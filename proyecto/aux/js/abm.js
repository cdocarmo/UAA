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



$(document).on("ready", inicio);
function inicio ()
{


	$.ajaxSetup({
		beforeSend: function(xhr, settings) {
			if(settings.type == "POST"){
				//console.log($('[name="csrfmiddlewaretoken"]').val());
				xhr.setRequestHeader("X-CSRFToken", $('[name="csrfmiddlewaretoken"]').val());
			}
		}
	});

	reBind();
	cargo_analitos();
	cargo_localidades();
	ingreso_analitos();
	cargo_clientes_pendientes();
	cargo_clientes();
	//$("#aceptar").on("click", confirmar_datos);
	$("#clai").on("click", cargo_listas);
	$("#tab-interno-clientes").on("click", cargo_clientes_pendientes);
	$("#id_categorias").on("change", categoria_click);

	//$('tr[class*=fila]').on("click", cargo_datos);
	//$('#fila-analitos').on("hover", cambio_cursor);
	//$('#preguntas button').on('click', enviar_pregunta);
}

function confirmar_datos(datos) 
{	
	console.log("Alert Callback");
    bootbox.alert("Hello world!", function() {
        console.log("Alert Callback");
    });
}

function cargo_analitos(datos) 
{
	$('#ListaAnalitos').load('/analitos/cargo-analitos/', function(){
		reBind();
	});
}

function cargo_clientes_pendientes(datos) 
{
	$('#habilitar-clientes').load('/cliente/clientes-pendientes/', function(){
		reBind();
	});

}

function cargo_clientes(datos) 
{
	$('#list-clientes').load('/cliente/clientes/', function(){
		reBind();
	});

}

function cargo_localidades(datos) 
{
	$('#ListaLocalidades').load('/localidades/cargo-localidades/');
}


function ingreso_analitos(datos) 
{
	$('#IngresoAnalitos').load('/analitos/home/');
}


function cargo_listas(datos) 
{
	cargo_analitos();
	cargo_localidades();
	cargo_clientes_pendientes();
	cargo_clientes();
}

function cargar_clientes (argument) {
	cargo_clientes_pendientes();
	cargo_clientes();	
	// body...
}
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
			$('#id-analito').val($(this).find('.numero-referencia').html());
			$('#vmaxp').val($(this).find('.vmaxp').html());
			$('#metodo_unit').val($(this).find('.metodo-unit').html());
			$('#metodo').val($(this).find('.metodo').html());
			$('#detalle').val($(this).find('.observaciones').html());
		} else if ($(this).hasClass('fila-localidades')) {
			$('#id-localidad').val($(this).find('.numero-referencia').html());
			$('#nombre-localidad').val($(this).find('.ciudad').html());
			$('#departamento> option[value=' + '"' +$(this).find('.departamento').html() + '"' + ']').attr('selected', 'selected');
			$('#coordenadas').val($(this).find('.coordenadas').html());
			
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
		mostrarModal();
	});
	
	//Boton guardar
	$('a[id^=guardar]').click(function(){
		var guardar = true;
		$('#' + tab_actual + ' input').each(function() {
			var completos = revisarInputs(this);
			if (completos == false) {
				guardar = completos;
			}
		});
		if (!guardar) {
			focus_flag = false;
			$('#mensaje-modal').html("Llena los campos vacíos");	
		}else{
			//guarda segun el tab actual (usando ajax?)
			if (tab_actual == 'tab-analitos') {
				$('#mensaje-modal').html("Llamar guardar de analitos");
			}else if (tab_actual == 'tab-usuarios') {
				$('#mensaje-modal').html("Llamar guardar de analitos");
			}else if (tab_actual == 'tab-localidades') {
				$('#mensaje-modal').html("Llamar guardar de analitos");
			}else if (tab_actual == 'tab-clientes') {
				$('#mensaje-modal').html("Llamar guardar de analitos");
			}
		}
		mostrarModal();
	});
	

	$('.habilitar').click(function(){
		$('#modal-habilitado').modal('show');
		//
		var ident = $(this).parent().parent().find('.id').text();
		habilitarCliente(ident);
		setTimeout("$('#modal-habilitado').modal('hide')", 2500);
		var nodo = $(this).parent().parent();
		$('#listado-todos-clientes').append($(nodo).clone());
		$(this).parent().parent().remove();
	});
	

		//Borro fila
	$('.habilitar').click(function(){
		$('#modal-habilitado').modal('show');
		setTimeout("$('#modal-habilitado').modal('hide')", 1500);
		
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
	
	$('input').focusout(function() {
		revisarInputs(this);
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
	//remuevo la clase para que no exista fila seleccionada
	$('.seleccionada').removeClass('seleccionada');
	//recorro los inputs para limpiarlos
	// esto da error en csrf_token de django !($(this).is('input[type="submit"]') || 
	$('input').each(function(){
		if ($(this).is('input[type="reset"]') || $(this).is('input[type="button"]')){
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
		if (($(obj).val().length < 1) || ($(obj).val() == "__.___")) {
			//quitarMsg(this) deberia estar en un condicional quizas...
			quitarMsg(obj);
			$(crearMsgValidacion(msg_input_vacio, $(obj).attr("id"))).appendTo($(obj).prev());
		}else{
			completos = true;
			quitarMsg(obj);
		}
	}else{
		completos = true;
	}
	return completos;
}

function mostrarModal() {
	$('#modal-eliminar').modal({
			show: true,
			backdrop: 'static'
	});
}

function categoria_click () {

   	var model = $('#id_categorias').val();
	
	if (model=="new") {
		/*
		p = xpopup({
		    url: "/analitos/categoria/",

		    modal: true,
		    width: 600,
		    height: 300,
		    modal: true, // Block UI and show PopUp
		    name: 'testPopup',
            close: function() {
                console.log(p);
            }		    
		});
		p.center();
		if (p.closed()) {
			console.log(p);
		}
		*/
		
		var strFeatures = "left=200,top=100,width=650,height=550,fullscreen=no" 
		var Pagina = "Plan de control pop up.aspx"; 
		objNewWindow = window.open("/add/categoria","newWin", strFeatures); 
		objNewWindow.focus();
		

   }
}


//para mandar via ajax
function habilitarCliente(identidad) {
	$.post('acepto-cliente/', { cliente: identidad }, cargar_clientes);
	
	return null;
}
