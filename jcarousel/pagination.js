/*! jCarousel - v0.3.8 - 2018-05-31
* http://sorgalla.com/jcarousel/
* Copyright (c) 2006-2018 Jan Sorgalla; Licensed MIT */

!function(e){"use strict";e.jCarousel.plugin("jcarouselPagination",{_options:{perPage:null,item:function(e){return'<a href="#'+e+'">'+e+"</a>"},event:"click",method:"scroll"},_carouselItems:null,_pages:{},_items:{},_currentPage:null,_init:function(){this.onDestroy=e.proxy(function(){this._destroy(),this.carousel().one("jcarousel:createend",e.proxy(this._create,this))},this),this.onReload=e.proxy(this._reload,this),this.onScroll=e.proxy(this._update,this)},_create:function(){this.carousel().one("jcarousel:destroy",this.onDestroy).on("jcarousel:reloadend",this.onReload).on("jcarousel:scrollend",this.onScroll),this._reload()},_destroy:function(){this._clear(),this.carousel().off("jcarousel:destroy",this.onDestroy).off("jcarousel:reloadend",this.onReload).off("jcarousel:scrollend",this.onScroll),this._carouselItems=null},_reload:function(){var t=this.options("perPage");if(this._pages={},this._items={},e.isFunction(t)&&(t=t.call(this)),null==t)this._pages=this._calculatePages();else for(var s,i=parseInt(t,10)||0,r=this._getCarouselItems(),o=1,a=0;0!==(s=r.eq(a++)).length;)this._pages[o]?this._pages[o]=this._pages[o].add(s):this._pages[o]=s,a%i==0&&o++;this._clear();var n=this,l=this.carousel().data("jcarousel"),c=this._element,u=this.options("item"),h=this._getCarouselItems().length;e.each(this._pages,function(t,s){var i=n._items[t]=e(u.call(n,t,s));i.on(n.options("event")+".jcarouselpagination",e.proxy(function(){var e=s.eq(0);if(l.circular){var i=l.index(l.target()),r=l.index(e);parseFloat(t)>parseFloat(n._currentPage)?r<i&&(e="+="+(h-i+r)):r>i&&(e="-="+(i+(h-r)))}l[this.options("method")](e)},n)),c.append(i)}),this._update()},_update:function(){var t,s=this.carousel().jcarousel("target");e.each(this._pages,function(e,i){if(i.each(function(){if(s.is(this))return t=e,!1}),t)return!1}),this._currentPage!==t&&(this._trigger("inactive",this._items[this._currentPage]),this._trigger("active",this._items[t])),this._currentPage=t},items:function(){return this._items},reloadCarouselItems:function(){return this._carouselItems=null,this},_clear:function(){this._element.empty(),this._currentPage=null},_calculatePages:function(){for(var e,t,s=this.carousel().data("jcarousel"),i=this._getCarouselItems(),r=s.clipping(),o=0,a=0,n=1,l={};0!==(e=i.eq(a++)).length;)o+(t=s.dimension(e))>r&&(n++,o=0),o+=t,l[n]?l[n]=l[n].add(e):l[n]=e;return l},_getCarouselItems:function(){return this._carouselItems||(this._carouselItems=this.carousel().jcarousel("items")),this._carouselItems}})}(jQuery);