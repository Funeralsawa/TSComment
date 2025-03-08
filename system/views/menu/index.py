from django.http import JsonResponse
from django.contrib.auth import logout as LogOut

def logout(request):
    LogOut(request)
    return JsonResponse({
        'result': "success",
    })

def send_question(request):
    data = request.POST
    questionnaire = "<font color=red>" + data['question'] + "</font>"
    return JsonResponse({
        'result': "success",
        'questionnaire': questionnaire,
    })