"""apiv2 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
from core.views import *
from rest_framework_simplejwt import views as jwt_views

urlpatterns = [
    # path('admin/', admin.site.urls),
    path("", front, name="front"),
    path("ques/<str:sub>/<int:level>", ques, name="ques"),
    path("quesall/", quesall, name="quesall"),
    path("ans/", ans, name="ans"),
    path("submit/", submit, name="submit"),
    path("ping/", ping, name="ping"),
    path("check/", check, name="check"),
    path('admin/', admin.site.urls),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', jwt_views.TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterApi.as_view()),
    path('scores/', scores, name="scores"),
]

handler404 = "core.views.front"
