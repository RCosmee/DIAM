from django.urls import path
from . import views

app_name = 'aulas'

urlpatterns = [


    # Modalidades
    path('modalidades/', views.modalidades, name='modalidades'),
    path('modalidades/<int:pk>/', views.modalidade_detail, name='modalidade_detail'),

    # Aulas
    path('aulas/', views.aulas, name='aulas'),
    path('aulas/<int:pk>/', views.aula_detail, name='aula_detail'),
    

    # Marcações
    path('marcacoes/', views.marcacoes, name='marcacoes'),
    path('marcacoes/<int:pk>/', views.marcacao_detail, name='marcacao_detail'),


    # Comentários gerais (listar, criar)
    path('comentarios/', views.comentarios, name='comentarios'),
    
    # Comentários + média para uma aula específica
    path('aulas/<int:aula_id>/comentarios/', views.comentarios_e_media, name='comentarios_e_media'),

    # Comentário específico (atualizar, deletar)
    path('comentarios/<int:comentario_id>/', views.comentario_detail, name='comentario_detail'),
]
