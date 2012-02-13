(function($) {
    $.fn.toolbar = function(options) {
	var container = $(this).addClass("ui-toolbar");

	var settings = $.extend({ 
	    fadeSpeed: 200,
	    fadeTo: 0.5,
	    topDistance: 30
	}, options);
	
	var topbarME = function() { 
	    container.fadeTo(settings.fadeSpeed, 1); 
	};

	var topbarML = function() { 
	    container.fadeTo(settings.fadeSpeed, settings.fadeTo); 
	};

	var inside = false;
	$(window).scroll(function() {
	    var position = $(window).scrollTop();
	    if(position > settings.topDistance && !inside) {
		topbarML();
		container.bind('mouseenter', topbarME);
		container.bind('mouseleave', topbarML);
		inside = true;
	    } else if (position < settings.topDistance){
		topbarME();
		container.unbind('mouseenter', topbarME);
		container.unbind('mouseleave', topbarML);
		inside = false;
	    }
	});

	return container;
    };
})(jQuery);