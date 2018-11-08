window.addEventListener('load', function() {
	let patterns = {
		name: /^[A-Za-z]+$/,
		phone: /^\+7\(\d{3}\)\d{3}-\d{4}$/,
		email: /^[a-z]+(\.|-)*[a-z]+@[a-z]+\.ru$/
	}, check = function() {
		let msg = "", text = "Некорректно заполнен ", failed = [];
		for (let i = 0; i < 3; i++) {
			let that = document.forms['FORM'][i];
			console.log(patterns[that.name].test(that.value));
			if ( !patterns[that.name].test(that.value) ) {
				msg += msg != "" ? "; " + text + that.name : text + that.name;
				that.style.borderColor = "red";
				failed.push(that);
			} else that.style.borderColor = "initial";
		}
		$(failed).effect('bounce');

		if (msg != "") {
			let dialog = document.createElement('div');
			$(dialog).html(msg);
			$(dialog).dialog();
		}
		//alert(msg);
	}, div = document.createElement('div');
	div.id = "options";
	autoField.appendChild(div);
 	$(send).on('click', check);

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

 	$('#bday').datepicker({
		monthNames: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
		dayNamesMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
		dateFormat: "dd.mm.yy"
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

$(function() {
	// Инициализация слайдера
	$('.jcarousel').jcarousel({
		// Базовые настройки скрипта пишутся здесь
	});

	$('.jcarousel-prev').jcarouselControl({
		target: '-=1'
	});

	$('.jcarousel-next').jcarouselControl({
		target: '+=1'
	});

	$('.jcarousel-pagination').jcarouselPagination({
    	item: function(page) {
        	return '<a href="#' + page + '">' + page + '</a>';
    	}
	});

	$('.jcarousel').jcarouselAutoscroll({
    	interval: 3000,
    	target: '+=1',
    	autostart: true
	});
});