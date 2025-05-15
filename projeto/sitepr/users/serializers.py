from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    nome = serializers.CharField(source='user.username')

    class Meta:
        model = Profile
        fields = ['nome', 'imagem','tipo_conta']

    def get_tipo_conta(self, obj):
        if hasattr(obj.user, 'atleta'):
            return 'atleta'
        elif hasattr(obj.user, 'personaltrainer'):
            return 'pt'
        else:
            return 'desconhecido'

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)

        # Certifica-te de que user_data é um dicionário
        if isinstance(user_data, dict):
            username = user_data.get('username')
            if username:
                instance.user.username = username
                instance.user.save()

        # Atualiza a imagem se fornecida
        imagem = validated_data.get('imagem')
        if imagem is not None:
            instance.imagem = imagem

        instance.save()
        return instance