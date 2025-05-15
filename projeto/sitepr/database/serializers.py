from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Chat, Message

class ChatSerializer(serializers.ModelSerializer):
    participants = serializers.SlugRelatedField(
        many=True,
        queryset=User.objects.all(),
        slug_field='email'  # Utiliza o campo "email" do User
    )

    class Meta:
        model = Chat
        fields = ['pk', 'name', 'avatar', 'participants']


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='email'  # Também pode usar email aqui, se quiser
    )

    class Meta:
        model = Message
        fields = ['pk', 'chat', 'sender', 'content', 'timestamp']