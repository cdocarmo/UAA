from django.contrib import admin
from models import *

class UsuarioAdmin(admin.ModelAdmin):
	fieldsets = (
			(None, {
					'fields': (('user', 'telefono', 'celular'), 
						('documento', 'mail_profesional'), 'domicilio')
				}),
		)
	list_display = ['user', 'telefono', 'celular', 'mail_profesional']
	search_fields = ('user', )
	ordering = ('user', )


admin.site.register(UserProfile, UsuarioAdmin)