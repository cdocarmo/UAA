from django.db import models
from django.utils.translation import ugettext as _
import datetime
from usuarios.models import UserProfile

class Cliente(models.Model):
	user = models.ForeignKey(UserProfile, unique=True)
	razon = models.CharField(max_length=150, blank=True, null=True, verbose_name=u'Raz\xf3n Social')
	rut = models.CharField(max_length=30, blank=True, null=True)
	def __unicode__(self):
		return _("%s") % (self.razon)
