# Create your views here.
# coding=UTF-8
from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from analitos.forms import *
from localidades.forms import *
from usuarios.forms import *


@login_required(login_url='/login')
def index(request):
    if request.method=='POST':
    	if 'agregar-muestreo' in request.POST:
	        formulario = AnalitoForm(request.POST)
	        if formulario.is_valid():
	            analito = Analito(
	            nombre = formulario.cleaned_data['nombre'],
	            categoria = formulario.cleaned_data['categoria'],
	            valor_minimo = 0,
	            valor_maximo = formulario.cleaned_data['vmaxp'],
	            metodo_unit = formulario.cleaned_data['metodo_unit'],
	            metodo = formulario.cleaned_data['metodo'],
	            observaciones = formulario.cleaned_data['detalle'])
	            analito.save()

	            return HttpResponseRedirect('')
    else:
        formAnalito = AnalitoForm()
        formLocalidad = LocalidadForm()
    return render_to_response('index.html',
                            {'formAnalito':formAnalito,
                            'formLocalidad':formLocalidad}, 
                            context_instance=RequestContext(request))

