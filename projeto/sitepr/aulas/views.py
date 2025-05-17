from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from .models import Modalidade, Aula, Marcacao, Comentario, Avaliacao
from .serializers import *
from rest_framework.permissions import IsAuthenticated
from datetime import datetime

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
        aula_list = Aula.objects.all()
        serializer = AulaSerializer(aula_list, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AulaSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def aula_detail(request, aula_id):
    try:
        aula = Aula.objects.get(pk=aula_id)
    except Aula.DoesNotExist:
        return Response({'erro': 'Aula não encontrada.'}, status=status.HTTP_404_NOT_FOUND)

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
        return Response({'mensagem': 'Aula eliminada.'}, status=status.HTTP_204_NO_CONTENT)



# ------- Marcacao -------
@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def marcacoes(request):
    if request.method == 'GET':
        # Retornar as marcações do usuário logado
        marcacoes_user = Marcacao.objects.filter(user=request.user)
        
        # Verificar se as aulas marcadas já passaram e atualizar o status
        for marcacao in marcacoes_user:
            aula = marcacao.aula
            data_hora_aula = datetime.combine(aula.data, aula.hora_inicio)  # Combina data e hora da aula
            if data_hora_aula < datetime.now():
                # Se a aula passou, atualizar o status da marcação para 'cancelada' ou outro que você achar
                if marcacao.status != 'cancelada':  # Verifica se o status já não está como 'cancelada'
                    marcacao.status = 'cancelada'  # Alterando o status para 'cancelada'
                    marcacao.save()

        # Serializar e retornar as marcações
        serializer = MarcacaoSerializer(marcacoes_user, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        idaula = request.query_params.get('idaula')

        if not idaula:
            return Response({'error': 'idaula é obrigatório'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            aula = Aula.objects.get(pk=idaula)
        except Aula.DoesNotExist:
            return Response({'error': 'Aula não encontrada'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar se a aula já passou
        data_hora_aula = datetime.combine(aula.data, aula.hora_inicio)  # Combina data e hora da aula
        if data_hora_aula < datetime.now():
            return Response({'error': 'Não é possível marcar uma aula que já passou'}, status=status.HTTP_400_BAD_REQUEST)

        # Criar a nova marcação com status 'por_marcar' inicialmente
        marcacao = Marcacao(user=request.user, aula=aula, status='por_marcar')

        try:
            # Salvar a marcação
            marcacao.save()
            
            # Após salvar, altere o status para 'marcada'
            marcacao.status = 'marcada'
            marcacao.save()  # Salve novamente para garantir que o status seja atualizado corretamente

        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Serializar a marcação e retornar a resposta
        serializer = MarcacaoSerializer(marcacao)
        return Response(serializer.data, status=status.HTTP_201_CREATED)



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
        marcacao.delete()
        return Response({'mensagem': 'Marcação removida.'}, status=status.HTTP_204_NO_CONTENT)

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
