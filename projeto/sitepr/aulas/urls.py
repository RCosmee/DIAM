from django.urls import path
from . import views

app_name = 'aulas'

urlpatterns = [
    path('api/modalidades/', views.modalidades),
    path('api/modalidade/<int:modalidade_id>/', views.modalidade_detail),

    path('api/aulas/', views.aulas),
    path('api/aula/<int:aula_id>/', views.aula_detail),

    path('api/marcacoes/', views.marcacoes),
    path('api/marcacao/<int:marcacao_id>/', views.marcacao_detail),

    path('api/comentarios/', views.comentarios),
    path('api/comentario/<int:comentario_id>/', views.comentario_detail),

    path('api/avaliacoes/', views.avaliacoes),
    path('api/avaliacao/<int:avaliacao_id>/', views.avaliacao_detail),
]
