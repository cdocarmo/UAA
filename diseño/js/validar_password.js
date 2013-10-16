/**
 * @author Gabriel Fernández
 */

$(document).ready(function() {
	//validar primer input
	$('#password1').on('keypress', function(e){
		var color;
		var tipeos;
		if (e.keyCode == 8) {
			tipeos = $(this).val().length;	
		} else {
			tipeos = $(this).val().length + 1;
		}
		
		if (tipeos < 6) {
			color = "red";
		} else if (tipeos >=6 && tipeos <= 8){
			color = "yellow";
		} else {
			color = "green";
		}
		
		$(this).css('color', color);
		//alert(tipeos);
	});
	
	//validar segundo input
	$('#password2').on('keyup', function(e) {
		var color;
		var tipeos;
		
		//if (e.keyCode == 8) {
		//	tipeos = $(this).val().length;	
		//} else {
		//	tipeos = $(this).val().length;
		//}
		
		tipeos = $(this).val().length;
		
		var substr1;
		var substr2;
		
		var substr1 = $("#password1").val().substring(0, $("#password1").val().length);
		var substr2 = $("#password2").val().substring(0, $("#password2").val().length);
		
		var tipeos_anterior = $("#password1").val().length;
		if (tipeos < tipeos_anterior || tipeos > tipeos_anterior) {
			color = "red";
			$("#guardar").addClass('disabled');
		} else if (substr1 != substr2){
			color = "red";
			$("#guardar").addClass('disabled');
		} else {
			color = "green";
			$("#guardar").removeClass('disabled');
		}
		
		$(this).css('color', color);
	});
});
