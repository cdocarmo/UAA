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
var boton_ver_anterior = null;
var col_analitos = new Array();

//banderas
var select_departamentos = false;
var select_ciudades = false;
var select_direcciones = false;

//TODO: debo capturar el enter para que no me guarde sin advertencia previa.

$(document).ready(function(){
	limpiar(true);
	reBind();
});

//EVENTOS

function reBind() {
	//PESTAÑA "NUEVO PEDIDO"
	$('#numero-referencia').keypress(function(e){
		if (e.which == 13 ) {
			e.preventDefault();  // Evito que cuando hago enter se ejecute el evento que usa el boton Buscar Punto de Referencia
			// Aqui deberia ir lo que se hace si el numero del punto de referencia esta bien colocado
		}
		// aqui llamar a un autocompletar
	});
	
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
	
	//PESTAÑA "MUESTREOS PENDIENTES"
	
	$('.editar-muestreo').on('click', function(){
		$('#modal-editar-muestreo').modal('show');
		//Aca se deben obtener los datos via AJAX y colocarlas en variables para pasarlas al siguiente str
		//hardcodeado: este array debe ser llenado con lo obtenido via ajax
		var id_muestreo = $(this).parent().parent().parent().parent().attr('id'); //obtengo el id para buscar el muestreo
		$('#modal-editar-muestreo').find('#guardar-edicion-muestreo').attr('data-id', id_muestreo);
		
	});
	
	//PESTAÑA "MUESTREOS ANTERIORES"
	
	$('.ver').on('click', function(){
			if (ocultarMostrarMuestreos(this)) {
				return;
			}
			
			if (ultimo_muestreo != null) {
				$(ultimo_muestreo).remove();
			}
			
			if ($(this).hasClass('editar')) {
				var id_pedido = $(this).parent().parent().find('.numero-muestreo').html();	
			}else{
				var id_pedido = $(this).parent().parent().find('.numero-pedido').html();
			}
			
			var fila = null;
			var fila_anterior = $(this).parent().parent();
			//Aca se deben obtener los datos via AJAX y colocarlas en variables para pasarlas al siguiente str
			//se debe crear un for para iterar sobre cada muestreo del pedido obtenido y pasar los datos al html de abajo
			var html_cod = "";
			var max = 3;
			for (var i=0;i<max;i++) {
				html_cod = html_cod + '<td colspan="3" class="datos-muestreo">' +
				'\t<ul class="lista-datos-muestreo">' +
				'\t\t<li><span class="item-muestreo-geo">Número de muestreo:</span> <b class="pull-right nro-muestreo">00000</b></li>' +
				'\t\t<li><span class="item-muestreo-geo">Código de Referencia:</span> <b class="pull-right cod-referencia">XXXXX</b></li>' +
				'\t\t<li><span class="item-muestreo-geo">Ciudad:</span> <b class="pull-right ciudad">Salto</b></li>' +
				'\t\t<li><span class="item-muestreo-geo">Departamento: </span> <b class="pull-right departamento">Salto</b></li>' +
				'\t\t<li><span class="item-muestreo-geo">Dirección: </span> <b class="pull-right direccion">Oficial 1º 2016</b></li>' +
				'\t</ul>' +
				'</td>' +
				'<td colspan="3" class="datos-muestreo">' +
				'\t<ul class="lista-datos-analitos">' +
				'\t\t<li><i class="icon-tint"> </i>&nbsp;&nbsp;&nbsp;Cromo</li>' +
				'\t\t<li><i class="icon-tint"> </i>&nbsp;&nbsp;&nbsp;Plomo</li>' +
				'\t\t<li><i class="icon-tint"> </i>&nbsp;&nbsp;&nbsp;Color</li>';
				if ($(this).hasClass('editar')) {
					html_cod = html_cod + '\t\t<li><button class="btn btn-success editar-muestreo" id="id' + i + '">Editar Muestreo</button></li>';	
				} // la variable "i" debe ser sustituida por la variable que contiene el id del muestreo
				
				'\t</ul>' +
				'</td>' +
				'<td> </td>';
				fila = crearFilaConInfoDeMuestreos(id_pedido, i); //segundo parametro es temporal, debe sustituirse por el id de muestreo correcto
				$(fila).html(html_cod);
				$(fila_anterior).after(fila);
				$(fila).show('slow');
				if (i == (max - 1)) {
					
				}
				fila_anterior = fila;
				html_cod = "";
			}
			//ESTO COMENTADO A CONTINUACION DEBE SER ELIMINADO
			//fila = crearFilaConInfoDeMuestreos(id_pedido);
			//html_cod = '\t\t<td colspan="3"></td>' +
			//'\t\t<td colspan="3"><button class="btn btn-success imprimir-datos-muestreo">Imprimir Datos</button></td>';
			//ocultarMostrarMuestreos(this);
			//$(fila).html(html_cod);
			//$(fila_anterior).after(fila);
			//$(fila).show('slow');
			//html_cod = "";
			//ultimo_muestreo = fila;
			
			reBind();
	});
	
	//CAMBIAR ICONO DE ANALITO AL PASAR PUNTERO POR ENCIMA
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
	
	//agregar analito
	$('#listado-analitos option').on('click', function() {
		var identidad = $(this).attr('value');
		if (col_analitos.indexOf(identidad) != -1) {
			alert('Disculpa, ya has añadido este analito.'); //cambiar por un modal
		}else{
			btnHabilitarCambios($(this).parent().parent().parent().find('.aplicar-cambios'));
			var nombre = $(this).text();
			var item = '<li class="item-analitos" value="' + identidad + '"><i class="icon-tint"> </i>&nbsp;&nbsp;&nbsp;' + nombre + '</li>';
			//alert(item);
			$('.item-muestreo').append(item);
			col_analitos.push(identidad);
		}
	});
	
	//remover analito
	$('.item-analitos').on('click', function(){
		if ($(this).parent().children().length >= 2) {
			btnHabilitarCambios($(this).parent().parent().parent().find('.aplicar-cambios'));
			$(this).remove();
		}else{
			alert('Disculpa, no puedes dejar vacía esta lista de analitos.'); //cambiar por un modal
		}
		
	});
	
	//habilitar boton 'aplicar cambios'
	$('.datos-muestreo li').focusin(function() {
		btnHabilitarCambios($(this).parent().parent().parent().find('.aplicar-cambios'));
	});
	
	//finalizar edicion muestreo
	$('#guardar-edicion-muestreo').on('click', function(){
		if (validarCamposEdicionDelMuestreo($(this).attr('data-id'))) {
			//llamada ajax
			alert('Edición finalizada.');
			$('#modal-editar-muestreo').modal('hide');
			
		}//else{
			//alert('problemas');
		//}
	});
	
	//NUEVO PUNTO DE REFERENCIA
	
	$('#nuevo-punto-referencia').on('click', function(e) {
		//alert('anda');
		e.preventDefault();
		$('#modal-nuevo-punto-referencia').modal('show');
	});
	
	var ocultar_boton_referencia = false;
	
	$('#buscar-punto-referencia').on('click', function(e) {
		e.preventDefault();
		if (!ocultar_boton_referencia) {
			$('.buscar-referencia').show();
			$('#buscar-punto-referencia').html('Ocultar Búsqueda');
			ocultar_boton_referencia = true;
		} else {
			$('.buscar-referencia').hide();
			$('#buscar-punto-referencia').html('Buscar Punto de Referencia');
			ocultar_boton_referencia = false;
		}
	});
	
	var ocultar_caja_nueva_ciudad = false;
	
	$('#btn-nueva-ciudad').on('click', function(e) {
		e.preventDefault();
		if (!ocultar_caja_nueva_ciudad) {
			$('.nueva-ciudad-localidad').show();
			$('#ciudades-nuevo').attr('disabled', true);
			ocultar_caja_nueva_ciudad = true;
		}
	});
	
	//CERRAR MODAL
	$('#modal-nuevo-punto-referencia .close, #cerrar-nueva-referencia').on('click', function() {
		$('.nueva-ciudad-localidad').hide();
		$('#ciudades-nuevo').attr('disabled', false);
		ocultar_caja_nueva_ciudad = false;
	});
	
	//SELECTEDS
	$('#departamentos option').on('click', function(e){
		e.preventDefault();
		$('#ciudades').removeAttr('disabled');
		//llamada ajax para cargar ciudades del departamento seleccionado
	});
	
	$('#ciudades').on('click', function(e){
		e.preventDefault();
		$('#direcciones').removeAttr('disabled');
		//llamada ajax para cargar direcciones de la ciudad seleccionada
	});
	
	$('#direcciones').on('click', function(e){
		e.preventDefault();
		//hacer nada
	});
	//para el modal nuevo punto geográfico
	$('#departamentos-nuevo option').on('click', function(e){
		e.preventDefault();
		if ($(this).val() != 'seleccionar') {
			$('#ciudades-nuevo').removeAttr('disabled');
			//llamada ajax para cargar ciudades del departamento seleccionado
		}
	});
	
	//VALIDAR PUNTO DE REFERENCIA
	//REVISAR SI EL CODIGO DE REFERENCIA INGRESADO EXISTE O NO
	
	$('#numero-referencia').focusout(function() {
		//buscarInsertarNroReferencia($(this).val());
	});
	
	//VALIDAR NUEVO PUNTO DE REFERENCIA
	
	$('#btn-nuevo-punto-referencia').on('click', function() {
		var validar = true;
		if ($('#departamentos-nuevo').val() == 'seleccionar') {
			$('#departamentos-nuevo').css('border-color', 'red');
			validar = false;
		} else {
			$('#departamentos-nuevo').css('border-color', '#CCC');
		}
		if ($('#ciudades-nuevo').val() == 'seleccionar') {
			$('#ciudades-nuevo').css('border-color', 'red');
			validar = false;
		} else {
			$('#ciudades-nuevo').css('border-color', '#CCC');
		}
		var msn = $('#direccion-nuevo').html(); //aca hay un bug raro de jquery que no se como arreglar
		//var largo = msn.length;
		
		//if (largo < 1) {
		//	$('#direccion-nuevo').css('border-color', 'red');
		//	validar = false;
		//} else {
		//	$('#direccion-nuevo').css('border-color', '#CCC');
		//}
		if (validar) {
			//llamada ajax para guardar nueva localidad
			$('.nueva-ciudad-localidad').hide();
			$('#ciudades-nuevo').attr('disabled', false);
			ocultar_caja_nueva_ciudad = false;
		}else{
			alert('Corrije los campos marcados en rojo.');
		}
	});
	
	//HABILITAR PUNTO DE REFERENCIA
	$('.punto-referencia-habilitado').on('click', function(){
		//llamada ajax para habilitar el punto de referencia.
	});
}

function ocultarMostrarMuestreos(obj) {
	if ($(obj).hasClass('ocultar')) {
		$('tr[class*=pedido]').remove();
		$(obj).removeClass('ocultar').addClass('ver');
		$(obj).html('Ver');
		boton_ver_anterior = obj;
		return true;
	}else{
		$('tr[class*=pedido]').remove();
		$(obj).removeClass('ver').addClass('ocultar');
		if (boton_ver_anterior != null) {
			// para que el boton anterior cambie a funcion "ver".
			$(boton_ver_anterior).removeClass('ocultar').addClass('ver');
			$(boton_ver_anterior).html('Ver');
		}
		$(obj).html('Ocultar');
		boton_ver_anterior = obj;
		return false;
	}
}

function validarCamposEdicionDelMuestreo(id) {
	var msg_alert = "";
	var editar_muestreo = true;
	//recoger todos los datos en un objeto
	var obj = new Object();
	obj['id'] = id;
	obj['departamento'] = $('#departamentos-edicion').val();
	obj['ciudad'] = $('#ciudades-edicion').val();
	obj['direccion'] = $('#direccion-edicion').val();
	obj['referencia'] = $('#numero-referencia-edicion').val();
	var analitos = new Array();
	$('.analito').each(function(){
		if ($(this).is(':checked')) {
			analitos.push($(this).attr('value'));
			analitos_marcados++;	
		}
	});
		
	if ($('#direccion-edicion').val().length < 1) {
		if ($('#locacion-edicion').find('#msg-vacio-direccion').length == 0) {
			quitarMsg($('#direccion-edicion'));
			$(crearMsgValidacion('Campo obligatorio', 'direccion-edicion')).appendTo($('#direccion-edicion').prev());	
		}
		editar_muestreo = false;
	}else{
		quitarMsg($('#direccion-edicion'));
	}
		
	if (analitos_marcados > 0) {
		quitarMsg($('#analitos-edicion'));
		obj['col-analitos'] = analitos;
	}else {
		if ($('#analitos-edicion').find('#msg-vacio-analitos').length == 0) {
			$(crearMsgValidacion('Debes seleccionar al menos un analito', 'analitos-edicion')).appendTo($('#analitos-edicion legend').append());	
		}
		editar_muestreo = false;
	}
	if (editar_muestreo) {
		actualizarFilaMuestreo(obj);
		limpiarEdicionMuestreo();
		return true;
	}else{
		return false;
			//agregar_muestreo = true;
	}
	//analitos_marcados = 0;
}

function actualizarFilaMuestreo(obj) {
	$('#' + obj['id']).find('.cod-referencia').html(obj['referencia']);
	$('#' + obj['id']).find('.ciudad').html(obj['ciudad']);
	$('#' + obj['id']).find('.departamento').html(obj['departamento']);
	$('#' + obj['id']).find('.direccion').html(obj['direccion']);
	
	$('#' + obj['id']).find('.lista-datos-analitos').empty();
	for (var i=0; i<obj['col-analitos'].length; i++) {
		$('#' + obj['id']).find('.lista-datos-analitos').append('<li><i class="icon-tint"> </i>&nbsp;&nbsp;&nbsp;' + obj['col-analitos'][i] + '</li>');
	}
	
}

function btnHabilitarCambios(boton) {
	if ($(boton).hasClass('enabled')) {
		return;
	}else{
		$(boton).removeClass('disabled');
		$(boton).addClass('enabled');
	}
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

function crearFilaConInfoDeMuestreos(numero_pedido, id_muestreo) {
	var nodo_fila = $('<tr class="pedido' + numero_pedido + ' fila-muestreo" id="muestreo' + id_muestreo + '"> </tr>').hide();
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
	//si el parametro total es true entonces limpia las lineas de los muestreos agregados arriba del formulario
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

function limpiarEdicionMuestreo() {
	$('.analito').each(function(){
		$(this).attr('checked', false);
	});
	$('#departamentos-edicion').prop('selectedIndex', 0);
	$('#ciudades-edicion').prop('selectedIndex', 0);
	$('#direccion-edicion').val('');
	$('#numero-referencia-edicion').val('');
}

function buscarSiExisteNroReferencia(nro_referencia) {
	//recibe el codigo ingresado y si existe retorna un html con los datos
	//si no retorna un <p>No exite este número de referencia</p>
	var respuesta = "";
	return respuesta;
}

