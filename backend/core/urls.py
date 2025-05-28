from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blog.views import BlogViewSet, register, EmailTokenObtainPairView, my_blogs
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'blogs', BlogViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/signup/', register),
    path('api/login/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/my-blogs/', my_blogs),
]
