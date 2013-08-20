# Create your views here.
# coding=UTF-8

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from forms import *
from django.contrib.auth.models import User

from usuarios.models import UserProfile

def registro_cliente(request, step=1):
    #step = request.POST.get('step','1')

    if request.method=='POST':
        formulario = RegisterForm(request.POST)
        print formulario.is_valid()
        if formulario.is_valid():
			usuario = User(
			first_name = formulario.cleaned_data['firstname'],
			last_name = formulario.cleaned_data['lastname'],
			email = formulario.cleaned_data['email'],
			is_active = 0,
			username=formulario.cleaned_data['email'])
			usuario.save()
			userp = UserProfile(
			user=usuario,
			telefono = formulario.cleaned_data['telefono'],
			domicilio = formulario.cleaned_data['domicilio'])
			userp.save()

			cliente = Cliente(
			user = userp,
			razon=formulario.cleaned_data['razon'])
			cliente.save()

			return HttpResponseRedirect('/')
    else:
        formulario = RegisterForm()
    return render_to_response('clientes/registro_cliente.html',
                            {'formulario':formulario}, 
                            context_instance=RequestContext(request))


def cargo_clientes(request):
    clientes = User.objects.filter(is_active=1).order_by("last_name")
    return render_to_response('clientes/list_clientes.html',
                            {'clientes':clientes}, 
                            context_instance=RequestContext(request))


def cargo_clientes_pendientes(request):
    clientes = User.objects.filter(is_active=0).order_by("last_name")
    return render_to_response('clientes/list_clientes_pendientes.html',
                            {'clientes':clientes}, 
                            context_instance=RequestContext(request))
