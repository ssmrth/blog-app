from rest_framework import serializers
from .models import Blog
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import authenticate

class BlogSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Blog
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}, 'username': {'required': False}}

    def create(self, validated_data):
        email = validated_data.get('email')
        if User.objects.filter(email=email).exists():
            raise serializers.ValidationError({'email': 'This email is already in use.'})
        validated_data['username'] = email  # Always set username to email
        return User.objects.create_user(**validated_data)

class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'username'

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        if not username or not password:
            raise serializers.ValidationError({'detail': 'Both email and password are required.'})
        try:
            user = authenticate(request=self.context.get('request'), username=username, password=password)
        except Exception as e:
            raise serializers.ValidationError({'detail': f'Authentication error: {str(e)}'})
        if not user:
            raise serializers.ValidationError({'detail': 'No active account found with the given credentials'})
        data = super().validate({'username': username, 'password': password})
        return data