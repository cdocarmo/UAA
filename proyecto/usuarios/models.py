from django.db import models
from django.utils.translation import ugettext as _
import datetime
from django.contrib.auth.models import User


class UserProfile(models.Model):
	PENDIENTE = 1
	ACTIVA = 2
	NEGADA = 3
	STATUS = (
		(PENDIENTE, _('PENDIENTE')),
		(ACTIVA, _('ACTIVA')),
		(NEGADA, _('NEGADA')),)
	user = models.ForeignKey(User, unique=True)
	telefono = models.CharField(max_length=30, blank=True, null=True, verbose_name=u'tel\xe9fono')
	celular = models.CharField(max_length=30, blank=True, null=True)
	documento = models.CharField(max_length=255, blank=True, null=True)
	mail_profesional = models.EmailField(blank=False)
	domicilio = models.CharField(max_length=255)
	slug = models.SlugField(editable=False)
	descripcion = models.TextField(blank=True, null=True, verbose_name=u'descripci\xf3n')
	status = models.IntegerField(choices=STATUS, default=1)
	fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name=u'fecha de creaci\xf3n')

	def __unicode__(self):
		return _("%s %s") % (self.user.first_name, self.user.last_name)
