//GLOBALES
var tab_actual = 'tab-analitos';
var msg_no_hay_seleccion = "No ha seleccionado ";
var msg_a_punto_de_eliminar = "Está a punto de eliminar un ";
var msg_input_vacio = "Campo obligatorio";
var msg_solo_numeros = "Error: solo admite numeros";
var focus_flag = true;
var ANALITO = "analito";
var USUARIO = "usuario";
var CLIENTE = "cliente";
var LOCALIDAD = "localidad";
var OPTIONCATEGORIAS = null;
var OPTIONDEPARTAMENTOS = null;

$(document).ready(function(){
	reBind();
});

//EVENTOS

function reBind() {
	limpiarCampos();
	
	//Aplico mascaras
	$('#vminp, #vmaxp').mask('99.999');
	
	$('tr[class*=fila]').hover(function(){
		$(this).css("cursor", "pointer");
	});

	//Seleccionar fila
	$('tr[class*=fila]').click(function(){
		//quitar la marca de seleccion
		$('.seleccionada').css({
			fontWeight: "normal",
			color: "#515151",
			textShadow: "None"
		}).removeClass("seleccionada");
		//agregar marca de seleccion
		$(this).addClass("seleccionada");
		$(this).css({
			fontWeight: "bold",
			color: "#555",
			textShadow: "1px 1px 3px #BBF"
		});
		//Pasar datos a formulario
		$('#guardar-cliente').val("Actualizar");
		if ($(this).hasClass('fila-clientes')) {
			$('#nombres-cliente').val($(this).find('.nombres').html());
			$('#apellidos-cliente').val($(this).find('.apellidos').html());
			$('#domicilio-cliente').val($(this).find('.domicilio').html());
			$('#telefono-cliente').val($(this).find('.telefono').html());
			$('#celular-cliente').val($(this).find('.celular').html());
			if ($(this).find('.habilitado').html() == 'Sí') {
				$('#habilitado-cliente').attr('checked', true);
			}
		} else if ($(this).hasClass('fila-usuarios')) {
			$('#nombres-usuario').val($(this).find('.nombres').html());
			$('#apellidos-usuario').val($(this).find('.apellidos').html());
			$('#domicilio-usuario').val($(this).find('.domicilio').html());
			$('#telefono-usuario').val($(this).find('.telefono').html());
			$('#celular-usuario').val($(this).find('.celular').html());
			//$('.checkbox input> option[value=' + '"' +$(this).find('.departamento').html() + '"' + ']').attr('selected', 'selected');
			
		} else if ($(this).hasClass('fila-analitos')) {
			$('#nombre').val($(this).find('.nombre').html());
			cboxCategorias($('#categorias > option[value=' + '"' + $(this).find('.categoria').html() + '"' + ']'));
			$('#categorias > option[value=' + '"' +$(this).find('.categoria').html() + '"' + ']').prop('selected', true);
			$('#vminp').val($(this).find('.vminp').html());
			$('#vmaxp').val($(this).find('.vmaxp').html());
			$('#metodo-unit').val($(this).find('.metodo-unit').html());
			$('#metodo').val($(this).find('.metodo').html());
			$('#observaciones').val($(this).find('.observaciones').html());
		} else if ($(this).hasClass('fila-localidades')) {
			$('#nombre-localidad').val($(this).find('.ciudad').html());
			cboxDepartamentos($('#departamentos > option[value=' + '"' +$(this).find('.departamento').html() + '"' + ']'));
			//var selector = '#departamentos > option[value=' + '"' +$(this).find('.departamento').html() + '"' + ']';
			//alert(selector);
			$('#departamentos > option[value=' + '"' +$(this).find('.departamento').html() + '"' + ']').prop('selected', true);
			$('#coordenadas-geograficas').val($(this).find('.coordenadas').html());
			$('#distancia').val($(this).find('.distancia').html());
		}
	});
	
	//Limpiar cuando se cambia de tab
	$('a[class*=tab]').click(function(){
		tab_actual = $(this).attr('class');
		limpiarCampos();
		quitarMensajes();
	});
	
	//Muestra ventana modal, boton eliminar
	$('a[id^=eliminar]').click(function(){
		if ($('#' + tab_actual).find('.seleccionada')) {
			//si hay fila seleccionada.
			if (tab_actual == 'tab-analitos') {
				$('#mensaje-modal-eliminar').html(msg_a_punto_de_eliminar + ANALITO + ".");
			}else if (tab_actual == 'tab-usuarios') {
				$('#mensaje-modal-eliminar').html(msg_a_punto_de_eliminar + USUARIO + ".");
			}else if (tab_actual == 'tab-localidades') {
				$('#mensaje-modal-eliminar').html(msg_a_punto_de_eliminar + LOCALIDAD + ".");
			}else if (tab_actual == 'tab-clientes') {
				$('#mensaje-modal-eliminar').html(msg_a_punto_de_eliminar + CLIENTE + ".");
			}
			//$('#modal-eliminar').css('visibility', 'hidden');
		}else{
			//si no hay fila seleccionada
			if (tab_actual == 'tab-analitos') {
				$('#mensaje-modal-eliminar').html(msg_no_hay_seleccion + ANALITO + ".");
			}else if (tab_actual == 'tab-usuarios') {
				$('#mensaje-modal-eliminar').html(msg_no_hay_seleccion + USUARIO + ".");
			}else if (tab_actual == 'tab-localidades') {
				$('#mensaje-modal-eliminar').html(msg_no_hay_seleccion + LOCALIDAD + ".");
			}else if (tab_actual == 'tab-clientes') {
				$('#mensaje-modal-eliminar').html(msg_no_hay_seleccion + CLIENTE + ".");
			}
			$('#eliminar-btn-eliminar').css('visibility', 'visible');
		}
		mostrarModal('eliminar');
	});
	
	//Boton guardar
	$('a[id^=guardar]').click(function(){
		var guardar = true;
		var selector = '#' + tab_actual;
		$( selector + ' input, ' + selector + ' select').each(function() {
			var completos = revisarInputs(this);
			if (completos == false) {
				guardar = completos;
			}
		});
		if (!guardar) {
			focus_flag = false;
			$('#mensaje-modal-incompleto').html("Llena los campos vacíos");	
			mostrarModal('incompleto');
		}else{
			//guarda segun el tab actual (usando ajax?)
			if (tab_actual == 'tab-analitos') {
				$('#mensaje-modal-guardado').html("Llamar guardar de analitos");
			}else if (tab_actual == 'tab-usuarios') {
				$('#mensaje-modal-guardado').html("Llamar guardar de analitos");
			}else if (tab_actual == 'tab-localidades') {
				$('#mensaje-modal-guardado').html("Llamar guardar de analitos");
			}else if (tab_actual == 'tab-clientes') {
				$('#mensaje-modal-guardado').html("Llamar guardar de analitos");
			}
			mostrarModal('guardado');
		}
		
	});
	
	//habilito cliente
	$('.habilitar').click(function(){
		$('#modal-habilitado').modal('show');
		//setTimeout("$('#modal-habilitado').modal('hide')", 1500);
		var ident = $(this).parent().parent().find('.id').text();
		habilitarCliente(ident);
		var nodo = $(this).parent().parent();
		$('#listado-todos-clientes').append($(nodo).clone());
		$(this).parent().parent().remove();
	});
	
	//Validaciones
	$(window).focusin(function(e){
		if (e.target.nodeName != 'INPUT'){
			if (focus_flag == true) {
				focus_flag = false;
			}else{
				focus_flag = true;
			}
		}else {
			focus_flag = false;
		}
	});
	
	$('input, select').focusout(function() {
		revisarInputs(this);
	});
	
	//SUBCATEGORIA
	$('#categorias option').on('click', function(){
		if ($(this).hasClass('tiene-subcategoria')) {
			var selector = 'select.' + $(this).attr('id');
			$('#label-subcategorias').show();
			$(selector).show();
		}
	});
	
	//CERRAR
	$('#modal-guardado .cerrar, #modal-guardado .close').on('click', function() {
		limpiarCampos();
	});
	
	//BOTON LIMPIAR
	$('button[id^=limpiar]').on('click', function() {
		limpiarCampos();
	});
}

function quitarMsg(obj) {
	$('#msg-vacio-' + $(obj).attr("id")).remove();
}

function quitarMensajes() {
	$('span[id^=msg-vacio]').each(function() {
		$(this).remove();
	});
}

function limpiarCampos() {
	//limpio y remuevo la clase para que no exista fila seleccionada
	$('.seleccionada').css({
			fontWeight: "normal",
			color: "#515151",
			textShadow: "None"
		}).removeClass("seleccionada");
	//recorro los inputs para limpiarlos
	$('input').each(function(){
		if (!($(this).is('input[type="submit"]') || !$(this).is('input[type="reset"]') || !$(this).is('input[type="button"]'))){
			$(this).val("");	
		}
	});
}

function crearMsgValidacion(msg, id) {
	var nodo_msg = $('<span id="msg-vacio-' + id + '" style="color:red; margin-left:5%">' + msg + '</span>');
	return nodo_msg;
}

function revisarInputs(obj) {
	var completos = false;
	if (focus_flag == false) {
		if (($(obj).val().length < 1) || ($(obj).val() == "__.___") || ($(obj).val() == 'seleccionar')) {
			//quitarMsg(this) deberia estar en un condicional quizas...
			quitarMsg(obj);
			var objeto_label;
			if (obj.nodeName == 'SELECT') {
				objeto_label = $(obj).prev();
			} else {
				objeto_label = $(obj).prev();
			}
			$(crearMsgValidacion(msg_input_vacio, $(obj).attr("id"))).appendTo(objeto_label);
		}else{
			completos = true;
			quitarMsg(obj);
		}
	}else{
		completos = true;
	}
	return completos;
}

function cboxCategorias(option) {
	if (OPTIONCATEGORIAS != null) {
		$(OPTIONCATEGORIAS).prop('selected', false);
	}
	OPTIONCATEGORIAS = option
}

function cboxDepartamentos(option) {
	if (OPTIONDEPARTAMENTOS != null) {
		$(OPTIONDEPARTAMENTOS).prop('selected', false);
	}
	OPTIONCATEGORIAS = option
}

//para mandar via ajax
function habilitarCliente(identidad) {
	$('#modal-habilitado').modal('hide');
	return null;
}

function mostrarModal(tipo) {
	var selector = '';
	if (tipo == 'eliminar') {
		selector = '#modal-eliminar';
	} else if (tipo == 'guardado') {
		selector = '#modal-guardado';
	}
	else if (tipo == 'incompleto') {
		selector = '#modal-incompleto';
	}
	$(selector).modal({
			show: true,
			backdrop: 'static'
	});
}
