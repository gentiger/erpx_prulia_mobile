window.webpage = {
	init: function() {
		//alert("go");
		webpage.start();
		common.handle_external_links();

	},
	start: function(version) {
		webpage.setup_assets();
//		debugger;
//		var url =  localStorage.server + "/api/method/frappe.www.webpage.get_webpage_assets";
//		if(version && version === "v6") {
//			url = localStorage.server + "/api/method/frappe.templates.pages.webpage.get_webpage_assets";
//		}
//
//		$.ajax({
//			method: "GET",
//			url: url,
//			data: {
//				build_version: localStorage._build_version || "000"
//			}
//		}).success(function(data) {
//			// webpage startup
//			window._version_number = data.message.build_version;
//			window.app = true;
//			if(!window.frappe) { window.frappe = {}; }
//			window.frappe.list_webpagetop = cordova.platformId==="ios";
//			window.frappe.boot = data.message.boot;
//			window.dev_server = data.message.boot.developer_mode;
//
//			if(cordova.platformId === "ios") {
//				document.addEventListener("deviceready", function() {
//					StatusBar.backgroundColorByHexString("#f5f7fa");
//				});
//			}
//
//			if(localStorage._build_version != data.message.build_version) {
//				localStorage._build_version = data.message.build_version;
//				common.write_file("assets.txt", JSON.stringify(data.message.assets));
//				webpage.webpage_assets = data.message.assets;
//			}
//
//			if(!webpage.webpage_assets) {
//				common.read_file("assets.txt", function (assets) {
//					webpage.webpage_assets = JSON.parse(assets);
//					webpage.setup_assets();
//				});
//			}
//			else {
//				webpage.setup_assets();
//			}
//
//		}).error(function(e) {
//			if(e.status === 500) {
//				webpage.start("v6");
//			}
//			else {
//				webpage.logout();
//			}
//		});
	},
	setup_assets: function() {
		
//		$("body").on("click", "a", function(e) {
//			href = $(this).attr("href");
//			if(href && href.substr(0, 1)!=="#") {
//				cordova.InAppBrowser.open(common.get_full_url(href), '_blank',
//					'location=yes');
//				e.preventDefault();
//				e.stopPropagation();
//				return false;
//			}
//		});
		$.ajax(localStorage.server+"/me").success(function(data) {
			debugger;
			$(".offcanvas-main-section").html(data);
			$(".splash").remove();
		}).error(function(e) {
			webpage.logout();
		});
//		$.when( $.getScript(localStorage.server+"/me"), 
//				$.ajax({url: localStorage.server+"/website_script.js", dataType: 'text'}),
////				$.getScript(localStorage.server+"/assets/js/erpnext-web.min.js"),
//				$.ajax({url: localStorage.server+"/assets/css/frappe-web.css", dataType: 'text'}),
////				$.ajax({url: localStorage.server+"/assets/erpnext/css/website.css", dataType: 'text'}),
//				$.ajax({url: localStorage.server+"/website_theme.css", dataType: 'text'})).then(function( a1, a2, c1, c2 ) {
//					debugger;
//			  // Each argument is an array with the following structure: [ data, statusText, jqXHR ]
//			  common.load_script(a1[0]);
//			  common.load_script(a2[0]);
//
//			  common.load_style(c1[0]);
//			  common.load_style(c2[0]);		  
//			  
//			  $.when( $.getScript(localStorage.server+"/assets/js/frappe-web.min.js"), 
//					  $.ajax({url: localStorage.server+"/website_script.js", dataType: 'text'})).then(function(a1,c1){
//						  common.load_script(a1[0]);
//						  common.load_style(c1[0]);
//						  
//						  // render the webpage
//						  common.base_url = localStorage.server;
//						  frappe.render_user();
//							
//						  $(document).trigger("page-change");
//						  $(".splash").remove();
//					  })
//			  
//				
//		}, function(e1,e2,e3,e4,e5,e6){
//			debugger;
//		});
		
		
		
		// override logout
//        frappe.app.redirect_to_login = function() {
//			delete localStorage.session_id;
//        	window.location.href = "login.html";
//		}
	},
	load_script: function(url){
		$.ajax({
			  url: localStorage.server+url,
			  dataType: "script",
			  success: function( data, textStatus, jqxhr ) {
				  common.load_script(data)
			}
		});
	},
	logout: function() {
		delete localStorage.session_id;
		window.location.href = "login.html"
	}
}

$(document).ready(function() { webpage.init() });