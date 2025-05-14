from django.contrib import admin
from django.urls import path, include

urlpatterns = [ 
    path('api/', include('database.urls')), 
    path('aulas/', include('aulas.urls')),  
    path('', include('users.urls')),  # <-- ISTO É IMPORTANTE!
    path('admin/', admin.site.urls), 
] 
