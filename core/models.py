from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (("student", "Student"), ("teacher", "Teacher"))
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    institution = models.CharField(max_length=200, blank=True, default="",
                                   help_text="College or school name")

    def __str__(self):
        return f"{self.username} ({self.role})"

class TimeSlot(models.Model):
    """
    Represents an available timeslot created by a teacher.
    """
    teacher = models.ForeignKey("User", on_delete=models.CASCADE, related_name="timeslots")
    start = models.DateTimeField()
    end = models.DateTimeField()
    duration_minutes = models.PositiveIntegerField(default=30)
    topic = models.CharField(max_length=255, blank=True)
    meeting_link = models.URLField(blank=True)  # Meeting link provided by teacher
    is_available = models.BooleanField(default=True)  # set False once booked
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.teacher.username} {self.start} - {self.end} ({'available' if self.is_available else 'booked'})"

class Booking(models.Model):
    """
    A student booking of a teacher's timeslot.
    """
    student = models.ForeignKey("User", on_delete=models.CASCADE, related_name="bookings")
    slot = models.ForeignKey("TimeSlot", on_delete=models.CASCADE, related_name="bookings")
    purpose = models.TextField(blank=True)
    attachments = models.FileField(upload_to="attachments/", null=True, blank=True)
    meeting_mode = models.CharField(max_length=50, default="online")  # online / offline
    meeting_link = models.URLField(blank=True)  # e.g., zoom link
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default="confirmed")  # confirmed / cancelled / completed

    def __str__(self):
        return f"Booking {self.id} by {self.student.username} for slot {self.slot.id}"

class Notification(models.Model):
    """
    A notification/message from a teacher to a student regarding a booking.
    """
    teacher = models.ForeignKey("User", on_delete=models.CASCADE, related_name="sent_notifications")
    student = models.ForeignKey("User", on_delete=models.CASCADE, related_name="received_notifications")
    booking = models.ForeignKey("Booking", on_delete=models.CASCADE, related_name="notifications")
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification from {self.teacher.username} to {self.student.username} ({self.id})"
