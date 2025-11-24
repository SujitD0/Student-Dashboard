
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import TimeSlot, Booking

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    class Meta:
        model = User
        fields = ("id", "username", "email", "password", "first_name", "last_name", "role")

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
