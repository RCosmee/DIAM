from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from datetime import datetime
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Aula
from .serializers import AulaSerializer
from django.shortcuts import get_object_or_404
from .models import Modalidade, Aula, Marcacao, Comentario
from .serializers import ModalidadeSerializer, AulaSerializer, MarcacaoSerializer, ComentarioSerializer
from django.db.models import Avg


# ------- Modalidade -------

@api_view(['GET', 'POST'])
def modalidades(request):
    if request.method == 'GET':
        modalidades = Modalidade.objects.all()
        serializer = ModalidadeSerializer(modalidades, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ModalidadeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def modalidade_detail(request, modalidade_id):
    try:
        modalidade = Modalidade.objects.get(pk=modalidade_id)
    except Modalidade.DoesNotExist:
        return Response({'erro': 'Modalidade não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ModalidadeSerializer(modalidade)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ModalidadeSerializer(modalidade, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        modalidade.delete()
        return Response({'mensagem': 'Modalidade eliminada.'}, status=status.HTTP_204_NO_CONTENT)


# ------- Aula -------

@api_view(['GET', 'POST'])
def aulas(request):
    if request.method == 'GET':
        aulas = Aula.objects.all()
        serializer = AulaSerializer(aulas, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AulaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def aula_detail(request, pk):
    aula = get_object_or_404(Aula, pk=pk)
    
    if request.method == 'GET':
        serializer = AulaSerializer(aula)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = AulaSerializer(aula, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        aula.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# ------- Marcacao -------

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def marcacoes(request):
    if request.method == 'GET':
        marcacoes_user = Marcacao.objects.filter(user=request.user)

        # Atualiza status das marcações para 'cancelada' se a aula já passou
        for marcacao in marcacoes_user:
            aula = marcacao.aula
            data_hora_aula = datetime.combine(aula.data, aula.hora_inicio)
            if data_hora_aula < datetime.now() and marcacao.status != 'cancelada':
                marcacao.status = 'cancelada'
                marcacao.save()

        serializer = MarcacaoSerializer(marcacoes_user, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        idaula = request.query_params.get('idaula')
        if not idaula:
            return Response({'error': 'Parâmetro idaula é obrigatório.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            aula = Aula.objects.get(pk=idaula)
        except Aula.DoesNotExist:
            return Response({'error': 'Aula não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

        data_hora_aula = datetime.combine(aula.data, aula.hora_inicio)
        if data_hora_aula < datetime.now():
            return Response({'error': 'Não é possível marcar uma aula que já passou.'}, status=status.HTTP_400_BAD_REQUEST)

        if aula.participantes_atual >= aula.max_participantes:
            return Response({'error': 'A aula atingiu o número máximo de participantes.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            marcacao = Marcacao.objects.create(user=request.user, aula=aula, status='marcada')
            aula.participantes_atual += 1
            aula.save()
            serializer = MarcacaoSerializer(marcacao)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def marcacao_detail(request, pk):
    try:
        marcacao = Marcacao.objects.get(pk=pk)
    except Marcacao.DoesNotExist:
        return Response({'erro': 'Marcação não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = MarcacaoSerializer(marcacao)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = MarcacaoSerializer(marcacao, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        aula = marcacao.aula
        marcacao.delete()
        if aula.participantes_atual > 0:
            aula.participantes_atual -= 1
            aula.save()
        return Response({'mensagem': 'Marcação removida.'}, status=status.HTTP_204_NO_CONTENT)


# ------- Comentario -------

# ------- Comentarios com avaliação -------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated]) 
def comentarios(request):
    if request.method == 'GET':
        aula_id = request.query_params.get('aula_id', None)
        if aula_id:
            comentarios = Comentario.objects.filter(aula_id=aula_id).order_by('-criado_em')
        else:
            comentarios = Comentario.objects.all().order_by('-criado_em')
        serializer = ComentarioSerializer(comentarios, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        data = request.data.copy()
        data['autor'] = request.user.id
        serializer = ComentarioSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Erros no serializer:", serializer.errors)  # DEBUG
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def comentarios_e_media(request, aula_id):
    comentarios = Comentario.objects.filter(aula_id=aula_id).order_by('-criado_em')
    media = comentarios.aggregate(media_nota=Avg('nota'))['media_nota']
    serializer = ComentarioSerializer(comentarios, many=True)
    return Response({
        'media_avaliacao': media if media is not None else 0,
        'comentarios': serializer.data
    })

@api_view(['PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def comentario_detail(request, comentario_id):
    try:
        comentario = Comentario.objects.get(pk=comentario_id)
    except Comentario.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Talvez verificar se request.user == comentario.autor aqui

    if request.method == 'PUT':
        serializer = ComentarioSerializer(comentario, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        comentario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)