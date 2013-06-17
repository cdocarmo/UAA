# Create your views here.
# coding=UTF-8

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from analitos.models import Analito
from forms import *

def home(request):
    print request.method
    if request.method=='POST':
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

            return HttpResponseRedirect('/')
    else:
        formulario = AnalitoForm()
    return render_to_response('Analitos/mant_analitos.html',
    	{'formulario':formulario}, 
    	context_instance=RequestContext(request))# Create your views here.


def cargo_analitos(request):
    analitos = Analito.objects.all()

    return render_to_response('Analitos/list_analitos.html',
                            {'analitos':analitos}, 
                            context_instance=RequestContext(request))
