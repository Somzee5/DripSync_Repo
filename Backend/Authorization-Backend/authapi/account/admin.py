from django.contrib import admin

from account.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserModelAdmin(BaseUserAdmin):

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserModelAdmin
    # that reference specific fields on auth.User.
    list_display = ["id" ,"email", "firstname", "lastname","tc", "is_admin"]
    list_filter = ["is_admin"]
    fieldsets = [
        ('UserCredentials', {"fields": ["email", "password"]}),
        ("Personal info", {"fields": ["firstname", "lastname", "tc"]}),
        ("Permissions", {"fields": ["is_admin"]}),
    ]

    # add_fieldsets is not a standard ModelAdmin attribute. UserModelAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    add_fieldsets = [
        (
            None,
            { 
                "classes": ["wide"],
                "fields": ["email", "firstname", "lastname", "tc", "password1", "password2"],
            },  
        ),
    ]
    search_fields = ["email"]
    ordering = ["email"]
    filter_horizontal = []


# Now register the new UserModelAdmin
admin.site.register(User, UserModelAdmin)

from .models import Profile  
admin.site.register(Profile)


from .models import Wardrobe
admin.site.register(Wardrobe)