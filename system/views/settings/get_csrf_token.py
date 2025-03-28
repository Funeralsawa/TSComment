from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views import View

class get_csrf_token(View):
    def get(self, request):
        token = get_token(request)
        return JsonResponse({'csrfToken': token})