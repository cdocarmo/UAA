//JS

$(document).ready(function(){
	
	//PASA A LA SIGUIENTE PARTE
	
	$('#siguiente-cliente').on('click', function(e) {
		e.preventDefault();
		if (validarCliente('cliente')) {
			$('#col2').animate({left:'56%'}, 'slow');
		} 
		
	});
	
	//FINALIZA EL FORM
	
	$('#guardar-nuevo-registro-cliente').on('click', function(e) {
		e.preventDefault();
		if (validarCliente('usuario')) {
			alert('Aca debe ir la llamada a la accion \nque procesa el formulario')
		} 
	});
	
	//LIMPIA CADA PARTE DEL FORMULARIO
	
	$('#limpiar-cliente').on('click', function(e) {
		e.preventDefault();
		limpiar('cliente')
	});
	
	$('#limpiar-usuario').on('click', function(e) {
		e.preventDefault();
		limpiar('usuario')
	});
});

//VALIDACION

function validarCliente(tipo) {
	var flag = true;
	if (tipo == 'cliente') {
		$('.input-cliente').each(function() {
			if ($(this).val().length < 1) {
				$(this).prev().children().css('visibility', 'visible');
				flag = false;
			} else {
				$(this).prev().children().css('visibility', 'hidden');
			}
		});
	}else{
		$('.input-usuario').each(function() {
			if ($(this).val().length < 1) {
				$(this).prev().children().css('visibility', 'visible');
				flag = false;
			} else {
				$(this).prev().children().css('visibility', 'hidden');
			}
		});
	}
	return flag;
}

//LIMPIA LOS INPUTS

function limpiar(tipo) {
	if (tipo == 'cliente') {
		$('.input-cliente').each(function() {
			$(this).val('');
		});
	}else{
		$('.input-usuario').each(function() {
			$(this).val('');
		});
	}
}

