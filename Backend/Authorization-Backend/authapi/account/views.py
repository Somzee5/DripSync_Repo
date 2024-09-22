
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
# Generate token manually 
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


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
            # after saving the user .. we generate the token manually
            token = get_tokens_for_user(user)


            return Response({'message': 'registration successfull',
            'token': token,
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




            
# Getting info using the access token generated while logging in
'''class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
 
        return Response(serializer.data, status = status.HTTP_200_OK)'''


'''class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            return Response({
                'name': user.firstname,
                'email': user.email,
                # Include other fields here
            })
        except User.DoesNotExist:
            return Response({
                'error': 'User not found'
            }, status=404)'''


from rest_framework.decorators import api_view, permission_classes

'''
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def complete_profile(request, user_id):
    if request.user.id != user_id:
        return Response({'error': 'Unauthorized access'}, status=status.HTTP_403_FORBIDDEN)
    profile_data = {
        'user_id': user_id,
        'email': request.user.email,
    }
    return Response({'profile': profile_data}, status=status.HTTP_200_OK)'''




import base64
from django.core.files.base import ContentFile
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
            # You can access the authenticated user via request.user
            user = request.user

            # Make sure user ID from URL matches the authenticated user
            if user.id != user_id:
                return Response({"error": "User ID mismatch."}, status=status.HTTP_403_FORBIDDEN)

            profile_data = request.data

            # Handle base64 image if provided
            if 'captured_image' in profile_data:
                image_data = profile_data['captured_image']
                format, imgstr = image_data.split(';base64,')  # Get format and base64 string
                ext = format.split('/')[-1]  # Extract file extension
                profile_data['captured_image'] = ContentFile(base64.b64decode(imgstr), f'{user.id}.{ext}')
            
            # Create the Profile object
            serializer = ProfileSerializer(data=profile_data)
            if serializer.is_valid():
                # Manually link the user to the profile before saving
                serializer.save(user=user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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

