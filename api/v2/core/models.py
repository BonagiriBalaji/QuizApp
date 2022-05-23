import jwt

from datetime import datetime, timedelta

from django.conf import settings
from django.contrib.auth.models import (
    AbstractBaseUser, BaseUserManager, PermissionsMixin
)
from django.db import models
from hashlib import md5
from django.utils import timezone


class UserManager(BaseUserManager):

    def create_user(self, username, email, password=None):
        if username is None:
            raise TypeError('Users must have a username.')

        if email is None:
            raise TypeError('Users must have an email address.')

        user = self.model(username=username, email=self.normalize_email(email))
        user.set_password(password)
        user.save()

        return user

    def create_superuser(self, username, email, password):
        if password is None:
            raise TypeError('Superusers must have a password.')

        user = self.create_user(username, email, password)
        user.is_superuser = True
        user.is_staff = True
        user.save()

        return user

class User(AbstractBaseUser, PermissionsMixin):

    username = models.CharField(db_index=True, max_length=255, unique=True)
    email = models.EmailField(db_index=True, unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'password']

    objects = UserManager()
    
    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.email

    @property
    def token(self):
        return self._generate_jwt_token()

    def get_full_name(self):
        return self.username

    def get_short_name(self):
        return self.username

    def _generate_jwt_token(self):
        dt = datetime.now() + timedelta(days=60)

        token = jwt.encode({
            'id': self.pk,
            'exp': int(dt.strftime('%s'))
        }, settings.SECRET_KEY, algorithm='HS256')

        return token.decode('utf-8')
    
class Questions(models.Model):

    Subjects = (
       ('P', 'Python'),
       ('J', 'Java'),
       ('JS', 'JavaScript')
    )

    question_id = models.CharField(max_length=10, primary_key=True)
    question_data = models.CharField(max_length=500)
    subject = models.CharField(max_length=10, choices=Subjects)
    level = models.IntegerField(default=1)

    class Meta:
        db_table = "questions"



class Options(models.Model):

    # option_id = models.IntegerField(primary_key=True)
    # optionsList = ArrayField(models.CharField(max_length=70, blank=True))
    option_data = models.CharField(max_length=50, default='', blank=True)
    marks = models.IntegerField(default=0)
    question = models.ForeignKey(Questions, on_delete=models.CASCADE, related_name='options')
    class Meta:
        db_table = "options"

# class Answers(models.Model):

#     answers_id = models.IntegerField(primary_key=True)
#     ans = models.IntegerField()
#     marks = models.IntegerField(default=0)
#     question = models.OneToOneField(Questions, on_delete=models.CASCADE, related_name='answers')
#     class Meta:
#         db_table = "answers"

class Scores(models.Model):

    class Meta:
       db_table = "scores"
       
    # score = models.FloatField(default=-1)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scores')
    hash = models.CharField(max_length=16, editable = False, default=None, unique=True)
    created_at = models.DateTimeField(default=timezone.now, editable = False)
    # created_at2 = models.DateTimeField(auto_now_add=True)
    # created = models.DateTimeField(auto_now_add=True, editable=False, null=False, blank=False)
    subject = models.CharField(max_length=10, default="Python")
    level_1 = models.IntegerField(default=-1)
    level_2 = models.IntegerField(default=-1)
    level_3 = models.IntegerField(default=-1)
    
    def save(self, *args, **kwargs):      
        self.hash = md5(f"{self.user}{self.created_at}{self.subject}".encode('utf-8')).hexdigest()
        super().save(*args, **kwargs)
    
    @property
    def score(self):
        score = 0
        if self.level_1 >= 0:
            score += self.level_1
        if self.level_2 >= 0:
            score += self.level_2
        if self.level_3 >= 0:
            score += self.level_3
        return score
    