let Api = {
	load: "data/list.json",
	add: "data/add.json",
	submit: "data/submit.json",
	delete: "data/delete.json"
};
class Reviews {
	constructor() {
		this.items = [];
		this.request(Api.load);
	}
	onAdd() {
		let data = {
			"id_user": 123,
			"text": document.forms['FORM'].text.value
		};
		if (data['text'] != '') this.request(Api.add, data);
	}
	onApprove(event) {
		let div = $(event.currentTarget).parent(),
			id = $(div).attr("data-id"),
			data = {"id_comment": id};
		if (id) this.request(Api.submit, data, div);
	}
	onRemove(event) {
		let div = $(event.currentTarget).parent(),
			id = $(div).attr("data-id"),
			data = {"id_comment": id};
		if (id) this.request(Api.delete, data, div);
	}
	setEvents() {
		$('#send').on('click', this.onAdd.bind(this));
		$('.approve').on('click', this.onApprove.bind(this));
		$('.remove').on('click', this.onRemove.bind(this));
	}
	approvePost() {
		$(this).css("background", "lightgreen");
	}
	removePost() {
		$(this).remove();
	}
	process(url, response, that) {
		if(response.result) {
			switch (url) {
				case Api.load:
					this.items = response.comments;
					this.render();
					this.setEvents();
					break;
				case Api.add:
					alert(response.userMessage);
					break;
				case Api.submit:
					this.approvePost.call(that);
					break;
				case Api.delete:
					this.removePost.call(that);
					break;
			}
		}
	}
	render() {
		this.items.forEach(function(item) {
			new Review(item.id_comment, item.username, item.text);
		});
	}
	request(url, data, that) {
		$.post({
			url: url,
			data: data,
			dataType: 'json',
			context: this,
			success: function(response) {
				this.process(url, response, that);
			},
			error: function(error){
				console.log(error);
			}
		});
	}
};
class Review {
	constructor(id, username, text) {
		this.id = id;
		this.name = username;
		this.text = text;
		this.render();
	}
	render() {
		let div = document.createElement('div'),
			author = document.createElement('p'),
			post = document.createElement('p'),
			approve = document.createElement('a'),
			remove = document.createElement('a');
		$('body').append(div);
		$(div).append(author);
		$(div).append(post);
		$(div).append(approve);
		$(div).append(remove);
		$(div).addClass("review");
		$(div).attr("data-id", this.id);
		$(author).addClass("user");
		$(author).html(this.name);
		$(post).addClass("message");
		$(post).html(this.text);
		$(approve).addClass("approve");
		$(approve).attr("href", "#");
		$(approve).html("Одобрить");
		$(remove).addClass("remove");
		$(remove).attr("href", "#");
		$(remove).html("Удалить");
	}
};

$(document).ready(function() {
	var reviews = new Reviews();
});