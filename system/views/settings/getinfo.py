from django.http import JsonResponse
from system.models.student.student import Student
from system.models.teacher.teacher import Teacher
from system.models.questionnaire.questionnaire import Questionnaire

def getinfo_web(request):
    user = request.user
    if not user.is_authenticated:
        return JsonResponse({
            'result': "未登录",
        })
    else:
        if user.username == 'acs': is_teacher = "true"
        else: is_teacher = "false"
        if Teacher.objects.filter(user=user):
            teacher = Teacher.objects.filter(user=user)[0]
            questionnaire = Questionnaire.objects.filter(owner=teacher)
            return JsonResponse({
                'result': "success",
                'is_teacher': "true",
                'questionnaire': list(questionnaire.values('name')),
            })
        else:
            return JsonResponse({
                'result': "success",
                'is_teacher': is_teacher,
            })
