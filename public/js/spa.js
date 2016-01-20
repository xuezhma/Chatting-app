$( document ).ready(function(){
	// for tab Home
	if(getQueryVariable('name') == 'undefined'){
		var tosend = "<h1 >Welcome. </h1><h4>You don't have a display name yet. <a data-toggle='tab' href='#menu1'>Set Display Name Now</a></h4><h4>Or we will use your email as your display name.</h4>";
	}else{
		var tosend = "<h1 class='text-center'>Welcome. " + getQueryVariable('name') + "</h1>";
	}
	var $hiddenWelc = jQuery('.hiddenWelc');
	$hiddenWelc.text = " ";
	$hiddenWelc.append(tosend);

	// for change password
	// var email = getQueryVariable('email');
	// console.log(email);
	// var $hiddenEmail = jQuery('.hiddenemail');
	// var to = "<input type='hidden' class='form-control' value='" + email + "' type='text' name='email' required> ";
	// $hiddenEmail.text = " ";
	// $hiddenEmail.append(to);


	// for tab Join Chat
	var name = getQueryVariable('email') || getQueryVariable('name');
	console.log(name);
	var $hiddenName = jQuery('.hiddenName');
	var tobe = "<input type='hidden' class='form-control' value='" + name + "' type='text' name='name' required> ";
	$hiddenName.text = " ";
	$hiddenName.append(tobe);
	console.log(tobe);
	console.log($hiddenName);
});