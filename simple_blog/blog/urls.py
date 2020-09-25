from django.urls import path
from blog.views import IndexView, AboutView

#app_name = 'blog'

urlpatterns = [
    path('', IndexView.as_view(), name='index'),
    path('about/', AboutView.as_view(), name='about'),
]
