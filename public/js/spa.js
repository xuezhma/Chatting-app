$( document ).ready(function(){
	// for tab Join Chat
	var name = getQueryVariable('name') || getQueryVariable('email');
	console.log(name);
	var $hiddenName = jQuery('.hiddenName');
	var tobe = "<input type='hidden' class='form-control' value='" + name + "' type='text' name='name' required> ";
	$hiddenName.text = " ";
	$hiddenName.append(tobe);
	console.log(tobe);
	console.log($hiddenName);
});