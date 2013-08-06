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
    return render_to_response('index.html',
                            {}, 
                            context_instance=RequestContext(request))


def manager(request):
    if request.method=='POST':
    	if 'guardar-analito' in request.POST:
	        formulario = AnalitoForm(request.POST)
	        if formulario.is_valid():
	            analito = Analito(
	            nombre = formulario.cleaned_data['nombre'],
	            categoria = formulario.cleaned_data['categorias'],
	            valor_minimo = 0,
	            valor_maximo = formulario.cleaned_data['vmaxp'],
	            metodo_unit = formulario.cleaned_data['metodo_unit'],
	            metodo = formulario.cleaned_data['metodo'],
	            observaciones = formulario.cleaned_data['detalle'])
	            analito.save()

	            return HttpResponseRedirect('')
    	if 'guardar-localidades' in request.POST:
	        formulario = LocalidadForm(request.POST)
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
    return render_to_response('manager/manager.html',
                            {'formAnalito':formAnalito,
                            'formLocalidad':formLocalidad}, 
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