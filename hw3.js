var text = "'Isn't this game really cool' - he asked.\nShe said: 'Well, it's so hard and I can't pass the first level!'";
let pattern = /'([^a-z]|$)/g,
	result = text.replace(pattern, function(str) {
		let newStr = '"';
		if (str.length != 1) {
			return newStr + str[1];
		} else return newStr;
	});
console.log(result);

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
	};

	send.addEventListener('click', check);
});