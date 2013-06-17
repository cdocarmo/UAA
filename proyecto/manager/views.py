# Create your views here.
# coding=UTF-8

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from analitos.forms import *

def manager(request):
    if request.method=='POST':
    	if 'guardar-analito' in request.POST:
	        formulario = AnalitoForm(request.POST)
	        if formulario.is_valid():
	            analito = Analito(
	            nombre = formulario.cleaned_data['nombre'],
	            categoria = formulario.cleaned_data['categorias'],
	            valor_minimo = formulario.cleaned_data['vminp'],
	            valor_maximo = formulario.cleaned_data['vmaxp'],
	            metodo_unit = formulario.cleaned_data['metodo_unit'],
	            metodo = formulario.cleaned_data['metodo'],
	            observaciones = formulario.cleaned_data['detalle'])
	            analito.save()

	            return HttpResponseRedirect('')
    else:
        formAnalito = AnalitoForm()	
    return render_to_response('manager/manager.html',
                            {'formAnalito':formAnalito}, 
                            context_instance=RequestContext(request))