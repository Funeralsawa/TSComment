from django.db import models
from system.models.teacher.teacher import Teacher

class Class(models.Model):
    ClassName = models.CharField(verbose_name='班级名', max_length=100, blank=False, null=False)
    teacher = models.ManyToManyField(Teacher, related_name='classes')

    def __str__(self):
        return self.ClassName

    class Meta:
        managed=True
        verbose_name = 'class'
        verbose_name_plural = 'classes'
