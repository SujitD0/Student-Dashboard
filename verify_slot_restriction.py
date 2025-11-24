import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'meetup_back.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta
from rest_framework.test import APIRequestFactory, force_authenticate
from core.views import TimeSlotViewSet
from core.models import User

def verify_slot_restriction():
    print("Setting up verification...")
    # Create a teacher user
    teacher, created = User.objects.get_or_create(username='test_teacher', role='teacher')
    if created:
        teacher.set_password('password')
        teacher.save()
    
    factory = APIRequestFactory()
    view = TimeSlotViewSet.as_view({'post': 'create'})

    # Test case 1: Past date
    past_time = timezone.now() - timedelta(hours=1)
    data_past = {
        'start': past_time,
        'end': past_time + timedelta(minutes=30),
        'duration_minutes': 30
    }
    request_past = factory.post('/api/timeslots/', data_past, format='json')
    force_authenticate(request_past, user=teacher)
    
    print("Testing past date creation...")
    try:
        response_past = view(request_past)
        if response_past.status_code == 400:
            print("SUCCESS: Past date rejected.")
            print(f"Response: {response_past.data}")
        else:
            print(f"FAILURE: Past date accepted with status {response_past.status_code}.")
            print(response_past.data)
    except Exception as e:
        print(f"FAILURE: Exception occurred: {e}")

    # Test case 2: Future date
    future_time = timezone.now() + timedelta(hours=1)
    data_future = {
        'start': future_time,
        'end': future_time + timedelta(minutes=30),
        'duration_minutes': 30
    }
    request_future = factory.post('/api/timeslots/', data_future, format='json')
    force_authenticate(request_future, user=teacher)

    print("\nTesting future date creation...")
    try:
        response_future = view(request_future)
        if response_future.status_code == 201:
            print("SUCCESS: Future date accepted.")
        else:
            print(f"FAILURE: Future date rejected with status {response_future.status_code}.")
            print(response_future.data)
    except Exception as e:
        print(f"FAILURE: Exception occurred: {e}")

if __name__ == '__main__':
    verify_slot_restriction()
