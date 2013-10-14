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
from django.contrib.auth.models import User
from clientes.views import *

@login_required(login_url='/login')
def manager(request):
    if request.method=='POST':
    	if 'guardar-analito' in request.POST:
	        formulario = AnalitoForm(request.POST)
	        if formulario.is_valid():
				if formulario.cleaned_data['id'] != 0:
					xAnalito = Analito.objects.get(id=formulario.cleaned_data['id'])
					if xAnalito:
						xAnalito.nombre = formulario.cleaned_data['nombre']
						xAnalito.categoria = formulario.cleaned_data['categoria']
						xAnalito.valor_minimo = 0
						xAnalito.valor_maximo = formulario.cleaned_data['vmaxp']
						xAnalito.metodo_unit = formulario.cleaned_data['metodo_unit']
						xAnalito.metodo = formulario.cleaned_data['metodo']
						xAnalito.observaciones = formulario.cleaned_data['detalle']

						xAnalito.save()
				else:	        	
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
    	if 'guardar-localidades' in request.POST:
			formulario = LocalidadForm(request.POST)
			#print formulario.is_valid()
			if formulario.is_valid():
				if formulario.cleaned_data['id'] != 0:
					xLocalidad = Localidad.objects.get(id=formulario.cleaned_data['id'])
					if xLocalidad:
						xLocalidad.nombre = formulario.cleaned_data['nombre']
						xLocalidad.departamento = formulario.cleaned_data['departamento']
						xLocalidad.coordenadas = formulario.cleaned_data['coordenadas']
						xLocalidad.save()
				else:
					local = Localidad(
					nombre = formulario.cleaned_data['nombre'],
					departamento = formulario.cleaned_data['departamento'],
					coordenadas = formulario.cleaned_data['coordenadas'])
					local.save()
				return HttpResponseRedirect('')
    	if 'guardar-cliente' in request.POST:
	        formulario = ClienteForm(request.POST)
	        if formulario.is_valid():
	            local = Localidad(
	            nombre = formulario.cleaned_data['nombre'],
	            departamento = formulario.cleaned_data['departamento'],
	            coordenadas = formulario.cleaned_data['coordenadas'],
	            dist_mdeo = formulario.cleaned_data['dist_mdeo'])
	            local.save()

	            return HttpResponseRedirect('')	 
    else:
        formAnalito = AnalitoForm()
        formLocalidad = LocalidadForm()
        formCliente = ClienteForm()
    return render_to_response('manager/manager.html',
                            {'formAnalito':formAnalito,
                            'formLocalidad':formLocalidad,
                            'formCliente':formCliente}, 
                            context_instance=RequestContext(request))


def ingresar(request):
	if request.method == 'POST':
		formulario = LoginForm(request.POST)
		if formulario.is_valid:
			usuario = request.POST['username']
			clave = request.POST['password1']
			acceso = authenticate(username=usuario, password=clave)
			if acceso is not None:
				if acceso.is_active:
					login(request, acceso)
					return HttpResponseRedirect('/')
				else:
					error = u'Usuario no Activo, consulte Administrador...'
					return render_to_response('usuario/login.html',
						{'formulario':formulario,
						'error':error}, 
						context_instance=RequestContext(request))
			else:
					error = u'Usuario o contraseña incorrecta, intente nuevamente.'
					return render_to_response('usuario/login.html',
						{'formulario':formulario,
						'error':error}, 
						context_instance=RequestContext(request))
	else:
		formulario = LoginForm()
	return render_to_response('usuario/login.html',
		{'formulario':formulario}, 
		context_instance=RequestContext(request))


@login_required(login_url='/login')
def cerrar(request):
    logout(request)
    return HttpResponseRedirect('/')  

def acepto_cliente(request):
	print request.is_ajax()
	if request.is_ajax():
		print "W"
		if request.POST['cliente']:
			cliente = User.objects.get(id=request.POST['cliente'])
			if cliente:
				cliente.is_active = 1
				cliente.save()
			return HttpResponse()
"""

def acepto_cliente(request, cli_ID):
	cliente = User.objects.get(id=cli_ID)
	if cliente:
		cliente.is_active = 1
		cliente.save()
	return HttpResponseRedirect('/')  
"""
