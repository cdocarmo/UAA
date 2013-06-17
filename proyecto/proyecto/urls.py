from django.conf.urls import patterns, include, url

# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^analitos/home/$', 'analitos.views.home', name='home-analitos'),
    url(r'^manager/$', 'manager.views.manager', name='manager'),
    
    url(r'^analitos/cargo-analitos/$', 'analitos.views.cargo_analitos', name='cargo-analitos'),
    # url(r'^proyecto/', include('proyecto.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    url(r'^admin/', include(admin.site.urls)),
)
