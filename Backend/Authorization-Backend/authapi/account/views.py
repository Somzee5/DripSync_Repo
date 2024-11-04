
from django.shortcuts import render

from rest_framework.response import Response 
from rest_framework import status 
from rest_framework.views import APIView 

from account.serializers import UserRegistrationSerializer, ProfileSerializer,UserChangePasswordSerializer
from account.models import User, Profile
from account.renderers import UserRenderer


from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny

from rest_framework_simplejwt.tokens import RefreshToken

# Registration view
class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer]

    def post(self,request):
        data = request.data
        serializer = UserRegistrationSerializer(data = data)

        if serializer.is_valid(raise_exception=True):
            user = User.objects.filter(email = data.get('email'))
            if user.exists():
                return Response({'message': 'Account with this email already exists',
                'data': serializer.errors},
                status = status.HTTP_400_BAD_REQUEST, )

            user = serializer.save()
            

            refresh = RefreshToken.for_user(user)

            return Response({'message': 'registration successfull',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user_id': user.id,
            'data': serializer.data},
            status = status.HTTP_201_CREATED ,)

        return Response({'message': 'Registration Unsuccessful',
        'data': serializer.errors},
        status = status.HTTP_400_BAD_REQUEST, )
        
        



class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        # Ensure 'email' is used as the username in the authentication backend
        user = authenticate(request, username=email, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user_id': user.id
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'error': 'Invalid email or password'
            }, status=status.HTTP_400_BAD_REQUEST)




  


from rest_framework.decorators import api_view, permission_classes



 


from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated


 
class CompleteProfileView(APIView):
    permission_classes = [IsAuthenticated] 

    def post(self, request, user_id):
        # Check if the profile already exists
        if Profile.objects.filter(user__id=user_id).exists():
            return Response({"error": "Profile already exists for this user."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create new profile
        try:  
            user = request.user

            # Make sure user ID from URL matches the authenticated user
            if user.id != user_id:
                return Response({"error": "User ID mismatch."}, status=status.HTTP_403_FORBIDDEN)

            profile_data = request.data

            # Handle image file if uploaded
            captured_image = request.FILES.get('captured_image')

            # Create the Profile object
            serializer = ProfileSerializer(data=profile_data)
            if serializer.is_valid():
                profile = serializer.save(user=user)
                if captured_image:
                    profile.captured_image = captured_image
                    profile.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def put(self, request, user_id):
        # Fetch the existing profile
        try:
            user = request.user
            if user.id != user_id:
                return Response({"error": "User ID mismatch."}, status=status.HTTP_403_FORBIDDEN)
            
            profile = Profile.objects.get(user=user)
            profile_data = request.data
            captured_image = request.FILES.get('captured_image')

            # Update the profile
            serializer = ProfileSerializer(profile, data=profile_data, partial=True)
            if serializer.is_valid():
                if captured_image:
                    profile.captured_image = captured_image
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Profile.DoesNotExist:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
     

 


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    user_data = {
        'user_id': request.user.id,
        'email': request.user.email,
        'firstname': request.user.firstname,
        # Add other fields if needed
    }
    
    return Response({'user': user_data}, status=200)
 




# Change password
class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        data = request.data
        serializer = UserChangePasswordSerializer(data = data, context={'user': request.user})

        if serializer.is_valid(raise_exception=True):
            return Response({'message': 'Password changed successfully' },
                status = status.HTTP_200_OK )
        
        return Response(serializer.errors, status= status.HTTP_400_BAD_REQUEST)



# View for Sending OTP
from django.core.mail import send_mail
from .models import User, OTP
import random

class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        try:
            user = User.objects.get(email=email)
            otp = random.randint(100000, 999999)
            # Save OTP in the database (optional)
            OTP.objects.create(user=user, otp=otp)

            # Send OTP via email
            send_mail(
                'Your OTP for Password Reset',
                f'Your OTP is {otp}',
                'sohampatilsp55@gmail.com',  # Sender email
                [email],  # Receiver email
                fail_silently=False,
            )

            return Response({"message": "OTP sent to your email"}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)




from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import OTP  # Make sure to import your OTP model
from django.utils import timezone

class VerifyOTPView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp_input = request.data.get('otp_input')
        new_password = request.data.get('new_password')  # Get new password from request

        try:


            # Get the OTP record for the given email
            otp_record = OTP.objects.get(user__email=email, otp=otp_input, is_valid=True)

            # Check if the OTP is still valid (e.g., check timestamp)
            if (timezone.now() - otp_record.created_at).seconds > 300:
                return Response({"error": "OTP has expired"}, status=status.HTTP_400_BAD_REQUEST)

            # If valid, proceed to update the user's password
            user = otp_record.user
            user.set_password(new_password)
            user.save()

            # Mark OTP as used
            otp_record.is_valid = False
            otp_record.save()

            return Response({"message": "Password has been reset successfully!"}, status=status.HTTP_200_OK)

        except OTP.DoesNotExist:
            return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


from .models import Wardrobe
from .serializers import WardrobeSerializer
# Profile Showing view
class MyProfileView(APIView):
    def get(self, request, user_id): 
        try:
            # Fetch the user profile by user_id
            profile = Profile.objects.get(user__id=user_id)  # Ensure correct user_id lookup
            wardrobe = Wardrobe.objects.filter(user__id=user_id)
            
            # Serialize the profile and wardrobe
            profile_serializer = ProfileSerializer(profile)
            wardrobe_serializer = WardrobeSerializer(wardrobe, many=True)

            # Return both profile and wardrobe in the response
            return Response({
                'profile': profile_serializer.data,
                'wardrobe': wardrobe_serializer.data
            }, status=status.HTTP_200_OK)

        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found.'}, status=status.HTTP_404_NOT_FOUND)        


# view to provide user_id 
class ProvideUserIDView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get the user ID
        user_id = request.user.id

        try:
            # Access the user's profile to get the gender, height, weight, and waist
            profile = request.user.profile
            gender = profile.get_gender_display()  # Full display value (e.g., 'Male' or 'Female')
            height = profile.height  # Assuming height is a field in the Profile model
            weight = profile.weight  # Assuming weight is a field in the Profile model
            waist = profile.waist  # Assuming waist is a field in the Profile model
            skintone = profile.get_skin_tone_display()
        except Profile.DoesNotExist:
            return Response({'error': 'Profile not found'}, status=404)

        # Return user_id, gender, height, weight, and waist in the response
        return Response({
            'user_id': user_id,
            'gender': gender,
            'height': height,
            'weight': weight,
            'waist': waist,
            'skintone': skintone,
        })

    


# View to add the product into wardrobe
class AddToWardrobeView(APIView):
    permission_classes = [IsAuthenticated]
 
    def post(self, request):
        print("Received data:", request.data)
        # Ensure the request data contains the required fields for the wardrobe
        data = {
            'Id_Product': request.data.get('Id_Product'),
            'Product_URL': request.data.get('Product_URL'),
            'URL_image': request.data.get('URL_image'),
            'Description': request.data.get('Description'),
            'Price': request.data.get('Price'),
            'added_date': request.data.get('added_date'),  # This can also be set to the current date
            # You don't need to include the 'user' field here
        }

        serializer = WardrobeSerializer(data=data)

        if serializer.is_valid():
            serializer.save(user=request.user)  # Associate with the logged-in user
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, Id_Product):
        try:
            wardrobe_item = Wardrobe.objects.get(user=request.user, Id_Product=Id_Product)
            wardrobe_item.delete()
            return Response({"message": "Item removed from wardrobe successfully."}, status=status.HTTP_204_NO_CONTENT)
        except Wardrobe.DoesNotExist:
            return Response({"error": "Item not found in wardrobe."}, status=status.HTTP_404_NOT_FOUND)