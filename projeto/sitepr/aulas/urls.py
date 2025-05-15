from django.urls import path
from . import views

app_name = 'aulas'

urlpatterns = [
    path('modalidades/', views.modalidades),
    path('modalidade/<int:modalidade_id>/', views.modalidade_detail),
    path('aulas/', views.aulas),
    path('aula/<int:aula_id>/', views.aula_detail),
    path('marcacoes/', views.marcacoes),
    path('marcacao/<int:marcacao_id>/', views.marcacao_detail),
    path('comentarios/', views.comentarios),
    path('comentario/<int:comentario_id>/', views.comentario_detail),
    path('avaliacoes/', views.avaliacoes),
    path('avaliacao/<int:avaliacao_id>/', views.avaliacao_detail),
]

