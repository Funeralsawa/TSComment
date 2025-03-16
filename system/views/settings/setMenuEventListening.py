from system.models.questionnaire.questionnaire import Questionnaire
from system.models.teacher.teacher import Teacher
from django.http import JsonResponse

def SetMenuEventListening(request):
    data = request.GET
    name = data['name']
    user = request.user
    teacher = Teacher.objects.filter(user=user)[0]
    text = Questionnaire.objects.filter(owner=teacher, name=name)
    text = list(text.values())[0].get('text')
    return JsonResponse({
        'result': "success",
        'text': text,
    })
