from django.contrib import admin
from django.urls import path, include

<<<<<<< Updated upstream
urlpatterns = [ 
    path('api/', include('database.urls')), 
    path('admin/', admin.site.urls), 
] 
=======
urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('users.urls')),  # <-- ISTO É IMPORTANTE!
]
>>>>>>> Stashed changes
