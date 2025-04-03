from django.db import models
from system.models.teacher.teacher import Teacher
from system.models.class_info.class_info import Class
from django.utils import timezone
from datetime import datetime
import uuid

class Questionnaire(models.Model):
    name = models.CharField(max_length=50, verbose_name='name', null=False, blank=False, 
                            default=timezone.now().strftime("%Y:%m:%D-%H:%M:%S"))
    create_Time = models.DateTimeField(verbose_name='create_time', auto_now_add=True)
    content = models.JSONField()
    owner = models.ForeignKey(Teacher, on_delete=models.CASCADE, related_name="Questionnaire_owner")
    has_submit = models.BooleanField(verbose_name='是否发布', null=False, blank=False, default=False)
    cls = models.ForeignKey(Class, on_delete=models.CASCADE, blank=False, null=False)

    def __str__(self):
        return str(self.name)
