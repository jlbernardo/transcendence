"""
URL configuration for accounts_service project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from accounts.views import auth
from accounts.views import profile
from accounts.views import friendship
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # auth
    path('api/auth/register/', auth.register, name='register'),
    path('api/auth/login/', auth.login, name='login'),
    path('api/auth/logout/', auth.logout, name='logout'),

    # profile
    path('api/profile/', profile.profile, name='profile'),
    path('api/profile/avatar/', profile.avatar, name='avatar'),

    # friends
    path('api/friends/request/', friendship.send_friend_request, name='send_friend_request'),
    path('api/friends/accept/', friendship.accept_friend_request, name='accept_friend_request'),
    path('api/friends/reject/<int:request_id>/', friendship.reject_friend_request, name='reject_friend_request'),
    path('api/friends/pending/', friendship.list_pending_requests, name='list_pending_requests'),
    path('api/friends/', friendship.list_friends, name='list_friends'),

    # API
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema')),
]

# Configuration to serve media
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)