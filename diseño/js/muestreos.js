//GLOBALES
var tab_actual = 'tab-pedido';  //tab-muestreos-anteriores
var PEDIDO = "pedido";
var MUESTREOS_ANTERIORES = "muestreos-anteriores";
var MODO = "nuevo";  //puede ser nuevo o modificar
var col_muestreos = new Array();
var prox_numero_muestreo = 0;
var agregar_muestreo = true;
var analitos_marcados = 0;
var ultimo_muestreo = null;
var item_muestreo_anterior = null;

//TODO: debo capturar el enter para que no me guarde sin advertencia previa.

$(document).ready(function(){
	limpiar(true);
	reBind();
});

//EVENTOS

function reBind() {
	//PESTAÑA "NUEVO PEDIDO"
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
			col_muestreos.push(obj);
			prox_numero_muestreo++;
			$('.ningun-muestreo').css('display', 'none');
			modificarTitulo();
			limpiar(false);
		}else{
			agregar_muestreo = true;
		}
		analitos_marcados = 0;
	});
	
	$('#lista-muestreos').on('click', function(e) {
		if (e.target.nodeName == 'I'){
			for (item in col_muestreos) {
				if (col_muestreos[item].nro_muestreo == $(e.target).parent().parent().attr('id').substring(4)) {
					//alert('entra a eliminar');
					var temp = col_muestreos.splice(item);
				}
			}
			$(e.target).parent().parent().remove();
			//alert(col_muestreos.length);
			if (col_muestreos.length == 0) {
				$('.ningun-muestreo').css('display', 'block');
			}
			limpiar(false);
			modificarTitulo();
		}else if (e.target.nodeName == 'A'){
			MODO = "modificar";
			//alert(MODO);
			limpiar(false);
			//TODO: llamar un metodo que deje todos los fondos blancos
			blanquearFondos();
			$(e.target).parent().css('background-color', '#dee');
			for (item in col_muestreos) {
				var temp = $(e.target).parent().attr('id').substring(4);
				if (item == temp) {
					rellenarFormulario(col_muestreos[item]);
					$('#btn-agregar-muestreo').html("Modificar este muestreo");
					return;
				}
			}
		}
	});
	// LIMPIAR FORMULARIO
	$('#limpiar').on('click', function(){
		MODO == "nuevo";
		$('#btn-agregar-muestreo').html("Agregar este muestreo al pedido");
		limpiar(false);
		//alert(MODO);
	});
	// LIMPIAR TODITO
	$('#limpiar-todo').on('click', function(){
		MODO == "nuevo";
		$('#btn-agregar-muestreo').html("Agregar este muestreo al pedido");
		limpiar(true);
		//alert(MODO);
	});
	
	//PESTAÑA "MUESTREOS ANTERIORES"
	
	$('.ver').on('click', function(){
		if (ultimo_muestreo != null) {
			$(ultimo_muestreo).remove();
		}
		var id_muestreo = $(this).parent().parent().find('.numero-muestreo').html();
		var fila = crearFilaConInfoDeMuestreos(id_muestreo);
		var fila_anterior = $(this).parent().parent();
		//Aca se deben obtener los datos via AJAX y colocarlas en variables para pasarlas al siguiente str
		var html_cod = $('<td colspan="4" class="datos-muestreo">' +
		'\t<ul>' +
		'\t\t<li><span class="item-muestreo-geo">Departamento: </span> <input value="Salto"></li>' +
		'\t\t<li><span class="item-muestreo-geo">Ciudad:</span> <input value="Salto"></li>' +
		'\t\t<li><span class="item-muestreo-geo">Dirección: </span> <input value="Oficial 1º 2016"></li>' +
		'\t\t<li><span class="item-muestreo-geo">Dirección: </span> <input value="Oficial 1º 2016"></li>' +
		'\t</ul>' +
		'</td>' +
		'<td colspan="2" class="datos-muestreo">' +
		'\t<ul class="item-muestreo">' +
		'\t\t<li>Agregar otro analito</li>' +
		'\t\t<li><select><option>Analito 1</option><option>Analito 2</option><option>Analito 3</option></select></li>' +
		'\t\t<li><i class="icon-tint"> </i>&nbsp;&nbsp;&nbsp;Cromo</li>' +
		'\t\t<li><i class="icon-tint"> </i>&nbsp;&nbsp;&nbsp;Plomo</li>' +
		'\t\t<li><i class="icon-tint"> </i>&nbsp;&nbsp;&nbsp;Color</li>' +
		'\t</ul>' +
		'</td>' +
		'<td> </td>');
		$(fila).append(html_cod);
		$(fila_anterior).after(fila);
		$(fila).show('slow');
		ultimo_muestreo = fila;
		reBind();
	});
	
	$('.item-muestreo li').on('mouseover', function(){
		item_muestreo_anterior = $(this);
		$(this).find('i').removeClass('icon-tint');
		$(this).find('i').addClass('icon-remove');
	});
	
	$('.item-muestreo li').on('mouseout', function(){
		if (item_muestreo_anterior != null) {
			$(this).find('i').removeClass('icon-remove');
			$(this).find('i').addClass('icon-tint');
		}
		
		
	});
}

function blanquearFondos() {
	$('li[id^=nro-]').each(function(){
		$(this).css('background-color', 'white');
	});
}

function rellenarFormulario(obj) {
	var analitos = obj['col-analitos'];
	var selector;
	var nombre;
	for (item in analitos) {
		nombre = analitos[item];
		selector = '#' + nombre;
		$(selector).get(0).checked = true;
	}
	var departamento = obj['departamento'];
	var ciudad  = obj['ciudad'];
	$('#departamentos option[value="' + departamento + '"]').get(0).selected = true;
	$('#ciudades option[value="' + ciudad + '"]').get(0).selected = true;
	$('#direccion').val(obj['direccion']);
	$('#numero-referencia').val('');
}

function crearLineaNuevoMuestreo(obj) {
	//alert(obj.nro_muestreo);
	var nuevo_nodo = $('<li id="nro-' + obj.nro_muestreo + '"><a href="#"><i class="icon-edit"></i>&nbsp&nbsp&nbspMuestreo numero <span class="nro-de-muestreo">' + col_muestreos.length 
	+ '</span> - C&oacute;digo de referencia <span class="codigo-referencia">' + obj.referencia + '</span><i class="icon-remove pull-right"></i></a></li>');
	$('#lista-muestreos').prepend(nuevo_nodo);
}

function crearFilaConInfoDeMuestreos(numero_muestreo) {
	var nodo_fila = $('<tr id="id' + numero_muestreo + '" class="fila-muestreo"> </tr>').hide();
	return nodo_fila;
}

function modificarTitulo() {
	$('#numero-de-muestreos').html(String(col_muestreos.length));
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

function limpiar(total) {
	$('.analito').each(function(){
		$(this).attr('checked', false);
	});
	$('#departamentos').prop('selectedIndex', 0);
	$('#ciudades').prop('selectedIndex', 0);
	$('#direccion').val('');
	$('#numero-referencia').val('');
	if (total) {
		$('li[id^=nro-]').each(function(){
			$(this).remove();
			$('.ningun-muestreo').css('display', 'block');
		});
	}
}
