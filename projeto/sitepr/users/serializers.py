from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='user.username')

    tipo_conta = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = ['nome', 'imagem', 'tipo_conta']

    def get_tipo_conta(self, obj):
        if hasattr(obj.user, 'atleta'):
            return 'Atleta'
        elif hasattr(obj.user, 'personaltrainer'):
            return 'Personal Trainer'
        else:
            return 'Desconhecido'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})

        username = user_data.get('username')
        if username:
            instance.user.username = username
            instance.user.save()

        imagem = validated_data.get('imagem')
        if imagem is not None:
            instance.imagem = imagem

        instance.save()
        return instance
