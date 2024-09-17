from django.urls import path
from account.views import UserRegistrationView, UserLoginView, UserProfileView, UserChangePasswordView
urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name="register"),
    path('login/', UserLoginView.as_view(), name="login"),  # Fixed path
    path('profile/', UserProfileView.as_view(), name="profile"),
    path('changepassword/', UserChangePasswordView.as_view(), name="changepassword"),

]




