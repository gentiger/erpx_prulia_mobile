var app = {
	server_add:"http://167.88.124.17",
//	server_add:"http://107.191.116.237", 

    init: function() {  
    	if(!localStorage.getItem("server")){
    		app.verify_server(app.server_add, app.select, app.retry_server);
    	}
        if(localStorage.getItem("server")) {
            app.setup_login();
        } else {
			app.show_server();
        }
		
    },
    bind_events: function() {
		app.bind_login();
		app.bind_signup();
		app.bind_forgotpass();
    },
	bind_login: function() {
		$(".btn-login").on("click", function() {

			$me = $(this);
			$me.prop("disabled", true);
			$.ajax({
				method: "POST",
				url: localStorage.server + "/api/method/login",
				data: {
					usr: $("#usr").val(),
					pwd: $("#pwd").val(),
					device: "mobile"
				}
			}).success(function(data, status, xhr) {
				localStorage.user = $("#usr").val();
				var cookie_source = xhr.getResponseHeader('Set-Cookie');
				localStorage.session_id = common.get_cookie("sid", cookie_source);
				localStorage.home_page = data.home_page
				app.start_homepage();
				
			}).error(function() {
				common.msgprint("Invalid Login");
				$me.prop("disabled", false);
			}).always(function() {
				// $("#usr").val("");
				// $("#pwd").val("");
			});
			return false;
		});
	},
	bind_select_server: function() {
        $(".btn-select-server").on("click", function() {
            // check if erpnext / frappe server

            $(this).prop("disabled", true);

            var server = $("#server").val();
            if(!server) {
                app.retry_server();
                return false;
            }


            if(server.substr(0, 7)!== "http://" && server.substr(0, 8)!== "https://") {
                // http / https not provided
                // try https
                app.verify_server("https://" + server, app.select,
                    function() {
                        // try http
                        app.verify_server("http://" + server, app.select, app.retry_server);
                    }
                );
            } else {
                app.verify_server(server, app.select, app.retry_server);
            }

            return false;
        });
		$(".recent-server-list").on("click", "a", function() {
			$this = $(this);
			$this.prop("disabled", true);
			app.verify_server($this.text(), app.select, app.retry_server);
		});
	},
	select: function(server){
		localStorage.server = app.strip_trailing_slash(server);
		app.save_server_in_recent(localStorage.server);
		app.setup_login();
	},
    verify_server: function(server, valid, invalid) {
        $.ajax({
    			method: "GET",
    			url: server + "/api/method/version",
    		})
            .success(function(data) {
                if(data.message) {
                    valid(server);
                } else {
                    invalid();
                };
            })
            .fail(function() { invalid() })
            .error(function() { invalid() });
    },
	bind_change_server: function() {
		$(".change-server").on("click", function() {
			localStorage.server = "";
			app.show_server(true);
			return false;
		});
	},
	bind_signup: function() {
		$(".signup").on("click", function() {
			var ref = cordova.InAppBrowser.open(localStorage.getItem("server") + "/member-registration", '_blank',
					'location=no');
			ref.addEventListener('loadstop', function(event) {        
			    if (event.url.match("registration-complete")) {
			        ref.close();
			    }
			});
			return false;
		});
	},
	bind_forgotpass: function() {
		$(".forgotpass").on("click", function() {
			app.show_forgot_pass(true);
			return false;
		});
		$(".btn-reset-password").on("click", function() {
			if(!$("#reset_email").val()) {
				common.msgprint("Valid Login id required.");
				return false;
			}
			
			
			$me = $(this);
			$me.prop("disabled", true);
			$.ajax({
				method: "GET",
				url: localStorage.server + "/api/method/frappe.core.doctype.user.user.reset_password",
				data: {
					user: $("#reset_email").val()
				}
			}).success(function(data, status, xhr) {
				if(data.message==='not found') {
					common.msgprint("Not a valid user");
				} else {
					common.msgprint(data.message);
				} 				
			}).error(function(error) {
				common.msgprint(error.responseText);
				$me.prop("disabled", false);
			}).always(function() {
				 $("#reset_email").val("");
			});
			return false;
		});
		$(".btn-reset-password-cancel").on("click", function() {
			app.show_login();
			return false;
		});
	},

    strip_trailing_slash: function(server) {
        return server.replace(/(http[s]?:\/\/[^\/]*)(.*)/, "$1");
    },
	save_server_in_recent: function(server) {
		server = server.toLowerCase().trim();

		var recent_servers = localStorage.recent_servers ?
			JSON.parse(localStorage.recent_servers) : [];

		var index = recent_servers.indexOf(server);
		if(index !== -1) {
			recent_servers.splice(index, 1);
		}
		recent_servers.push(server);

		localStorage.setItem("recent_servers", JSON.stringify(recent_servers));
	},
    setup_login: function(oEvtData) {
    	if(oEvtData){
    		this.oEvtData = oEvtData;
    	} else {
    		this.oEvtData = null;
    	}
		if(localStorage.server && localStorage.session_id) {
			app.if_session_valid(app.start_homepage, app.show_login);
		} else {
			app.show_login();
		}
    },
	show_login: function() {
		$(".app").removeClass("hide");
        $(".div-resetpassword").addClass("hide");
        $(".div-login").removeClass("hide");
		$(".current-server").text(localStorage.server);
		app.bind_events();
		common.handle_external_links();
		if(cordova.platformId === "ios") {
			StatusBar.backgroundColorByHexString("#fffff");
		}
	},
	if_session_valid: function(if_yes, if_no) {
		app.set_sid_cookie();
		$.ajax({
			method: "GET",
			crossDomain: true,
			url: localStorage.server + "/api/method/ping",
		}).success(function(data) {
			if(data.message === "pong") {
				if_yes();
			} else {
				if_no();
			}
		}).error(function() {
			if_no();
		});
	},
	set_sid_cookie: function() {
		document.cookie = "sid=" + localStorage.session_id +
			"; expires=Fri, 31 Dec 9999 23:59:59 GMT";
	},
	start_homepage: function(){
		if(localStorage.getItem("home_page")==="/desk"){
			app.start_desk();
		} else {
			delete localStorage.session_id;
			$(".btn-login").prop("disabled", false);
			common.msgprint("Unable to start the app, please contact Administrator");
		}
	},	
	start_desk: function() {
		if(this.oEvtData && this.oEvtData.hash){
			window.location.href = "desk.html#" + this.oEvtData.hash
		} else {
			window.location.href = "desk.html"
		}
		
	},
    retry_server: function() {
        common.msgprint("Does not seem like a valid server address. Please try again.");
		app.show_server();
    },
//	show_server: function(clear) {
//		$(".app").removeClass("hide");
//        $(".btn-select-server").prop("disabled", false);
//        $(".div-select-server").removeClass("hide");
//        if(clear) {
//            $(".div-login").addClass("hide");
//        }
//		app.show_recent_servers();
//	},
    show_forgot_pass: function(clear) {
		$(".app").removeClass("hide");
		$(".btn-reset-password").prop("disabled", false);
        $(".div-resetpassword").removeClass("hide");
        if(clear) {
            $(".div-login").addClass("hide");
        }
	},
	show_recent_servers: function() {
		if(localStorage.recent_servers) {
			var recent_servers = JSON.parse(localStorage.recent_servers);
			recent_servers.reverse().splice(2);

			var html = "<li class='text-muted'>Recent:</li>"
			$.each(recent_servers, function(i, server) {
				html += '<li><a>'+server+'</a></li>';
			});
			$('.recent-server-list').empty().append(html).removeClass('hide');
		}
	}
};

document.addEventListener('deviceready', app.init, false);
