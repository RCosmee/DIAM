from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import ChatSerializer, MessageSerializer
from .models import Chat, Message
from django.db.models import Q
from rest_framework.views import APIView
from django.core.files.storage import default_storage

@api_view(['GET', 'POST'])
def chat_list(request):
    if request.method == 'GET':
        user_id = request.query_params.get('user_id', None)
        
        if user_id is not None:
            try:
                user_id = int(user_id)
            except ValueError:
                return Response({'error': 'user_id must be an integer'}, status=status.HTTP_400_BAD_REQUEST)

            # Filtra chats que contenham user_id na lista participants
            chats = Chat.objects.filter(participants__contains=[user_id])
        else:
            # Se não passar user_id, retorna todos os chats
            chats = Chat.objects.all()

        serializer = ChatSerializer(chats, many=True, context={'request': request})
        return Response(serializer.data)

    # POST (criar novo chat)
    serializer = ChatSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        chat = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



# Atualizar ou apagar Chat específico
@api_view(['PUT', 'DELETE'])
def chat_detail(request, chat_id):
    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = ChatSerializer(chat, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        chat.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)


# Listar ou criar Messages de um Chat
@api_view(['GET', 'POST'])
def message_list(request, chat_id):
    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        messages = chat.messages.all()
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = MessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(status=status.HTTP_400_BAD_REQUEST)


# Atualizar ou apagar Menssagem específica
@api_view(['PUT', 'DELETE'])
def message_detail(request, message_id):
    try:
        message = Message.objects.get(pk=message_id)
    except Message.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = MessageSerializer(message, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        message.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def chat_participants(request, chat_id):
    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return Response({'error': 'Chat não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    return Response({'participants': chat.participants}, status=status.HTTP_200_OK)



@api_view(['DELETE'])
def remove_participant(request, chat_id):
    user_id = request.query_params.get('user_id', None)
    if user_id is None:
        return Response({'error': 'user_id é obrigatório como query param.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_id = int(user_id)
    except ValueError:
        return Response({'error': 'user_id deve ser um inteiro.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return Response({'error': 'Chat não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    if user_id not in chat.participants:
        return Response({'error': 'Usuário não está na lista de participantes.'}, status=status.HTTP_400_BAD_REQUEST)

    chat.participants.remove(user_id)
    chat.save()

    serializer = ChatSerializer(chat, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def add_participant(request, chat_id):
    user_id = request.query_params.get('user_id', None)
    if user_id is None:
        return Response({'error': 'user_id é obrigatório como query param.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_id = int(user_id)
    except ValueError:
        return Response({'error': 'user_id deve ser um inteiro.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        chat = Chat.objects.get(pk=chat_id)
    except Chat.DoesNotExist:
        return Response({'error': 'Chat não encontrado.'}, status=status.HTTP_404_NOT_FOUND)

    if user_id in chat.participants:
        return Response({'message': 'Usuário já está na lista de participantes.'}, status=status.HTTP_200_OK)

    chat.participants.append(user_id)
    chat.save()

    serializer = ChatSerializer(chat, context={'request': request})
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
def create_chat_without_name_avatar(request):
    participants = request.data.get('participants', None)

    if not isinstance(participants, list) or not participants:
        return Response(
            {'error': 'O campo "participants" deve ser uma lista não vazia.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    chat = Chat.objects.create(name="", avatar="", participants=participants)
    serializer = ChatSerializer(chat, context={'request': request})

    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def create_group_chat(request):
    nome = request.data.get('nome')
    avatar = request.data.get('avatar')
    participants = request.data.get('participants', [])

    if not nome or not avatar:
        return Response(
            {'error': 'Os campos "nome" e "avatar" são obrigatórios.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not isinstance(participants, list):
        return Response(
            {'error': 'O campo "participants" deve ser uma lista.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    chat = Chat.objects.create(name=nome, avatar=avatar, participants=participants)
    serializer = ChatSerializer(chat, context={'request': request})
    return Response(serializer.data, status=status.HTTP_201_CREATED)


class ImageUploadView(APIView):
    def post(self, request, *args, **kwargs):
        file = request.FILES.get('file')
        if not file:
            return Response({'error': 'Nenhum ficheiro recebido.'}, status=status.HTTP_400_BAD_REQUEST)

        filename = default_storage.save(f'imagens_grupo/{file.name}', file)
        return Response({'filename': filename.split('/')[-1]}, status=status.HTTP_201_CREATED)
