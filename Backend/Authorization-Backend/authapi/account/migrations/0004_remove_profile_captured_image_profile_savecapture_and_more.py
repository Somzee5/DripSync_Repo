# Generated by Django 5.0.7 on 2024-09-17 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0003_profile'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='captured_image',
        ),
        migrations.AddField(
            model_name='profile',
            name='savecapture',
            field=models.ImageField(blank=True, null=True, upload_to='captures/'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='photo',
            field=models.ImageField(blank=True, null=True, upload_to='photos/'),
        ),
    ]