
from django.shortcuts import render

from rest_framework.response import Response 
from rest_framework import status 
from rest_framework.views import APIView 

from account.serializers import UserRegistrationSerializer,UserLoginSerializer,UserProfileSerializer,UserChangePasswordSerializer
from account.models import User
from account.renderers import UserRenderer


from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated

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
        
# Login view
class UserLoginView(APIView):
    renderer_classes = [UserRenderer]

    def post(self,request):
        data = request.data
        serializer = UserLoginSerializer(data = data)

        if serializer.is_valid(raise_exception=True):
            email = data.get('email')
            password = data.get('password')

            user = authenticate(email = email, password = password)

            if user is not None:
                token = get_tokens_for_user(user)

                return Response({ 'message': 'Login successfull',
                    'token': token},
                    status = status.HTTP_200_OK ,)

            else:
                return Response({'errors': {'non_fiels_errors': ['email or password is not valid']}},
                    status= status.HTTP_404_NOT_FOUND)
            

        return Response({'message': 'Login unsuccessful',
                'errors': serializer.errors},
                status= status.HTTP_400_BAD_REQUEST)

            
# Getting info using the access token generated while logging in
class UserProfileView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        serializer = UserProfileSerializer(request.user)
 
        return Response(serializer.data, status = status.HTTP_200_OK)



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

