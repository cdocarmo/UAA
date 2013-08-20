from django.forms import ModelForm
from django import forms
from models import Analito, Categoria
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.forms.extras.widgets import SelectDateWidget
import datetime
from popup.widgets import SelectWithPopUp



class PedidoForm(forms.Form):

    localidad = forms.ModelChoiceField(queryset=Categoria.objects.none(), widget=SelectWithPopUp)

    departamento = forms.ModelChoiceField(queryset=Categoria.objects.none(), widget=SelectWithPopUp)

    direccion = forms.CharField(label=_(u'Direccion'), max_length=30, 
            widget=forms.TextInput(
            attrs={'class':'input-text', 'id':"direccion", 'name':"direccion"}),
            required=True)


    def __init__(self, *args, **kwargs):
        super(AnalitoForm, self).__init__(*args, **kwargs)
        self.fields['categoria'].queryset = Categoria.objects.all()


