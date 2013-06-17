from django.db import models
from django.utils.translation import ugettext as _
import datetime
from django.contrib.auth.models import User


class Departamento(models.Model):
	nombre = models.CharField(max_length=100, verbose_name=u'Departamento')

	def __unicode__(self):
		return _("%s") % (self.nombre)

class Localidad(models.Model):
	nombre = models.CharField(max_length=100, verbose_name=u'Nombre')
	departamento = models.CharField(max_length=30, blank=True, null=True, verbose_name=u'Departamento')
	coordenadas = models.CharField(max_length=255, blank=True, null=True, verbose_name=u'Coordenadas')
	dist_mdeo = models.CharField(max_length=255, blank=True, 
				null=True, verbose_name=u'Distacia desde Montevideo')

	def __unicode__(self):
		return _("%s %s") % (self.user.first_name, self.user.last_name)
