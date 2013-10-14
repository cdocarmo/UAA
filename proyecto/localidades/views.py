# Create your views here.
# coding=UTF-8

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from models import Localidad, Departamento, Lugar
from forms import *
from django.core import serializers

def cargo_localidades(request):
    localidades = Localidad.objects.all().order_by("nombre")

    return render_to_response('localidades/list_localidades.html',
                            {'localidades':localidades}, 
                            context_instance=RequestContext(request))


def obtener_localidad(request):
    if request.POST:

        depa_Id = request.POST['numero'] #request.POST.get('provincia_id')
        #se obtiene la provincia
        depa = Departamento.objects.get(id = int(depa_Id))
        #se obtienen todas las ciudades de la provincia
        local = Localidad.objects.filter(departamento = depa)
         
        #se devuelven las ciudades en formato json, solo nos interesa obtener como json
        #el id y el nombre de las ciudades.
        data = serializers.serialize("json", local, fields=('id','nombre'))
         
    return HttpResponse(data, mimetype="application/javascript")


def obtener_lugar(request):
    if request.POST:

        depa_Id = request.POST['Depa'] #request.POST.get('provincia_id')
        ciudad_Id = request.POST['Ciudad'] #request.POST.get('provincia_id')
        #se obtiene la provincia
        depa = Departamento.objects.get(id = int(depa_Id))
        #se obtienen todas las ciudades de la provincia
        lugar = Lugar.objects.filter(departamento = depa, localidad=ciudad_Id)
               
        #se devuelven las ciudades en formato json, solo nos interesa obtener como json
        #el id y el nombre de las ciudades.
        data = serializers.serialize("json", lugar, fields=('id','direccion'))
         
    return HttpResponse(data, mimetype="application/javascript")    

def busco_lugar(request):
    if request.POST:
        lugar_Id = request.POST['Lugar'] #request.POST.get('provincia_id')
        lugar = Lugar.objects.filter(id = lugar_Id)
        data = serializers.serialize("json", lugar, fields=('id','codigo'))
         
    return HttpResponse(data, mimetype="application/javascript")        