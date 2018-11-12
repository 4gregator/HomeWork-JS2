let strataCarousel = function() {
	let div = document.createElement("div"),
		left = document.createElement("img"),
		right = document.createElement("img"),
		img = document.createElement("img"),
		btn = document.createElement("button"),
		stratas = document.getElementsByClassName("strata"),
		i = 0;
	div.id = "strataCarousel";
	playField.insertBefore(div, playField.firstChild);
	left.src = "images/left.png";
	left.className = "arrows";
	div.appendChild(left);
	left.addEventListener('click', function() {
		i = i == 0 ? stratas.length - 1 : --i;
		img.src = stratas[i].src;
	});
	img.id = "strataView";
	img.src = stratas[i].src;
	div.appendChild(img);
	right.src = "images/right.png";
	right.className = "arrows";
	div.appendChild(right);
	right.addEventListener('click', function() {
		i = i + 1 == stratas.length ? 0 : ++i;
		img.src = stratas[i].src;
	});
	btn.id = "closeCarousel";
	btn.innerHTML = "закрыть";
	div.appendChild(btn);
	btn.addEventListener('click', function() {
		playField.removeChild(div);
	});
};