var glrURL = "http://localhost/test/json/gallery.json",
	statusURL = "http://localhost/test/json/error.json",
	gallery = document.getElementsByClassName("gallery");

var xhr = new XMLHttpRequest();
xhr.open('GET', glrURL);
xhr.send();

xhr.onreadystatechange = function(){
	if (xhr.readyState == 4) {
		if (xhr.status == 200) {
			let result = JSON.parse(xhr.responseText);
			statusURL = "http://localhost/test/json/success.json";

			for (let i = 0; i < gallery.length; i++) {
				gallery[i].src = result[i].preview;
				gallery[i].addEventListener('click', function(){
					this.src = (this.src != "http://localhost" + result[i].full) ? result[i].full : result[i].preview;
				});
			}
		}
	}
	let check = new XMLHttpRequest();
	check.open('GET', statusURL);
	check.send();

	check.onreadystatechange = function(){
		if (check.readyState == 4) {
			if (check.status == 200) {
				let result = JSON.parse(check.responseText);
				console.log(result.result);
			}
		}
	};
};