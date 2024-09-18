from django.urls import path
from account.views import UserRegistrationView, UserLoginView,  UserChangePasswordView
from .views import complete_profile, get_current_user

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name="register"),
    path('login/', UserLoginView.as_view(), name="login"),  
    path('changepassword/', UserChangePasswordView.as_view(), name="changepassword"),
    path('profile/<int:user_id>/', complete_profile, name='complete_profile'),

    path('me/', get_current_user, name='current_user'),

]




