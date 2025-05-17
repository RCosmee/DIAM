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

    # Comentários
    path('comentarios/', views.comentarios, name='comentarios'),
    path('comentarios/<int:pk>/', views.comentario_detail, name='comentario_detail'),

    # Avaliações
    path('avaliacoes/', views.avaliacoes, name='avaliacoes'),
    path('avaliacoes/<int:pk>/', views.avaliacao_detail, name='avaliacao_detail'),
]
