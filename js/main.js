'use strict';

/****
	Main JS file
****/

(function() {

	//no fancybox overlay for videos for smaller screens
	if( $(window).width() > 600){
		$(".fancybox").attr('rel', 'gallery').fancybox({
	        openEffect  : 'none',
	        closeEffect : 'none',
	        nextEffect  : 'none',
	        prevEffect  : 'none',
	        padding     : 0,
	        margin      : [20, 60, 20, 60] // Increase left/right margin
	    });
	}

    //collapse list
	var arrowList = $(".arrow-list");
	var isIE8 = $("html").hasClass("ie8");
	arrowList.on("click",".collapse-link", function(e){
		e.preventDefault();
		var myLink = $(this),
			myParent = myLink.parent(),
			myContent = myLink.next('p');

		if(myLink.hasClass("active")){
			if(isIE8){
				myContent.hide().removeClass("opened");
			}else{
				myContent.slideUp("fast").removeClass("opened");
			}
			myLink.removeClass("active");
		}else{
			if(isIE8){
				arrowList.find(".opened").hide().removeClass("opened");
			}else{
				arrowList.find(".opened").slideUp("fast").removeClass("opened");
			}
			arrowList.find(".active").removeClass("active");
			myContent.slideDown("fast").addClass("opened");
			myLink.addClass("active");

		}	

	});

	//smaller screens get a different banner
	if(Modernizr.touch && $(window).width() < 601){
		//shortens link text
		var langLink = $(".lang-link");
		langLink.html(langLink.data("short")).show();

		$('<img src="images/banner/banner-600.jpg" alt="" />').insertBefore('.lead');
	}


	//share popups
	var shareTool = $(".toolbox");	
	shareTool.on("click","a:not(.non-js)",function(e){
		console.log("click")
		e.preventDefault();
		var myButton = $(this),
			shareForm,
		    popupHeight = 600,
		    popupWidth = 960,
		    popupX = screen.width/2 - popupWidth/2,
		    popupY = screen.height/2 - popupHeight/2,
		    popupArgs = 'toolbar=0,status=0,width=' + popupWidth + ',height=' + popupHeight + ',top=' + popupY + ', left=' + popupX;
	

		var u = window.location,
         	redirect_uri = "http://myneighbourhoodfirst.ca/close-window",
         	t = "My Neighborhood first",
         	longtitle = shareTool.data("title"),
         	summary = shareTool.data("summary");


		switch(myButton.data("social")){
			case "tw":
				popupArgs = 'toolbar=0,status=0,width=' + 800 + ',height=' + 400 + ',top=' + popupY + ', left=' + popupX;
				window.open("https://twitter.com/share?url=" + encodeURIComponent(u) + "&text=" + $(".toolbox").data("twitter-text"), 'Twitter', popupArgs);
				break;
			case "li": 
				popupArgs = 'toolbar=0,status=0,width=' + 600 + ',height=' + 400 + ',top=' + popupY + ', left=' + popupX;
				window.open("http://www.linkedin.com/shareArticle?mini=true&url=" + encodeURIComponent(u) + "&title=" + encodeURIComponent(longtitle) + "&summary=" + encodeURIComponent(summary) + "&source=" + encodeURIComponent(u), 'LinkedIn', popupArgs);
				break;
			case "fb":
		        shareForm = window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(u) + '&t=' + encodeURIComponent(longtitle) + '&redirect_uri=' + encodeURIComponent(u), 'sharer', popupArgs);
				break;
			default:	
				
				break;
		}

	});


})(jQuery);


