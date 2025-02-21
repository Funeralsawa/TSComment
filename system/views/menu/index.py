from django.http import JsonResponse
from django.contrib.auth import logout as LogOut

def logout(request):
    LogOut(request)
    return JsonResponse({
        'result': "success",
    })