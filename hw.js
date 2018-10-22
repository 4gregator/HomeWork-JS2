"use strict";

var config = [{
	href: '/',
	name: "Главная"
}, {
	href: '/catalog',
	name: "Каталог"
}, {
	href: '/gallery',
	name: "Галерея",
	items: [{
			href: '/1',
			name: "Фото 1"
		}, {
			href: '/2',
			name: "Фото 2"
		}],
}, {
	href: '/portfolio',
	name: "Портфолио",
	items: [{
			href: '/1',
			name: "Работа 1"
		}, {
			href: '/2',
			name: "Работа 2"
		}, {
			href: '/3',
			name: "Работа 3"
		}],
}, {
	href: '/contacts',
	name: "Контакты"
}];

class Container {
	remove(){
		document.getElementById(this.id).remove();
	}
};

class Menu extends Container {
	constructor(id, config){
		super();
		this.id = id;
		this.items = [];
		this.createItems(config);
	}
	createItems(config){
		let j = 1;
		for (let i = 0; i < config.length; i++) {
			this.items.push(new MenuItem(config[i].href, config[i].name));
			if ('items' in config[i]) {
				this.items.push( new SubMenu("sub-menu-" + j++, config[i].items).create() );
			}
		}
	}
	create(){
		document.write(this.render());
	}
	render(){
		let result = '<ul id="' + this.id + '">';

		for (let i = 0; i < this.items.length; i++) {
			result += typeof this.items[i] === "object" ? this.items[i].render() : this.items[i];
		}

		result += '</ul>';
		return result;
	}
};

class SubMenu extends Menu {
	createItems(config){
		for (let i = 0; i < config.length; i++) {
			this.items.push(new MenuItem(config[i].href, config[i].name));
		}
	}
	create(){
		return this.render();
	}
	render(){
		let result = '<ul id="' + this.id + '">';

		for (let i = 0; i < this.items.length; i++) {
			result += this.items[i].render();
		}

		result += '</ul>';
		return result;
	}
};

class MenuItem extends Container {
	constructor(href, name){
		super();
		this.href = href;
		this.name = name;
	}
	render(){
		return '<li><a href="' + this.href + '">' + this.name + '</a></li>';
	}
};

let menu = new Menu("main-menu", config);
menu.create();