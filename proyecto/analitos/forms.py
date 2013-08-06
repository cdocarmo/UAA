from django.forms import ModelForm
from django import forms
from models import Analito, Categoria
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.forms.extras.widgets import SelectDateWidget
import datetime



class AnalitoForm(forms.Form):


    nombre = forms.CharField(label=_(u'Nombre'), max_length=30, 
            widget=forms.TextInput(
            attrs={'class':'input-text', 'id':"nombre", 'name':"nombre"}),
            required=True)
    detalle = forms.CharField(label=u"Detalle", required=False,
        widget=forms.Textarea(attrs ={'class':'txt-area', 'cols': '70', 'rows': '3'}))

    categorias = forms.ModelChoiceField(queryset=Categoria.objects.none())


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

        queryset = Categoria.objects.all()
        CHOICES =[]
        CHOICES.append(('','---------'))
        CHOICES.extend([(x.id, x.nombre) for x in queryset])
        CHOICES.append(('new','--Nueva Categoria--'))      
        self.fields['categorias'].choices = CHOICES


