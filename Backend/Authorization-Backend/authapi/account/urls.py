from django.urls import path
from account.views import UserRegistrationView, UserLoginView,  UserChangePasswordView, CompleteProfileView, ForgotPasswordView, VerifyOTPView
from .views import get_current_user

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name="register"),
    path('login/', UserLoginView.as_view(), name="login"),  
    path('changepassword/', UserChangePasswordView.as_view(), name="changepassword"),
    path('profile/<int:user_id>/', CompleteProfileView.as_view(), name='complete_profile'),
    path('me/', get_current_user, name='current_user'),

    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),

]