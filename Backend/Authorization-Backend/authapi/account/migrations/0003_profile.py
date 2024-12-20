# Generated by Django 5.0.7 on 2024-09-17 04:01

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0002_physicalattributes'),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('height', models.CharField(max_length=5)),
                ('weight', models.CharField(max_length=5)),
                ('age', models.IntegerField()),
                ('gender', models.CharField(max_length=10)),
                ('skin_tone', models.CharField(max_length=20)),
                ('photo', models.ImageField(blank=True, null=True, upload_to='user_photos/')),
                ('captured_image', models.TextField(blank=True, null=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
