let html = document.querySelector('html');

//Switcher Styles
function switcherEvents() {
	'use strict';

	/***************** RTL Start*********************/
	$(document).on("click", '#myonoffswitch55', function () {
		if (this.checked) {
			$('body').addClass('rtl');
			$('body').removeClass('ltr');
			$("html[lang=en]").attr("dir", "rtl");
			$(".select2-container").attr("dir", "rtl");
			$('.fc-theme-standard').removeClass('fc-direction-ltr');
			$('.fc-theme-standard').addClass('fc-direction-rtl');
			$('.fc-header-toolbar').removeClass('fc-toolbar-ltr');
			$('.fc-header-toolbar').addClass('fc-toolbar-rtl');
			localStorage.setItem("slicartl", true);
			localStorage.removeItem("slicaltr");
			$("head link#style").attr("href", $(this));
			(document.getElementById("style")?.setAttribute("href", "../assets/plugins/bootstrap/css/bootstrap.rtl.min.css"));

			var carousel = $('.owl-carousel');
			$.each(carousel, function (index, element) {
				// element == this
				var carouselData = $(element).data('owl.carousel');
				carouselData.settings.rtl = true; //don't know if both are necessary
				carouselData.options.rtl = true;
				$(element).trigger('refresh.owl.carousel');
			});
			if (document.querySelector('body').classList.contains('horizontal')&& !(document.querySelector('body').classList.contains('login-img'))) {
				checkHoriMenu();
			}
		}
	});
	/***************** RTL End *********************/

	/***************** LTR Start *********************/
	$(document).on("click", '#myonoffswitch54', function () {

		if (this.checked) {
			$('body').addClass('ltr');
			$('body').removeClass('rtl');
			$("html[lang=en]").attr("dir", "ltr");
			$(".select2-container").attr("dir", "ltr");
			$('.fc-theme-standard').addClass('fc-direction-ltr');
			$('.fc-theme-standard').removeClass('fc-direction-rtl');
			$('.fc-header-toolbar').addClass('fc-toolbar-ltr');
			$('.fc-header-toolbar').removeClass('fc-toolbar-rtl');
			localStorage.setItem("slicaltr", true);
			localStorage.removeItem("slicartl");
			$("head link#style").attr("href", $(this));
			(document.getElementById("style")?.setAttribute("href", "../assets/plugins/bootstrap/css/bootstrap.min.css"));
			var carousel = $('.owl-carousel');
			$.each(carousel, function (index, element) {
				// element == this
				var carouselData = $(element).data('owl.carousel');
				carouselData.settings.rtl = false; //don't know if both are necessary
				carouselData.options.rtl = false;
				$(element).trigger('refresh.owl.carousel');
			});
			if (document.querySelector('body').classList.contains('horizontal')&& !(document.querySelector('body').classList.contains('login-img'))) {
				checkHoriMenu();
			}
		} 
	});
	/***************** LTR End*********************/

	/***************** LIGHT THEME Start*********************/
	$(document).on("click", '#myonoffswitch1', function () {
		if (this.checked) {
			$('body').addClass('light-mode');
			$('body').removeClass('dark-mode');
			$('body').removeClass('light-menu');
			$('body').removeClass('dark-menu');
			$('body').removeClass('color-menu');
			$('body').removeClass('light-header');
			$('body').removeClass('color-header');
			$('body').removeClass('dark-header');

			$('#myonoffswitch3').prop('checked', true);
			$('#myonoffswitch6').prop('checked', true);

			localStorage.setItem('slicalightMode', true)
			localStorage.removeItem('slicadarkMode', false)
		} 
	});
	/***************** LIGHT THEME End *********************/

	/***************** DARK THEME Start*********************/
	$(document).on("click", '#myonoffswitch2', function () {
		if (this.checked) {
			$('body').addClass('dark-mode');
			$('body').removeClass('light-mode');
			$('body').removeClass('light-menu');
			$('body').removeClass('color-menu');
			$('body').removeClass('dark-menu');
			$('body').removeClass('dark-header');
			$('body').removeClass('color-header');
			$('body').removeClass('light-header');

			$('#myonoffswitch5').prop('checked', true);
			$('#myonoffswitch8').prop('checked', true);

			html.style.removeProperty("--dark-body");
			html.style.removeProperty("--dark-theme");
			localStorage.removeItem("slicabgColor");
			localStorage.removeItem("slicathemeColor");

			localStorage.setItem('slicadarkMode', true);
			localStorage.removeItem('slicalightMode', false);
			
		} 
	});
	/***************** Dark THEME End*********************/

	/***************** VERTICAL-MENU Start*********************/
	$(document).on("click", '#myonoffswitch34', function () {
		if (this.checked) {
			$('body').removeClass('horizontal');
			$('body').removeClass('horizontal-hover');
			$(".main-content").removeClass("horizontal-content");
			$(".main-content").addClass("app-content");
			$(".main-container").removeClass("container");
			$(".main-container").addClass("container-fluid");
			$(".app-header").removeClass("hor-header");
			$(".app-sidebar").removeClass("horizontal-main");
			$(".main-sidemenu").removeClass("container");
			$(".upgrade-section").removeClass("container");
			$('#slide-left').removeClass('d-none');
			$('#slide-right').removeClass('d-none');
			$('body').addClass('sidebar-mini');
			$('body').removeClass('default-logo');
			$('body').removeClass('center-logo');

			$('#myonoffswitch13').prop('checked', true);

			localStorage.setItem("slicavertical", true);
			localStorage.removeItem("slicahorizontal");
			localStorage.removeItem("slicahorizontalHover");
			localStorage.removeItem("slicadefaultlogo");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			if (document.querySelector('body').classList.contains('horizontal')&& !(document.querySelector('body').classList.contains('login-img'))) {
				checkHoriMenu();
				menuClick();
				responsive();
			}
		} 
	});
	/***************** VERTICAL-MENU End*********************/

	/***************** HORIZONTAL-CLICK-MENU Start*********************/
	$(document).on("click", '#myonoffswitch35', function () {
		if (this.checked) {
			if (window.innerWidth >= 992) {
				let li = document.querySelectorAll('.side-menu li')
				li.forEach((e, i) => {
					e.classList.remove('is-expanded')
				})
				var animationSpeed = 300;
				// first level
				var parent = $("[data-bs-toggle='sub-slide']").parents('ul');
				var ul = parent.find('ul[class^="slide-menu"]:visible').slideUp(animationSpeed);
				ul.removeClass('open');
				var parent1 = $("[data-bs-toggle='sub-slide2']").parents('ul');
				var ul1 = parent1.find('ul[class^="sub-slide-menu"]:visible').slideUp(animationSpeed);
				ul1.removeClass('open');
			}
			$('body').addClass('horizontal');
			$(".main-content").addClass("horizontal-content");
			$(".main-content").removeClass("app-content");
			$(".main-container").addClass("container");
			$(".main-container").removeClass("container-fluid");
			$(".app-header").addClass("hor-header");
			$(".app-sidebar").addClass("horizontal-main");
			$(".main-sidemenu").addClass("container");
			$(".upgrade-section").addClass("container");
			$('body').removeClass('sidebar-mini');
			$('body').removeClass('sidenav-toggled');
			$('body').removeClass('horizontal-hover');
			$('body').removeClass('closed-menu');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('sideicon-menu');
			$('.slide-menu').removeClass('double-menu-active');
			$('#switchbtn-defaultlogo').prop('checked', true);

			localStorage.setItem("slicahorizontal", true);
			localStorage.removeItem("slicahorizontalHover");
			localStorage.removeItem("slicavertical");
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			// $('#slide-left').removeClass('d-none');
			// $('#slide-right').removeClass('d-none');
			if (document.querySelector('body').classList.contains('horizontal') && !(document.querySelector('body').classList.contains('login-img'))) {
				checkHoriMenu();
				ActiveSubmenu();
				menuClick();
				responsive();
				document.querySelector('.horizontal .side-menu').style.flexWrap = 'noWrap'
			}
		}
	});
	/***************** HORIZONTAL-CLICK-MENU End*********************/

	/***************** HORIZONTAL-HOVER-MENU Start*********************/
	$(document).on("click", '#myonoffswitch111', function () {
		if (this.checked) {
			let li = document.querySelectorAll('.side-menu li')
			li.forEach((e, i) => {
				e.classList.remove('is-expanded')
			})
			var animationSpeed = 300;
			// first level
			var parent = $("[data-bs-toggle='sub-slide']").parents('ul');
			var ul = parent.find('ul[class^="slide-menu"]:visible').slideUp(animationSpeed);
			ul.removeClass('open');
			var parent1 = $("[data-bs-toggle='sub-slide2']").parents('ul');
			var ul1 = parent1.find('ul[class^="sub-slide-menu"]:visible').slideUp(animationSpeed);
			ul1.removeClass('open');
			$('body').addClass('horizontal-hover');
			$('body').addClass('horizontal');
			// let subNavSub = document.querySelectorAll('.sub-slide-menu');
			// subNavSub.forEach((e) => {
			// 	e.style.display = '';
			// })
			// let subNav = document.querySelectorAll('.slide-menu')
			// subNav.forEach((e) => {
			// 	e.style.display = '';
			// })
			
			$(".main-content").addClass("horizontal-content");
			$(".main-content").removeClass("app-content");
			$(".main-container").addClass("container");
			$(".main-container").removeClass("container-fluid");
			$(".app-header").addClass("hor-header");
			$(".app-sidebar").addClass("horizontal-main");
			$(".main-sidemenu").addClass("container");
			$(".upgrade-section").addClass("container");
			$('body').removeClass('sidebar-mini');
			$('body').removeClass('sidenav-toggled');
			$('body').removeClass('closed-menu');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('sideicon-menu');
			$('.slide-menu').removeClass('double-menu-active');

			$('#switchbtn-defaultlogo').prop('checked', true);

			localStorage.setItem("slicahorizontalHover", true);
			localStorage.removeItem("slicahorizontal");
			localStorage.removeItem("slicavertical");
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			HorizontalHovermenu();
			if (document.querySelector('body').classList.contains('horizontal')&& !(document.querySelector('body').classList.contains('login-img'))) {
				checkHoriMenu();
				responsive();
				document.querySelector('.horizontal .side-menu').style.flexWrap = 'nowrap'
			}
		}
	});
	/***************** HORIZONTAL-HOVER-MENU End*********************/

	/***************** DEFAULT-MENU Start*********************/
	$(document).on("click", '#myonoffswitch13', function () {
		if (this.checked) {
			$('body').addClass('default-menu');
			hovermenu();
			$('body').removeClass('closed-menu');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('sideicon-menu');
			$('body').removeClass('sidenav-toggled');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicadefaultmenu", true);
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicadefaultlogo");
		}
	});
	/***************** DEFAULT-MENU End*********************/

	/***************** CLOSED-MENU Start*********************/
	$(document).on("click", '#myonoffswitch30', function () {
		if (this.checked) {
			$('body').addClass('closed-menu');
			hovermenu();
			$('body').addClass('sidenav-toggled');
			$('body').removeClass('default-menu');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('sideicon-menu');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicaclosedmenu", true);
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicadefaultlogo");
		}
	});
	/***************** CLOSED-MENU End*********************/

	/***************** ICON-TEXT-MENU Start*********************/
	$(document).on("click", '#myonoffswitch14', function () {
		if (this.checked) {
			$('body').addClass('icontext-menu');
			icontext();
			$('body').addClass('sidenav-toggled');
			$('body').removeClass('default-menu');
			$('body').removeClass('sideicon-menu');
			$('body').removeClass('closed-menu');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicaicontextmenu", true);
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicadefaultlogo");

		}
	});
	/***************** ICON-TEXT-MENU End*********************/

	/***************** ICON-OVERLAY-MENU Start*********************/
	$(document).on("click", '#myonoffswitch15', function () {
		if (this.checked) {
			$('body').addClass('sideicon-menu');
			hovermenu();
			$('body').addClass('sidenav-toggled');
			$('body').removeClass('default-menu');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('closed-menu');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicasideiconmenu", true);
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicadefaultlogo");
		}
	});
	/***************** ICON-OVERLAY-MENU End*********************/

	/***************** HOVER-SUBMENU-MENU Start*********************/
	$(document).on("click", '#myonoffswitch32', function () {
		if (this.checked) {
			$('body').addClass('hover-submenu');
			hovermenu();
			$('body').addClass('sidenav-toggled');
			$('body').removeClass('default-menu');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('sideicon-menu');
			$('body').removeClass('closed-menu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicahoversubmenu", true);
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicadefaultlogo");
		}
	});
	/***************** HOVER-SUBMENU-MENU End*********************/

	/***************** HOVER-SUBMENU-MENU-1 Start*********************/
	$(document).on("click", '#myonoffswitch33', function () {
		if (this.checked) {
			$('body').addClass('hover-submenu1');
			hovermenu();
			$('body').addClass('sidenav-toggled');
			$('body').removeClass('default-menu');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('sideicon-menu');
			$('body').removeClass('closed-menu');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('double-menu');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicahoversubmenu1", true);
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicadoublemenutabs");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicadefaultlogo");
		}
	});
	/***************** HOVER-SUBMENU-MENU-1 End*********************/

	/***************** DOUBLE-MENU Start*********************/
	$(document).on("click", '#switchbtn-doublemenu', function () {
		if (this.checked) {
			$('body').addClass('double-menu');
			doubleLayoutFn();
			$('body').removeClass('default-menu');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('sideicon-menu');
			$('body').removeClass('closed-menu');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu-tabs');
			$('body').removeClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicadoublemenu", true);
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenutabs");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicadefaultlogo");
		}
	});
	/***************** DOUBLE-MENU End*********************/

	/***************** DOUBLE-MENU-TABS Start*********************/
	$(document).on("click", '#switchbtn-doublemenutabs', function () {
		if (this.checked) {
			$('body').addClass('double-menu-tabs');
			doubleLayoutFn();
			$('body').removeClass('default-menu');
			$('body').removeClass('icontext-menu');
			$('body').removeClass('sideicon-menu');
			$('body').removeClass('closed-menu');
			$('body').removeClass('hover-submenu');
			$('body').removeClass('hover-submenu1');
			$('body').removeClass('double-menu');
			$('body').removeClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicadoublemenutabs", true);
			localStorage.removeItem("slicadefaultmenu");
			localStorage.removeItem("slicaclosedmenu");
			localStorage.removeItem("slicaicontextmenu");
			localStorage.removeItem("slicasideiconmenu");
			localStorage.removeItem("slicahoversubmenu");
			localStorage.removeItem("slicahoversubmenu1");
			localStorage.removeItem("slicadoublemenu");
			localStorage.removeItem("slicacenterlogo");
			localStorage.removeItem("slicadefaultlogo");
		}
	});
	/***************** DOUBLE-MENU-TABS End*********************/

	/***************** Default Logo Start*********************/
	$(document).on("click", '#switchbtn-defaultlogo', function () {
		if (this.checked) {
			$('body').addClass('default-logo');
			$('body').removeClass('center-logo');
			localStorage.setItem("slicadefaultlogo", true);
			localStorage.removeItem("slicacenterlogo");
		}
	});
	/***************** Default Logo End*********************/

	/***************** Center Logo Start*********************/
	$(document).on("click", '#switchbtn-centerlogo', function () {
		if (this.checked) {
			$('body').addClass('center-logo');
			$('body').removeClass('default-logo');
			localStorage.setItem("slicacenterlogo", true);
			localStorage.removeItem("slicadefaultlogo");
		}
	});
	/***************** Center Logo End*********************/

	/***************** LAYOUT-STYLE Start*********************/
	$(document).on("click", '#myonoffswitch9', function () {
		if (this.checked) {
			$('body').addClass('layout-fullwidth');
			$('body').removeClass('layout-boxed');
			localStorage.setItem("slicafullwidth", true);
			localStorage.removeItem("slicaboxedwidth");
		}
	});

	$(document).on("click", '#myonoffswitch10', function () {
		if (this.checked) {
			$('body').addClass('layout-boxed');
			$('body').removeClass('layout-fullwidth');
			localStorage.setItem("slicaboxedwidth", true);
			localStorage.removeItem("slicafullwidth");
		}
	});
	/***************** LAYOUT-STYLE End*********************/

	/***************** LAYOUT-POSITIONS Start*********************/
	$(document).on("click", '#myonoffswitch11', function () {
		if (this.checked) {
			$('body').addClass('fixed-layout');
			$('body').removeClass('scrollable-layout');
			localStorage.setItem("slicafixed", true);
			localStorage.removeItem("slicascrollable");
		}
	});

	$(document).on("click", '#myonoffswitch12', function () {
		if (this.checked) {
			$('body').addClass('scrollable-layout');
			$('body').removeClass('fixed-layout');
			localStorage.setItem("slicascrollable", true);
			localStorage.removeItem("slicafixed");
		}
	});
	/***************** LAYOUT-POSITIONS End*********************/

	/***************** MENU-STYLES Start*********************/
	$(document).on("click", '#myonoffswitch3', function () {
		if (this.checked) {
			$('body').addClass('light-menu');
			$('body').removeClass('color-menu');
			$('body').removeClass('dark-menu');
			localStorage.setItem("slicalightmenu", true);
			localStorage.removeItem("slicacolormenu");
			localStorage.removeItem("slicadarkmenu");
		}
	});
	
	$(document).on("click", '#myonoffswitch4', function () {
		if (this.checked) {
			$('body').addClass('color-menu');
			$('body').removeClass('light-menu');
			$('body').removeClass('dark-menu');
			localStorage.setItem("slicacolormenu", true);
			localStorage.removeItem("slicalightmenu");
			localStorage.removeItem("slicadarkmenu");
		}
	});
	
	$(document).on("click", '#myonoffswitch5', function () {
		if (this.checked) {
			$('body').addClass('dark-menu');
			$('body').removeClass('color-menu');
			$('body').removeClass('light-menu');
			localStorage.setItem("slicadarkmenu", true);
			localStorage.removeItem("slicalightmenu");
			localStorage.removeItem("slicacolormenu");
		}
	});
	/***************** MENU-STYLES End*********************/

	/***************** HEADER-STYLES Start*********************/
	$(document).on("click", '#myonoffswitch6', function () {
		if (this.checked) {
			$('body').addClass('light-header');
			$('body').removeClass('color-header');
			$('body').removeClass('dark-header');
			localStorage.setItem("slicalightheader", true);
			localStorage.removeItem("slicacolorheader");
			localStorage.removeItem("slicadarkheader");
		} 
	});

	$(document).on("click", '#myonoffswitch7', function () {
		if (this.checked) {
			$('body').addClass('color-header');
			$('body').removeClass('light-header');
			$('body').removeClass('dark-header');
			localStorage.setItem("slicacolorheader", true);
			localStorage.removeItem("slicalightheader");
			localStorage.removeItem("slicadarkheader");
		}
	});

	$(document).on("click", '#myonoffswitch8', function () {
		if (this.checked) {
			$('body').addClass('dark-header');
			$('body').removeClass('color-header');
			$('body').removeClass('light-header');
			localStorage.setItem("slicadarkheader", true);
			localStorage.removeItem("slicalightheader");
			localStorage.removeItem("slicacolorheader");
		}
	});
	/***************** HEADER-STYLES End*********************/


	/***************** Add Switcher Classes *********************/
	//LTR & RTL
	if (!localStorage.getItem('slicartl') && !localStorage.getItem('slicaltr')) {

		/***************** RTL *********************/
		// $('body').addClass('rtl');
		/***************** RTL *********************/
		/***************** LTR *********************/
		// $('body').addClass('ltr');
		/***************** LTR *********************/

	}
	//Light-mode & Dark-mode
	if (!localStorage.getItem('slicalight') && !localStorage.getItem('slicadark')) {
		/***************** Light THEME *********************/
		// $('body').addClass('light-mode');
		/***************** Light THEME *********************/

		/***************** DARK THEME *********************/
		// $('body').addClass('dark-mode');
		/***************** Dark THEME *********************/
	}

	//Vertical-menu & Horizontal-menu
	if (!localStorage.getItem('slicavertical') && !localStorage.getItem('slicahorizontal') && !localStorage.getItem('slicahorizontalHover')) {
		/***************** Horizontal THEME *********************/
		// $('body').addClass('horizontal');
		/***************** Horizontal THEME *********************/

		/***************** Horizontal-Hover THEME *********************/
		// $('body').addClass('horizontal-hover');
		/***************** Horizontal-Hover THEME *********************/
	}

	//Vertical Layout Style
	if (!localStorage.getItem('slicadefaultmenu') && !localStorage.getItem('slicaclosedmenu') && !localStorage.getItem('slicaicontextmenu')&& !localStorage.getItem('slicasideiconmenu')&& !localStorage.getItem('slicahoversubmenu')&& !localStorage.getItem('slicahoversubmenu1')&& !localStorage.getItem('slicadoublemenu')&& !localStorage.getItem('slicadoublemenutabs')) {
		/**Default-Menu**/
		// $('body').addClass('default-menu');
		/**Default-Menu**/

		/**closed-Menu**/
		// $('body').addClass('closed-menu');
		/**closed-Menu**/

		/**Icon-Text-Menu**/
		// $('body').addClass('icontext-menu');
		/**Icon-Text-Menu**/

		/**Icon-Overlay-Menu**/
		// $('body').addClass('sideicon-menu');
		/**Icon-Overlay-Menu**/

		/**Hover-Sub-Menu**/
		// $('body').addClass('hover-submenu');
		/**Hover-Sub-Menu**/

		/**Hover-Sub-Menu1**/
		// $('body').addClass('hover-submenu1');
		/**Hover-Sub-Menu1**/

		/**Double-Menu**/
		// $('body').addClass('double-menu');
		/**Double-Menu**/

		/**Double-Menu-Tabs**/
		// $('body').addClass('double-menu-tabs');
		/**Double-Menu-Tabs**/
	}

	//Horizontal Logo Style
	if (!localStorage.getItem('slicadefaultlogo') && !localStorage.getItem('slicacenterlogo')) {
		/**Default-Logo**/
		// $('body').addClass('default-logo');
		/**Default-Logo**/

		/**Center-Logo**/
		// $('body').addClass('center-logo');
		/**Center-Logo**/

	}

	//Boxed Layout Style
	if (!localStorage.getItem('slicafullwidth') && !localStorage.getItem('slicaboxedwidth')) {
	// $('body').addClass('layout-boxed');
	}

	//Scrollable-Layout Style
	if (!localStorage.getItem('slicafixed') && !localStorage.getItem('slicascrollable')) {
	// $('body').addClass('scrollable-layout');
	}

	//Menu Styles
	if (!localStorage.getItem('slicalightmenu') && !localStorage.getItem('slicacolormenu') && !localStorage.getItem('slicadarkmenu')) {
		/**Light-menu**/
		// $('body').addClass('light-menu');
		/**Light-menu**/

		/**Color-menu**/
		// $('body').addClass('color-menu');
		/**Color-menu**/

		/**Dark-menu**/
		// $('body').addClass('dark-menu');
		/**Dark-menu**/
	}
	//Header Styles
	if (!localStorage.getItem('slicalightheader') && !localStorage.getItem('slicacolorheader') && !localStorage.getItem('slicadarkheader')) {
		/**Light-Header**/
		// $('body').addClass('light-header');
		/**Light-Header**/

		/**Color-Header**/
		// $('body').addClass('color-header');
		/**Color-Header**/

		/**Dark-Header**/
		// $('body').addClass('dark-header');
		/**Dark-Header**/

	}
	/***************** Add Switcher Classes *********************/

}
switcherEvents();


(function () {
	"use strict";
	/***************** RTL has Class *********************/
	let bodyRtl = $('body').hasClass('rtl');
	if (bodyRtl) {
		$('body').addClass('rtl');
		$('body').removeClass('ltr');
		$("html[lang=en]").attr("dir", "rtl");
		$(".select2-container").attr("dir", "rtl");
		$("head link#style").attr("href", $(this));
		(document.getElementById("style")?.setAttribute("href", "../assets/plugins/bootstrap/css/bootstrap.rtl.min.css"));

		var carousel = $('.owl-carousel');
		$.each(carousel, function (index, element) {
			// element == this
			var carouselData = $(element).data('owl.carousel');
			carouselData.settings.rtl = true; //don't know if both are necessary
			carouselData.options.rtl = true;
			$(element).trigger('refresh.owl.carousel');
		});
		if (document.querySelector('body').classList.contains('horizontal')&& !(document.querySelector('body').classList.contains('login-img'))) {
			checkHoriMenu();
		}

	}
	/***************** RTL has Class *********************/

	/***************** Horizontal has Class *********************/
	let bodyhorizontal = $('body').hasClass('horizontal');
	if (bodyhorizontal) {
		if (window.innerWidth >= 992) {
			let li = document.querySelectorAll('.side-menu li')
			li.forEach((e, i) => {
				e.classList.remove('is-expanded')
			})
			var animationSpeed = 300;
			// first level
			var parent = $("[data-bs-toggle='sub-slide']").parents('ul');
			var ul = parent.find('ul[class^="slide-menu"]:visible').slideUp(animationSpeed);
			ul.removeClass('open');
			var parent1 = $("[data-bs-toggle='sub-slide2']").parents('ul');
			var ul1 = parent1.find('ul[class^="sub-slide-menu"]:visible').slideUp(animationSpeed);
			ul1.removeClass('open');
		}
		$('body').addClass('horizontal');
		$(".main-content").addClass("horizontal-content");
		$(".main-content").removeClass("app-content");
		$(".main-container").addClass("container");
		$(".main-container").removeClass("container-fluid");
		$(".app-header").addClass("hor-header");
		$(".app-sidebar").addClass("horizontal-main");
		$(".main-sidemenu").addClass("container");
		$(".upgrade-section").addClass("container");
		$('body').removeClass('sidebar-mini');
		$('body').removeClass('sidenav-toggled');
		$('body').removeClass('horizontal-hover');
		$('body').removeClass('closed-menu');
		$('body').removeClass('hover-submenu');
		$('body').removeClass('hover-submenu1');
		$('body').removeClass('double-menu');
		$('body').removeClass('double-menu-tabs');
		$('body').removeClass('icontext-menu');
		$('body').removeClass('sideicon-menu');
		$('.slide-menu').removeClass('double-menu-active');
		// $('#slide-left').removeClass('d-none');
		// $('#slide-right').removeClass('d-none');
		if (document.querySelector('body').classList.contains('horizontal') && !(document.querySelector('body').classList.contains('login-img'))) {
			checkHoriMenu();
			ActiveSubmenu();
			menuClick();
			responsive();
			document.querySelector('.horizontal .side-menu').style.flexWrap = 'noWrap'
		}
	}
	/***************** Horizontal has Class *********************/

	/***************** Horizontal Hover has Class *********************/
	let bodyhorizontalhover = $('body').hasClass('horizontal-hover');
	if (bodyhorizontalhover) {
		let li = document.querySelectorAll('.side-menu li')
		li.forEach((e, i) => {
			e.classList.remove('is-expanded')
		})
		var animationSpeed = 300;
		// first level
		var parent = $("[data-bs-toggle='sub-slide']").parents('ul');
		var ul = parent.find('ul[class^="slide-menu"]:visible').slideUp(animationSpeed);
		ul.removeClass('open');
		var parent1 = $("[data-bs-toggle='sub-slide2']").parents('ul');
		var ul1 = parent1.find('ul[class^="sub-slide-menu"]:visible').slideUp(animationSpeed);
		ul1.removeClass('open');
		$('body').addClass('horizontal-hover');
		$('body').addClass('horizontal');
		let subNavSub = document.querySelectorAll('.sub-slide-menu');
		subNavSub.forEach((e) => {
			e.style.display = '';
		})
		let subNav = document.querySelectorAll('.slide-menu')
		subNav.forEach((e) => {
			e.style.display = '';
		})
		// $('#slide-left').addClass('d-none');
		// $('#slide-right').addClass('d-none');
		$(".main-content").addClass("horizontal-content");
		$(".main-content").removeClass("app-content");
		$(".main-container").addClass("container");
		$(".main-container").removeClass("container-fluid");
		$(".app-header").addClass("hor-header");
		$(".app-sidebar").addClass("horizontal-main");
		$(".main-sidemenu").addClass("container");
		$(".upgrade-section").addClass("container");
		$('body').removeClass('sidebar-mini');
		$('body').removeClass('sidenav-toggled');
		$('body').removeClass('closed-menu');
		$('body').removeClass('hover-submenu');
		$('body').removeClass('hover-submenu1');
		$('body').removeClass('double-menu');
		$('body').removeClass('double-menu-tabs');
		$('body').removeClass('icontext-menu');
		$('body').removeClass('sideicon-menu');
		$('.slide-menu').removeClass('double-menu-active');
		HorizontalHovermenu();
		if (document.querySelector('body').classList.contains('horizontal')&& !(document.querySelector('body').classList.contains('login-img'))) {
			checkHoriMenu();
			responsive();
			document.querySelector('.horizontal .side-menu').style.flexWrap = 'nowrap'
		}
	}
	/***************** Horizontal Hover has Class *********************/

	/***************** CLOSEDMENU has Class *********************/
	let bodyclosed = $('body').hasClass('closed-menu');
	if (bodyclosed) {
		$('body').addClass('closed-menu');
		if (!(document.querySelector('body').classList.contains('login-img'))) {
			hovermenu();
		}
		$('body').addClass('sidenav-toggled');
	}
	/***************** CLOSEDMENU has Class *********************/

	/***************** ICONTEXT MENU has Class *********************/
	let bodyicontext = $('body').hasClass('icontext-menu');
	if (bodyicontext) {
		$('body').addClass('icontext-menu');
		if (!(document.querySelector('body').classList.contains('login-img'))) {
			icontext();
		}
		$('body').addClass('sidenav-toggled');
	}
	/***************** ICONTEXT MENU has Class *********************/

	/***************** ICONOVERLAY MENU has Class *********************/
	let bodyiconoverlay = $('body').hasClass('sideicon-menu');
	if (bodyiconoverlay) {
		$('body').addClass('sideicon-menu');
		if (!(document.querySelector('body').classList.contains('login-img'))) {
			hovermenu();
		}
		$('body').addClass('sidenav-toggled');
	}
	/***************** ICONOVERLAY MENU has Class *********************/

	/***************** HOVER-SUBMENU has Class *********************/
	let bodyhover = $('body').hasClass('hover-submenu');
	if (bodyhover) {
		$('body').addClass('hover-submenu');
		if (!(document.querySelector('body').classList.contains('login-img'))) {
			hovermenu();
		}
		$('body').addClass('sidenav-toggled');
	}
	/***************** HOVER-SUBMENU has Class *********************/

	/***************** HOVER-SUBMENU has Class *********************/
	let bodyhover1 = $('body').hasClass('hover-submenu1');
	if (bodyhover1) {
		$('body').addClass('hover-submenu1');
		if (!(document.querySelector('body').classList.contains('login-img'))) {
			hovermenu();
		}
		$('body').addClass('sidenav-toggled');
	}
	/***************** HOVER-SUBMENU has Class *********************/

	/***************** Double-Menu has Class *********************/
	let bodydoublemenu = $('body').hasClass('double-menu');
	if (bodydoublemenu) {
		$('body').addClass('double-menu');
		if (!(document.querySelector('body').classList.contains('login-img'))) {
			doublemenu();
		}
	}
	/***************** Double-Menu has Class *********************/

	/***************** Double-Menu-Tabs has Class *********************/
	let bodydoublemenutabs = $('body').hasClass('double-menu-tabs');
	if (bodydoublemenutabs) {
		$('body').addClass('double-menu-tabs');
		if (!(document.querySelector('body').classList.contains('login-img'))) {
			doublemenu();
		}
	}
	/***************** Double-Menu-Tabs has Class *********************/

	checkOptions();
})()

function checkOptions() {
	'use strict'

	// horizontal
	if (document.querySelector('body').classList.contains('horizontal')) {
		$('#myonoffswitch35').prop('checked', true);
	}

	// horizontal-hover
	if (document.querySelector('body').classList.contains('horizontal-hover')) {
		$('#myonoffswitch111').prop('checked', true);
	}

	//RTL 
	if (document.querySelector('body').classList.contains('rtl')) {
		$('#myonoffswitch55').prop('checked', true);
	}

	// light header 
	if (document.querySelector('body').classList.contains('light-header')) {
		$('#myonoffswitch6').prop('checked', true);
	}
	// color header 
	if (document.querySelector('body').classList.contains('color-header')) {
		$('#myonoffswitch7').prop('checked', true);
	}
	// dark header 
	if (document.querySelector('body').classList.contains('dark-header')) {
		$('#myonoffswitch8').prop('checked', true);
	}

	// light menu
	if (document.querySelector('body').classList.contains('light-menu')) {
		$('#myonoffswitch3').prop('checked', true);
	}
	// color menu
	if (document.querySelector('body').classList.contains('color-menu')) {
		$('#myonoffswitch4').prop('checked', true);
	}
	// dark menu
	if (document.querySelector('body').classList.contains('dark-menu')) {
		$('#myonoffswitch5').prop('checked', true);
	}
	// Boxed style
	if (document.querySelector('body').classList.contains('layout-boxed')) {
		$('#myonoffswitch10').prop('checked', true);
	}
	// scrollable-layout style
	if (document.querySelector('body').classList.contains('scrollable-layout')) {
		$('#myonoffswitch12').prop('checked', true);
	}
	// closed-menu style
	if (document.querySelector('body').classList.contains('closed-menu')) {
		$('#myonoffswitch30').prop('checked', true);
	}
	// icontext-menu style
	if (document.querySelector('body').classList.contains('icontext-menu')) {
		$('#myonoffswitch14').prop('checked', true);
	}
	// iconoverlay-menu style
	if (document.querySelector('body').classList.contains('sideicon-menu')) {
		$('#myonoffswitch15').prop('checked', true);
	}
	// hover-submenu style
	if (document.querySelector('body').classList.contains('hover-submenu')) {
		$('#myonoffswitch32').prop('checked', true);
	}
	// hover-submenu1 style
	if (document.querySelector('body').classList.contains('hover-submenu1')) {
		$('#myonoffswitch33').prop('checked', true);
	}
	// double-menu style
	if (document.querySelector('body').classList.contains('double-menu')) {
		$('#switchbtn-doublemenu').prop('checked', true);
	}
	// double-menu-tabs style
	if (document.querySelector('body').classList.contains('double-menu-tabs')) {
		$('#switchbtn-doublemenutabs').prop('checked', true);
	}
	// default-logo style
	if (document.querySelector('body').classList.contains('default-logo')) {
		$('#switchbtn-defaultlogo').prop('checked', true);
	}
	// center-logo style
	if (document.querySelector('body').classList.contains('center-logo')) {
		$('#switchbtn-centerlogo').prop('checked', true);
	}
}
checkOptions()

function resetData() {
	'use strict'
	$('#myonoffswitch54').prop('checked', true);
	$('#myonoffswitch1').prop('checked', true);
	$('#myonoffswitch34').prop('checked', true);
	$('#myonoffswitch3').prop('checked', true);
	$('#myonoffswitch6').prop('checked', true);
	$('#myonoffswitch9').prop('checked', true);
	$('#myonoffswitch11').prop('checked', true);
	$('#myonoffswitch13').prop('checked', true);
	$('body')?.addClass('light-mode');
	$('body')?.removeClass('dark-mode');
	$('body')?.removeClass('dark-menu');
	$('body')?.removeClass('light-menu');
	$('body')?.removeClass('color-menu');
	$('body')?.removeClass('dark-header');
	$('body')?.removeClass('light-header');
	$('body')?.removeClass('color-header');
	$('body')?.removeClass('layout-boxed');
	$('body')?.removeClass('icontext-menu');
	$('body')?.removeClass('sideicon-menu');
	$('body')?.removeClass('closed-menu');
	$('body')?.removeClass('hover-submenu');
	$('body')?.removeClass('hover-submenu1');
	$('body')?.removeClass('double-menu');
	$('body')?.removeClass('double-menu-tabs');
	$('.slide-menu')?.removeClass('double-menu-active');
	$('body')?.removeClass('scrollable-layout');
	$('body')?.removeClass('sidenav-toggled');
	$('body')?.removeClass('scrollable-layout');
	$('body')?.removeClass('default-logo');
	$('body')?.removeClass('center-logo');


	$('body').removeClass('horizontal');
	$('body').removeClass('horizontal-hover');
	$(".main-content").removeClass("horizontal-content");
	$(".main-content").addClass("app-content");
	$(".main-container").removeClass("container");
	$(".main-container").addClass("container-fluid");
	$(".app-header").removeClass("hor-header");
	$(".app-sidebar").removeClass("horizontal-main");
	$(".main-sidemenu").removeClass("container");
	$(".upgrade-section").removeClass("container");
	$('#slide-left').removeClass('d-none');
	$('#slide-right').removeClass('d-none');
	$('body').addClass('sidebar-mini');
	$('body').removeClass('default-logo');
	$('body').removeClass('center-logo');
	if (document.querySelector('body').classList.contains('horizontal') && !(document.querySelector('body').classList.contains('login-img')) ) {
		checkHoriMenu();
		menuClick();
		responsive();
	}

	$('body').addClass('ltr');
	$('body').removeClass('rtl');
	$("html[lang=en]").attr("dir", "ltr");
	$(".select2-container").attr("dir", "ltr");
	// localStorage.setItem("slicaltr", true);
	// localStorage.removeItem("slicartl");
	$("head link#style").attr("href", $(this));
	(document.getElementById("style")?.setAttribute("href", "../assets/plugins/bootstrap/css/bootstrap.min.css"));
	var carousel = $('.owl-carousel');
	$.each(carousel, function (index, element) {
		// element == this
		var carouselData = $(element).data('owl.carousel');
		carouselData.settings.rtl = false; //don't know if both are necessary
		carouselData.options.rtl = false;
		$(element).trigger('refresh.owl.carousel');
	});
	if (document.querySelector('body').classList.contains('horizontal')&& !(document.querySelector('body').classList.contains('login-img'))) {
		checkHoriMenu();
	}
}