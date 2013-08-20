from django.db import models

# Create your models here.
class Pedido(models.Model):
	cliente = models.ForeignKey()
	lugar = models.ForeignKey()
	nro_pedidp = models.CharField(max_length=50)



    def __unicode__(self):
        pass
    