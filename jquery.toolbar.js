(function($) {
	
	/**
	 * Returns filtered options map from a user supplied map
	 * @param options
	 * @return Object
	 */
	var filterSettings_ = function(options) {
		if(!$.isPlainObject(options)) { //must be an object
			return {};
		}
		
		$.each(options, function(key, value) {
			if(key == 'fadeSpeed') { //allows only integers greater than or equal to zero
				options.fadeSpeed = parseInt(value);
				if(isNaN(options.fadeSpeed)) {
					delete options.fadeSpeed;
				} else if(options.fadeSpeed < 0) {
					options.fadeSpeed = 0;
				}
			} else if(key == 'fadeTo') { //allows only numbers between 0 and 1 (inclusive)
				options.fadeTo = parseFloat(value);
				if(isNaN(options.fadeTo)) {
					delete options.fadeTo;
				} else if(options.fadeTo < 0) {
					options.fadeTo = 0;
				} else if(options.fadeTo > 1) {
					options.fadeTo = 1;
				}
			} else if(key == 'topDistance') { //allows only integers greater than or equal to zero
				options.topDistance = parseInt(value);
				if(isNaN(options.topDistance)) {
					delete options.topDistance;
				} else if(options.topDistance < 0) {
					options.topDistance = 0;
				}
			} else if(key == 'autoPosition') { //boolean value of whatever is provided
				options.autoPosition = Boolean(value);
			} else if(key == 'classPrefix') { //any string, lower case, no leading/trailing whitespace
				options.classPrefix = $.trim(value.toString().toLowerCase());
			} else { //removes unused data provided
				delete options[key];
			}
		});
		
		return options;
	};
	
	/**
	 * Default settings
	 */
	$.toolbar = {
		defaults : {
			//how fast to adjust the visibility of the toolbar
			fadeSpeed : 200,
			//how much to adjust the visibility of the toolbar
			fadeTo : 0.5,
			//pixel distance from the top before fading
			topDistance : 30,
			//attempts to adjust page layout to accommodate the toolbar
			autoPosition : true,
			//prefix for used css classes
			classPrefix : 'toolbar'
		}
	};
	
	/**
	 * Initializes the plugin using the options (if any) provided by the user
	 * @param options (optional)
	 * @return jQuery
	 */
    $.fn.toolbar = function(/*options*/) {
    	var options = arguments.length > 0 ? filterSettings_(arguments[0]) : {};
		var settings = $.extend({}, $.toolbar.defaults, options);
		
		var container = $(this).first().addClass(settings.classPrefix + '-container').css(
			{ position : 'fixed', top : 0, left : 0, width : '100%', display : 'block', overflow : 'hidden' }
		);
		
		if(container.size() > 0) {
			var body = $('body').addClass(settings.classPrefix + '-init');
			if(settings.autoPosition) {
				var topMargin = parseInt(body.css('marginTop').replace('px', ''));
				var toolbarHeight = container.outerHeight(true);
				body.css(
					{ marginTop : (topMargin + toolbarHeight) + 'px' }
				);
			}
			
			var handleMouseenter = function() { 
			    container.fadeTo(settings.fadeSpeed, 1, function() {
			    	container.trigger('focus');
			    });
			};
		
			var handleMouseleave = function() { 
			    container.fadeTo(settings.fadeSpeed, settings.fadeTo, function() {
			    	container.trigger('blur');
			    });
			};
	    	
			var inside = false;
			var theWindow = $(window).scroll(function() {
			    var position = theWindow.scrollTop();
			    if(position > settings.topDistance && !inside) {
					handleMouseleave();
					container.bind('mouseenter', handleMouseenter).bind('mouseleave', handleMouseleave);
					inside = true;
			    } else if(position < settings.topDistance) {
					handleMouseenter();
					container.unbind('mouseenter', handleMouseenter).unbind('mouseleave', handleMouseleave);
					inside = false;
			    }
			});
		}
		
		return container;
    };
    
})(jQuery);