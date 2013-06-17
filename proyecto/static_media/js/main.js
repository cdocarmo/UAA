$(document).on("ready", inicio);
function inicio ()
{
	cargo_analitos();
	ingreso_analitos();
	$("#clai").on("click", cargo_listas);	
	//$('#preguntas button').on('click', enviar_pregunta);
}

function cargo_analitos(datos) 
{
	$('#ListaAnalitos').html('&nbsp;').load('/analitos/cargo-analitos/');
}

function ingreso_analitos(datos) 
{
	$('#IngresoAnalitos').html('&nbsp;').load('/analitos/home/');
}


function cargo_listas(datos) 
{
	cargo_analitos();
}
