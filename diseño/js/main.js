//EVENTOS

$(document).ready(function(){
	//Cambiar cursor sobre filas
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
		}
	});
	//TODO: limpiar campos
});
