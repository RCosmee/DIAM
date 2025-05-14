from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [ 
    path('api/', include('database.urls')), 
    path('aulas/', include('aulas.urls')),  
    path('', include('users.urls')),  # <-- ISTO É IMPORTANTE!
    path('admin/', admin.site.urls), 
] 

if settings.DEBUG:
 urlpatterns+= static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)