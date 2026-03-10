
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TimeSlot, Booking, Notification

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name", "role", "institution")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class TimeSlotSerializer(serializers.ModelSerializer):
    teacher = UserSerializer(read_only=True)

    class Meta:
        model = TimeSlot
        fields = ("id", "teacher", "start", "end", "duration_minutes", "topic", "meeting_link", "is_available", "created_at")
        read_only_fields = ("id", "created_at", "teacher")

class BookingSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    slot = TimeSlotSerializer(read_only=True)
    slot_id = serializers.PrimaryKeyRelatedField(write_only=True, queryset=TimeSlot.objects.filter(is_available=True), source="slot")

    class Meta:
        model = Booking
        fields = ("id", "student", "slot", "slot_id", "purpose", "attachments", "meeting_mode", "meeting_link", "created_at", "status")
        read_only_fields = ("id", "created_at", "student", "slot")

class NotificationSerializer(serializers.ModelSerializer):
    teacher_name = serializers.SerializerMethodField()
    student_name = serializers.SerializerMethodField()
    booking_info = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = ("id", "teacher", "student", "booking", "message", "is_read",
                  "created_at", "teacher_name", "student_name", "booking_info")
        read_only_fields = ("id", "created_at", "teacher", "teacher_name",
                            "student_name", "booking_info")

    def get_teacher_name(self, obj):
        return f"{obj.teacher.first_name} {obj.teacher.last_name}".strip() or obj.teacher.username

    def get_student_name(self, obj):
        return f"{obj.student.first_name} {obj.student.last_name}".strip() or obj.student.username

    def get_booking_info(self, obj):
        slot = obj.booking.slot
        return {
            "id": obj.booking.id,
            "date": slot.start.strftime("%Y-%m-%d"),
            "time": slot.start.strftime("%I:%M %p"),
            "topic": slot.topic or "General",
        }
