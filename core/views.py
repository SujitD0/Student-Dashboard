# core/views.py
from rest_framework import viewsets, status, generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.shortcuts import get_object_or_404
from django.utils import timezone

from .models import TimeSlot, Booking
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, TimeSlotSerializer, BookingSerializer
from .permissions import IsTeacher, IsStudent
from rest_framework.decorators import action

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()

class TimeSlotViewSet(viewsets.ModelViewSet):
    queryset = TimeSlot.objects.all().order_by("start")
    serializer_class = TimeSlotSerializer

    def get_permissions(self):
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAuthenticated(), IsTeacher()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # teacher creates slot; teacher_id field in serializer can be used
        # but force teacher to be request.user
        if serializer.validated_data['start'] < timezone.now():
            raise ValidationError("Cannot create slots in the past.")
        serializer.save(teacher=self.request.user)

    def perform_update(self, serializer):
        if 'start' in serializer.validated_data and serializer.validated_data['start'] < timezone.now():
            raise ValidationError("Cannot move slots to the past.")
        serializer.save()

    def get_queryset(self):
        qs = super().get_queryset()
        # optional filters: teacher_id, date
        teacher = self.request.query_params.get("teacher")
        available = self.request.query_params.get("available")
        if teacher:
            qs = qs.filter(teacher__id=teacher)
        if available in ["true", "True", "1"]:
            qs = qs.filter(is_available=True)
        return qs

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated, IsTeacher])
    def mark_unavailable(self, request, pk=None):
        slot = self.get_object()
        slot.is_available = False
        slot.save()
        return Response({"status": "slot marked unavailable"})

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all().order_by("-created_at")
    serializer_class = BookingSerializer

    def get_permissions(self):
        if self.action in ["create"]:
            return [IsAuthenticated(), IsStudent()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        # Ensure slot is still available
        slot = serializer.validated_data["slot"]
        if not slot.is_available:
            raise serializers.ValidationError("Slot already booked")
        # mark slot unavailable
        slot.is_available = False
        slot.save()
        serializer.save(student=self.request.user)

    def get_queryset(self):
        user = self.request.user
        if user.role == "teacher":
            # show bookings for teacher's slots
            return Booking.objects.filter(slot__teacher=user).order_by("-created_at")
        if user.role == "student":
            return Booking.objects.filter(student=user).order_by("-created_at")
        return Booking.objects.none()

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        # only student who booked or teacher owning slot can cancel
        if request.user != booking.student and request.user != booking.slot.teacher:
            return Response({"detail": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)
        booking.status = "cancelled"
        booking.slot.is_available = True
        booking.slot.save()
        booking.save()
        # Placeholder for notification/email send
        return Response({"status": "booking cancelled"})
