from django.forms import ModelForm
from django import forms
from models import Localidad, Departamento
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.forms.extras.widgets import SelectDateWidget
import datetime


class LocalidadForm(forms.Form):
    nombre = forms.CharField(label=_(u'Nombre'), max_length=30, 
            widget=forms.TextInput(
            attrs={'class':'input-text', 'id':"nombre", 'name':"nombre"}),
            required=True)

    departamento = forms.ModelChoiceField(queryset=Departamento.objects.none())


    coordenadas = forms.CharField(label=_(u'coordenadas'), max_length=30,
                           widget=forms.TextInput(
                           attrs={'class':'input-text', 'id':"coordenadas", 'name':"coordenadas"}),
                           required=True)
    dist_mdeo = forms.CharField(label=_(u'dist_mdeo'), max_length=30,
                           widget=forms.TextInput(
                           attrs={'class':'input-text', 'id':"dist_mdeo", 'name':"dist_mdeo"}),
                           required=True)
    def __init__(self, *args, **kwargs):
        super(LocalidadForm, self).__init__(*args, **kwargs)
        self.fields['departamento'].queryset = Departamento.objects.all()