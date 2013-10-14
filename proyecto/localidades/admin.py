from django.contrib import admin
from models import *

class LocalidadAdmin(admin.ModelAdmin):
	#prepopulated_fields = {"slug": ("nombre", )}
	fieldsets = (
			(None, {
					'fields': (('nombre'), ('departamento'),
						('coordenadas', 'dist_mdeo'))
				}),
		)
	list_display = ['id', 'nombre', 'departamento', 'coordenadas', 'dist_mdeo']
	list_filter = ['departamento']
	search_fields = ('nombre', )
	ordering = ('nombre', )


class LugarAdmin(admin.ModelAdmin):
	#prepopulated_fields = {"slug": ("nombre", )}
	fieldsets = (
			(None, {
					'fields': (('codigo'), ('cliente'),
						('localidad', 'departamento', 'direccion'))
				}),
		)
	list_display = ['id', 'codigo', 'localidad', 'departamento', 'direccion']
	list_filter = ['departamento']
	search_fields = ('codigo', )
	ordering = ('codigo', )

admin.site.register(Localidad, LocalidadAdmin)
admin.site.register(Lugar, LugarAdmin)
admin.site.register(Departamento)