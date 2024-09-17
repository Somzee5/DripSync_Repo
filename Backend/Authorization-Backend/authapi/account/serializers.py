from rest_framework import serializers
from account.models import User

class UserRegistrationSerializer(serializers.ModelSerializer):

    # we are writing this bcoz we need a confirm password field in our registration
    password2 = serializers.CharField(style={'input_type':'password'},write_only = True)

    class Meta:
        model = User
        fields = ['email', 'password', 'firstname', 'lastname', 'tc', 'password2']

        extra_kwargs = {
            'password' : {'write_only' : True}
        }

    # Validating password and confirm password(password2) are the same
    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        email = data.get('email')
        

        if password != password2:
            raise serializers.ValidationError("Passwords don't match")

        return data
    
    def create(self,validated_data):
        return User.objects.create_user(**validated_data)
    

# Login serializer
class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)

    class Meta:
        model = User
        fields = ['email', 'password']


# Profile Serializer
class UserProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'firstname', 'lastname']


# change password serializer
class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length = 255,style={'input_type':'password'},write_only = True)
    password2 = serializers.CharField(max_length = 255,style={'input_type':'password'},write_only = True)

    class Meta:
        fields = ['password', "password2"]

    def validate(self, data):
        password = data.get('password')
        password2 = data.get('password2')
        user = self.context.get('user')

        if password != password2:
            raise serializers.ValidationError("Passwords don't match")
        
        user.set_password(password)
        user.save()

        return data
    



