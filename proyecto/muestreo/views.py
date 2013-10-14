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
from localidades.models import *
from usuarios.forms import *
from muestreo.forms import *
import string

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
        if 'btn-nuevo-punto-referencia' in request.POST:
			formLugar = NuevoLugarForm(request.POST)
			print formLugar.errors
			if formLugar.is_valid():
				if string.strip(formLugar.cleaned_data['new_ciudad']) != "":
					xCiudad = Localidad(
					nombre = formLugar.cleaned_data['new_ciudad'], 
					departamento = formLugar.cleaned_data['departamento'])
					xCiudad.save()
				else:
					xCiudad = formLugar.cleaned_data['cuidad']


				xCli = request.user.get_profile()
				xLugar = Lugar(
				codigo = "1",
				cliente = xCli,
				localidad = xCiudad,
				departamento = formLugar.cleaned_data['departamento'],
				direccion = formLugar.cleaned_data['direccion'])
				xLugar.save()
	        	return HttpResponseRedirect('')
    else:
        fromPedido = PedidoForm()
        formLocalidad = LocalidadForm()
        formLugar = NuevoLugarForm()
    return render_to_response('index.html',
                            {'fromPedido':fromPedido,
                            'formLocalidad':formLocalidad,
                            'formLugar':formLugar}, 
                            context_instance=RequestContext(request))

