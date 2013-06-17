from django.db import models
import datetime
from django.utils.translation import ugettext as _
from django.contrib.auth.models import User


class Categoria(models.Model):
	nombre = models.CharField(max_length=50, verbose_name=u'Nombre')

	def __unicode__(self):
		return _("%s") % (self.nombre)

class Analito(models.Model):
	nombre = models.CharField(max_length=50, verbose_name=u'Nombre')
	categoria = models.ForeignKey(Categoria)
	valor_minimo = models.DecimalField(max_digits=5, decimal_places=3)
	valor_maximo = models.DecimalField(max_digits=5, decimal_places=3, verbose_name=u'Valor Maximo')
	observaciones = models.CharField(max_length=255, blank=True, null=True)
	metodo_unit = models.CharField(max_length=55, blank=True, null=True)
	metodo = models.CharField(max_length=55, blank=True, null=True)
	slug = models.SlugField(editable=False)

	def __unicode__(self):
		return _("%s") % (self.nombre)

