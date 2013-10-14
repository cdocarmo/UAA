# coding=UTF-8
from django.forms import ModelForm
from django import forms
from models import Cliente
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.forms.extras.widgets import SelectDateWidget
import datetime
from usuarios.models import UserProfile
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from popup.widgets import SelectWithPopUp
from localidades.models import Localidad

class RegisterForm(ModelForm):
    
    ayudas = {
              'username':u'Ingresa el nombre de tu empresa o el tuyo propio si ofreces un servicio particular.',
              'email':u'Ingresa una direcci\xf3n, si corresponde.',
              'password1':u'Escribe un buen password.',
              'password2':u'Ahora repitelo, para verificar.'
    }

    firstname = forms.CharField(label=_(u'Nombre'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"nombre-usuario", 'id':"nombre-usuario", 'type':"text"}), help_text = ayudas['username'])

    lastname = forms.CharField(label=_(u'Apellido'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"apellidos", 'id':"apellidos", 'type':"text"}), help_text = ayudas['username'])


    email = forms.CharField(label=_(u'email'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"email", 'id':"email", 'type':"text"}), help_text = ayudas['username'])


    domicilio = forms.CharField(label=_(u'domicilio'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"domicilio", 'id':"domicilio", 'type':"text"}), help_text = ayudas['username'])


    telefono = forms.CharField(label=_(u'telefono'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"telefono", 'id':"telefono", 'type':"text"}), help_text = ayudas['username'])


    razon = forms.CharField(label=_(u'razon'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"razon", 'id':"razon", 'type':"text"}), help_text = ayudas['username'])
    #step = forms.IntegerField(widget=forms.HiddenInput, initial=1)


    class Meta:
        model = Cliente
        fields = ("firstname", "lastname", "email", "domicilio", "telefono", "razon")



class ClienteForm(ModelForm):
    ayudas = {
              'username':u'Ingresa el nombre de tu empresa o el tuyo propio si ofreces un servicio particular.',
              'email':u'Ingresa una direcci\xf3n, si corresponde.',
              'password1':u'Escribe un buen password.',
              'password2':u'Ahora repitelo, para verificar.'
    }

    firstname = forms.CharField(label=_(u'Nombre'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"nombres-cliente", 'id':"nombres-cliente", 'type':"text"}), help_text = ayudas['username'])

    lastname = forms.CharField(label=_(u'Apellido'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"apellidos-cliente", 'id':"apellidos-cliente", 'type':"text"}), help_text = ayudas['username'])


    email = forms.CharField(label=_(u'email'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"email-cliente", 'id':"email-cliente", 'type':"text"}), help_text = ayudas['username'])


    domicilio = forms.CharField(label=_(u'domicilio'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"domicilio-cliente", 'id':"domicilio-cliente", 'type':"text"}), help_text = ayudas['username'])

    localidad = forms.ModelChoiceField(queryset=Localidad.objects.none(), widget=SelectWithPopUp)


    telefono = forms.CharField(label=_(u'telefono'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"telefono-cliente", 'id':"telefono-cliente", 'type':"text"}), help_text = ayudas['username'])

    celular = forms.CharField(label=_(u'celular'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"celular-cliente", 'id':"celular-cliente", 'type':"text"}), help_text = ayudas['username'])


    razon = forms.CharField(label=_(u'razon'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"razon-cliente", 'id':"razon-cliente", 'type':"text"}), help_text = ayudas['username'])
    #step = forms.IntegerField(widget=forms.HiddenInput, initial=1)


    class Meta:
        model = Cliente
        fields = ("firstname", "lastname", "email", "domicilio", "telefono", "razon", "celular")


    def __init__(self, *args, **kwargs):
        super(ClienteForm, self).__init__(*args, **kwargs)
        self.fields['localidad'].queryset = Localidad.objects.all()
