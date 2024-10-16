# Generated by Django 5.0.7 on 2024-09-17 05:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0004_remove_profile_captured_image_profile_savecapture_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='profile',
            name='gender',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='photo',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='savecapture',
        ),
        migrations.RemoveField(
            model_name='profile',
            name='skin_tone',
        ),
        migrations.AddField(
            model_name='profile',
            name='captured_image',
            field=models.ImageField(blank=True, null=True, upload_to='profile_images/'),
        ),
        migrations.AlterField(
            model_name='profile',
            name='height',
            field=models.FloatField(),
        ),
        migrations.AlterField(
            model_name='profile',
            name='weight',
            field=models.FloatField(),
        ),
    ]
