from django.db import models
from django.conf import settings


class UserProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    # note: next time eliminate the null=True and blank=True in the fields below
    # otherwise, need to re-create the database
    contact_email = models.EmailField(max_length=200, null=True, blank=True)
    surname = models.CharField(max_length=120, null=True, blank=True)
    given_name = models.CharField(max_length=120, null=True, blank=True)

    class Meta:
        ordering = ('surname', 'given_name')

    def __str__(self):
        return self.user.username
