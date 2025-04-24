from rest_framework.response import Response # type: ignore
from rest_framework.decorators import api_view  # type: ignore
from rest_framework import status # type: ignore
from .serializers import *  # (1) 
 
@api_view(['GET', 'POST']) # (2) 
def questions(request): 
 
    if request.method == 'GET':  # (3) 
        question_list = Questao.objects.all() 
        serializer = QuestaoSerializer(question_list, many=True) 
        return Response(serializer.data) 
 
    elif request.method == 'POST': # (3) 
        serializer = QuestaoSerializer(data=request.data) 
        if serializer.is_valid(): 
            serializer.save() 
            return Response(status=status.HTTP_201_CREATED) 
 
    return Response(status=status.HTTP_400_BAD_REQUEST) 
 
@api_view(['PUT', 'DELETE'])  # (2) e (4) 
def question_detail(request, question_id): 
 
    try: 
        question = Questao.objects.get(pk=question_id) 
    except Questao.DoesNotExist: 
        return Response(status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'PUT':  # (4) 
        serializer = QuestaoSerializer(question, data=request.data) 
        if serializer.is_valid(): 
            serializer.save() 
            return Response(status=status.HTTP_204_NO_CONTENT)
        
@api_view(['GET', 'POST']) 
def options(request, question_id): 
 
    if request.method == 'GET': 
        question = Questao.objects.get(pk=question_id) 
        option_list = question.opcao_set.all() 
        serializer = OpcaoSerializer(option_list, many=True) 
        return Response(serializer.data) 
 
    elif request.method == 'POST': 
        serializer = OpcaoSerializer(data=request.data) 
        if serializer.is_valid(): 
            serializer.save() 
            return Response(status=status.HTTP_201_CREATED) 
 
    return Response(status=status.HTTP_400_BAD_REQUEST) 
 
 
@api_view(['PUT', 'DELETE']) 
def option_detail(request, option_id): 
 
    try: 
        option = Opcao.objects.get(pk=option_id) 
    except Opcao.DoesNotExist: 
        return Response(status=status.HTTP_404_NOT_FOUND) 
 
    if request.method == 'PUT': 
        serializer = OpcaoSerializer(option, data=request.data) 
        if serializer.is_valid(): 
            serializer.save() 
            return Response(status=status.HTTP_204_NO_CONTENT) 
 
    elif request.method == 'DELETE': 
        option.delete() 
        return Response(status=status.HTTP_204_NO_CONTENT) 
 
    return Response(status=status.HTTP_400_BAD_REQUEST)         