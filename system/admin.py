from django.contrib import admin
from system.models.teacher.teacher import Teacher
from system.models.student.student import Student

# Register your models here.
admin.site.register(Teacher)
admin.site.register(Student)