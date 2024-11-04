from rest_framework import serializers
from account.models import User,Profile

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


class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)  # Include email from related User model
    name = serializers.CharField(source='user.firstname', read_only=True)
    lastname = serializers.CharField(source='user.lastname', read_only=True)

    class Meta:
        model = Profile
        fields = ['email','name','lastname','height', 'weight', 'age', 'gender', 'skin_tone', 'waist', 'captured_image']

    def create(self, validated_data):
        return Profile.objects.create(**validated_data)
 

from .models import Wardrobe
class WardrobeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Wardrobe
        fields = ['Id_Product', 'Product_URL', 'URL_image', 'Description', 'Price', 'added_date']


 


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
    



