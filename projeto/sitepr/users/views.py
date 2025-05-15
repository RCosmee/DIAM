from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from .serializers import ProfileSerializer
from rest_framework.decorators import api_view, permission_classes,  parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from django.core.exceptions import ObjectDoesNotExist

from django.http import JsonResponse 
from django.views.decorators.csrf import csrf_exempt 
from django.core.files.storage import FileSystemStorage 
import os 
from datetime import datetime 
import logging 
logger = logging.getLogger(__name__) 




from .models import Atleta, PersonalTrainer, Profile  # Adiciona isso se ainda não tiveres esses modelos

@api_view(['POST'])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    tipo_conta = request.data.get('tipo_conta')  # Atleta ou PT
    
    if not username or not email or not password or not tipo_conta:
        return Response({'error': 'Todos os campos são obrigatórios!'}, status=status.HTTP_400_BAD_REQUEST)
    
    if User.objects.filter(email=email).exists():
        return Response({'error': 'Este e-mail já está em uso!'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Criar o usuário
    user = User.objects.create_user(username=username, email=email, password=password)
    Profile.objects.create(user=user)
    
    # Criar o perfil baseado no tipo de conta
    if tipo_conta == 'atleta':
        Atleta.objects.create(user=user)
    elif tipo_conta == 'pt':
        PersonalTrainer.objects.create(user=user)
    else:
        return Response({'error': 'Tipo de conta inválido'}, status=status.HTTP_400_BAD_REQUEST)
    
    return Response({'message': f'Usuário {username} criado com sucesso!'}, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login_view(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'error': 'E-mail e senha são obrigatórios!'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(request, username=email, password=password)  # Passar o email como username
    
    if user is not None:
        login(request, user)
        return Response({'message': 'Logado com sucesso!'})
    else:
        return Response({'error': 'Credenciais inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    
@api_view(['GET'])
def logout_view(request):
    logout(request)
    return Response({'message': 'Logged out successfully'})

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('email')
    nome = request.data.get('nome')
    nova_senha = request.data.get('nova_senha')

    if not email or not nome or not nova_senha:
        return Response({'error': 'Todos os campos são obrigatórios.'}, status=400)

    try:
        user = User.objects.get(email=email, username=nome)
        user.set_password(nova_senha)
        user.save()
        return Response({'message': 'Senha atualizada com sucesso!'})
    except User.DoesNotExist:
        return Response({'error': 'Utilizador não encontrado.'}, status=404)
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_data(request):
    try:
        profile = Profile.objects.get(user=request.user)
        imagem_url = profile.imagem.url if profile.imagem else None
    except Profile.DoesNotExist:
        imagem_url = None

    # Detectar tipo_conta com base nas relações
    if hasattr(request.user, 'atleta'):
        tipo_conta = 'Atleta'
    elif hasattr(request.user, 'personaltrainer'):
        tipo_conta = 'Personal Trainer'
    else:
        tipo_conta = 'Desconhecido'

    return Response({
        'nome': request.user.get_full_name() or request.user.username,
        'imagem': imagem_url,
        'tipo_conta': tipo_conta,
    })


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser])
def profile_view(request):
    if request.method == 'GET':
        try:
            profile = Profile.objects.get(user=request.user)
        except ObjectDoesNotExist:
            # se o profile ainda não existir, cria um vazio
            profile = Profile.objects.create(user=request.user)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
        
    elif request.method == 'PUT':
        try:
            profile = Profile.objects.get(user=request.user)
            serializer = ProfileSerializer(profile, data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ObjectDoesNotExist:
            return Response({'error': "Profile does not exist"}, status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_400_BAD_REQUEST)
