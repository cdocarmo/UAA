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
from django.utils.html import escape


def home(request):
    if request.method=='POST':
        formulario = AnalitoForm(request.POST)
        print "W"
        if formulario.is_valid():
            analito = Analito(
            nombre = formulario.cleaned_data['nombre'],
            categoria = formulario.cleaned_data['categoria'],
            valor_minimo = formulario.cleaned_data['vminp'],
            valor_maximo = formulario.cleaned_data['vmaxp'],
            metodo_unit = formulario.cleaned_data['metodo_unit'],
            metodo = formulario.cleaned_data['metodo'],
            observaciones = formulario.cleaned_data['detalle'])
            analito.save()

            return HttpResponseRedirect('/')
    else:
        formulario = AnalitoForm()
    return render_to_response('analitos/mant_analitos.html',
    	{'formulario':formulario}, 
    	context_instance=RequestContext(request))# Create your views here.


def cargo_analitos(request):
    analitos = Analito.objects.all().order_by("nombre")

    return render_to_response('analitos/list_analitos.html',
                            {'analitos':analitos}, 
                            context_instance=RequestContext(request))





@login_required(login_url='/login')
def add_categoria(request):
    if request.method=='POST':
        formulario = CategoriaForm(request.POST)
        if formulario.is_valid():

            try:
                newObject = formulario.save()
            except forms.ValidationError, error:
                newObject = None            
        if newObject:
            print newObject._get_pk_val()
            return HttpResponse('<!DOCTYPE html><html><head><title></title></head><body>'
            '<script type="text/javascript">opener.dismissAddAnotherPopup(window, "%s", "%s");</script></body></html>' % \
            # escape() calls force_unicode.
            (escape(newObject._get_pk_val()), escape(newObject)))
        else:
            formulario = CategoriaForm()
    else:
        formulario = CategoriaForm()
    return render_to_response('analitos/categoria.html',
        {'formulario':formulario}, 
        context_instance=RequestContext(request))# Create your views here.

"""
@login_required(login_url='/login')
def add_categoria(request):
    if request.method=='POST':
        formulario = CategoriaForm(request.POST)
        if formulario.is_valid():
            catego = Categoria(
            nombre = formulario.cleaned_data['nombre'])
            catego.save()
            return HttpResponseRedirect('/')
    else:
        formulario = CategoriaForm()
    return render_to_response('analitos/categoria.html',
        {'formulario':formulario}, 
        context_instance=RequestContext(request))# Create your views here.

"""