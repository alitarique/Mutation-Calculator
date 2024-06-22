var site = {};
var toolbox = {};
var lazyLoader = {};
var cron = {};
var menu = {};
ajaxurl = typeof(ajaxurl)=='undefined'?'/wp-admin/admin-ajax.php':ajaxurl;

jQuery.noConflict();

window.addEventListener('DOMContentLoaded', () => {
	new EmailLinkManagement();
})

if(typeof(console) == 'undefined'){
	var console = { log: function(){} }
}

(function menu($, $menu){
	$menu.init = function(){
		$('#mobile_menu .root-menu .menu > .page_item.page_item_has_children, #mobile_menu .root-menu .menu > .menu-item.menu-item-has-children').each(function(i,e){
				console.log('menu with child', e);
				$('<i class="fa fa-angle-down">').insertAfter($(e).find('> a'));
			})
			.on('click','.fa', function(){
				$(this).parent().toggleClass('opened');
			});
	}

	$(document).ready(function(){
		$menu.init();
	});

})(jQuery, menu);


(function cron($, $cron){
	$cron.init = function(){
		$.ajax('/wp-admin/admin-ajax.php?action=ali_cron');
	}

	$(document).ready(function(){
		setTimeout(function(){
			$cron.init();
		},100);
	});

})(jQuery, cron);

(function toolbox($, $toolbox){
	$toolbox.init = function(){
		$(window).on("hashchange",this,function(){
			$toolbox._handle_hash_change()}
		);
		if(location.hash!=''){
			$toolbox._handle_hash_change();
		}
	};

	$toolbox._handle_hash_change = function(){

		switch(location.hash){
			case "#demo":
				// launch demo mode
				break;
			case "#toolbox":
				// show info panel
				$('body').addClass('info-panel-display');

				lf_render_element = function(lElm, lParent){

					var lNewItem = $('<li>')
										.append($('<label>').html(lElm.label));
													
					if(typeof(lElm.value)!='undefined'){
						lNewItem.append($('<em>').html(lElm.value));
					}

					if(typeof(lElm.button)!='undefined'){
						lNewItem.append($('<button type="button" class="button" data-action="' + lElm.key + '">').html(lElm.button + ' <i class="fa fa-spin fa-cog">'));
					}

					if(typeof(lElm.list)!='undefined'){
						lGroupElm = $('<ul class="sub-items">');
						for(var i=0;i<lElm.list.length;i++){
							lf_render_element(lElm.list[i],lGroupElm);
						}

						lNewItem.append(lGroupElm);
						lNewItem.append($('<i class="toggle-group fa fa-angle-right"></i>'))
					}

					lParent.append(lNewItem);

				}

				$.ajax({
					url: ajaxurl + '?debug',
					action: "POST",
					data: {action:"ali_get_site_info"},
					success: function(response){
						if(typeof(response)!='undefined'){
							if(!Array.isArray(response)){
								response = JSON.parse(response.trim());
							}
							$('#ali-info-panel ul.informations').html('');
							console.log('ali_get_site_info response:',response);
							lSiteId = '';
							for(var i=0;i<response.length;i++){
								var lElm = response[i];
								if(typeof(lElm.key) == 'undefined'){
									console.log(response);
									break;
								}
								lf_render_element(lElm,$('#ali-info-panel ul.informations') );
								
								if(lElm.key=='id'){
									lSiteId = lElm.value;
								}
							}

							$('#ali-info-panel').off('click').on('click','.button', function(event){
								var lButton = this;
								$(lButton).addClass('working');
								var lfCallback = function(){
									$(lButton).removeClass('working');
								};

								switch($(lButton).data('action')){
									case 'clear-cache':
										$toolbox._clear_cache_data(lfCallback);
										break;
									case 'clear-photo-cache':
										$toolbox._clear_photo_cache_data(lfCallback);
										break;
									case 'adv-management':
										window.open('/setup/#manage?id=' + lSiteId);
										break;
									case 'listing_data_update':
										$toolbox._update_listings(lfCallback);
										break;
									case 'blog_data_update':
										$toolbox._update_blog(lfCallback);
										break;
								}
								
							})
							.on('click','li .toggle-group,li label', function(event){
								$(this).parents('li').toggleClass('open');
							});

							
							var lToolButtons = [];
							lToolButtons.push( $('<button class="button" data-action="clear-cache" type="button">').html('Clear Cache <i class="fa fa-spin fa-cog"></i>') );	
							lToolButtons.push( $('<button class="button" data-action="clear-photo-cache" type="button">').html('Clear Photo Cache <i class="fa fa-spin fa-cog"></i>') );
							lToolButtons.push( $('<button class="button" data-action="adv-management" type="button">').html('Manage...') );

							$('#ali-info-panel .tools').html('');
							$('#ali-info-panel .tools').append(lToolButtons);
						}


					}
				});
				break;
		}
	};

	$toolbox._clear_cache_data = function(callback){
		$.ajax({
			url: ajaxurl,
			action: "POST",
			data: {action:"ali_clear_cache", debug:'1'},
			success: function(response){
				alert('Cache data cleared! Congrats');
				callback();
			}
		});
	};

	$toolbox._clear_photo_cache_data = function(callback){
		$.ajax({
			url: ajaxurl,
			action: "POST",
			data: {action:"ali_clear_photo_cache", debug:'1'},
			success: function(response){
				alert('Photo cache data cleared! Congrats');
				callback();
			}
		});
	};

	$toolbox._update_listings = function(callback){
		//listings_update
		$.ajax({
			url: ajaxurl,
			action: "POST",
			data: {action:"listings_update", debug:'1'},
			success: function(response){
				alert('Listing update process called! This should be done very soon');
				callback();
			}
		});
	};

	$toolbox._update_blog = function(callback){
		//listings_update
		$.ajax({
			url: ajaxurl,
			action: "POST",
			data: {action:"blog_articles_update", debug:'1'},
			success: function(response){
				alert('Blog article update process called! This should be done very soon');
				callback();
			}
		});
	};
	
	$(document).ready(function(){
		$toolbox.init();
	});
	

})(jQuery, toolbox);

/* text scaler */
var text_scaler = {};
(function text_scaler($,$scaler){
	$scaler.list = null;
	$scaler.init = function(){
		// bail out if it's a damn bot
		if(navigator.userAgent.indexOf('bot')>=0){
			return false;
		}

		$(window).on('resize', $scaler.onResize);
		setTimeout(function(){
			$scaler.onResize();
		},100);
	};

	$scaler.onResize = function(){
		
		$scaler.list = $('.scale-text');
		
		$scaler.list.each(function(i,e){
			$element = $(e);
			if($element.parents('.print-only').length>0){
				return;
			}

			if($element.hasClass('heading')){
				$element = $element.find('span').eq(0);
			}

			$scaler.scaleElement($element);
		});
	}

	$scaler.scaleElement = function($e){
		var lFontSize = $e.css('font-size').replace('px','');
		var lIncrements = 0;
		console.log('scale element', $e);
		while($scaler.getTextWidth($e) > $e.innerWidth()){
			lIncrements++;
			$e.css({
				'font-size': lFontSize - lIncrements,
				'padding-top': lIncrements/2,
				'padding-bottom': lIncrements/2
			});
		}

		// var lProcessed = $scaler.calculateScale($e);
		// $e.css({
		// 	'font-size': lProcessed.css('font-size'),
		// 	'padding-top': lProcessed.css('padding-top'),
		//  	'padding-bottom': lProcessed.css('padding-bottom')
		// });
	}

	$scaler.calculateScale = function($elm){
		var spanText = $("BODY #spanTextWidthCanvas");
		var lFontSize = $elm.css('font-size').replace('px','');
		var lIncrements = 0;

	    if (spanText.size() <= 0) {
	      spanText = $("<span id='spanTextWidthCanvas' style='opacity:0;'></span>");
	      spanText.appendTo("BODY");
	    }

	    var value = $elm.val();
	    if (!value) value = $elm.text();

	    spanText.text(value);

	    spanText.css({
	      "fontSize": lFontSize,
	      "fontWeight": $elm.css('fontWeight'),
	      "fontFamily": $elm.css('fontFamily'),
	      "position": "absolute",
	      "top": 0,
	      "opacity": 0,
	      "width" : $elm.innerWidth(),
	      "left": -2000
	    });

	    while($scaler.getTextWidth(spanText) > $elm.innerWidth()){
			lIncrements++;
			spanText.css({
				'font-size': lFontSize - lIncrements,
				'padding-top': lIncrements/2,
				'padding-bottom': lIncrements/2
			});
		}

		return spanText;
	}

	$scaler.getTextWidth = function($elm) {
	    var spanText = $("BODY #spanCalculateTextWidth");

	    if (spanText.size() <= 0) {
	      spanText = $("<span id='spanCalculateTextWidth' style='opacity:0;'></span>");
	      spanText.appendTo("BODY");
	    }

	    var valu = $elm.val();
	    if (!valu) valu = $elm.text();

	    spanText.text(valu);

	    spanText.css({
	      "fontSize": $elm.css('fontSize'),
	      "fontWeight": $elm.css('fontWeight'),
	      "fontFamily": $elm.css('fontFamily'),
	      "position": "absolute",
	      "top": 0,
	      "opacity": 0,
	      "left": -2000
	    });

	    return spanText.outerWidth() + parseInt($elm.css('paddingLeft'));
	};

	  $scaler.getTextHeight = function(width) {
	    var spanText = $("BODY #spanCalculateTextHeight");

	    if (spanText.size() <= 0) {
	      spanText = $("<span id='spanCalculateTextHeight'></span>");
	      spanText.appendTo("BODY");
	    }

	    var valu = this.val();
	    if (!valu) valu = this.text();

	    spanText.text(valu);

	    spanText.css({
	      "fontSize": this.css('fontSize'),
	      "fontWeight": this.css('fontWeight'),
	      "fontFamily": this.css('fontFamily'),
	      "top": 0,
	      "left": -1 * parseInt(width) + 'px',
	      "position": 'absolute',
	      "display": "inline-block",
	      "width": width
	    });

	    return spanText.innerHeight() + 'px';
	  };

	$(document).ready(function(){
		$scaler.init();
	});

})(jQuery, text_scaler);

/* Firefox image-container fix 
  -- This makes container div to fit the image width
*/
if(typeof InstallTrigger !== 'undefined') {
	(function($){
		$(document).ready(function(){
			window.setTimeout(function(){
				$(".image-container img").each(function(i,e){
					$(e).parent().width($(e).width());
				});
			},1000)
		});
	})(jQuery);
}

/* lazy loader */
(function lazy_loader($,$loader){
	$loader.scrollCheckHnd = null;
	$loader.list = null;

	$loader.init = function(){
		// bail out if it's a damn bot
		if(navigator.userAgent.indexOf('bot')>=0){
			return false;
		}

		if($('.lazy-load').length>0){
			$(window).scroll($loader.onScrollHandler);
			add_action('lazy-load',$loader.onScrollHandler);
			$loader.onScrollHandler();
			$loader.startBackgroundProcess();
		}
		
	};

	$loader.startBackgroundProcess = function(){
		setTimeout(function(){
			if ($('.lazy-load').length <= 30){
				$loader.processBatch($('.lazy-load').length);
			}
			else if($(window).width() <= 640){
				$loader.processBatch();
			}
		},100);
	}

	$loader.processBatch = function($batch_length){
		console.log('background batch processing of', $batch_length);

		$loader.list = $('.lazy-load');
		$batch_length = $batch_length || 30;

		$loader.list.slice(0,$batch_length).each(function(i,e){
			$loader.loadImage(e);
			
		});

		if($loader.list.length>$batch_length){
			window.setTimeout($loader.processBatch, 250);
		}
	}


	$loader.onScrollHandler = function(){
		
		$loader.list = $('.lazy-load');

		if($loader.scrollCheckHnd==null){
			$loader.scrollCheckHnd = window.setTimeout(function(){
				
				console.log('process lazy-load on', $loader.list.length, 'items');

				$loader.list.each(function(i,e){
					
						if($loader.inViewPort(e)){
							$loader.loadImage(e);
							
						}

					
				});

				$loader.scrollCheckHnd = null;
			},100);
		}
		
		if($loader.list.length==0){
			//$(window).off('scroll');
		}
	}

	$loader.loadImage = function(el, fn) {
		var img = new Image() 
			,src = $(el).attr('data-src');

		if($(el).parents('article').hasClass('fullrow')){
			src = $(el).attr('data-full-src');
		}
		
	    img.onload = function() {
	        el.src = src;
	        $(el).removeClass('lazy-load');
	        $(el).addClass('loaded');
	      	fn? fn() : null;
	    }

		img.src = src;

	}

	$loader.inViewPort = function(el){
		var rect = el.getBoundingClientRect();
	    return (
		       rect.top    >= -500
		    && rect.left   >= 0
		    && rect.top <= ((window.innerHeight || document.documentElement.clientHeight) + 500)
	    )
	}


	$(document).ready(function(){
		$loader.init();
	});

})(jQuery, lazyLoader);

/*
fromTemplate
*/
(function fromTemplate($) {
$.fromTemplate = function (selector) {
		var lElm = $(selector);
        var lTemplateContent;
        var lResult = null;
        if((lElm.get(0) != null) && (typeof(lElm.get(0).content)!="undefined")){
        	lTemplateContent = lElm.get(0).content.firstElementChild;
        	lResult = $(lTemplateContent).clone();
        }
        else{
        	lResult = lElm.clone().children().eq(0);
        }

        return lResult;
    } //function
})(jQuery);

(function siteClass($){
    $site = {
		_resize_menu_timeout: null,
		_theme_path : '',
		_paralax_timer: null,
		_is_demo: false,
		use_paralax: true,
		ui : {}
	}

	

	$site.send_sms= function(message,callback, token, ip){
		//token = (typeof(token)=="undefined")?$('body').data('sms-token'):token;
		ip = (typeof(ip)=="undefined")?$('meta[name="viewport"]').data('ip'):ip;
		var lData = {action:'ali_send_sms', 'message': message, 'requestorIP': ip}
		if(typeof(token)!="undefined"){
			lData['token'] = token;
		}

		//if((token != null) && (typeof(token!="undefined")) && (typeof(token!="")) ){
			$.ajax({
				url: ajaxurl,
				method: 'POST',
				data: lData,
				success: function(result){
					if(typeof(callback)!="function"){
						switch(result[0].Status){
							case 200:
								console.log('successfully sent!');
								break;
							default:
								console.log(result.StatusText);
						}
					}	
					else{
						callback(result[0]);
					}
				},
				error: function(){
					
				}
			});
		//}
	};

	$site.send_sms_form = function(form){
		if(site.ui.validateForm(form)){
			var lMessage = $(form).find('textarea[name=sms-message]').val();
			lMessage += ' - ' + $(form).find('input[name=sms-phone]').val();

			$(form).find('.form-item').each(function(i,e){
				var lInput = $(e).find('input');
				if((lInput.length > 0) && (lInput.attr('name') != 'sms-phone')){
					lMessage += ' - ' + $(e).find('label').text() + ': ' + lInput.val();
				}
			});

			site.send_sms(lMessage, function(){
				$(form).toggleClass('completed');
				if (typeof(_gaq)!="undefined") _gaq.push(['_trackEvent', 'Aliquando – Outils', "Demande d'information"]);
			})
		}
	};

	$site.load = function(theme_path){
		$site._theme_path = theme_path;
		$site.ui.load();

		$(".sms-form .sms-send-btn").click(function(){
			var lForm = $(this).parents('.sms-form');
			$site.send_sms_form(lForm);
		});

		if((typeof(instanceExists) == 'function') && instanceExists("ali.webcounters")){
			console.log('webcounter activated');
            ali.webcounters.add_view();
        }

        //this._update_listings();
	}

	site = $site;

})(jQuery);

(function uiClass($){
	$ui = {};

	$ui.load = function(){
		var me=this;
		if($(document).width()<641){
			$('html').addClass('k-mobile');
		}
		$(window).on('resize', me._handle_window_resize);
		me._handle_window_resize();

		// Put a flagged on the body to indicate the presence of the wp-admin bar
		if ($("#wpadminbar").length > 0) {
			$("body").addClass("is-logged-in");
		}

		// Handle navigation fixed when scrolling
		if($("#main-content").length>0){
			var lTopScrollTrigger = $("#main-content").offset().top;

			$(window).scroll(function () {
				var lScrollPos = $(document).scrollTop();
				if(lScrollPos > 0){
					$("body").addClass("scrolled");
				}
				else{
					$("body").removeClass("scrolled");
				}

				if (lScrollPos >= lTopScrollTrigger) {
					$("#header").addClass("scrolled");
				}
				else{
					$("#header").removeClass("scrolled");	
				}

				do_actions('window_scroll',lScrollPos);

				// Paralax effect
				//if(site._paralax_timer!=null){window.clearTimeout(site._paralax_timer);}
				if(false){ //(site.use_paralax){
					$("#main-content").css({
							"background-position": "0px " + (0-(lScrollPos/10)) + "px"
						});
				}
			});
		}

		
		// Handle footer "move to top" and "admin" button
		$('#page-navigation').on('click','.page-nav-item', function(e){
			console.log('page nav item clicked');

			if($(this).attr('rel') == 'top'){
				site.ui._handle_move2top_click();
			}
			else if($(this).attr('rel') == 'dashboard'){
				window.open('/wp-admin/index.php?page=acf-options');
			}
			else{
				window.open($(this).attr('rel'));
			}

			e.stopPropagation();
		});
		$("#btn-move-to-top").click(this._handle_move2top_click);
		$("#btn-open-admin").click(function(){window.open("/wp-admin/");});


		// Handle sidebar "submit" button
		$("#btn-sb-submit").click(this._handle_submit_sidebar_click);
		$("#btn-news-submit").click(this._handle_submit_sidebar_newsletter);

		// // Handle footer form
		// $('#bottom-footer .form-item').on('click', function(){
		// 	console.log('focus on form item');
		// 	$('#bottom-footer .form-item-list').addClass('focus');
		// });
		//$("#btn-send-footer-message").click(this._handle_send_message_click);

		if($('body').width() <= 640){
			//this._transform_menu_to_dropdown();
			
		}
		else{
			var lIId = window.setInterval(function(){
				var lHeight = $("#page-content").data("oldHeight");
				var lCheckCount = $("#page-content").data("checkCount")||0;

				if(lCheckCount < 20)
				if(lHeight != $("#page-content").height()){
					lHeight = $("#page-content").height();
					$("#page-content").data("oldHeight",lHeight);
					$("#page-content").data("checkCount",lCheckCount+1);
					$("#side-bar").css("min-height", lHeight);
				}
				else{
					window.clearInterval(lIId);
				}
			},100);
		}

		$('.mobile_menu_btn, #mobile_menu, .side_menu_btn').click(function(e){
			console.log('mobile_menu called');
			$('body').toggleClass('mobile_menu_visible');
		});
		$('#mobile_menu .root-menu').click(function(e){
			e.stopPropagation();
		});

		$("#share-button").click(function (e) {
			if ($(".share-panel").hasClass('displayed')) {
				$(".share-panel").removeClass('displayed');
			}
			else {
				$(".share-panel").addClass('displayed');
			}
			e.stopPropagation();
		});

		this.apply_share();

		$("#print-button").click(function (e) {
			var lDoPrint = apply_filters('ali_do_print', false);
			if(!lDoPrint){
				window.print();
				e.stopPropagation();
			}
		});


		// transform .phone into clickable phones
		var userAgent = window.navigator.userAgent.toLowerCase();
		if(userAgent.indexOf('mobile')>=0){
			console.log('mobile-detected');
			$('div.phone:visible,span.phone:visible,label.phone:visible').each(function(i,e){
				var lPhone = $(e).text();
				$(e).html('<a href="tel:' + lPhone.replace(new RegExp(' |-','gi'),'') + '">' + lPhone + '</a>');
				
			});
		}


		if($('#page_gallery').length>0){
			me._init_slider();
		}
		console.log('working panels');

		$('.panel.has-transition').each(function(i,e){
			console.log($(e).data('delay'));
			if($(e).data('delay') != undefined){
				window.setTimeout(function(){
					$(e).removeClass('has-transition');
				}, 500 + (Number($(e).data('delay')*1000)));
			}
			else{
				window.setTimeout(function(){
					$(e).removeClass('has-transition');
				}, 500);
			}
		});
		//$(".v-center-photo").each(function(i,e){$(e).css("margin-top",-($(e).height()-$(e).offsetParent().height())/2)});

		// set value to stats box with "data-source"
		if($('.ali-stats-box[data-source*="page_"]').length>0){
			ali.webcounters.get_site_resume(function(data){
				var track_item_id = apply_filters('ali_get_counter_track_item_id',null);
				var lCounter = null;
				if(track_item_id==null){
					lCounter = data.GeneralCounter;
				}
				else{
					for(var i=0;i<data.Counters.length;i++){
						if(data.Counters[i].track_item_id==track_item_id){
							lCounter = data.Counters[i];
						}
					}
				}

				$('.ali-stats-box[data-source*="page_"]').each(function(i,e){
					var lSource = $(e).data('source').replace('page_','');
					var lValue = lCounter[lSource];
					console.log(lSource, lValue);
					$(e).find('.value-box').html(lValue);
				});
			});	
		}
	};

	$ui.ajust_menu_width = function(){
		if($(window).width()<=640){
			return 0;
		}
		
		var lMaxWidth = $("#header .menu_container").width();
		var lMenuWidth = 0;
		var lMenuOffsetMove = 0;
		$("#header .root-menu > li").each(function(i,e){
			lMenuWidth += $(e).outerWidth();
			if(lMaxWidth < lMenuWidth){
				lMenuOffsetMove -= $(e).outerWidth();
				$(e).addClass('extended-item');
			}
			else{
				$(e).removeClass('extended-item');
			}
		});
		var lNavBgColor = $("#header").css('background-color');
		var lNavFgColor = $("#header a").css('color');

		console.log('ajust_menu_width:', lMenuWidth , '>', lMaxWidth);

		if(lMenuWidth > lMaxWidth){
			$("#header").addClass("too-long max-left");
			$("#header i").css({'background-color': lNavBgColor, 'color': lNavFgColor}).click(function(e){
				var lOffsetMove = 0;
				if($(this).hasClass('right')){
					lOffsetMove = lMenuOffsetMove;
					$("#header").removeClass('max-left').addClass('max-right');
				}
				else{
					$("#header").removeClass('max-right').addClass('max-left');	
				}

				$("#header .root-menu").css('margin-left', lOffsetMove);

				e.stopPropagation();
			});

			$('#header .nav').css('width', 'calc(((100% - ' + lMaxWidth + 'px) / 2) + 40px)');
			$('#header .nav.left').css('right', 'calc((50% + ' + (lMaxWidth/2) + 'px) - 40px)');
			$('#header .nav.right').css('left', 'calc((50% + ' + (lMaxWidth/2) + 'px) - 40px)');
		}
		else{
			$("#header").removeClass('too-long');
		}
	}

	$ui._get_menu_width = function(){
		var lResult = 0;
		$("#header .root-menu > li").each(function(i,e){
			lResult += $(e).outerWidth();
		});

		return lResult;
	};

	$ui.apply_share = function() {
		$(".share-panel .panel-controls .button").click(function () {
			$(".share-panel").removeClass('displayed');
		});

		var fncShare = function (element) {
			var lFinalUrl = $(element).attr('href');
			var lWndWidth = $(element).attr('wnd-width') || 600;
			var lWndHeight = $(element).attr('wnd-height') || 450;
			var lWndOptions = 'top=50, left=' + ((Math.round($(window).width() / 2)) - lWndWidth) + ', width=' + lWndWidth + ', height=' + lWndHeight + ';';

			if (lFinalUrl.indexOf('[title]')) {
				lFinalUrl = lFinalUrl.replace('[title]', encodeURI($('head title').html()));
			}

			if (lFinalUrl.indexOf('[url]')) {
				lFinalUrl = lFinalUrl.replace('[url]', encodeURI(window.location));
			}
			if (lFinalUrl.indexOf('[url-timed]')) {
				var lTime = new Date();
				lFinalUrl = lFinalUrl.replace('[url-timed]', encodeURI(window.location + '?t=' + lTime.getTime()));
			}

			if (lFinalUrl.indexOf('[keywords]')) {
				var lHashtags = '';
				if ($('head meta[name="keywords"]').length > 0) {
					lHashtags = encodeURI(" #" + $('head meta[name="keywords"]').attr('content').replace(/, /g, ' #'));
				}
				console.log(lHashtags);
				lFinalUrl = lFinalUrl.replace('[keywords]', lHashtags);
			}

			if (lFinalUrl.indexOf('[media]')) {
				var lMedia = $(element).attr('media');

				lFinalUrl = lFinalUrl.replace('[media]', lMedia);
			}

			console.log(lWndOptions);
			if (lFinalUrl.indexOf('mailto') >= 0) {
				var lWnd = window.open(lFinalUrl, 'share_window', lWndOptions);
				window.setTimeout(function () {
					lWnd.close();
				}, 1000);

			}
			else {
				window.open(lFinalUrl, 'share_window', lWndOptions);
			}
		}

		$(".share-panel ul li").each(function (index, element) {
			$(element).click(function () {
				if ($(element).attr('href')) {
					console.log('href detected', $(element).attr('href'));
					fncShare(element);
					$('.rel-data').hide('blind');
				}
				else if ($(element).attr('rel')) {
					console.log('rel detected:', $(element).attr('rel-src'));
					
					var lList = $('<ul>');
					$($(element).attr('rel-src')).each(function (i, e) {
						var lItem = $('<li>')
								.append($(e).clone())
								.attr('media', $(e).attr('src'))
								.attr('wnd-width', $(element).attr('wnd-width'))
								.attr('wnd-height', $(element).attr('wnd-height'))
								.attr('href', $(element).attr('rel'))
								.click(function () {
									fncShare(this);
								});
						lList.append(lItem);
					});

					if(lList.find('li').length>0){
						$('.rel-data').html('').append(lList);
					}
					
					$('.rel-data').show('blind');
				}
			});
		});
	};

	$ui.popup= function($options){
		$options = $.extend({
						content:'',
						closeFn: null,
						type:'text',
					}, $options);
		

		if($('body #ui-popup').length==0){
			var lPopupTemplate = $('<div id="ui-popup" class="ali-ui ali-popup"><div class="ali-wnd"><div class="ali-window-title heading h1"><span></span></div><i class="ali-close-button fa fa-times"></i><div class="ali-wnd-content"><div class="content"></div></div></div></div>');
			if($options.no_close_button){
				lPopupTemplate.addClass('no-close-button');
			}
			$('body').append(lPopupTemplate);
		}

		$popup_wnd = $('body #ui-popup');
		switch($options.type){
			case 'text':
				$popup_wnd.find('.content').html($options.content);
				break;
			case 'url':
				$popup_wnd.find('.content').html('<iframe frameborder="0" src="' + $options.content + '"></iframe>');
				break;
		}

		if($options.title){
			$popup_wnd.find('.ali-window-title span').html($options.title);
		}

		$('body #ui-popup').on('click','.ali-close-button', function(){
			$('body #ui-popup').remove();
			if(typeof($options.closeFn) == 'function'){
				$options.closeFn();
			}
		});
	};

	$ui.scrollTo = function(element){
		if(typeof element == "string"){
			if(element.indexOf('.')<0 && element.indexOf('#')<0){
				element = '.' + element;
			}
		}
		
		$('html, body').animate({
			scrollTop: $(element).offset().top
		}, 500);
	};

	$ui._init_slider = function(options){
		const lHeight = $('#page_gallery').data('gallery-height');
		var lAutoHeight = apply_filters('ali_page_gallery_auto_height', $('#page_gallery').data('gallery-auto-height'));
		

		var lView = $("#page_gallery").data('gallery-view');
		console.log('gallery AutoHeight',lAutoHeight);
		console.log('gallery default Height',lHeight);

		var lOptions = $.extend({
			width:apply_filters('ali_page_gallery_width',1150),    // slider standard width
			height:apply_filters('ali_page_gallery_height',lHeight == null ? 500 : lHeight),   // slider standard height
			space:10,
			layout:$('#page_gallery').data('gallery-style'),
			loop:true,
			preload:0,
			view:(typeof(lView)!='undefined')?lView:'mask',
			instantStartLayers:true,
			autoplay:true,
			autoHeight: (typeof(lHeight)!='undefined')?lAutoHeight:true,
			
		}, options);

		if($(window).width() < 640){
			lOptions.width = $(window).width();    // slider standard width
			lOptions.height = 450;   // slider standard height
			lOptions.layout = 'fullwidth';
			lOptions.view='mask';
			lOptions.filters = null;
		}

		var slider = new MasterSlider();
		slider.control('arrows' , {insertTo:'#page_gallery'});
		slider.control('timebar' , {insertTo:'#page_gallery'});
		slider.control('bullets' , {insertTo:'#page_gallery'});

		slider.setup('page_gallery', lOptions);
		
		

		return slider;
	};

	$ui._transform_menu_to_dropdown = function(){
		$("#header .menu_container ul").hide();
		var lMobileMenu = $('<select id="page_selector">').change(function(){
			window.location = $(this).val();
		});

		var lFirstOption = $('<option value="" disabled selected>');
		if($('body').hasClass('lang-fr')){
			lFirstOption.html('Sélectionnez une page');
		}
		else{
			lFirstOption.html('Select a page');
		}
		lMobileMenu.append(lFirstOption);

		$("#header .menu_container ul>li").each(function(i,e){
			var lLink = $(e).find("a");
			var lLabel = lLink.html();
			var lPrefix = '';
			if($(e).parents("li").length>0){
				for(var i=0;i<$(e).parents("li").length;i++){
					lPrefix += '+ ' + lPrefix;
				}
				lPrefix = lPrefix + '';
			}
			var lOption = $('<option>').attr("value", lLink.attr("href")).html(lPrefix + lLabel);
			lMobileMenu.append(lOption);
		});

		//lMobileMenu.val(window.location.href);

		var lNavLabel = $('<div class="menu-label">').html("Navigation :");
		$("#header .menu_container").prepend(lMobileMenu);
		//$("#header .menu_container").prepend(lNavLabel);
	};

	$ui._handle_move2top_click= function(){
		$('html, body').animate({
			scrollTop: 0
		}, 500);
	};

	$ui._handle_send_message_click= function(){
		var lDestEmail = $("#foot-destemail").val().replace(/\[a\]/gi,"@");
		var lCcEmail = $("#foot-ccemail").val().replace(/\[a\]/gi,"@");
		console.log('cc mail', lCcEmail);
		
		//TODO: DEVMODE
		//lDestEmail = "marc-andre@id-3.net";

		// validate data

		if(site.ui.validateForm($("#footer_contact_form"))){
			
			// sms are allowed, send sms notification
			if($("#footer_contact_form").hasClass('sms-allowed')){
				var lSmsMessage = $("#foot-name").val() + ': ' + $("#foot-message").val() + ' - email: ' + $("#foot-email").val();
				site.send_sms(lSmsMessage);
			}

			$.ajax({
				url: site._theme_path + "/ajax-calls/send_message.php",
				type: "POST",
				data: { destemail: lDestEmail,
					uname: $("#foot-name").val(),
					uemail: $("#foot-email").val(),
					umessage: $("#foot-message").val(),
					cc_email: lCcEmail
				},
				success: function () {
					console.log("sent successfully");
					$("#footer_contact_form .form-content").hide();
					$("#footer_contact_form .form-success").show();

					if(instanceExists("ali.webcounters")){
					ali.webcounters.add_form_process('footer_contact');
					if (typeof(_gaq)!="undefined") _gaq.push(['_trackEvent', 'Aliquando – Outils', "Demande d'information"]);
					}

					// register in Kalemo
					kamelo.addMember($("#foot-email").val(), $("#foot-name").val(), null);
				},
				error: function () { console.log("failed!!!"); }
			});
		}
	};

	$ui._handle_submit_sidebar_click= function(){
		var lDestEmail = $("#sb-destemail").val().replace(/\[a\]/gi,"@");
		var lCcEmail = $("#sb-ccemail").val().replace(/\[a\]/gi,"@");
		
		//lDestEmail = "marc-andre@id-3.net";

		// validate data
		if(site.ui.validateForm($("#sidebar_contact_form"))){
			console.log(site._theme_path);
			
			// register in Kalemo
			kamelo.addMember($("#sb-email").val(), $("#sb-name").val(), null);

			// sms are allowed, send sms notification
			if($("#sidebar_contact_form").hasClass('sms-allowed')){
				var lSmsMessage = $("#sb-name").val() + ': ' + $("#sb-message").val() + ' - tel: ' + $("#sb-phone").val() + ' - email: ' + $("#sb-email").val();
				site.send_sms(lSmsMessage);
			}

			$.ajax({
				url: site._theme_path + "/ajax-calls/send_message.php",
				type: "POST",
				data: { destemail: lDestEmail,
					uname: $("#sb-name").val(),
					uemail: $("#sb-email").val(),
					uphone: $("#sb-phone").val(),
					umessage: $("#sb-message").val(),
					cc_email: lCcEmail
				},
				success: function () {
					console.log("sent successfully");
					$("#sidebar_contact_form .form-content").hide();
					$("#sidebar_contact_form .form-success").show();

					if(instanceExists("ali.webcounters")){
						ali.webcounters.add_form_process('sidebar_contact');
						if (typeof(_gaq)!="undefined") _gaq.push(['_trackEvent', 'Aliquando – Outils', "Demande d'information"]);
					}
				},
				error: function () { console.log("failed!!!"); }
			});
		}
	};

	$ui._handle_submit_sidebar_newsletter = function(){
		var lDestEmail = $("#news-destemail").val().replace(/\[a\]/gi,"@");
		var lCcEmail = $("#news-ccemail").val().replace(/\[a\]/gi,"@");
		
		//lDestEmail = "marc-andre@id-3.net";

		// validate data
		if(site.ui.validateForm($("#sidebar_newsletter_form"))){				
			// register in Kalemo
			$("#sidebar_newsletter_form .form-content").hide();
			kamelo.addMember($("#news-email").val(), null, null,'Aliquando - Infolettre').then(function() {
				$("#sidebar_newsletter_form .form-success").show();
			});
		}
	};


	$ui._handle_window_resize= function(){
		var hWind = window;
		var lImageHeight = $('#top_header .background-image').height();

		if($('#top_header .background-image').hasClass('force_mobile_resize')){
			if($(hWind).width() < 972){
				var lImageHeight = $('#top_header .background-image').height() * ($(hWind).width().toString() / 972);
				if($('#top_header .background-image').data('min-height')==null){
					$('#top_header .background-image').data('min-height', lImageHeight);
				}

				var lMinHeight = $('#top_header .background-image').data('min-height');
				$('#top_header .background-image').attr('style','height: ' + lImageHeight + 'px !important;min-height:' + lMinHeight + 'px;');
				$('#top_header').attr('style','height: ' + lImageHeight + 'px !important;min-height:' + lMinHeight + 'px;');
				
			}
			else{
				$('#top_header').height(lImageHeight);
			}
		}
		$('#top_header').height(lImageHeight);

		if(site._resize_menu_timeout != null) window.clearTimeout(site._resize_menu_timeout);
		
		site._resize_menu_timeout = window.setTimeout(function(){
			site.ui.ajust_menu_width();	
		}, 200);

		
	};

	$ui._highlight_field_error = function(field){
		$(field).css("backgroundColor","#FF9900")
		$(field).animate({backgroundColor:'#fff'}, 250);
	};

	$ui.validateForm = function(formElm){
		var lForm = $(formElm);
		var lResult = true;
		//console.log('formElm',formElm);

		// validate required
		lForm.find("input.validate-required:visible, textarea.validate-required:visible").each(function(i,e){
			if($.trim($(e).val()) == ''){
			lResult = false;

			$(e).addClass("validation-error");
			$(e).attr("placeholder", $(formElm).find(".error-messages .required").html());
			site.ui._highlight_field_error(e);
			}
		});

		if(lResult){
		// validate email
		var reEmail = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?");
		lForm.find("input.validate-email:visible").each(function(i,e){
			if(typeof($(e).attr("id"))!="undefined"){
			
			if(!reEmail.test($(e).val())){
				lResult = false;
				$(e).val('');
				$(e).addClass("validation-error");
				$(e).attr("placeholder", $(formElm).find(".error-messages .email").html());
			}
			}
		});
		
		// validate phone
		//var rePhone = new RegExp("(1-?)?(([2-9]\\d{2})|[2-9]\\d{2})-?[2-9]\\d{2}-?\\d{4}");
		var rePhone = new RegExp("\\d{10,}");
		lForm.find("input.validate-phone:visible").each(function(i,e){
			if(typeof($(e).attr("id"))!="undefined"){
			const lPhoneNumber = $(e).val();
			const lNormalizedNumber = lPhoneNumber.replace(/\D/g,'');

			if(!rePhone.test(lNormalizedNumber)){
				lResult = false;
				$(e).val('');
				$(e).addClass("validation-error");
				$(e).attr("placeholder", $(formElm).find(".error-messages .phone").html());
			}
			}
		});
		
		// validate postal code
		var rePostalCode = new RegExp(/^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i);
		lForm.find("input.validate-zipcode:visible").each(function(i,e){
			if (($(e).val()!= "") && (typeof($(e).attr("id"))!="undefined")){
			if (!rePostalCode.test($(e).val())){
				lResult = false;
				$(e).val('');
				$(e).addClass("validation-error");
				$(e).attr("placeholder", $(formElm).find(".error-messages .zipcode").html());
			}
			}
		});
		}
		
		return lResult;
	}

	site.ui = $ui;
})(jQuery);

/**
 * ANCHOR Sticky management
 */
(function($){
	$(document).ready(function(){
		const lStickySections = document.querySelectorAll('section.sticky');
		let lSectionTop = 0;
		let lSectionRect = {};
		const lStickySectionList = Array.from(lStickySections);

		console.log('Sticky management', lStickySectionList);

		lStickySectionList.forEach(function($section, $index){
			$section.style.setProperty('--sticky-top', lSectionTop + 'px');
			lSectionRect = $section.getBoundingClientRect();
			lSectionTop += lSectionRect.height;
		})
	})	
})(jQuery)


/* FORM MANAGER */
var AliquandoFormManager = {};
(function AliquandoFormManager($,$scope){
	
	$scope.init = function(){
		$scope.pageLoadTime = performance.now();

		$('.aliquando-form').each(function(i,e){
			$scope.applySecurity(e);
			$scope.applyResultPanel(e);
			$scope.apply_handlers(e);
		});

		$('.kamelo-form').each(function(i,e){
			$scope.apply_kamelo_handlers(e);
		});

		$scope.applyConsent();

		$(document).on("cmplz_enable_category", (consentData) => {
			//do something interesting with marketing consent
			$scope.applyConsent();
		});
		
	}

	$scope.applySecurity = function(form_elm){
		$(form_elm).append('<input name="name__hp" type="text" value="" class="ali-hp-input">');
	}

	$scope.applyConsent = function(){

		$scope.privacyConsent = true;
		const cookies = document.cookie.split(';').reduce( (c,e) => { const [key,value] = e.split('='); c[key.trim()] = value; return c},{});
		
		if(['cmplz_preferences','cmplz_marketing'].some( e => Object.keys(cookies).includes(e))){
			$scope.privacyConsent = false;
			if(cookies.cmplz_preferences === 'allow' || cookies.cmplz_marketing === 'allow'){
				$scope.privacyConsent = true;
			}
		}
		
	//	console.log('privacyConsent', $scope.privacyConsent);
		const newsletterInputList = Array.from(document.querySelectorAll('.aliquando-form .form-item #receive_newsletter'));

		newsletterInputList.forEach( e => {
			if($scope.privacyConsent == false){
				e.removeAttribute('checked');
				e.setAttribute('disabled','disabled');
			}
			else{
				e.removeAttribute('disabled');
				e.setAttribute('checked','checked');
			}
		})
		
	}

	$scope.apply_handlers = function(form_elm){
		$(form_elm)
			.on('enter', 'input, textarea, select', function(){
				$scope._handle_input_focus_in(this, form_elm);
			})
			.on('mousedown', 'input, textarea, select', function(){
				$scope._handle_input_focus_in(this, form_elm);
			})
			.on('blur', 'input, textarea, select', function(){
				$scope._handle_input_focus_out(this,form_elm);
			})
			.on('click', 'button', function(){
				$scope._handle_form_submit(form_elm);
			});
		
		form_elm.$formManager = $scope;
	}
	$scope.applyResultPanel = function(form_elm){
		const rawElm = $(form_elm)[0];
		if(rawElm.dataset.successElement){
			const resultPanel = document.body.querySelector(rawElm.dataset.successElement);
			resultPanel.classList.add('ali-hide');
		}
	}

	$scope.apply_kamelo_handlers = function(form_elm){
		console.log('apply_kamelo_handlers',form_elm);
		$(form_elm)
			.on('click', 'input[type=submit]', function($event){
				$event.stopPropagation();
				$event.preventDefault();

				let lGroupName = 'Aliquando - Infolettre';
				const lEmail = $(form_elm).find('.kamelo-user-email input').val();
				let lName  = $(form_elm).find('.kamelo-user-name input').val();
				const lFirstName  = $(form_elm).find('.kamelo-user-firstname input').val();
				const lLastName  = $(form_elm).find('.kamelo-user-lastname input').val();
				if(lName == null && (lFirstName != null && lLastName != null)){
					lName = lFirstName + ' ' + lLastName;
				}
				
				const lGroupInput = Array.from(form_elm.querySelectorAll('input[type=hidden]')).find(function($input){ return $input.value.indexOf('kamelo-group')>=0})
				
				if(lGroupInput != null){
					lGroupName = lGroupInput.value.replace('kamelo-group:','');
				}

				kamelo.addMember(lEmail, lName, null, lGroupName).then(function($result) {
					console.log($result);
				});

				form_elm.submit();
			});

		form_elm.$formManager = $scope;
	}

	$scope.send_data = function(form_elm, hide_form_on_succes){
		
		if(hide_form_on_succes == undefined) hide_form_on_succes = true;
		const fillTime								= performance.now() - $scope.pageLoadTime;
		const lDestEmail 							= window.atob($(form_elm).data('destination'));
		const lRUrl									= $(form_elm).data('rurl');
		const lEncodedCC 							= $(form_elm).data('destination-copy');
		const lReplyTo 								= $(form_elm).find('input[name=email]').val();
		const lFormSource 							= $(form_elm).find('input[name=form_source]').val();
		let lUserName 								= $(form_elm).find('input[name=name]').val();
		
		// Security

		if(fillTime < 1000) {
			console.log('Fill time too short', fillTime);
			return Promise.resolve();
		}
		if($(form_elm).find('input[name=name__hp].ali-hp-input').length>0){ if ($(form_elm).find('input[name=name__hp].ali-hp-input').val() != '') return Promise.resolve(); }

		if($(form_elm).find('input[name=name]').length>0){
			lUserName = $(form_elm).find('input[name=firstname]').val() + ' ' + $(form_elm).find('input[name=lastname]').val();
		}

		// Bail early if no email was specify
		if(typeof(lReplyTo)=='undefined' || lReplyTo == ''){	console.log('Reply to', lReplyTo);return;}

		const lData = { 
			action: 'form_send_data',
			destemail: lDestEmail,
			message_title: $(form_elm).data('message-title'),
			reply_to: lReplyTo,
			form_source_url: window.location.toString()
		};
	
		// decode cc email if any
		if((typeof(lEncodedCC) != 'undefined') && (lEncodedCC!='') ){
			lData['cc_email'] = window.atob(lEncodedCC);
		}

		$(form_elm).find('.form-item').each(
			function(i,e){
				const lType = $(e).data('item-type');
				const lFuncName = 'get_' + lType + '_data';
				if(typeof $scope[lFuncName] == 'undefined'){
					console.log(`${lFuncName} is not a function`);
				}
				$scope[lFuncName](e,lData);
			}
		);

		if(typeof(lData.destination)!='undefined'){
			if(lData.destination != '[default]'){
				lData.destemail = window.atob(lData.destination);
				lData.destination = window.atob(lData.destination);
			}
			else{
				lData.destination = lDestEmail;
			}
		}

		console.log('formData', lData);

		$(form_elm).find('input,textarea,select,button.submit').attr('disabled','disabled');
		$(form_elm).find('.form-item-list, button.submit').css({'opacity':'0.5'});
		$(form_elm).find('button.submit').append($(' <i class="fa fa-spin fa-cog"></i>'));
		
		lPromise = new Promise(function($resolve, $reject){
			$.ajax({
				url: ajaxurl + '?debug',
				type: "POST",
				data: lData,
				// call success
				success: function () {
					const rawElm = $(form_elm)[0];
					console.log("sent successfully");
					if(rawElm.dataset.successElement){
						const resultPanel = document.body.querySelector(rawElm.dataset.successElement);
						resultPanel.classList.remove('ali-hide');
					}
					else{
						$(form_elm).find('.form-results .success').show();	
					}
					$(form_elm).find('.button.submit').hide('fast');
					
					if(hide_form_on_succes){
						$(form_elm).find('.form-item-list').hide('blind');
					}
					
					$(form_elm).find('.results').show('blind');
					
					if($scope.privacyConsent){
						addGTMEvent('formSent',lData);

						// register in Kalemo
						if((['Oui/Yes','1',true].includes(lData.receive_newsletter)) && (typeof(kamelo)!='undefined')){
							console.log('register in Kamelo');
							kamelo.addMember(lReplyTo, lUserName, null, 'Aliquando - Infolettre').then(function($result) {
								if(hide_form_on_succes){
									setTimeout(function(){
										$resolve();
									}, 2000);
								}
								else{
									$resolve();
								}
							});
						}
						else{
							if(hide_form_on_succes){
								setTimeout(function(){
									$resolve();
								}, 2000);
							}
							else{
								$resolve();
							}
						}
					}
					else{
						if(hide_form_on_succes){
							setTimeout(function(){
								$resolve();
							}, 2000);
						}
						else{
							$resolve();
						}
					}
					
				},
				// call fail
				error: function (err) { 
					console.log("failed!!!", err); 
					$(form_elm).find('.results .error').show();
					$(form_elm).find('.results').show('blind',function(){
						window.setTimeout(function(){
							$(form_elm).find('.results').hide('blind',function(){
								$(form_elm).find('.results .error').hide();
							});
						}, 3000)
					});
				}
			});
		});

		return lPromise.then(
			function success(){
				if($(form_elm).find('.note_success').length > 0){
					const lNoteViewed = localStorage.getItem('ali.form.notetaken');
					if(lNoteViewed==null){
						site.ui.popup({
							'content': $(form_elm).find('.note_success').html(),
							'closeFn' : function(){
								localStorage.setItem('ali.form.notetaken',1);
								if(lRUrl != undefined && lRUrl != '' && lRUrl != window.location.href) $scope.redirect(lRUrl,0);
							}
						});
					}
					else{
						console.log(lRUrl);
						if(lRUrl != undefined && lRUrl != '' && lRUrl != window.location.href) $scope.redirect(lRUrl);
					}
				}

				if($scope.privacyConsent){
					if(typeof(lFormSource)!="undefined"){
						if (typeof(_gaq)!="undefined") _gaq.push(['_trackEvent', 'Aliquando – ' + lFormSource, "Demande d'information"]);
					}
				}

				add_action('ali_form_sent', lData);
			}
		);
	}

	$scope.redirect = function($url,$delay){
		if($url == null && $url == '') return;

		if(typeof $delay == 'undefined') $delay = 1000;

		window.setTimeout(function(){
				window.location = $url;
			},$delay);
	},

	$scope.get_text_data = function(elm, data_array){
		$input = $(elm).find('input');
		data_array[$input.attr('name')] = $input.val();
		data_array[$input.attr('name') + '_label'] = $(elm).find('label').html();
	}

	$scope.get_numeric_data = function(elm, data_array){
		$input = $(elm).find('input');
		data_array[$input.attr('name')] = $input.val();
		data_array[$input.attr('name') + '_label'] = $(elm).find('label').html();
	}

	$scope.get_textarea_data = function(elm, data_array){
		$input = $(elm).find('textarea');
			data_array[$input.attr('name')] = $input.val();
			data_array[$input.attr('name') + '_label'] = $(elm).find('label').html();
	}
	$scope.get_true_false_data = function(elm, data_array){
		$input = $(elm).find('input');
		data_array[$input.attr('name') + '_label'] = $(elm).find('label').text();
		if($input.prop('checked')){
			data_array[$input.attr('name')] = 'Oui/Yes';
		}
		else{
			data_array[$input.attr('name')] = 'Non/No';
		}   		
	}
	$scope.get_checkbox_data = function(elm, data_array){
		const labels = Array.from(elm.querySelectorAll('.checkbox-label:has(input:checked)'));
		const inputLabel = elm.querySelector('label').innerText;
		const datakey = elm.dataset.key;

		data_array[datakey + '_label'] = inputLabel || datakey;
		data_array[datakey] = labels.map( l => l.innerText ).join(',');
	}

	$scope.get_select_data = function(elm, data_array){
		$input = $(elm).find('select');
		data_array[$input.attr('name')] = $input.val();
			data_array[$input.attr('name') + '_label'] = $(elm).find('label').html();
	}

	$scope.get_hidden_data = function(elm, data_array){
		$input = $(elm).find('input');
		if($(elm).find('label').html() != ''){
				data_array[$input.attr('name')] = $input.val();
				data_array[$input.attr('name') + '_label'] = $(elm).find('label').html();
			}
	}

	$scope.validate_form = function(form_elm, apply_error_on_fields){
		if(apply_error_on_fields == undefined) apply_error_on_fields = true;
		let lErrorCount = 0;

		$(form_elm).removeClass("form-validation-success");
		$(form_elm).removeClass("form-validation-error");

		if(apply_error_on_fields){
			$(form_elm).find('.form-item.required').removeClass('error err-required err-validate');
		}

		$(form_elm).find('.form-item.required').each(function(i,e){
			const lVal = $(e).find('input').val();
			console.log($(e).attr('name') + ' is required and value is: ', lVal);

			if(lVal == ''){
				lErrorCount += 1;
				if(apply_error_on_fields){
					$(e).addClass('error err-required');
				}
			}
		});
		if(lErrorCount > 0 || $(form_elm).find('.form-item.error').length > 0){
			$(form_elm).addClass("form-validation-error");
			window.postMessage({event: 'aliFormManager/form/validated'});
			return false;
		}

		$(form_elm).find('.form-item.validate').each(function(i,e){
			var lVal = $(e).find('input').val();
			if(lVal != ''){
				console.log('validation of value by ', $(e).data('validate-type'));
				if(typeof($scope['validate_' + $(e).data('validate-type')])=='function'){
					if(!$scope['validate_' + $(e).data('validate-type')](lVal,$(e).data('validate-expression'))){
						lErrorCount++;
						if(apply_error_on_fields){
							$(e).addClass('error err-validate');
						}
					}
				}
			}
		});

		const lErrorLength = lErrorCount + $(form_elm).find('.form-item.error').length;
		if(lErrorLength == 0){
			$(form_elm).addClass("form-validation-success");
			console.log('should have added success class to', form_elm);
			window.postMessage({event: 'aliFormManager/form/validated'});
			
			return true;
		}

		$(form_elm).addClass("form-validation-error");
		console.log('should have added error class to', form_elm);
		window.postMessage({event: 'aliFormManager/form/validated'});
				
		return false;
	}

	$scope.validate_item = function(form_elm, input){
		const $FormItem = $(input).parents('.form-item');
		$FormItem.removeClass('error err-required err-validate');
		const lVal = $(input).val();

		if($FormItem.hasClass('required')){
			if(lVal == ''){
				$FormItem.addClass('error err-required');
				return false;
			}
		}

		if($FormItem.hasClass('validate')){
			if(lVal != ''){
				if(typeof($scope['validate_' + $FormItem.data('validate-type')])=='function'){
					const lValidateResult = $scope['validate_' + $FormItem.data('validate-type')](lVal,$FormItem.data('validate-expression'));
					if(!lValidateResult){
						$FormItem.addClass('error err-validate');
						return false;
					}
				}
			}
		};
		return true;
	}

	$scope.validate_phone = function(value){
		const lPatternTest = [
			function($value){ return $value.match(/^[(]{0,1}[0-9]{3}[)]{0,1}[-\s.]{0,1}[0-9]{3}[-\s.]{0,1}[0-9]{4}$/)},
			function($value){ return $value.match(/^(\()?\d{3}(\))?(.|\s)?\d{3}(.|\s)\d{4}$/)},
			function($value){ return $value.replace(/\D/g,'').match(/^(\d{10,20})/)}
		];

		const lResult = lPatternTest.some(function($e,$i){
			const lPatternTest = $e(value);
			console.log('Pattern', $i,'on',value, 'returns', lPatternTest);
			return lPatternTest != null;
		});

		console.log('phone validation for',value,'is', lResult);
		return lResult;
	}

	$scope.validate_email = function(value){
		const emailPattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		const lResult = emailPattern.test(value);
		return lResult;
	}

	$scope.validate_regexp = function(value, expression){
		const lRegEx = new RegExp(window.atob(expression),'gi');
		const lResult = lRegEx.test(value);
		
		return lResult;
	}

	$scope._handle_input_focus_in = function(input, form_elm){
		$(form_elm).find('.form-item-list').addClass('focus');
	}
	$scope._handle_input_focus_out = function(input, form_elm){
		console.log('_handle_input_focus_out');
		if($scope.validate_item(form_elm,input)){
			$scope.validate_form(form_elm, false);
		}
	}

	$scope._handle_form_submit = function(form_elm){
		if($scope.validate_form(form_elm)){
			console.log('form is ready to post');

			$scope.send_data(form_elm);
		}
		else{
			console.log('error found in form');
		}
	}

	$(document).ready(function(){
		$scope.init();
	});

})(jQuery,AliquandoFormManager);


/** Add an event to Google Tag Manager */
function addGTMEvent($event, $data){
	window.dataLayer = window.dataLayer || [];
	const lLayer = Object.assign({
		'event': $event
	}, $data);

	window.dataLayer.push(lLayer);
}

var kamelo = {};
(function($, $scope){
	$scope.localGateway = "/ajax-calls/kamelo.php";
	$scope.gateway = "https://apiv4.cyberimpact.com/";

	$scope.load = function(){
		this.userpwd = $('meta[name="kamelo"]').attr('content');
	}

	$scope.getApiAuth = function($value){
		if($value == null || typeof $value == 'undefined') return null;
		if($value == '') return null;

		const lDecodeAuth = atob($value);
		if(lDecodeAuth.indexOf('{')>=0){
			return 'Bearer ' + $value;
		}
		else{
			if(atob(btoa($value)) === $value){
				return 'Bearer ' + lDecodeAuth;
			}
			else{
				return 'Basic ' + btao($value);
			}
			
		}
	}

	/**
	 * Create a name from parameters
	 * @return Object {first : 'John' : last : 'Doe'}
	 */
	$scope.createName = function($firstName, $lastName){
			const lResult = {
					first: $firstName,
					last : $lastName
			};

			if(lResult.first == null) return '';

			if(lResult.last == null){
					const lSplitFirstName = lResult.first.split(' ');
					if(lSplitFirstName.length >=2){
							lResult.first = lSplitFirstName.splice(0,1)[0];
							lResult.last = lSplitFirstName.join(' ');
					}
			}

			return lResult;
	}

	/**
	 * Add a member into a group
	 * When the member already exists, add him directly into the group. Otherwise, an "optin" email is sent
	 */
	$scope.addMember = function($email, $firstname, $lastname, $groupName){
			if(typeof $email=='undefined' || $email == null) return Promise.reject(new Error('Empty email'));

			$groupName = (typeof $groupName == 'undefined') ? 'Aliquando' : $groupName;
			const lName = $scope.createName($firstname, $lastname);
			const lSearches = [
					$scope.getGroup($groupName),
					$scope.findMember($email)
			];

			return new Promise(function ($resolve,$reject) {    
					Promise.all(lSearches).then(function($searchResults) {
							[$group, $member] = $searchResults;

							if($group == null) {$reject(new Error('Unable to find or create group')); return;}

							if($member != null){
									$scope.addMemberToGroup($member, $group).then(function() {
											$resolve($member);
									});
							}
							else{
									const lGroupId = ($group == null) ? null : $group.id;
									
									$scope.memberOptins($email, lName.first, lName.last, lGroupId).then(function($optinResult){
											$resolve($optinResult);
									});
							}
					})
					.catch(function($err) {
							console.log($err);
					});
			});
	}
	$scope.add_member = function($email, $firstname, $lastname, $groupName){
		return $scope.addMember($email, $firstname, $lastname, $groupName);
	}

	/**
	 * Add member via Opt-in
	 */
	$scope.memberOptins = function($email, $firstName, $lastName, $groupId){
			return $scope.apiPost('members/optins', {
					email : $email,
					firstname: $firstName,
					lastname: $lastName,
					groups: $groupId
			});
	}

	/**
	 * Add a member to a certain group
	 */
	$scope.addMemberToGroup = function($member, $group){
			return $scope.apiPost('members/' + $member.id + '/groups',{groups: $group.id});
	}

	/**
	 * Find a member
	 */
	$scope.findMember = function($email){
			return new Promise(function($resolve, $reject){
					$scope.apiGet('members/' + escape($email)).then(function($member) {
							$resolve($member);
					})
					.catch(function($err){
							$reject($err);
					});
			});
	}


	/**
	 * Get an existing group or create it otherwise
	 */
	$scope.getGroup = function($title, $public){
			return new Promise(function($resolve, $reject){

					$scope.findGroup($title).then(function ($group) {
							if($group != null){
									$resolve($group);
							}
							else{
									$scope.addGroup($title, $public).then(function ($group){
											$resolve($group);
									});
							}
					});

			});
	}

	/**
	 * Add a group to the collection
	 */
	$scope.addGroup = function($title, $public){
			return new Promise(function($resolve, $reject){
					$public = typeof $public == 'undefined' ? true : $public;

					$scope.apiPost('groups', {'title': $title, 'isPublic': $public}).then(function ($response) {
							$resolve($response);
					});
			});
	}

	/**
	 * Search a group by it's title
	 */
	$scope.findGroup = function($title){
			return new Promise(function($resolve, $reject){
					$scope.getGroups().then(function($groups) {
							const lMatch = $groups.find(function ($g) {return $g.title == $title});
							$resolve(lMatch);
					});
			});
	}

	/**
	 * Get all groups
	 */
	$scope.getGroups = function($options){
			return new Promise(function($resolve, $reject){
					$scope.apiGet('groups', $options).then(function($response) {
							$resolve($response.groups);
					});
			});
	}

	$scope.apiGet = function($path, $data, $options){
			$options = Object.assign({method:'GET'},$options);
			return $scope.api($path, $data, $options)
	}
	$scope.apiPost = function($path, $data, $options){
			$options = Object.assign({method:'POST'},$options);
			return $scope.api($path, $data, $options)
	}
	$scope.apiPut = function($path, $data, $options){
			$options = Object.assign({method:'PUT'},$options);
			return $scope.api($path, $data, $options)
	}
	$scope.apiDelete =function($path, $data, $options){
			$options = Object.assign({method:'DELETE'},$options);
			return $scope.api($path, $data, $options)
	}

	$scope.api = function($path, $data, $options){
			let lPath = $scope.gateway + $path;
			
			const lAuth = $scope.getApiAuth($scope.userpwd);

			if(lAuth == null){ return Promise.reject(new Error('No auth specified')); }
			
			$options = Object.assign({
					"method" : 'POST',
					"credentials":"include",
					"headers" : {
							"content-type":"application/json"
					},
			}, $options);

			$data = {
				'context' : {
					'method'	: $options.method,
					'auth' 		: lAuth,
					'path'		: $path
				},
				'parameters' : $data
			}

			$options.method ='POST';
			$options.body 	= JSON.stringify($data);

			console.log('call kamelo proxy',site._theme_path + $scope.localGateway, 'with',$options);
			
			return new Promise( function ($resolve, $reject) {
					fetch(site._theme_path + $scope.localGateway, $options)
							.then(function($response) {
									if([200,201].includes($response.status)){
										return $response.json();
									}
									else if ($response.status==404){
										return null;
									}
									else{
										console.log('error occured', $response);
										$reject($response);
									}
							})
							.then(function ($json) {
									$resolve($json);
							})
							.catch(function($err){
									$reject($err);
							});
			});
	}

	$(document).ready(function(){
		$scope.load();
		if($.browser == null){
			$.browser = {};
		}

		if(($.browser != null) && (typeof($.browser.isMSIE)!="function")){
			$.browser.isMSIE = function() {
				var ua = window.navigator.userAgent;
				var msie = ua.indexOf("MSIE ");

				if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer, return version number
					return true;
				return false;
			}
		}
		if(($.browser != null) && (typeof($.browser.isSafari)!="function")){
			$.browser.isSafari = function() {
				if(this.safari){
					return true;
				}
				var ua = window.navigator.userAgent;
				var safari = ua.indexOf("safari ");

				if (safari > 0) return true;
				return false;
			}
		}
	});

})(jQuery, kamelo);

/* MAP MANAGEMENT */
function mapManager(map_id, options) {
	$ = jQuery;
	
	var lStyle = [{"featureType":"water","stylers":[{"visibility":"on"},{"color":"#b5cbe4"}]},{"featureType":"landscape","stylers":[{"color":"#efefef"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#83a5b0"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#bdcdd3"}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e3eed3"}]},{"featureType":"administrative","stylers":[{"visibility":"on"},{"lightness":33}]},{"featureType":"road"},{"featureType":"poi.park","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":20}]},{},{"featureType":"road","stylers":[{"lightness":20}]}];
	if((site.map_color_palette != undefined) && (site.map_color_palette != '')){
		lStyle = site.map_color_palette
	}
	
	console.log('$browser', $.browser);
	if(typeof($.browser.isSafari)=='function' && $.browser.isSafari()){
		var browserMajorVersion = $.browser.version.split('.')[0];
		if(browserMajorVersion < 534){
			$('#' + map_id).parents('.section').remove();
			$('#' + map_id).remove();
			return null;
		}
		
	}

	console.log('map_id', map_id);
	// extract options from element attributes
	const lMapElement = document.querySelector('#' + map_id);
	const lMapMarkersElement = lMapElement.querySelectorAll('.marker');

	if(lMapMarkersElement.length <= 1 && lMapElement.dataset && Object.keys(lMapElement.dataset).length > 0){
		//console.log(lMapElement.dataset);
		//options = Object.assign({}, options, lMapElement.dataset);
		
		if(options == undefined) options = {};

		if(lMapElement.dataset.zoom) options.zoom = Number(lMapElement.dataset.zoom);
		
	}

	if(options !=null){
		if(options.zoom != undefined){
			options.forcedZoom = true;
		}
	}

	//console.log(lStyle);

	var lMan = {
	    mapObj: null,
	    clusterer: null,
	    options: jQuery.extend({
	        styles: lStyle,
	        forcedZoom: false,
	        pinClickHandler: null,
	        scrollWheelZoom: false,
	        touchZoom: false,
	        zoomControl: true,
	        markerClass: 'map-marker-icon',
	        zoom: 13,
	        autoFitBound:true,
	        center: new L.LatLng(46.074513, -72.6917612),
	        useClassicMap: $('#' + map_id).data('useClassicMap')
	    }, options)
	};

	console.log('use classic map?', $('#' + map_id).data('useClassicMap'));

	(function($scope){

	    $scope.init = function(map_id){
			console.log('init map');
			$scope._mapLibraryIsReady().then( _ => {
				console.log('map library is ready');

				AliMarker.prototype = new google.maps.OverlayView();
				(function($proto){
					$proto.draw = function() {
						var me = this;
						var div = this.div_;
						

						var point = this.getProjection().fromLatLngToDivPixel(this.latlng_);
						if (point) {
						div.style.left = point.x + 'px';
						div.style.top = point.y + 'px';
						}
					};
					
					$proto.onAdd = function() {
						var me = this;
						div = this.div_ = document.createElement('DIV');
						div.style.border = "none";
						div.style.position = "absolute";
						div.style.paddingLeft = "0px";
						div.style.cursor = 'pointer';
						if(me.obj.label != undefined){
							div.style.setProperty('--label', '"' + me.obj.label + '"');
						}
						//you could/should do most of the above via styling the class added below
						
						div.classList.add(this.markerClass);
						

						google.maps.event.addDomListener(div, "click", function(event) {

							if(typeof(me.onClick)=='function'){
								me.onClick(me);
							}
							//google.maps.event.trigger(me, "click");
						});

						var panes = this.getPanes();
						panes.overlayImage.appendChild(div);
					};
					
					$proto.onRemove = function() {
						if(this.div_ != null){
							this.div_.parentNode.removeChild(this.div_);
							this.div_ = null;
						}
					};

					// Set the visibility to 'hidden' or 'visible'.
					$proto.hide = function() {
					if (this.div_) {
						// The visibility property must be a string enclosed in quotes.
						this.div_.style.visibility = 'hidden';
					}
					};

					$proto.show = function() {
					if (this.div_) {
						this.div_.style.visibility = 'visible';
					}
					};

					$proto.toggle = function() {
					if (this.div_) {
						if (this.div_.style.visibility === 'hidden') {
						this.show();
						} else {
						this.hide();
						}
					}
					};

					$proto.getPosition = function(){
						return this.latlng_;
					}

					// Detach the map from the DOM via toggleDOM().
					// Note that if we later reattach the map, it will be visible again,
					// because the containing <div> is recreated in the overlay's onAdd() method.
					$proto.toggleDOM = function() {
					if (this.getMap()) {
						// Note: setMap(null) calls OverlayView.onRemove()
						this.setMap(null);
					} else {
						this.setMap(this.map_);
					}
					};

				})(AliMarker.prototype);


				if($scope.options.useClassicMap==true){
					$scope.initClassicMap(map_id);
				}
				else{
					$scope.initMultiMarkersMap(map_id);
				}
				
			})
	    };

		$scope._mapLibraryIsReady = function(){
			//console.log('_mapLibraryIsReady::google', typeof(google));

			if(typeof(google) != 'undefined') return Promise.resolve();
	
			return new Promise( ($resolve) => {
	
				const checkLibrary = () => {
					//console.log('_mapLibraryIsReady/checkLibrary::google', typeof(google));
					if(typeof(google) != 'undefined') return $resolve();
	
					window.setTimeout( _ => checkLibrary(), 500 );
				}
	
				checkLibrary();
			})
		}

	    $scope.initMultiMarkersMap = function(map_id){
	    	$scope.mapObj = new L.Map(map_id,{ 
	        							scrollWheelZoom: $scope.options.scrollWheelZoom, 
	        							touchZoom:$scope.options.touchZoom, 
	        							center: $scope.options.center, 
	        							zoom:$scope.options.zoom,
	        							minZoom: 5,
	        							maxZoom: 20,
	        							zoomControl: true //$scope.options.zoomControl
	        						});
	        //$scope.mapObj.dragging.disable();
	        var googleLayer = new L.Google('ROADMAP', {mapOptions:{styles: $scope.options.styles}});
	        $scope.mapObj.addLayer(googleLayer);

	        $scope.mapObj.whenReady(function(){
	        	if(typeof($scope.options.markers) != 'undefined'){
	        		window.setTimeout(function(){
	        			$scope.showMarkers($scope.options.markers);
	        		}, 1500);
		        }
		    });
	    }

	    $scope.initClassicMap = function(map_id){
	    	$scope.mapObj = new google.maps.Map(document.getElementById(map_id), 
                              $scope.options);
	    	window.setTimeout(function(){
	    		$scope.showMarkers($scope.options.markers);
	    	},500);
	    }

	    $scope.cleanMarker = function(){
	        if($scope.clusterer!=null){
	            $scope.mapObj.removeLayer($scope.clusterer);
	            $scope.clusterer = null;

	        }
	    };

	    $scope.showMarkers = function(markers){
	    	$scope.cleanMarker();
	    	
		    $scope._handle_get_markers_callback(markers);
	    };

	    $scope._handle_get_markers_callback = function(data){
	        console.log('markers', data);

	        if(data != null && data.length>0){
	            if($scope.options.useClassicMap){
	            	$scope._add_classic_markers(data);
	            }
	            else{
	            	$scope._add_clustered_markers(data);
	            }
		        
	        }
	        else{
	            jQuery('.id3-properties').addClass('no-data');
	        }

	        jQuery('.id3-properties').removeClass('loading');
	    }

	    $scope._add_classic_markers = function(data){
			$scope._mapLibraryIsReady().then( _ => {
				var bounds = new google.maps.LatLngBounds();
				var lMarkers = [];

				data.forEach(function(e){
					if(e.lat == undefined || e.lng == undefined) return;
					
					var lngLat = new google.maps.LatLng(e.lat, 
											e.lng);

					// e.marker = new google.maps.Marker({
					//     position: lngLat,
					//     map: $scope.mapObj,
					//     icon: goldStar
					// });
					e.marker = new AliMarker({
						position: lngLat,
						map: $scope.mapObj,
						obj: e,
						markerClass: $scope.options.markerClass,
						onPinClick: $scope.options.pinClickHandler
					});
					lMarkers.push(e.marker);
					bounds.extend(e.marker.getPosition());
				})

				if(data.length>1){
					$scope.mapObj.fitBounds(bounds);
					var markerCluster = new MarkerClusterer($scope.mapObj, lMarkers,
							{imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
				}
				else{
					if(typeof($scope.mapObj.setCenter) == 'function'){
						$scope.mapObj.setCenter(data[0].marker.getPosition());
					}
					else{
						console.log('_add_classic_markers mapObj',$scope.mapObj);
					}
				}
			})
	    }

	    $scope._add_clustered_markers = function(data){
			// build markers array
	        $scope.clusterer = L.markerClusterGroup({
	            showCoverageOnHover: false
	        });

	        if(data.length > 1){
	        	for(var i=0;i<data.length;i++){
	            	var lIconClass = $scope.options.markerClass;
	            	if(typeof(data[i].Genre)!='undefined'){
	            		lIconClass += ' ' + data[i].Genre;
	            	}
	                //var lMarkerIcon = L.divIcon({className: lIconClass, iconSize: [44,44]});
	                var lMarkerIcon = L.divIcon({className: lIconClass});
	                if(!isNaN(data[i].lat) && !isNaN(data[i].lng) && data[i].lat!='' && data[i].lng!='' ){
		                var marker = L.marker([data[i].lat, data[i].lng], {
		                    icon: lMarkerIcon
		                });

		                if($scope.options.pinClickHandler != null){
			                var popup = L.popup({
			                                    className: 'mapPropertyItem',
			                                    maxWidth: 400,
			                                })
			                                .setContent('<i class="fa fa-fw fa-spin fa-refresh"></i>');
			                popup.elm_id = data[i].id;

			                marker.bindPopup(popup)
			            }

		                marker.elm_id = data[i].id;

		                $scope.clusterer.addLayer(marker);
		            }
	            }

	            $scope.mapObj.addLayer($scope.clusterer);
	        }
	        else{
	        	var lIconClass = $scope.options.markerClass;
	        	if(typeof(data[0].Genre)!='undefined'){
	        		lIconClass += ' ' + data[0].Genre;
	        	}
	        	//var lMarkerIcon = L.divIcon({className: lIconClass, iconSize: [44,44]});
	        	var lMarkerIcon = L.divIcon({className: lIconClass});
	        	var marker = L.marker([data[0].lat, data[0].lng], {
		                    icon: lMarkerIcon
		                });

	        	marker.addTo($scope.mapObj);
	        }
	        

	        
	        if($scope.options.pinClickHandler != null){
	            $scope.mapObj.on('popupopen', function(e){
            		//if($(e.popup._contentNode).find('i').length>0){
                        $scope.options.pinClickHandler(e, e.popup.elm_id);
                    //}
                });
	        }

	        $scope.mapObj.whenReady(function(){
	        	$scope.mapObj.panTo([data[0].lat, data[0].lng], {animate:true});
	        	if(data.length > 1){
		        	// fit the map to all markers boundaries
		        	var lTimeout = 500;
		        	if($.browser.isSafari()){
		        		lTimeout = 1000;
		        	}
		            window.setTimeout(function(){
		            	$scope.mapObj.fitBounds($scope.clusterer.getBounds());	
		            	if(!$scope.options.autoFitBound){
				        	$scope.mapObj.setZoom($scope.options.zoom);
				        }
				        else{
				        	window.setTimeout(function(){
				        		$scope.mapObj.setZoom($scope.mapObj.getZoom() - 1);
				        	},lTimeout);
				        	
				        }
		            }, lTimeout / 2);
	            }
	            else{
	            	// center the map to single marker location
	            	if(!$scope.options.forcedZoom){
						window.setTimeout(function(){
		             		$scope.mapObj.setZoom(13);
		    //         		$scope.mapObj.panBy([0,0],{animate:true});
		    //         		console.log('2,5sec late pan to pin');
		             	}, 2500);
					}
	            }
	        });
	    }

	    $scope._handle_zoom_control_click = function(el){
	    	
	    	if($(el).hasClass("fa-minus")){
	    		console.log('zoom out');
	    		$scope.mapObj.panBy([0.00001,0.000001],{animate:true});

	    		window.setTimeout(function(){
	    			$scope.mapObj.zoomOut();	
	    		},200);
	    		
	    		
	    	}
	    	else{
	    		console.log('zoom in');
	    		$scope.mapObj.panBy([0,0],{animate:true});
	    		$scope.mapObj.zoomIn();
	    		
	    	}
	    }

	    

		function AliMarker(options) {
		  // Initialize all properties.
		  this.latlng_ = options.position;
		  this.markerClass = options.markerClass;
		  this.onClick = options.onPinClick;
		  this.obj = options.obj;
		  // Define a property to hold the image's div. We'll
		  // actually create this div upon receipt of the onAdd()
		  // method so we'll leave it null for now.
		  this.div_ = null;
		  if(options.obj.lat == undefined || options.obj.lng == undefined) return;

		  if(options.obj.sold){
			this.markerClass = 'sold-marker-icon';
		  }
		  console.log('AliMarker/construct', options.obj);
		  
		  // Explicitly call setMap on this overlay.
		  this.setMap(options.map);
		}

		
	    
	})(lMan);

	lMan.init(map_id);
	return lMan;
}


/* Encoded email management */
class EmailLinkManagement {
	constructor(){
		Array.from(document.body.querySelectorAll( 'a')).forEach( link => {
			let href = link.getAttribute('href');

			if(href == null || href == undefined) return;
			if(!href.startsWith('mailto:')) return;
			if(!href.includes('&#')) return;
			
			console.log('mailto link', href);
			link.setAttribute('href', href);
		})
	}
}



var utils = {
	query: {
		get: function(key){
			if(window.location.search!=''){
				var lQueries = window.location.search.replace('?','').split('&');
				for(var i=0;i<lQueries.length;i++){
					lKeyValue = lQueries[i].split('=');
					if(lKeyValue[0] == key){
						if(lKeyValue.length==1){
							return true;
						}
						else{
							return lKeyValue[1];
						}
					}
				}
			}
			return false;
		}
	}
}


/*----- JS Filter ------*/
__js_filters = typeof(__js_filters)=='undefined'?[]:__js_filters;

if(typeof(add_filter)=='undefined'){
    function add_filter(filter_name, hook_function, priority){
        priority = typeof(priority)=='undefined' ? -1: priority;
        
        for(var i=0;i<__js_filters.length;i++){
            if(__js_filters[i].name==filter_name){
                if(priority==-1){
                    priority = __js_filters[i].callback.length;
                }
                __js_filters[i].callback[priority]= hook_function;
                return;
            }
        }

        __js_filters.push({name:filter_name, callback: [hook_function]});

    }

    function apply_filters(filter_name, default_value, extra_params){
        for(var i=0;i<__js_filters.length;i++){
            if(__js_filters[i].name==filter_name){
                var lTreatedValue = default_value;
                for (var j = 0; j < __js_filters[i].callback.length; j++) {
                    if(typeof(__js_filters[i].callback[j])!='undefined'){
                        lTreatedValue = __js_filters[i].callback[j](lTreatedValue,extra_params);
                    }
                };
                return lTreatedValue;
            }
        }

        return default_value;
    }
}

const $quickbar = instanciateQuickbar();
function instanciateQuickbar(){
	const $scope = {};

	$scope.do = function($event, $action){
		console.log('qb do',$action);
		if(typeof $scope['do_' + $action] == 'function') $scope['do_' + $action]($event, $action);
	}

	$scope.do_stratego_newsletter = function($event, $action){
		$scope.do_newsletter($event, $action);
	}
	$scope.do_newsletter = function($event, $action){
		// display newsletter panel align to event target
		const lTargetElm = jQuery($event.target);
		const lPanelElm = jQuery('.ali-overlay-panel.' + $action);
		const jWindow		= jQuery(document);
		const jCloseBtn 	= lPanelElm.find('.btn-close');
		const lTargetElmCenter = $scope.getCenterPoint(lTargetElm);
		
		// lPanelElm.css({
		// 	left: lTargetElmCenter.x,
		// 	top: lTargetElmCenter.y + lTargetElm.height() / 2
		// });

		lPanelElm.toggleClass('show');
		lPanelElm.on('click', function($event){
			$event.stopPropagation();
			return false;
		});
		
		jWindow.on('click', function windowCloseNewsLetterPanel($event){
			jWindow.off('click',windowCloseNewsLetterPanel);
			lPanelElm.removeClass('show');
		});

		jCloseBtn.on('click', function(){
			lPanelElm.removeClass('show');
		})

		$event.stopPropagation();
	}

	$scope.getCenterPoint = function($elm){
		return {
			x: $elm.offset().left + ($elm.width() / 2),
			y: ($elm.offset().top + ($elm.height() / 2)),
		}
	}

	return $scope;
}

const cookiePopup = createCookiePopup();
function createCookiePopup(){
	const $scope = {};
	$scope.element = null;
	
	$scope.init = function(){
		$scope.element = jQuery('#privacy-policies-message');
		if(localStorage.getItem('accept-cookies') !== "true"){
			$scope.open();
		}
	}
	
	$scope.close = function(){
		if ($scope.element == null) return false;
		$scope.element.removeClass('displayed');
		window.setTimeout(function(){
			$scope.element.remove();
		},1000);
		
	}

	$scope.open = function(){
		if ($scope.element == null) return false;
		$scope.element.addClass('displayed');
	}

	$scope.accept = function(){
		localStorage.setItem('accept-cookies', true);
		$scope.close();
	}

	jQuery(document).ready(function(){
		$scope.init();
	});

	return $scope;
}

/*----- JS Action ------*/
__js_actions = typeof(__js_actions)=='undefined'?[]:__js_actions;

if(typeof(add_action)=='undefined'){
    function add_action(action_name, hook_function, priority){
        priority = typeof(priority)=='undefined' ? -1: priority;
        
        for(var i=0;i<__js_actions.length;i++){
            if(__js_actions[i].name==action_name){
                if(priority==-1){
                    priority = __js_actions[i].callback.length;
                }
                __js_actions[i].callback[priority]= hook_function;
                return;
            }
        }

        __js_actions.push({name:action_name, callback: [hook_function]});

    }

    function do_actions(action_name, extra_params){
        for(var i=0;i<__js_actions.length;i++){
            if(__js_actions[i].name==action_name){
                for (var j = 0; j < __js_actions[i].callback.length; j++) {
                    if(typeof(__js_actions[i].callback[j])!='undefined'){
                        if(typeof(extra_params)=='function'){
                            extra_params = extra_params();
                        }
                        __js_actions[i].callback[j](extra_params);
                    }
                };
            }
        }
    }
}

// Polyfills

if(typeof [].forEach == 'undefined'){
	Array.prototype.forEach = function($loopFnc){
		for( var i = 0; i < this.length; i++){
			$loopFnc(this[i], i);
		}
	}
}


String.prototype.sanitize = function(spaceReplacement){
	spaceReplacement = (typeof(spaceReplacement)=='undefined')?'-':spaceReplacement;

	var lResult = this;
	lResult = lResult.replace(new RegExp(" ","g"), spaceReplacement)
                        .replace(new RegExp("\\(|\\)","g"), '')
                        .replace(new RegExp("[éèêë]","g"), 'e')
                        .replace(new RegExp("[àâä]","g"), 'a')
                        .replace(new RegExp("[ìîï]","g"), 'i')
                        .replace(new RegExp("[öòô]","g"), 'a');

    lResult = lResult.replace(new RegExp("-{2,}","g"), '-');

    return lResult.toLowerCase();
}
