//GLOBALES
var tab_actual = 'tab-analitos';
var msg_no_hay_seleccion = "No ha seleccionado ";
var msg_a_punto_de_eliminar = "Está a punto de eliminar un ";
var msg_input_vacio = "Campo obligatorio";
var msg_solo_numeros = "Error: solo admite numeros";
var focus_flag = false;
var ANALITO = "analito";
var USUARIO = "usuario";
var CLIENTE = "cliente";
var LOCALIDAD = "localidad";

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
			$('#categorias> option[value=' + '"' +$(this).find('.categoria').html() + '"' + ']').attr('selected', 'selected');
			$('#vminp').val($(this).find('.vminp').html());
			$('#vmaxp').val($(this).find('.vmaxp').html());
		} else if ($(this).hasClass('fila-localidades')) {
			$('#nombre-localidad').val($(this).find('.ciudad').html());
			$('#departamentos> option[value=' + '"' +$(this).find('.departamento').html() + '"' + ']').attr('selected', 'selected');
			$('#coordenadas-geograficas').val($(this).find('.coordenadas').html());
			$('#distancia').val($(this).find('.distancia').html());
		}
	});
	
	//Limpiar cuando se cambia de tab
	$('a[class*=tab]').click(function(){
		tab_actual = $(this).attr('class');
		limpiarCampos();
	});
	
	//Muestra ventana modal
	$('a[id^=eliminar]').click(function(){
		if ($('#' + tab_actual).find('.seleccionada')) {
			//si hay fila seleccionada.
			if (tab_actual == 'tab-analitos') {
				$('#mensaje-modal').html(msg_a_punto_de_eliminar + ANALITO + ".");
			}else if (tab_actual == 'tab-usuarios') {
				$('#mensaje-modal').html(msg_a_punto_de_eliminar + USUARIO + ".");
			}else if (tab_actual == 'tab-localidades') {
				$('#mensaje-modal').html(msg_a_punto_de_eliminar + LOCALIDAD + ".");
			}else if (tab_actual == 'tab-clientes') {
				$('#mensaje-modal').html(msg_a_punto_de_eliminar + CLIENTE + ".");
			}
			//$('#modal-eliminar').css('visibility', 'hidden');
		}else{
			//si no hay fila seleccionada
			if (tab_actual == 'tab-analitos') {
				$('#mensaje-modal').html(msg_no_hay_seleccion + ANALITO + ".");
			}else if (tab_actual == 'tab-usuarios') {
				$('#mensaje-modal').html(msg_no_hay_seleccion + USUARIO + ".");
			}else if (tab_actual == 'tab-localidades') {
				$('#mensaje-modal').html(msg_no_hay_seleccion + LOCALIDAD + ".");
			}else if (tab_actual == 'tab-clientes') {
				$('#mensaje-modal').html(msg_no_hay_seleccion + CLIENTE + ".");
			}
			$('#eliminar-btn-eliminar').css('visibility', 'visible');
		}
		$('#modal-eliminar').modal({
			show: true,
			backdrop: 'static'
		});
	});
	
	//Borro fila
	$('.habilitar').click(function(){
		$('#modal-habilitado').modal('show');
		setTimeout("$('#modal-habilitado').modal('hide')", 1500);
		
		$(this).parent().parent().remove();
	});
	
	//Validaciones
	$(window).focusin(function(e){
		if (!($(e.target).hasClass('focusable'))){
			if (focus_flag == true) {
				focus_flag = false;
			}else{
				focus_flag = true;
			}
		}
	});
	$('input').focusout(function() {
		if (focus_flag == false) {
			if (($(this).val().length < 1) || ($(this).val() == "__.___")) {
				$(crearMsgValidacion(msg_input_vacio, $(this).attr("id"))).appendTo($(this).prev());
			}else{
				$('#msg-vacio-' + $(this).attr("id")).remove();
			}
			//focus_flag = false;
		}
	});
}

function limpiarCampos() {
	//remuevo la clase para que no exista fila seleccionada
	$('.seleccionada').removeClass('seleccionada');
	//recorro los inputs para limpiarlos
	$('input').each(function(){
		if (!($(this).is('input[type="submit"]') || $(this).is('input[type="reset"]') || $(this).is('input[type="button"]'))){
			$(this).val("");	
		}
	});
}

function crearMsgValidacion(msg, id) {
	var nodo_msg = $('<span id="msg-vacio-' + id + '" style="color:red; margin-left:5%">' + msg + '</span>');
	return nodo_msg;
}
