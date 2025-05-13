from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Atleta, PersonalTrainer  # Adiciona isso se ainda não tiveres esses modelos

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
def user_data(request):
    user = request.user
    return Response({
        'nome': user.username,
        'imagem': user.profile.imagem.url if user.profile.imagem else None
    })

@api_view(['POST'])
def update_user_profile(request):
    user = request.user
    if 'nome' in request.data:
        user.username = request.data['nome']
    if 'imagem' in request.FILES:
        user.profile.imagem = request.FILES['imagem']
    user.save()
    return Response({'message': 'Perfil atualizado com sucesso!'})