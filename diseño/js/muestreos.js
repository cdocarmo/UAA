//GLOBALES
var tab_actual = 'tab-pedido';  //tab-muestreos-anteriores
var PEDIDO = "pedido";
var MUESTREOS_ANTERIORES = "muestreos-anteriores";
var col_muestreos = new Array();
var prox_numero_muestreo = 0;
var agregar_muestreo = true;
var analitos_marcados = 0;

//TODO: debo capturar el enter para que no me guarde sin advertencia previa.

$(document).ready(function(){
	reBind();
});

//EVENTOS

function reBind() {
	//limpiarCampos();
	//Agregar un muestreo
	$('#btn-agregar-muestreo').on('click', function(){
		var msg_alert = "";
		//recoger todos los datos en un objeto
		var obj = new Object();
		obj['departamento'] = $('#departamentos').val();
		obj['ciudad'] = $('#ciudades').val();
		obj['direccion'] = $('#direccion').val();
		obj['referencia'] = $('#numero-referencia');
		var analitos = new Array();
		$('.analito').each(function(){
			if ($(this).is(':checked')) {
				analitos.push($(this).attr('value'));
				analitos_marcados++;	
			}
		});
		
		if ($('#direccion').val().length < 1) {
			var temp = $('#locacion').find('#msg-vacio-direccion');
			if ($('#locacion').find('#msg-vacio-direccion').length == 0) {
				$(crearMsgValidacion('Campo obligatorio', 'direccion')).appendTo($('#direccion').prev());	
			}
			agregar_muestreo = false;
		}else{
			quitarMsg($('#direccion'));
		}
		
		if (analitos_marcados > 0) {
			quitarMsg($('#analitos'));
			obj['col-analitos'] = analitos;
		}else {
			if ($('#analitos').find('#msg-vacio-analitos').length == 0) {
				$(crearMsgValidacion('Debes seleccionar al menos un analito', 'analitos')).appendTo($('#analitos legend').append());	
			}
			agregar_muestreo = false;
		}
		if (agregar_muestreo) {
			obj['nro_muestreo'] = prox_numero_muestreo;
			crearLineaNuevoMuestreo(obj);
			++prox_numero_muestreo;
			$('.ningun-muestreo').css('display', 'none');
			modificarTitulo();
			limpiar();
		}else{
			agregar_muestreo = true;
		}
		//Reseteo analitos marcados
		analitos_marcados = 0;
	});
	
	$('#lista-muestreos').on('click', function(e) {
		if (e.target.nodeName == 'I'){
			//alert('click en <i>');
			var nro_id;
			nro_id = $(this).parent().parent().attr('id');
			var count = 0;
			for (item in col_muestreos) {
				if (col_muestreos[item].nro_muestreo == $(this).attr('id').substring(4)) {
					delete col_muestreos[count];
				}
				++count;
			}
			$(e.target).parent().parent().remove();
			if (col_muestreos.length == 0) {
				//TODO: no lo muestra, parece que col_muestreos no queda vacio
				$('.ningun-muestreo').css('display', 'block');
			}
			modificarTitulo();
		}else if (e.target.nodeName == 'A'){
			for (item in col_muestreos) {
				var temp = $(e.target).parent().attr('id').substring(4);
				if (item == temp) {
				//if (item.nro_muestreo == temp) {
					rellenarFormulario(col_muestreos[item]);
					return;
				}
			}
		}
	});
}

function rellenarFormulario(obj) {
	var analitos = obj['col-analitos'];
	var selector;
	var nombre;
	for (item in analitos) {
		nombre = analitos[item];
		
		selector = 'input[value="' + nombre + '"]';
		$(selector).attr('checked', true);
		$('input[value="plomo"]').attr('checked', true);
	}
	//$('.analito').each(function(){
	//	$(this).attr('checked', true);
	//});
	var departamento = obj['departamento'];
	var ciudad  = obj['ciudad'];
	$('#departamentos option[value="' + departamento + '"]').attr('selected', 'selected');
	$('#ciudades option[value="' + ciudad + '"]').attr('selected', 'selected');
	//$('#departamentos').attr('selectedValue', departamento);
	//$('#ciudades').attr('selectedValue', ciudad);
	$('#direccion').val(obj['direccion']);
	$('#numero-referencia').val('');
}

function cambiarFondoMuestreos(obj) {
	
}

function crearLineaNuevoMuestreo(obj) {
	var nuevo_nodo = $('<li id="nro-' + obj.nro_muestreo + '"><a href="#"><i class="icon-edit"></i>&nbsp&nbsp&nbspMuestreo numero <span class="nro-de-muestreo">' + col_muestreos.length 
	+ '</span> - C&oacute;digo de referencia <span class="codigo-referencia">' + obj.referencia + '</span><i class="icon-remove pull-right"></i></a></li>');
	$('#lista-muestreos').prepend(nuevo_nodo);
	//en otro metodo deberia ir esto
	col_muestreos.push(obj);
}

function modificarTitulo() {
	$('#numero-de-muestreos').val(String(col_muestreos.length));
}

function crearMsgValidacion(msg, id) {
	var nodo_msg = $('<span id="msg-vacio-' + id + '" style="color:red; margin-left:5%">' + msg + '</span>');
	return nodo_msg;
}

//Este quita un mensaje particular
function quitarMsg(obj) {
	$('#msg-vacio-' + $(obj).attr("id")).remove();
}

//Este quita todos los mensajes
function quitarMensajes() {
	$('span[id^=msg-vacio]').each(function() {
		$(this).remove();
	});
}

function limpiar() {
	$('.analito').each(function(){
		$(this).attr('checked', false);
	});
	$('#departamentos').prop('selectedIndex', 0);
	$('#ciudades').prop('selectedIndex', 0);
	$('#direccion').val('');
	$('#numero-referencia').val('');
}
