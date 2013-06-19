$(document).on("ready", inicio);
function inicio ()
{
	cargo_analitos();
	cargo_localidades();
	ingreso_analitos();
	$("#clai").on("click", cargo_listas);
	$('tr[class*=fila]').on("click", cargo_datos);
	$('tr[class*=fila]').on("hover", cambio_cursor);
	console.log("W");
	//$('#preguntas button').on('click', enviar_pregunta);
}

function cargo_analitos(datos) 
{
	$('#ListaAnalitos').html('&nbsp;').load('/analitos/cargo-analitos/');
}

function cargo_localidades(datos) 
{
	$('#ListaLocalidades').html('&nbsp;').load('/localidades/cargo-localidades/');
}


function ingreso_analitos(datos) 
{
	$('#IngresoAnalitos').html('&nbsp;').load('/analitos/home/');
}


function cargo_listas(datos) 
{
	cargo_analitos();
	cargo_localidades();
}

function cambio_cursor(datos)
{
	console.log("W");
	$(this).css("cursor", "pointer");
}
	

function cargo_datos(datos)
{
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
	//TODO: limpiar campos
}