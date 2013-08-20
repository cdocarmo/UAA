from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'muestreo.views.index'),
    url(r'^analitos/home/$', 'analitos.views.home', name='home-analitos'),
    url(r'^manager/$', 'manager.views.manager', name='manager'),
    url(r'^cliente/registro/$', 'clientes.views.registro_cliente', name='registro-cliente'),
    url(r'^cliente/clientes-pendientes/$', 'clientes.views.cargo_clientes_pendientes', name='clientes-pendientes'),
    url(r'^cliente/clientes/$', 'clientes.views.cargo_clientes', name='clientes'),

    url(r'^login/$','manager.views.ingresar', name='ingresar'),
    url(r'^logout/$', 'manager.views.cerrar', name='cerrar'),    
    url(r'^analitos/cargo-analitos/$', 'analitos.views.cargo_analitos', name='cargo-analitos'),
    url(r'^localidades/cargo-localidades/$', 'localidades.views.cargo_localidades', name='cargo-localidades'),
    # url(r'^proyecto/', include('proyecto.foo.urls')),
    url(r'^add/(?P<model_name>\w+)/?$', 'popup.views.add_new_model'),
    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),
    url(r'^analitos/categoria/$','analitos.views.add_categoria', name='add-categoria'),
    #url(r'^acepto-cliente/(?P<cli_ID>\d+)/$', 'manager.views.acepto_cliente', name='acepto-cliente'),
    url(r'^manager/acepto-cliente/$', 'manager.views.acepto_cliente', name='acepto-cliente'),
    
    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
