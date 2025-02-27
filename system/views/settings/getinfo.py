from django.http import JsonResponse
from system.models.student.student import Student
from system.models.teacher.teacher import Teacher

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
            return JsonResponse({
                'result': "success",
                'is_teacher': "true",
            })
        else:
            return JsonResponse({
                'result': "success",
                'is_teacher': is_teacher,
            })