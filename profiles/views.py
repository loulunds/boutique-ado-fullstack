from django.shortcuts import render

# Create your views here.
def profile(request):
    """ A view to return the index page """
    template = 'profiles/profile.html'
    context = {}

    return render(request, template, context)