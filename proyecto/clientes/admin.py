from django.contrib import admin
from models import *

class ClienteAdmin(admin.ModelAdmin):
	fieldsets = (
			(None, {
					'fields': ('razon', 'user', 'rut')
				}),
		)
	list_display = ['razon', 'user', 'rut']
	search_fields = ('user', 'razon',)
	ordering = ('razon', )


admin.site.register(Cliente, ClienteAdmin)
