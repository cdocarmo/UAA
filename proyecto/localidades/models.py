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
	departamento = models.ForeignKey(Departamento)
	coordenadas = models.CharField(max_length=255, blank=True, null=True, verbose_name=u'Coordenadas')
	dist_mdeo = models.CharField(max_length=255, blank=True, 
				null=True, verbose_name=u'Distacia desde Montevideo')

	def __unicode__(self):
		return _("%s,  %s") % (self.nombre, self.departamento)


class Lugar(models.Model):

	localidad = models.ForeignKey(Localidad)
	departamento = models.ForeignKey(Departamento)
	direccion = models.CharField(max_length=50)
	def __unicode__(self):
		return _("%s,  %s") % (self.localidad, self.direccion)