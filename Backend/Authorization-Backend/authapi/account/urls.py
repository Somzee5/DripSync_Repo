from django.urls import path
from account.views import UserRegistrationView, UserLoginView,  UserChangePasswordView, CompleteProfileView, ForgotPasswordView, VerifyOTPView, MyProfileView, ProvideUserIDView, AddToWardrobeView
from .views import get_current_user
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name="register"),
    path('login/', UserLoginView.as_view(), name="login"),  
    path('changepassword/', UserChangePasswordView.as_view(), name="changepassword"),
    path('profile/<int:user_id>/', CompleteProfileView.as_view(), name='complete_profile'),
    path('me/', get_current_user, name='current_user'),

    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('myprofile/<int:user_id>/', MyProfileView.as_view(), name='myprofile'),
    path('home/', ProvideUserIDView.as_view(), name='provide-user_id'),


    path('wardrobe/', AddToWardrobeView.as_view(), name='add-to-wardrobe'),
    path('wardrobe/<int:Id_Product>/', AddToWardrobeView.as_view(), name='add-to-wardrobe'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)