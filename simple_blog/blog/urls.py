from django.urls import path
from . import views

app_name = 'blog'

urlpatterns = [
    path('', views.PostList.as_view(), name='all'),
    path('about/', views.AboutView.as_view(), name='about'),
    path('profile/<username>/', views.ProfileView.as_view(), name='profile'),
    path('create/', views.CreatePost.as_view(), name='create'),
    path('update/<pk>/', views.PostUpdate.as_view(), name='update'),
    path('delete/<pk>/', views.PostDelete.as_view(), name='delete'),
    path('<username>/', views.UserPostList.as_view(),name='user_post_list'),
    path('<username>/published/', views.PublishedPostList.as_view(),name='post_published_list'),
    path('<username>/drafts/', views.PostDraftList.as_view(),name='post_draft_list'),
    path('post/<pk>/', views.PostDetail.as_view(), name='detail'),
    path('<pk>/comment/', views.add_comment_to_post, name='add_comment_to_post'),
    path('comment/<pk>/approve/', views.comment_approve, name='comment_approve'),
    path('comment/<pk>/remove/', views.comment_remove, name='comment_remove'),
    path('publish/<pk>/', views.post_publish, name='post_publish'),
]
