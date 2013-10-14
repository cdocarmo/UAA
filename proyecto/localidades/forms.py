from django.forms import ModelForm
from django import forms
from models import Localidad, Departamento
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.forms.extras.widgets import SelectDateWidget
import datetime
from popup.widgets import SelectWithPopUp


class LocalidadForm(forms.Form):

    id = forms.CharField(label=_(u'id'), max_length=30, 
            widget=forms.TextInput(
            attrs={'class':'input-text', 'id':"id-localidad", 'name':"id-localidad", 
            'type':'hidden', 'value':"0"}),
            required=True)


    nombre = forms.CharField(label=_(u'Nombre'), max_length=30, 
            widget=forms.TextInput(
            attrs={'class':'input-text', 'id':"nombre-localidad", 'name':"nombre-localidad"}),
            required=True)

    departamento = forms.ModelChoiceField(queryset=Departamento.objects.none(), widget=SelectWithPopUp)


    coordenadas = forms.CharField(label=_(u'coordenadas'), max_length=30,
                           widget=forms.TextInput(
                           attrs={'class':'input-text', 'id':"coordenadas", 'name':"coordenadas"}),
                           required=True)
    def __init__(self, *args, **kwargs):
        super(LocalidadForm, self).__init__(*args, **kwargs)
        self.fields['departamento'].queryset = Departamento.objects.all()


class NuevoLugarForm(forms.Form):

    departamento = forms.ModelChoiceField(queryset=Departamento.objects.none(),
        widget=forms.Select(attrs={'class':'input-xxlarge', 'id':"depto_new", 'name':"depto_new"}))

    cuidad = forms.ModelChoiceField(queryset=Localidad.objects, required=False,
        widget=forms.Select(attrs={'class':'input-xxlarge', 'id':"ciudades-nuevo", 'name':"ciudades-nuevo"}))

    new_ciudad = forms.CharField(label=_(u'Nombre'), max_length=30, required=False,
            widget=forms.TextInput(
            attrs={'class':'input-text', 'id':"nueva-ciudad-localidad", 'name':"nueva-ciudad-localidad"}))
    
    direccion = forms.CharField(label=_(u'Nombre'), max_length=30, 
            widget=forms.TextInput(
            attrs={'class':'input-text', 'id':"direccion-nuevo", 'name':"direccion-nuevo"}),
            required=True)    

    def __init__(self, *args, **kwargs):
        super(NuevoLugarForm, self).__init__(*args, **kwargs)
        self.fields['departamento'].queryset = Departamento.objects.all()
                        