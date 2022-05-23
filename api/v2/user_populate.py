import apiv2.wsgi

# rm core/migrations/* db.sqlite3 -rf && touch core/migrations/__init__.py && python3 manage.py makemigrations && python3 manage.py migrate

from core.models import *

from django.db.models import Q

for i in range(10):
    User.objects.create_user(username=f"username{i}", email=f"testing{i}@test.com", password=f"password{i}")