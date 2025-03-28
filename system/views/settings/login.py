from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from system.models.teacher.teacher import Teacher
from system.models.student.student import Student
from django.contrib.auth.models import User

def signin(request):
    data = request.GET
    username = data.get('username')
    password = data.get('password')

    if username == 'acs':
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)
            return JsonResponse({
                'result': 'success',
                'is_teacher': int(1),
            })

    user = authenticate(username=username, password=password)
    if user:
        if Teacher.objects.filter(user=user):
            is_teacher = 1
        else:
            is_teacher = 0
    if not user:
        return JsonResponse({
            'result': "用户名或密码不正确",
        })
    login(request, user)
    request.session.set_expiry(0)
    return JsonResponse({
        'result': 'success',
        'is_teacher': is_teacher,
    })
