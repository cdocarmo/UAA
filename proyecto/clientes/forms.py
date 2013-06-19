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


    celular = forms.CharField(label=_(u'celular'), max_length=30, 
                               widget=forms.TextInput(attrs={'class':"input-xxlarge",
                                'name':"celular", 'id':"celular", 'type':"text"}), help_text = ayudas['username'])

    class Meta:
        model = Cliente
        fields = ("firstname", "lastname", "email", "domicilio", "telefono", "celular")


"""

class AnalitoForm(forms.Form):


    nombre = forms.CharField(label=_(u'Nombre'), max_length=30, 
            widget=forms.TextInput(
            attrs={'class':'input-text', 'id':"nombre", 'name':"nombre"}),
            required=True)
    detalle = forms.CharField(label=u"Detalle", required=False,
        widget=forms.Textarea(attrs ={'class':'txt-area', 'cols': '70', 'rows': '3'}))

    categorias = forms.ModelChoiceField(queryset=Categoria.objects.none())


    vminp = forms.CharField(label=_(u'vminp'), max_length=30, 
                          widget=forms.TextInput(
                          attrs={'class':'input-text', 'id':"vminp", 'name':"vminp"}),
                          required=True)
    vmaxp = forms.CharField(label=_(u'vmaxp'), max_length=30,
                             widget=forms.TextInput(
                             attrs={'class':'input-text', 'id':"vmaxp", 'name':"vmaxp"}),
                             required=True)
    metodo_unit = forms.CharField(label=_(u'metodo_unit'), max_length=30,
                           widget=forms.TextInput(
                           attrs={'class':'input-text', 'id':"metodo_unit", 'name':"metodo_unit"}),
                           required=True)
    metodo = forms.CharField(label=_(u'metodo'), max_length=30,
                           widget=forms.TextInput(
                           attrs={'class':'input-text', 'id':"metodo", 'name':"metodo"}),
                           required=True)
    def __init__(self, *args, **kwargs):
        super(AnalitoForm, self).__init__(*args, **kwargs)
        self.fields['categorias'].queryset = Categoria.objects.all()
"""