from django.contrib import admin
from models import *

class AnalitoAdmin(admin.ModelAdmin):
	fieldsets = (
			(None, {
					'fields': (('nombre'), ('categoria'),
						('valor_minimo', 'valor_maximo'), 
						('metodo_unit', 'metodo'), 'observaciones')
				}),
		)
	list_display = ['nombre', 'categoria', 'metodo_unit', 'metodo', 'valor_minimo', 'valor_maximo']
	list_filter = ['categoria']
	search_fields = ('nombre', )
	ordering = ('nombre', )


admin.site.register(Analito, AnalitoAdmin)
admin.site.register(Categoria)