# coding=UTF-8
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _
from django import forms
from datetime import date, datetime, timedelta
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm


class LoginForm(AuthenticationForm):
    
    ayudas = {
              'username':u'Ingresa el nombre de tu empresa o el tuyo propio si ofreces un servicio particular.',
              'email':u'Ingresa una direcci\xf3n, si corresponde.',
              'password1':u'Escribe un buen password.',
              'password2':u'Ahora repitelo, para verificar.'
    }    

    username = forms.CharField(label=_(u'Usuario'), max_length=30, 
                                widget=forms.TextInput(
                                attrs={'class':'input-text', 'placeholder':'Nombre de usuario…'}), 
                                help_text = ayudas['username'])
    password1 = forms.CharField(label=_("Password"), 
                                widget=forms.PasswordInput(
                                attrs={'class':'input-text', 'placeholder':'Contraseña'}), 
                                   help_text=ayudas['password1'])
    class Meta:
        model = User
        fields = ("username", "password1")