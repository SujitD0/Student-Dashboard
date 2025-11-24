import os
import django

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "meetup_back.settings")
django.setup()

from django.contrib.auth import get_user_model

def create_superuser():
    User = get_user_model()
    
    # Get credentials from environment variables
    username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
    email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@example.com')
    password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

    if not password:
        print("⚠️  DJANGO_SUPERUSER_PASSWORD not set. Skipping superuser creation.")
        return

    if not User.objects.filter(username=username).exists():
        print(f"Creating superuser '{username}'...")
        try:
            User.objects.create_superuser(username=username, email=email, password=password)
            print("✅ Superuser created successfully!")
        except Exception as e:
            print(f"❌ Error creating superuser: {e}")
    else:
        print(f"ℹ️  Superuser '{username}' already exists. Skipping.")

if __name__ == "__main__":
    create_superuser()
