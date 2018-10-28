window.addEventListener('load', function() {
	let patterns = {
		name: /^[A-Za-z]+$/,
		phone: /^\+7\(\d{3}\)\d{3}-\d{4}$/,
		email: /^[a-z]+(\.|-)*[a-z]+@[a-z]+\.ru$/
	}, check = function() {
		let msg = "", text = "Некорректно заполнен ";
		for (var i = 0; i < 3; i++) {
			if ( !patterns[document.forms['FORM'][i].name].test(document.forms['FORM'][i].value) ) {
				msg += msg != "" ? "\n" + text + document.forms['FORM'][i].name : text + document.forms['FORM'][i].name;
				document.forms['FORM'][i].style.borderColor = "red";
			} else document.forms['FORM'][i].style.borderColor = "initial";
		}
		if (msg != "") alert(msg);
	}, div = document.createElement('div');
	div.id = "options";
	autoField.appendChild(div);
 	send.addEventListener('click', check);

 	let getConfig = $.ajax({
 		url: "data/city.json",
 		type: 'GET',
 		dataType: 'JSON',
 		success: function(data) {
 			return data;
 		},
 		error: function(e) {
 			console.log(e);
 		}
 	});

 	$('#auto').on('keyup', function() {
 		let config = getConfig.responseJSON, self = this;
 		if (this.value.length > 2) {
 			div.innerHTML = "";
 			for (let i = 0; i < config.length; i++) {
 				let str = config[i].substr(0, this.value.length).toUpperCase();
 				if (this.value.toUpperCase() == str) {
 					let el = document.createElement('p');
 					el.innerHTML = config[i];
 					el.classList.add("option");
 					$(el).on('click', function() {
 						self.value = this.innerHTML;
 						div.innerHTML = "";
 					});
 					div.appendChild(el);
 				}
 			}
 		} else div.innerHTML = "";
 	});

 	let change = function() {
 		let i = $.inArray( this, $('.control') );
 		$('.content.active').removeClass('active');
 		$(this).addClass('active');
 		$('.content').eq(i).slideDown(1000, function() {
 			$(this).addClass('active');
 		});
 	};
 	$('.control').on('click', function() {
 		let self = this;
 		if ( !$(this).hasClass('active') ) {
 			$('.control.active').removeClass('active');
 			$('.content.active').slideUp(500, change.bind(self));
 		}
 	});
}); 