#!/usr/bin/env bash
# Build script for Render

set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Collect static files
python manage.py collectstatic --no-input

# Create any pending migrations
python manage.py makemigrations

# Run migrations
python manage.py migrate

# Create superuser if configured
python create_superuser.py
