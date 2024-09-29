from django.db import models

from django.contrib.auth.models import BaseUserManager,AbstractBaseUser

# Custom user manager
class UserManager(BaseUserManager):
    def create_user(self, email, firstname, lastname, tc, password=None ,password2=None):
        """
        Creates and saves a User with the given email, firstname , lastname,
        tc and password.
        """

        if not email:
            raise ValueError("User must have an email address")

        user = self.model(
            email=self.normalize_email(email),
            firstname = firstname,
            lastname = lastname,
            tc = tc,
        )
        

        user.set_password(password)
        user.save(using=self._db)
        return user


    def create_superuser(self, email, firstname, lastname, tc, password=None):
        """
        Creates and saves a superuser with the given email, firstname , lastname,
        tc and password.
        """
        user = self.create_user(
            email,
            password = password,
            firstname = firstname,
            lastname = lastname,
            tc = tc,
        )
        user.is_admin = True
        user.save(using=self._db)
        return user


# custom user manager
class User(AbstractBaseUser):
    email = models.EmailField(
        verbose_name="Email",
        max_length=255,
        unique=True,
    )
    firstname = models.CharField(max_length=30)
    lastname = models.CharField(max_length=30)
    tc = models.BooleanField()
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["firstname","lastname","tc"]

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return self.is_admin

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        # Simplest possible answer: All admins are staff
        return self.is_admin


    

from django.db import models
from django.conf import settings  # Import settings to use AUTH_USER_MODEL

class Profile(models.Model):
    GENDER_CHOICES = [
        ('M', 'Male'),
        ('F', 'Female'),
    ]
    
    SKIN_TONE_CHOICES = [
        ('LT', 'Light'),
        ('MD', 'Medium'),
        ('DK', 'Dark'),
    ]
    
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    height = models.FloatField()
    weight = models.FloatField()
    age = models.IntegerField()
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True)
    waist = models.FloatField(null=True)
    skin_tone = models.CharField(max_length=2, choices=SKIN_TONE_CHOICES, default='LT')
    captured_image = models.ImageField(upload_to='profile_images/', blank=True, null=True)

    def __str__(self):
        return self.user.email



from django.conf import settings
from django.utils import timezone


class OTP(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)  # Update this line
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(default=timezone.now)
    is_valid = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.user.email} - {self.otp}"




