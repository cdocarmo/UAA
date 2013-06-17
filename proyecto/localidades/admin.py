from django.contrib import admin
from models import *

class ArticuloAdmin(admin.ModelAdmin):
	prepopulated_fields = {"slug": ("nombre", )}
	fieldsets = (
			(None, {
					'fields': (('nombre', 'slug'), ('familia', 'subfamilia'),
						('costo', 'utilidad', 'precio'), 'observaciones')
				}),
		)
	list_display = ['codigo', 'nombre', 'familia', 'subfamilia', 'precio']
	list_filter = ['familia', 'subfamilia']
	search_fields = ('nombre', )
	ordering = ('nombre', )

	class Media:
		js = ('js/tiny_mce/tiny_mce.js',
			'js/basic_config.js',)

admin.site.register(Articulo, ArticuloAdmin)
admin.site.register(Familia)
admin.site.register(SubFamilia)