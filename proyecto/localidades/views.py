# Create your views here.
# coding=UTF-8

from django.shortcuts import render_to_response
from django.template import RequestContext
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from models import Localidad, Departamento
from forms import *


def cargo_localidades(request):
    localidades = Localidad.objects.all().order_by("nombre")

    return render_to_response('localidades/list_localidades.html',
                            {'localidades':localidades}, 
                            context_instance=RequestContext(request))