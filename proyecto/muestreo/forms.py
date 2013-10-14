from django.forms import ModelForm
from django import forms
#from models import Pedido
from localidades.models import Localidad, Departamento, Lugar
from django.utils.translation import ugettext_lazy as _
from django.contrib.auth.models import User
from django.forms.extras.widgets import SelectDateWidget
import datetime
from popup.widgets import SelectWithPopUp

class PedidoForm(forms.Form):

    departamento = forms.ModelChoiceField(queryset=Departamento.objects.none(),
        widget=forms.Select(attrs={'id':"depto", 'name':"depto"}))

    cuidad = forms.ModelChoiceField(queryset=Localidad.objects, required=False,
        widget=forms.Select(attrs={'id':"ciudades", 'name':"ciudades"}))


    direccion = forms.ModelChoiceField(queryset=Lugar.objects, required=False,
        widget=forms.Select(attrs={ 'id':"direccion", 'name':"direccion"}))



    def __init__(self, *args, **kwargs):
        super(PedidoForm, self).__init__(*args, **kwargs)
        self.fields['departamento'].queryset = Departamento.objects.all()
                        



