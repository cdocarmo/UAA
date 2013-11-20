//GLOBALES
var tab_actual = 'tab-pedido';  //tab-muestreos-anteriores
var PEDIDO = "pedido";
var MUESTREOS_ANTERIORES = "muestreos-anteriores";
var MODO = "nuevo";  //puede ser nuevo, agregar o modificar
var col_muestreos = new Array();
var prox_numero_muestreo = 0;
var agregar_muestreo = true;
var analitos_marcados = 0;
var ultimo_muestreo = null;
var item_muestreo_anterior = null;
var numero_muestreo_edicion = null;
var codigo_de_referencia_buffer = null;
var item_muestreo_edicion = null;
var boton_ver_anterior = null;
var col_analitos = new Array();

//mensajes
var editar_muestreo = 'Editar Muestreo';
var agregar_muestreos = 'Agregar Muestreos';

//banderas
var select_departamentos = false;
var select_ciudades = false;
var select_direcciones = false;
var buscar_punto_de_referencia_edicion = false;

//FUNCION QUE EXTIENDE LA CLASE STRING DANDOLE LA CAPACIDAD DE CAPITALIZAR
String.prototype.capitalize = function() {
    return this.toLowerCase().replace(/(^|\s)([a-z])/g, function(m, p1, p2) { return p1 + p2.toUpperCase(); });
};

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
	//cuando voy al tab nuevo pedido
	$('.tab-nuevo-pedido').bind('shown', function(){
		MODO = 'nuevo';
		//alert('modo: ' + MODO);
	});
	
	$('a[id^=btn-agregar-muestreo]').on('click', function(){
		//TODO: aqui debo poner un condicional segun el modo.
		if ($(this).attr('id') == 'btn-agregar-muestreo' && MODO == 'agregar') {
			return;
		}
		var msg_alert = "";
		//obtengo el id para saber en que formulario se desencadeno el evento
		var id_form_contenedor = '#' + $(this).parent().parent().parent().parent().attr('id');
		//recoger todos los datos en un objeto
		var obj = new Object();
		var prueba = $(id_form_contenedor + ' input[id^=codigo-referencia]');
		obj['cod_ref'] = $(id_form_contenedor + ' input[id^=codigo-referencia]').val();
		obj['latitud'] = $(id_form_contenedor + ' input[id^=latitud-referencia]').val();
		obj['longitud'] = $(id_form_contenedor + ' input[id^=longitud-referencia]').val();
		//obj['departamento'] = $('#departamentos').val();
		//obj['ciudad'] = $('#ciudades').val();
		//obj['direccion'] = $('#direccion').val();
		//obj['referencia'] = $('#numero-referencia');
		obj['observacion'] = $(id_form_contenedor + ' input[id^=observaciones-muestreo]').val();
		var analitos = new Array();
		//recorro todos los analitos para ver cual está marcado
		$(id_form_contenedor + ' .analito').each(function(){
			if ($(this).is(':checked')) {
				analitos.push($(this).attr('value'));
				analitos_marcados++;	
			}
		});
		
		//si codigo de referencia esta vacio muestro alerta
		if ($(id_form_contenedor + ' input[id^=codigo-referencia]').val().length < 1) {
			//var temp = $('#locacion').find('#msg-vacio-direccion');
			if ($(id_form_contenedor + ' #locacion').find('#msg-vacio-codigo-referencia').length == 0) {
				$(crearMsgValidacion('Campo obligatorio', 'codigo-referencia')).appendTo($(id_form_contenedor + ' #codigo-referencia').prev());	
			}
			agregar_muestreo = false;
		}else{
			quitarMsg($(id_form_contenedor + ' #codigo-referencia'));
		}
		
		if (analitos_marcados > 0) { //si hay analitos marcados...
			quitarMsg($(id_form_contenedor + ' #analitos')); //quito el mensaje de error
			obj['col-analitos'] = analitos; //agrego la coleccion
		}else { //sino
			if ($(id_form_contenedor + ' #analitos').find('#msg-vacio-analitos').length == 0) { //si no hay mensaje de error lo creo
				$(crearMsgValidacion('Debes seleccionar al menos un analito', 'analitos')).appendTo($(id_form_contenedor + ' #analitos legend').append());	
			}
			agregar_muestreo = false; //evito agregar muestreo
		}
		if (agregar_muestreo) { //todo esta ok
			if (MODO == "nuevo") { //si es un nuevo pedido
				obj['nro_muestreo'] = prox_numero_muestreo; //guardo el numero de muestreo
				prox_numero_muestreo++;	
			}else if (MODO == "modificar" || MODO == 'agregar'){ //si es modificar o agregar muestreo
				if (MODO == 'modificar') {
					obj['nro_muestreo'] = numero_muestreo_edicion;
					
					for (item in col_muestreos) {
						//TODO: el item_muestreo_edicion lo obtengo de linea 123
						if (col_muestreos[item].nro_muestreo == $(item_muestreo_edicion).attr('id').substring(4)) {
							//alert('entra a eliminar');
							var temp = col_muestreos.splice(item);
						}
					}
					$(item_muestreo_edicion).remove();
				}else{
					obj['nro_muestreo'] = prox_numero_muestreo; //guardo el numero de muestreo
					prox_numero_muestreo++;	
				}
			}
			crearLineaNuevoMuestreo(obj);
			col_muestreos.push(obj);
			
			$(id_form_contenedor + ' .ningun-muestreo').css('display', 'none');
			modificarTitulo();
			limpiar(false);	
		}else{
			agregar_muestreo = true;
		}
		analitos_marcados = 0;
		MODO = "nuevo";
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
			//limpiar(false);
			modificarTitulo();
		}else if (e.target.nodeName == 'A'){
			MODO = "modificar";
			item_muestreo_edicion = $(e.target).parent();
			//alert(MODO);
			limpiar(false);
			blanquearFondos();
			$(e.target).parent().css('background-color', '#dee');
			for (item in col_muestreos) {
				var temp = $(e.target).parent().attr('id').substring(4);
				if (item == temp) {
					rellenarFormulario(col_muestreos[item]);
					numero_muestreo_edicion = col_muestreos[item].nro_muestreo;
					$('a#btn-agregar-muestreo').text('Modificar este muestreo');
					return;
				}
			}
		}
	});
	
	$('#pedido-muestreo').on('submit', function(){
		//aca debo llamar al metodo que guarda el pedido
		if($('#lista-muestreos').children().length < 1){
			alert('Aun no has añadido muestreos al pedido.');
		}else{
			col_muestreos = new Array();
			col_analitos = new Array();
			modificarTitulo();
			limpiar(true);
			alert('Enviar form.');
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
	
	$('.agregar-muestreo').on('click', function(){
		//alert("aca");
		$('.titulo-modal-muestreo').html(agregar_muestreos);
		$('#btn-agregar-muestreo-edicion').removeClass('hide');
		MODO = 'agregar';
		limpiar(true);
		$('#modal-editar-muestreo').modal('show');
		//Aca se deben obtener los datos via AJAX y colocarlas en variables para pasarlas al siguiente str
		//hardcodeado: este array debe ser llenado con lo obtenido via ajax
		var id_muestreo = $(this).parent().parent().parent().parent().attr('id'); //obtengo el id para buscar el muestreo
		$('#modal-editar-muestreo').find('#guardar-edicion-muestreo').attr('data-id', id_muestreo);
		
	});
	
	$('button[id^=muestreo-id]').on('click', function(){
		MODO = 'modificar';
		limpiar(false);
		var id_muestreo = $(this).attr('id').split('-')[2]; //obtengo el id para buscar el muestreo
		var ident = $(this).attr('id').split('-')[2]; //obtengo el numero de muestreo desde el attr id del boton
		//alert('id es ' + ident);
		var cod_referencia = $(this).parent().parent().find('.cod-ref').html();
		codigo_de_referencia_buffer = cod_referencia; //para ver si se cambio de locacion y actualizar la fila de los muestreos
		var longitud = $(this).parent().parent().find('.longitud').html();
		var latitud = $(this).parent().parent().find('.latitud').html();
		var observaciones = $(this).parent().parent().find('.observaciones').html();
		//var departamento = $(this).parent().parent().find('.departamento').val();
		//var ciudad = $(this).parent().parent().find('.ciudad').val();
		//var direccion = $(this).parent().parent().find('.direccion').val();
		//obtener los analitos marcados
		var analitos = new Array();
		$(this).parent().parent().find('.analitos span').each(function(){
				analitos.push($(this).attr('id'));	
		});
		
		$('#codigo-referencia-edicion').val(cod_referencia);
		$('#longitud-referencia-edicion').val(longitud);
		$('#latitud-referencia-edicion').val(latitud);
		$('#observaciones-muestreo-edicion').val(observaciones);
		//$('#departamentos-edicion option:contains("' + departamento + '")').prop('selected', true);
		//$('#ciudades-edicion option:contains("' + ciudad + '")').prop('selected', true);
		//$('#direcciones-edicion option:contains("' + direccion + '")').prop('selected', true);
		//$('#modal-editar-muestreo').find('#guardar-edicion-muestreo').attr('data-id', id_muestreo);
		//marcar los analitos obtenidos
		
		for (var i=0; i<analitos.length; i++) {
			//alert('analito ' + analitos[i]);
			var selector = '#' + analitos[i] + '-edicion';
			//alert(selector);
			$(selector).get(0).checked = true;
			//$(selector).get(0).checked = true;
		}
		
		$('#btn-agregar-muestreo-edicion').addClass('hide');
		$('.titulo-modal-muestreo').html(editar_muestreo);
		$('#modal-editar-muestreo').modal('show');
		$('#guardar-edicion-muestreo').attr('data-id', id_muestreo);
	});
	
	//PESTAÑA "MUESTREOS ANTERIORES"
	
	$('.ver').unbind('click').on('click', function(e){
		e.preventDefault();
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
			var caja_cod = "";
			var max = 3;
			for (var i=0;i<max;i++) {
				caja_cod = caja_cod + '<td colspan=5 class="datos-pedido-muestreo">' + 
				'<table>' +
						'<caption>Pedido nro: 001</caption>' +
						'<tr>' +
							'<th>Número de Muestreo</th>' +
							'<th>Cód. de Referencia</th>' +
							'<th>Ciudad</th>' +
							'<th>Departamento</th>' +
							'<th>Dirección</th>' +
							'<th>Analito</th>' +
							'<th>Fecha</th>';
							if ($(this).hasClass('pendiente')){
								caja_cod = caja_cod +
								'<th></th>' +
								'<th></th>' +
								'<th></th>' +
								'<th></th>' +
								'<th></th>';
							}
							caja_cod = caja_cod + '</tr>';
				for (var j=0;j<max; j++) {
					caja_cod = caja_cod +
						'<tr id="muestreo-' + j + '">' + // aqui "j" debe ser el numero de muestreo
							'<td class="num-muestreo">0001</td>' +
							'<td class="cod-ref">XXJX00</td>' +
							'<td class="departamento">Salto</td>' +
							'<td class="ciudad">Salto</td>' +
							'<td class="direccion">Oficial 1 2016</td>' +
							'<td class="analitos"><span class="badge badge-success" id="plomo">Plomo</span></class><span class="badge badge-success" id="hierro">Hierro</span></class><span class="badge badge-success" id="arsenico">Arsénico</span></class></td>';
							if ($(this).hasClass('anterior')) {
								caja_cod = caja_cod +
								'<td class="fecha">11/11/13</td>';
							}else{ //si son muestreos pendientes
								caja_cod = caja_cod +
								'<td class="fecha dtp-muestreo input-append date"><input type="text"></input><span class="add-on"><i data-time-icon="icon-time" data-date-icon="icon-calendar"></i></span></td>' +
								'<td><button class="btn btn-primary" id="muestreo-id-' + j + '">Editar Detalles</button></td>' +
								'<td><button class="btn btn-danger elim-muestreo">X</button></td>' +
								'<td class="invisible latitud">12\' 34 23</td>' +
								'<td class="invisible longitud">123\' 43 32</td>' +
								'<td class="invisible observaciones">Observaciones bien observadas</td>';
							}
						caja_cod = caja_cod + '</tr>';
				}
				caja_cod = caja_cod + '</table>';
				if ($(this).hasClass('pendiente')) {
					caja_cod = caja_cod + '\t\t<button class="btn btn-success agregar-muestreo" id="id' + i + '">Agregar Muestreo</button>';	
				} // la variable "i" debe ser sustituida por la variable que contiene el id del muestreo
				
				caja_cod = caja_cod + '</td>';
				fila = crearFilaConInfoDeMuestreos(id_pedido, i); //segundo parametro es temporal, debe sustituirse por el id de muestreo correcto
				$(fila).html(caja_cod);
				$(fila_anterior).after(fila);
				$(fila).show('slow');
				if (i == (max - 1)) {
					
				}
				fila_anterior = fila;
				caja_cod = "";
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
			setearDateTimePickers();
			reBind();
	});
	
	//CAMBIAR ICONO DE ANALITO AL PASAR PUNTERO POR ENCIMA
	//TODO: revisar la utilidad de esto
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
	
	//elimina fila de muestreo en la lista de muestreos del pedido.
	$('.elim-muestreo').on('click', function() {
		$(this).parent().parent().remove();
	});
	
	//finalizar edicion muestreo
	$('#guardar-edicion-muestreo').unbind().on('click', function(){
		if (validarCamposEdicionDelMuestreo($(this).attr('data-id'))) {
			//llamada ajax
			if (MODO == 'agregar'){
				alert('Muestreo agregado.');
			}else{
				alert('Edición finalizada.');
			}
			$('#modal-editar-muestreo').modal('hide');
		}else{
			//alert('');
		}
	});
	
	//NUEVO PUNTO DE REFERENCIA
	
	$('#nuevo-punto-referencia').on('click', function(e) {
		//alert('anda');
		e.preventDefault();
		$('#modal-nuevo-punto-referencia').modal('show');
	});
	
	var ocultar_boton_referencia = false;
	
	$('button[id^=buscar-punto-referencia]').on('click', function(e) {
		e.preventDefault();
		if (MODO == 'nuevo') {
			if (!ocultar_boton_referencia) {
				$('.buscar-referencia').show();
				$('#buscar-punto-referencia').html('Ocultar Búsqueda');
				ocultar_boton_referencia = true;
			} else {
				$('.buscar-referencia').hide();
				$('#buscar-punto-referencia').html('Buscar Punto de Referencia');
				resetSelectsBuscarPuntoReferencia();
				ocultar_boton_referencia = false;
			}	
		}else if (MODO == 'modificar') {
			if (!ocultar_boton_referencia) {
				$('.buscar-referencia-edicion').show();
				$('#buscar-punto-referencia-edicion').html('Ocultar Búsqueda');
				ocultar_boton_referencia = true;
			} else {
				$('.buscar-referencia-edicion').hide();
				$('#buscar-punto-referencia-edicion').html('Buscar Punto de Referencia');
				resetSelectsBuscarPuntoReferencia();
				ocultar_boton_referencia = false;
			}
		}
	});
	
	var ocultar_caja_nueva_ciudad = false;
	
	$('#btn-nueva-ciudad').on('click', function(e) {
		e.preventDefault();
		if (!ocultar_caja_nueva_ciudad) {
			$('.nueva-ciudad-localidad').show();
			$('#nueva-ciudad-localidad').addClass('nueva-ciudad');
			$('#ciudades-nuevo').attr('disabled', true);
			ocultar_caja_nueva_ciudad = true;
		}
	});
	
	//CERRAR MODAL NUEVO PUNTO DE REFERENCIA
	$('#modal-nuevo-punto-referencia .close, #cerrar-nueva-referencia').on('click', function() {
		$('.nueva-ciudad-localidad').hide();
		//$('#ciudades-nuevo').attr('disabled', false);
		$('#departamentos-nuevo option[value="seleccionar"]').prop('selected', true);
		ocultar_caja_nueva_ciudad = false;
	});
	//CERRAR MODAL AGREGAR/EDITAR-MUESTREO
	$('.cerrar-muestreo').on('click', function(){
		limpiar(true);
		//$('#modal-editar-muestreo').hide();
	});
	
	//SELECTEDS
	$('.departamentos option').on('click', function(e){
		e.preventDefault();
		if ($(this).parent().hasClass('edicion')) {
			$('#ciudades-edicion').removeAttr('disabled');
			//llamada ajax para cargar ciudades del departamento seleccionado
		}else if (MODO == 'nuevo') {
			$('#ciudades').removeAttr('disabled');
			//llamada ajax para cargar ciudades del departamento seleccionado
		}
		
	});
	
	$('.ciudades option').on('click', function(e){
		e.preventDefault();
		if ($(this).parent().hasClass('edicion')) {
			$('#direcciones-edicion').removeAttr('disabled');
			//llamada ajax para cargar ciudades del departamento seleccionado
		}else if (MODO == 'nuevo') {
			$('#direcciones').removeAttr('disabled');
			//llamada ajax para cargar ciudades del departamento seleccionado
		}
		
		//llamada ajax para cargar direcciones de la ciudad seleccionada
	});
	
	$('.direcciones option').on('click', function(e){
		e.preventDefault();
		//TODO: actualizar los campos cod-ref latitud y longitud
		//lo siguiente esta hardcodeado pero son datos que se deberian
		//obtener via ajax
		$('#codigo-referencia').val('HARDCOD001');
		$('#latitud-referencia').val('12\' 34 23hardc');
		$('#longitud-referencia').val('12\' 34 23hardc');
		buscar_punto_de_referencia_edicion = true;
	});
	
	$('#direcciones-edicion option').on('click', function(e){
		e.preventDefault();
		//TODO: actualizar los campos cod-ref latitud y longitud
		//lo siguiente esta hardcodeado pero son datos que se deberian
		//obtener via ajax
		$('#codigo-referencia-edicion').val('HARDCOD001');
		$('#latitud-referencia-edicion').val('12\' 34 23hardc');
		$('#longitud-referencia-edicion').val('12\' 34 23hardc');
		buscar_punto_de_referencia_edicion = true;
	});
	//para el modal nuevo punto geográfico
	$('#departamentos-nuevo option').on('click', function(e){
		e.preventDefault();
		if ($(this).val() != 'seleccionar') {
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
			if ($('#nueva-ciudad-localidad').hasClass('nueva-ciudad')){
				$('#nueva-ciudad-localidad').removeClass('nueva-ciudad');
			}else{
				$('#ciudades-nuevo').css('border-color', 'red');
				validar = false;
			}
			
		} else {
			$('#ciudades-nuevo').css('border-color', '#CCC');
		}
		var msn = $('#direccion-nuevo').val(); //aca hay un bug raro de jquery que no se como arreglar
		var largo = msn.length;
		
		if (largo < 1) {
			$('#direccion-nuevo').css('border-color', 'red');
			validar = false;
		} else {
			$('#direccion-nuevo').css('border-color', '#CCC');
		}
		if (validar) {
			//llamada ajax para guardar nueva localidad
			//TODO: no se cierra la caja al finalizar, no se limpia el form
			alert('Guardado Nuevo Punto de Referencia');
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
	if (buscar_punto_de_referencia_edicion) {
		//si se busco otro punto de referencia
		obj['departamento'] = $('#departamentos-edicion').val();
		obj['ciudad'] = $('#ciudades-edicion').val();
		obj['direccion'] = $('#direccion-edicion').val();	
	}
	obj['referencia'] = $('#codigo-referencia-edicion').val();
	obj['ĺatitud'] = $('#latitud-referencia-edicion').val();
	obj['longitud'] = $('#longitud-referencia-edicion').val();
	obj['observaciones'] = $('#observaciones-muestreo-edicion').val();
	var analitos = new Array();
	$('.analito').each(function(){
		if ($(this).is(':checked')) {
			analitos.push($(this).attr('value'));
			analitos_marcados++;	
		}
	});
	//if ($('#direccion-edicion').val().length < 1) {
	//	if ($('#locacion-edicion').find('#msg-vacio-direccion').length == 0) {
	//		quitarMsg($('#direccion-edicion'));
	//		$(crearMsgValidacion('Campo obligatorio', 'direccion-edicion')).appendTo($('#direccion-edicion').prev());	
	//	}
	//	editar_muestreo = false;
	//}else{
	//	quitarMsg($('#direccion-edicion'));
	//}
		
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
		if (MODO == 'agregar') {
			agregarFilaMuestreo(obj);
		}else{
			actualizarFilaMuestreo(obj);
		}
		
		//limpiarEdicionMuestreo();
		limpiar(true);
		return true;
	}else{
		return false;
			//agregar_muestreo = true;
	}
	//analitos_marcados = 0;
}

function actualizarFilaMuestreo(obj) {
	$('#muestreo-' + obj['id']).find('.cod-referencia').html(obj['referencia']);
	
	
	$('#muestreo' + obj['id']).find('.lista-datos-analitos').empty();
	$('#muestreo-' + obj['id']).find('.badge').each(function() {
		$(this).remove();
	});
	if (obj['referencia'] != codigo_de_referencia_buffer) {
		alert('hay que llamar ajax para obtener los datos de departamento, ciudad y direccion (linea 643 - muestreos.js)');
		//TODO: AJAX: si entra aquí hay que obtener departamento, ciudad y direccion via ajax segun el nuevo codigo de referencia en
		//obj['referencia'] para actualizar la fila.
		//descomentar lo que sigue
		//var dep = datodeajax;
		//var ciud = datodeajax;
		//var dir = datodeajax;
		//$('#muestreo-' + obj['id']).find('.ciudad').html(ciud);
		//$('#muestreo-' + obj['id']).find('.departamento').html(dep);
		//$('#muestreo-' + obj['id']).find('.direccion').html(dir);
	}else{
		$('#muestreo-' + obj['id']).find('.ciudad').html(obj['ciudad']);
		$('#muestreo-' + obj['id']).find('.departamento').html(obj['departamento']);
		$('#muestreo-' + obj['id']).find('.direccion').html(obj['direccion']);
	}
	for (var i=0; i<obj['col-analitos'].length; i++) {
		var txt_analito = obj['col-analitos'][i];
		
		$('#muestreo-' + obj['id']).find('.analitos').append('<span class="badge badge-success" id="' + txt_analito.toLowerCase() + '">' + txt_analito.capitalize() + '</span>');
	}
	
}

function agregarFilaMuestreo(obj) {
	//TODO: agregar una fila con los datos del muestreo
	caja_cod = caja_cod +
						'<tr id="muestreo-' + obj['id'] + '">' + // aqui "j" debe ser el numero de muestreo
						'<td class="num-muestreo">' + obj['id'] + '</td>' +
						'<td class="cod-ref">' + obj['referencia'] + '</td>' +
						'<td class="departamento">' + obj['departamento'] + '</td>' +
						'<td class="ciudad">' + obj['ciudad'] + '</td>' +
						'<td class="direccion">' + obj['direccion']+ '</td>';
						for (var i=0; i<obj['col-analitos'].length; i++) {
							var txt_analito = obj['col-analitos'][i];
							caja_cod = caja_cod +
							'<td class="analitos"><span class="badge badge-success" id="' + txt_analito.toLowerCase() + '">' + txt_analito.capitalize() + '</span></td>';
						}
						caja_cod = caja_cod +
						'<td class="analitos"><span class="badge badge-success" id="plomo">Plomo</span></class><span class="badge badge-success" id="hierro">Hierro</span></class><span class="badge badge-success" id="arsenico">Arsénico</span></class></td>' +
						'<td class="fecha dtp-muestreo input-append date"><input type="text"></input><span class="add-on"><i data-time-icon="icon-time" data-date-icon="icon-calendar"></i></span></td>' +
						'<td><button class="btn btn-primary" id="muestreo-id-' + j + '">Editar Detalles</button></td>' +
						'<td><button class="btn btn-danger elim-muestreo">X</button></td>' +
						'<td class="invisible latitud">12\' 34 23</td>' +
						'<td class="invisible longitud">123\' 43 32</td>' +
						'<td class="invisible observaciones">Observaciones bien observadas</td>';
	caja_cod = caja_cod + '</tr>';
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
	
	$('#codigo-referencia').val(obj['cod_ref']);
	$('#observaciones-muestreo').val(obj['observacion']);
}

function crearLineaNuevoMuestreo(obj) {
	//alert(obj.nro_muestreo);
	var nuevo_nodo = $('<li id="nro-' + obj.nro_muestreo + '"><a href="#"><i class="icon-edit"></i>&nbsp&nbsp&nbspMuestreo numero <span class="nro-de-muestreo">' + col_muestreos.length 
	+ '</span> - C&oacute;digo de referencia <span class="codigo-referencia">' + obj.cod_ref + '</span><i class="icon-remove pull-right"></i></a></li>');
	if (MODO == 'nuevo') {
		$('#lista-muestreos').prepend(nuevo_nodo);
	}else if (MODO == 'agregar') {
		$('#lista-muestreos-edicion').prepend(nuevo_nodo);
	}
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
	//debo acomodar para ver como hacer para nuevo pedido e igual para edicion
	resetSelectsBuscarPuntoReferencia();
	
	if (total) {
		$('li[id^=nro-]').each(function(){
			$(this).remove();
			$('.ningun-muestreo').css('display', 'block');
		});
	}
}

function resetSelectsBuscarPuntoReferencia() {
	if (MODO == 'nuevo') {
		$('#departamentos').prop('selectedIndex', 0);
		$('#ciudades').prop('selectedIndex', 0);
		$('#direcciones').prop('selectedIndex', 0);
		//$('#departamentos').prop('disabled', 'disabled');
		$('#ciudades').prop('disabled', 'disabled');
		$('#direcciones').prop('disabled', 'disabled');
		$('#codigo-referencia').val('');
		//$('#longitud-referencia-edicion').val('');
		//$('#latitud-referencia-edicion').val('');
		$('#observaciones-muestreo').val('');
		$('.buscar-referencia').hide();
		$('#buscar-punto-referencia').html('Buscar Punto de Referencia');
		ocultar_boton_referencia = false;
	}else if (MODO == 'modificar' || MODO == 'agregar') {
		$('#departamentos-edicion').prop('selectedIndex', 0);
		$('#ciudades-edicion').prop('selectedIndex', 0);
		$('#direcciones-edicion').prop('selectedIndex', 0);
		//$('#departamentos-edicion').prop('disabled', 'disabled');
		$('#ciudades-edicion').prop('disabled', 'disabled');
		$('#direcciones-edicion').prop('disabled', 'disabled');
		$('#codigo-referencia-edicion').val('');
		$('#longitud-referencia-edicion').val('');
		$('#latitud-referencia-edicion').val('');
		$('#observaciones-muestreo-edicion').val('');
		$('.buscar-referencia-edicion').hide();
		$('#buscar-punto-referencia-edicion').html('Buscar Punto de Referencia');
		ocultar_boton_referencia = false;
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

function setearDateTimePickers() {
	$('.dtp-muestreo').datetimepicker({
        		format: 'dd/MM/yyyy',
        		language: 'es-UY'
        	});
}
