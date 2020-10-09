from django.shortcuts import render, get_object_or_404, redirect
from django.utils import timezone
from django.contrib.auth.decorators import login_required
from django.urls import reverse, reverse_lazy
from django.views.generic import TemplateView, ListView, DetailView, CreateView, UpdateView, DeleteView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.http import Http404
from django.contrib.auth import get_user_model
from braces.views import SelectRelatedMixin

from blog.models import Post, Comment
from blog.forms import PostForm, CommentForm

User = get_user_model()


class AboutView(TemplateView):
    template_name = 'blog/about.html'
    #template_name = 'blog/about.html'


class ProfileView(TemplateView):
    template_name = 'blog/profile.html'


class PostList(SelectRelatedMixin, ListView):
    model = Post
    select_related = ('author',)

    def get_queryset(self):
        return Post.objects.filter(published_date__isnull=False).order_by('created_date')


class UserPostList(SelectRelatedMixin, ListView):
    model = Post
    select_related = ('author',)
    template_name = 'blog/user_post_list.html'

    def get_queryset(self):
        try:
            self.author = User.objects.prefetch_related('posts').get(username__iexact=self.kwargs.get('username'))
        except User.DoesNotExist:
            raise Http404
        else:
            return self.request.user.posts.order_by('created_date')


class PublishedPostList(SelectRelatedMixin, ListView):
    model = Post
    select_related = ('author',)
    template_name = 'blog/user_post_list.html'

    def get_queryset(self):
        try:
            self.author = User.objects.prefetch_related('posts').get(username__iexact=self.kwargs.get('username'))
        except User.DoesNotExist:
            raise Http404
        else:
            return self.request.user.posts.filter(published_date__isnull=False).order_by('published_date')


class PostDraftList(LoginRequiredMixin, SelectRelatedMixin, ListView):
    redirect_field_name = 'blog/post_list.html'
    template_name = 'blog/post_draft_list.html'
    model = Post
    select_related = ('author',)

    def get_queryset(self):
        try:
            self.author = User.objects.prefetch_related('posts').get(username__iexact=self.kwargs.get('username'))
        except User.DoesNotExist:
            raise Http404
        else:
            return self.request.user.posts.filter(published_date__isnull=True).order_by('created_date')


class PostDetail(DetailView):
    model = Post


class CreatePost(LoginRequiredMixin, SelectRelatedMixin, CreateView):
    select_related = ('author',)
    redirect_field_name = 'blog/post_detail.html'
    form_class = PostForm
    model = Post

    def form_valid(self, form):
        self.object = form.save(commit=False)
        self.object.author = self.request.user
        self.object.save()
        return super().form_valid(form)


class PostUpdate(LoginRequiredMixin,SelectRelatedMixin, UpdateView):
    model = Post
    select_related = ('author',)
    fields = ['title', 'text']
    template_name_suffix = '_update'


class PostDelete(LoginRequiredMixin, SelectRelatedMixin, DeleteView):
    model = Post
    select_related = ('author',)
    success_url = reverse_lazy('blog:all')
    template_name = 'blog/post_confirm_delete.html'

    def get_queryset(self):
        queryset = super().get_queryset()
        return queryset.filter(author_id = self.request.user.id)

    def delete(self, *args, **kwargs):
        messages.success(self.request, 'Post Deleted')
        return super().delete(*args, **kwargs)


############################################
#################Comments###################
############################################


@login_required
def add_comment_to_post(request, pk):
    post = get_object_or_404(Post, pk=pk)
    if request.method == 'POST':
        form = CommentForm(request.POST)
        if form.is_valid():
            comment = form.save(commit=False)
            comment.post = post
            comment.save()
            return redirect('detail', pk=post.pk)
    else:
        form = CommentForm #todo: initialize it!
    return render(request, 'blog/comment_form.html', {'form':form})


@login_required
def comment_approve(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    comment.approve()
    return render('detail', pk=comment.post.pk)


@login_required
def comment_remove(request, pk):
    comment = get_object_or_404(Comment, pk=pk)
    post_pk = comment.post.pk
    comment.delete()
    return render('detail', pk=post_pk)


@login_required
def post_publish(request, pk):
    post = get_object_or_404(Post, pk=pk)
    post.publish()
    return redirect('detail', pk=pk)
