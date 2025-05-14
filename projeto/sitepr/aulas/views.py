from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Modalidade, Aula, Marcacao, Comentario, Avaliacao
from .serializers import *

# ------- Modalidade -------

@api_view(['GET', 'POST'])
def modalidades(request):
    if request.method == 'GET':
        modalidade_list = Modalidade.objects.all()
        serializer = ModalidadeSerializer(modalidade_list, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ModalidadeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def modalidade_detail(request, modalidade_id):
    try:
        modalidade = Modalidade.objects.get(pk=modalidade_id)
    except Modalidade.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = ModalidadeSerializer(modalidade, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)

    elif request.method == 'DELETE':
        modalidade.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

    return Response(status=status.HTTP_400_BAD_REQUEST)


# ------- Aula -------

@api_view(['GET', 'POST'])
def aulas(request):
    if request.method == 'GET':
        aula_list = Aula.objects.all()
        serializer = AulaSerializer(aula_list, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AulaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def aula_detail(request, aula_id):
    try:
        aula = Aula.objects.get(pk=aula_id)
    except Aula.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AulaSerializer(aula, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'DELETE':
        aula.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)


# ------- Marcacao -------

@api_view(['GET', 'POST'])
def marcacoes(request):
    if request.method == 'GET':
        marcacao_list = Marcacao.objects.all()
        serializer = MarcacaoSerializer(marcacao_list, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = MarcacaoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def marcacao_detail(request, marcacao_id):
    try:
        marcacao = Marcacao.objects.get(pk=marcacao_id)
    except Marcacao.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = MarcacaoSerializer(marcacao, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'DELETE':
        marcacao.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)


# ------- Comentario -------

@api_view(['GET', 'POST'])
def comentarios(request):
    if request.method == 'GET':
        comentario_list = Comentario.objects.all()
        serializer = ComentarioSerializer(comentario_list, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ComentarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def comentario_detail(request, comentario_id):
    try:
        comentario = Comentario.objects.get(pk=comentario_id)
    except Comentario.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = ComentarioSerializer(comentario, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'DELETE':
        comentario.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)


# ------- Avaliacao -------

@api_view(['GET', 'POST'])
def avaliacoes(request):
    if request.method == 'GET':
        avaliacao_list = Avaliacao.objects.all()
        serializer = AvaliacaoSerializer(avaliacao_list, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = AvaliacaoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
    return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT', 'DELETE'])
def avaliacao_detail(request, avaliacao_id):
    try:
        avaliacao = Avaliacao.objects.get(pk=avaliacao_id)
    except Avaliacao.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AvaliacaoSerializer(avaliacao, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'DELETE':
        avaliacao.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_400_BAD_REQUEST)
