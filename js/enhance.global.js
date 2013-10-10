// original file:  enhance.global.decompile.js
// work on enhance.global.decompile.js , then compile here: http://closure-compiler.appspot.com/home
// and save on this file 

//'use strict'

var callAddMeAgain = false;

PT6.enhances = (PT6.enhances || {});

/**
Main Nav submenus
**/
PT6.enhances.mainNav = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			windowObj = wJQ(window),
			buttonMob = wJQ("button", inst),
			mainNav = wJQ(".mainNav", inst);

		//main menu dropdown functionality
	    var dropDownObjs = function(linkElem){

			var myDropDownTimeout,
				dropElem = linkElem.next("ul");

			if(linkElem.hasClass("opened")){
				dropElem.fadeOut();
			    linkElem.removeClass("opened");
			}else{
				dropElem.fadeIn();
				linkElem.addClass("opened");
				linkElem.on({
			        mouseenter: function(){
			            clearTimeout(myDropDownTimeout);
			        },
			        mouseleave: function(){
			            myDropDownTimeout = setTimeout(function () {
			                dropElem.fadeOut();
			                linkElem.removeClass("opened");
			            },300);
			        }
			    });

			    dropElem.on({
			        mouseenter: function(){
			            clearTimeout(myDropDownTimeout);
			        },
			        mouseleave: function(){
			            myDropDownTimeout = setTimeout(function () {
			                dropElem.fadeOut();
			                linkElem.removeClass("opened");
			            },300);
			        }
			    });

			    if(Modernizr.touch){
			    	var touchEventElems = wJQ("header, .content");
			    	touchEventElems.on("click", function(e){
						dropElem.fadeOut();
			    		linkElem.removeClass("opened");
					});
			    }

			}

		};

		if(windowObj.width() <= 600){
			var langLink = wJQ(".langLink", inst);

			if(wJQ(".username", inst).length){
				var username = wJQ(".username", inst),
					userprofile = wJQ(".userprofile", inst);

				username.text(username.data("mob"));
				userprofile.text(userprofile.data("mob"));
			}
			wJQ(".mainNav").append("<li class='updated-lang' />");
			langLink.text(global_lang == "en" ? 'français' : 'english')
					.appendTo(".updated-lang")
		}


		inst.on("click",".hasSubNav", function(e){
			e.preventDefault();
			dropDownObjs(wJQ(this));
		});

		buttonMob.on("click", function(){
			wJQ(this).toggleClass("active")
			mainNav.slideToggle().toggleClass("opened");
		})

	});
};

/**
	Signup overlay
**/
PT6.enhances.signUpOverlay = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			windowObj = wJQ(window),
			isInNav = (typeof inst.data('nav') !== 'undefined' ? inst.data('nav') : false),
			signup = wJQ("#sign-overlay"),
			signInForm = wJQ('#form-signin'),
			forgotForm = wJQ('#forgot-pass'),
			forgotLink = wJQ(".forgot-link", signup),
			isInCommuPage = (typeof inst.data('add') !== 'undefined' ? inst.data('add') : false);


		//checks if touch device and screen smaller than 600px
		var isMobileFunc = function(){
			var isMobileOrTouch;
			if((windowObj.width() < 600) && Modernizr.touch) {
				isMobileOrTouch = true;
			}
			if((windowObj.width() >= 600) || !Modernizr.touch){
				isMobileOrTouch= false;
			}
			return isMobileOrTouch;
		}

		var wrapper = wJQ(".form-wrapper", signup),
	    	mask, myData, moveVal, testMob = isMobileFunc();


	    var closeMe = function(){
	    	if(wJQ('.add-me.btn').length > 0){
	    		if(wJQ('.add-me.btn').data('removesession')){
	    			// remove session
	    			wJQ.get(wJQ('.add-me.btn').data('removesession'));
	    		}
	    	}
	    	signup.hide();
			wJQ('.error', signup).remove();
			if(!testMob){
				wJQ("#signup-mask").fadeOut();
				wrapper.css({marginLeft: 0});
			}else{
				wJQ("#forgot-pass").hide();
				wJQ("#form-signin").show();
			}
	    }

	    wJQ("body").on("click","#signup-mask", closeMe);
		signup.on("click",".close-overlay", closeMe);

		forgotLink.on("click", function(){
			myData = wJQ(this).data("show");
			moveVal = myData ? -298 : 0;
			if(!testMob){
				wrapper.stop().animate({
				    marginLeft: moveVal
				}, 300 );
			}else{
				wJQ("#form-signin, #forgot-pass").slideToggle();
			}
		});

		var signUpLinkClick = function(){

		    if(!testMob){
		    	var docW = windowObj.width(),
		    		docH = windowObj.height(),
		    		leftVal = (docW / 2) - (signup.outerWidth() / 2),
		    		topVal = (docH / 2) - (signup.outerHeight() / 2);

				signup.css({left: leftVal, top: topVal}).show();

				if(!wJQ("#signup-mask").length){
					wJQ("body").append("<span id='signup-mask' />");
				}
				mask = wJQ("#signup-mask");
				mask.fadeIn()
					.height(wJQ(document).height());

				windowObj.off().on('scroll', function(){
					var scrollTop = windowObj.scrollTop();
					signup.css({top: topVal + scrollTop})
				});
		    }else{
		    	signup.addClass("show-in-mobile")
	    			  .insertAfter(".top-bar");
	    		signup.slideDown();
		    }
		}

		inst.on("click", function(e){
			e.preventDefault();
			if(!isInNav){
				wJQ("html, body").animate({ scrollTop: 0 }, 500, function(){
					signUpLinkClick();
				});
			}else{
				signUpLinkClick();
			}
		});

		// bind form using ajaxForm
		forgotForm.ajaxForm({
            // dataType identifies the expected content type of the server response
            dataType:  'json',

            // success identifies the function to invoke when the server response
            // has been received
            success:   function(data) {
                forgotForm.find('p:gt(0)').remove(); //remove p except the first one
                if (data.error) {
                    forgotForm.find('p').append('<p id="forgotpassword-error" class="error"><i class="icon-warning"></i>' + data.email_not_exit + '</p>');
                    //wJQ('#submit-forgotpassword, #forgot-email').hide();
                } else {
                    // remove all the input field and show confirmation message
                    wJQ('#submit-forgotpassword, #forgot-email, #forgotpassword-error').hide();
                    forgotForm.find('p').html(data.confirmationmsg);
                    setInterval(function(){
                        forgotLink.trigger('click')
                    },10000);
                }
            }
        });

		forgotForm.on('click', '#resendconfirmation', function() {
            wJQ.post(inst.data("ajaxresend"),
                 wJQ("#forgot-pass").serialize(),
                 function(data){
                    if (data.error) {
                        wJQ('#submit-forgotpassword, #forgot-email').hide();
                        forgotForm.find('p:eq(0)').hide();
                        forgotForm.find('p:gt(0)').remove(); //remove p except the first one
                        forgotForm.find('p').append('<p id="forgotpassword-error" class="error"><i class="icon-warning"></i>' + data.email_not_exit + '</p>');
                    } else {
                        wJQ('#submit-forgotpassword, #forgot-email, #forgotpassword-error').hide();
                        forgotForm.find('p').html(data.confirmationmsg);
                    }
                 }, "json"
            );
        });

		signInForm.on('click', '#resendconfirmationAgain', function() {
			var myLink = wJQ(this),
				myParent = myLink.parent(),
				newMSg;
            wJQ.get(myLink.data("url")).done(function(data){
            	newMSg = "<i class='icon-warning'></i>Email confirmation resent"
            	myParent.addClass("resent").html(newMSg);
			});
        });


		signInForm.ajaxForm({
			// dataType identifies the expected content type of the server response
			dataType:  'json',

			// success identifies the function to invoke when the server response
			// has been received
			success:   function(data) {
				wJQ('#error-signin').remove(); //remove p except the first one
				if (data.error) {
					signInForm.find('p:eq(0)').append('<p id="error-signin" class="error"><i class="icon-warning"></i>' + data.errorlogin + '</p>');
					//wJQ('#submit-forgotpassword, #forgot-email').hide();
				} else {
					// reload current page
					if(isInCommuPage){
						document.location.href = inst.attr("href");
					}else{
						if(callAddMeAgain){
							//code for wall of fame
							wJQ.get(wJQ('.add-me.btn').attr('href'), function(data){
								location.reload(true);
							});
						}else{
							location.reload(true);
						}
					}
				}
			}
		});


		//fixes issue where if enter key was pressed on IE8, it redirected to the FB login button
		if(PT6.support.isie8){
			signInForm.on("keypress",function(e){
				if ( e.which == 13 ) // Enter key = keycode 13
				{
					wJQ("#signup-submit").trigger("click");
					return false;
				}
			});
		}

	});
};


/**
 Articles Slider
 **/
PT6.enhances.slider = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			thumbsBlock = wJQ(".thumbs", inst),
			imageList = wJQ(".slides-list", inst),
			thumbList = wJQ(".thumbs-list", inst),
			thumbs = wJQ("a", thumbList),
			imgCount = wJQ('li', thumbList).length - 4,
			myImages = wJQ('img', imageList),
			btns = wJQ('button', inst),
			activeLink = wJQ(".active", thumbList),
			activeImg = wJQ(".active", imageList),
			slideDistance = 600,
			thumbsDistance = 566 + 10,
			windowWidth = wJQ(window).width();


		if(windowWidth < 700){
			inst.addClass("is-fluid");
			var mainW = wJQ(".main").width(),
				thumbsW = wJQ(".thumbs-wrapper", inst);
			myImages.css("max-width",mainW);
			imageList.find("li").width(mainW);
			thumbsBlock.width(mainW);
			wJQ(".slides", inst).width(mainW);
			var listW = thumbsW.width() / 4;
			wJQ('li', thumbList).width(listW);
			thumbsDistance = thumbsW.width();
		}

		var thumbClick = function(e) {
			e.preventDefault();
			var myLink =  wJQ(this),
				myData = myLink.data("link"),
				myIndex, prevIndex, newActive, newHeight;

			if(!myLink.hasClass("active")){

				newActive = imageList.find("[data-slide='" + myData + "']");
				prevIndex = activeLink.parent().index();
				myIndex = myLink.parent().index();
				thumbList.find(".active").removeClass("active");
				newHeight = newActive.data("height");
				imageList.height(newHeight);

				if(myIndex > prevIndex){
					activeImg.animate({left:-slideDistance}, 300)
					newActive.css({left:slideDistance}).animate({left:0}, 400);
				}else{
					activeImg.animate({left:slideDistance}, 300)
					newActive.css({left:-slideDistance}).animate({left:0}, 400);
				}

				newActive.addClass("active");
				myLink.addClass("active");
				activeImg = newActive;
				activeLink = myLink;
			}
		}

		var currentMargin = 0,
			activeClick = 0,
			moveBack = wJQ('.prev', inst),
			moveNext = wJQ('.next', inst),
			totalClicks = Math.floor(wJQ('li', thumbList).length / 4);

		var buttonClick = function(e){
			var myBtn = wJQ(this);

			if(myBtn.hasClass("next")){
				currentMargin-= thumbsDistance;
				activeClick += 1;
			}else{
				currentMargin+= thumbsDistance;
				activeClick -= 1;
			}
			moveBack[(activeClick >= 1 ? 'add' : 'remove') + 'Class']("enabled");
			moveNext[(activeClick < totalClicks ? 'add' : 'remove') + 'Class']("enabled");

			thumbList.stop().animate({marginLeft : currentMargin}, 500);
		}

		var myBlock, imgH;
		var detectImageHeight = function(){
			wJQ("li", imageList).each(function(i){
				myBlock = wJQ(this);
				imgH = myBlock.find("img").height();
				if(myBlock.find("p")){
					imgH += myBlock.find("p").innerHeight();
				}
				myBlock.attr("data-height",imgH)
				if(i==0){imageList.height(imgH);}
			});
		}

		if(imgCount > 0){
			moveNext.addClass("enabled");
			btns.on("click", buttonClick);
		}else{
			thumbsBlock.addClass("no-slider")
		}


		myImages.imagesLoaded({
			done: function ($images) {
				detectImageHeight();
			}
		});

		thumbs.on("click", thumbClick);

	});
};

PT6.enhances.selectavatar = function(ctx) {
	var myform_type =  wJQ('form').data('type');
    var myform_facebook  = wJQ('form').data('facebook');

	// Change avatar when you click on a thumbnail
    wJQ('label.avatar').on('click', function () {
        var elm = wJQ(this),
            myForm = elm.parents('form'),
            avatarID = elm.attr('for'),
            avatar_path = myForm.data("avatar"),
            forcemainthumbnailchange = true;

        wJQ.post(
            avatar_path,
            {'avatar':wJQ('#' + avatarID).data('url')},
            function (data) {
                if (!data.error) {
                    myForm.find('#id_image').val(data.filename);
                    if (forcemainthumbnailchange) {
                        myForm.find('#mainthumbnail').html('<img src="' + data.profil_90 + '" />');
                    }
                    forcemainthumbnailchange = true;
                }
            }, "json"
        );
    });


	// Select random avatar when opening the SIGN UP form
    if(myform_type == 'signup' && parseInt(myform_facebook) == 0){
		var randNum = Math.floor((Math.random()*4)+1);
		wJQ('label.avatar' + randNum).trigger('click');
	}
};

/**
 Ajax upload
 **/
PT6.enhances.ajaxUpload = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			actionData = inst.data("action"),
			btntextData =inst.data("btntext");

		var uploader = new qq.FileUploader({
			action: actionData,
			element: wJQ('#file-uploader')[0],
			multiple: false,
			forceMultipart:true,
			uploadButtonText: '<button id="signupuploadbtn">'+ btntextData + '</button>',
			fileTemplate: '<li style="display:none">' +
				'<div class="qq-progress-bar"></div>' +
				'<span class="qq-upload-spinner"></span>' +
				'<span class="qq-upload-finished"></span>' +
				'<span class="qq-upload-file"></span>' +
				'<span class="qq-upload-size"></span>' +
				'<a class="qq-upload-cancel" href="#">{cancelButtonText}</a>' +
				'<span class="qq-upload-failed-text">{failUploadtext}</span>' +
				'</li>',
			allowedExtensions: ['jpeg', 'jpg'],
			sizeLimit:5 * 1024 * 1024, // 5M
			onComplete: function(id, fileName, responseJSON) {
				if(responseJSON.success) {
					wJQ('#id_image').val(responseJSON.filename);
					wJQ('#mainthumbnail').html('<img src="' + responseJSON.profil_90 + '" />')
				} else {
					alert("upload failed!");
				}
			}
		});
	});
};


PT6.enhances.createInitialsPhotoUpload = function(ctx){
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			avatars = wJQ(".avatar-wrapper", inst),
			actionData = inst.data("action");

		avatars.each(function(i, elem){
			var count = i;

			var imageUrl = wJQ(elem).data('image');
			if(imageUrl == ''){
				var uploadButtonText = '<button class="avatar big"><div class="asset"><div id="photo-holder-' + count + '" class="img-ctn photo"></div></div></button>'
			}else{
				var uploadButtonText = '<button class="avatar big"><div class="asset"><div id="photo-holder-' + count + '"  style="background-image:url(' + imageUrl + ');" class="img-ctn photo"></div></div></button>'
			}

			new qq.FileUploader({
		        action: actionData,
		        element: wJQ(this)[0],
		        multiple: false,
		        forceMultipart:true,
		        inputName:'image',
		        uploadButtonText: uploadButtonText,
		        fileTemplate: '<li style="display:none">' +
		                '<div class="qq-progress-bar"></div>' +
		                '<span class="qq-upload-spinner"></span>' +
		                '<span class="qq-upload-finished">s</span>' +
		                '<span class="qq-upload-file"></span>' +
		                '<span class="qq-upload-size"></span>' +
		                '<a class="qq-upload-cancel" href="#">{cancelButtonText}</a>' +
		                '<span class="qq-upload-failed-text">{failUploadtext}</span>' +
		                '</li>',
		        allowedExtensions: ['jpeg', 'jpg'],
		        sizeLimit:5 * 1024 * 1024, // 5M
		        onComplete: function(id, fileName, responseJSON) {

					if(responseJSON.errors) {
		                alert(responseJSON.errors);
		            } else {
		            	wJQ('#id_images-' + count + '-id').val(responseJSON.id);
		                wJQ('#loading-image-upload-' + count).hide();
		                wJQ('#remove-image-upload-' + count).show();
		            	wJQ('#photo-holder-' + count).css('background-image', 'url('+responseJSON.url+')');
		            	wJQ('#image-upload-' + count).find('div.img-ctn.photo').css('background-image', 'url('+responseJSON.url+')');
		               	addImage();

		            }
		        },
		        onProgress: function(id, fileName, loaded, total){
		            wJQ('#loading-image-upload-' + count).show();
		        }
		    });

			var addImage = function(){
				var totalAddPhotoButton = wJQ('input[name^="images-"][name$="-id"][type="hidden"]').length,
					totalUploadedPhoto = wJQ('input[name^="images-"][name$="-id"][type="hidden"][value]').length;

				if(totalAddPhotoButton > totalUploadedPhoto){
					// we don't need to add a photo upload
					return;
				}

			    var count = wJQ('.images').children().length;

			    // when we delete photo it is possible that the count already exists, we dont want this
				while( wJQ('#id_images-' + count + '-id').length > 0 ){
					count++;
				}

			    var tmplMarkup = wJQ('#image-template').html();
			    var compiledTmpl = _.template(tmplMarkup, { id : count });

			    wJQ('div.images').append(compiledTmpl);
			    // update form count
			    wJQ('#id_images-TOTAL_FORMS').attr('value', count+1);

			    new qq.FileUploader({
			        action: actionData,
			        element: wJQ('#image-upload-' + count)[0],
			        multiple: false,
			        forceMultipart:true,
			        inputName:'image',
			        uploadButtonText: '<button class="avatar big"><div class="asset"><div id="photo-holder-' + count + '" class="img-ctn photo"></div></div></button>',
			        fileTemplate: '<li style="display:none">' +
			                '<div class="qq-progress-bar"></div>' +
			                '<span class="qq-upload-spinner"></span>' +
			                '<span class="qq-upload-finished">s</span>' +
			                '<span class="qq-upload-file"></span>' +
			                '<span class="qq-upload-size"></span>' +
			                '<a class="qq-upload-cancel" href="#">{cancelButtonText}</a>' +
			                '<span class="qq-upload-failed-text">{failUploadtext}</span>' +
			                '</li>',
			        allowedExtensions: ['jpeg', 'jpg'],
			        sizeLimit:5 * 1024 * 1024, // 5M
			        onComplete: function(id, fileName, responseJSON) {

						if(responseJSON.errors) {
			                alert(responseJSON.errors);
			            } else {

			            	wJQ('#id_images-' + count + '-id').val(responseJSON.id);
			                wJQ('#loading-image-upload-' + count).hide();
			                wJQ('#remove-image-upload-' + count).show();
			            	wJQ('#photo-holder-' + count).css('background-image', 'url('+responseJSON.url+')');
			            	//wJQ('#image-upload-' + count).find('div.img-ctn.photo').css('background-image', 'url('+responseJSON.url+')');
			               	addImage();

			            }
			        },
			        onProgress: function(id, fileName, loaded, total){
			            wJQ('#loading-image-upload-' + count).show();
			        }
			    });
			}

			inst.on("click", ".remove-element",function(e){
				e.preventDefault();
				if(!wJQ(this).hasClass("remove-text")){
					//<input class="delete-element" type="hidden" name="{{ form.prefix }}-DELETE" id="id_{{ form.prefix }}-DELETE">

					var parent = wJQ(this).parent();

					if(parent.find('.delete-element').length < 1){
						parent.remove();
					}else{
						parent.find('.delete-element').val('on');
						parent.hide();
					}
					addImage();
				}
			});

		});

	});


}

/**
 Poset Create photo upload
 **/
PT6.enhances.createPhotoUpload = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			actionData = inst.data("action");

		new qq.FileUploader({
			action: actionData,
			element: wJQ('#image-upload-0')[0],
			multiple: false,
			forceMultipart:true,
			inputName:'image',
			uploadButtonText: '',
			fileTemplate: '<li style="display:none">' +
				'<div class="qq-progress-bar"></div>' +
				'<span class="qq-upload-spinner"></span>' +
				'<span class="qq-upload-finished">s</span>' +
				'<span class="qq-upload-file"></span>' +
				'<span class="qq-upload-size"></span>' +
				'<a class="qq-upload-cancel" href="#">{cancelButtonText}</a>' +
				'<span class="qq-upload-failed-text">{failUploadtext}</span>' +
				'</li>',
			allowedExtensions: ['jpeg', 'jpg'],
			sizeLimit:5 * 1024 * 1024, // 5M
			onComplete: function(id, fileName, responseJSON) {
				if(responseJSON.errors) {
					alert(responseJSON.errors);
				} else {
					wJQ('#id_images-0-id').val(responseJSON.id);
					wJQ('#loading-image-upload-0').hide();
					wJQ('#remove-image-upload-0').show();
					wJQ('#photo-holder-0').css('background-image', 'url('+responseJSON.url+')');
					//wJQ('#image-upload-0').find('div.img-ctn.photo').css('background-image', 'url('+responseJSON.url+')');
					addImage();
				}
			},
			onProgress: function(id, fileName, loaded, total){
				wJQ('#loading-image-upload-0').show();
			}
		});


		var addImage = function(){
			var totalAddPhotoButton = wJQ('input[name^="images-"][name$="-id"][type="hidden"]').length,
				totalUploadedPhoto = wJQ('input[name^="images-"][name$="-id"][type="hidden"][value]').length;

			if(totalAddPhotoButton > totalUploadedPhoto){
				// we don't need to add a photo upload
				return;
			}

		    var count = wJQ('.images').children().length;

		    // when we delete photo it is possible that the count already exists, we dont want this
			while( wJQ('#id_images-' + count + '-id').length > 0 ){
				count++;
			}

		    var tmplMarkup = wJQ('#image-template').html();
		    var compiledTmpl = _.template(tmplMarkup, { id : count });

		    wJQ('div.images').append(compiledTmpl);
		    // update form count
		    wJQ('#id_images-TOTAL_FORMS').attr('value', count+1);

		    new qq.FileUploader({
		        action: actionData,
		        element: wJQ('#image-upload-' + count)[0],
		        multiple: false,
		        forceMultipart:true,
		        inputName:'image',
		        uploadButtonText: '<button class="avatar big"><div class="asset"><div id="photo-holder-' + count + '" class="img-ctn photo"></div></div></button>',
		        fileTemplate: '<li style="display:none">' +
		                '<div class="qq-progress-bar"></div>' +
		                '<span class="qq-upload-spinner"></span>' +
		                '<span class="qq-upload-finished">s</span>' +
		                '<span class="qq-upload-file"></span>' +
		                '<span class="qq-upload-size"></span>' +
		                '<a class="qq-upload-cancel" href="#">{cancelButtonText}</a>' +
		                '<span class="qq-upload-failed-text">{failUploadtext}</span>' +
		                '</li>',
		        allowedExtensions: ['jpeg', 'jpg'],
		        sizeLimit:5 * 1024 * 1024, // 5M
		        onComplete: function(id, fileName, responseJSON) {

					if(responseJSON.errors) {
		                alert(responseJSON.errors);
		            } else {
		            	wJQ('#id_images-' + count + '-id').val(responseJSON.id);
		                wJQ('#loading-image-upload-' + count).hide();
		                wJQ('#remove-image-upload-' + count).show();
		            	wJQ('#photo-holder-' + count).css('background-image', 'url('+responseJSON.url+')');
		            	//wJQ('#image-upload-' + count).find('div.img-ctn.photo').css('background-image', 'url('+responseJSON.url+')');
		               	addImage();

		            }
		        },
		        onProgress: function(id, fileName, loaded, total){
		            wJQ('#loading-image-upload-' + count).show();
		        }
		    });
		}

		inst.on("click", ".remove-element",function(e){
			e.preventDefault();
			if(!wJQ(this).hasClass("remove-text")){
				wJQ(this).parent().remove();
				addImage();
			}
		});

    });
};

/**
	Equal height
**/
PT6.enhances.equalHeight = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			currentH, sets, field,
			isEvent  =  (typeof inst.data('isevent') !== 'undefined' ? inst.data('isevent') : false),
			tallest = (typeof inst.data('min') !== 'undefined' ? inst.data('min') : 0);


		if(wJQ(window).width() > 600){
			if(!isEvent){
				sets = wJQ("article", inst);
				sets.each(function(){
					field = wJQ(this);
					currentH = field.outerHeight();
					if(currentH > tallest){
						tallest = currentH;
					}
				});

				sets.height(tallest);
			}else{
					var blocks;
					sets = wJQ(".row", inst);
					sets.each(function(){
						field = wJQ(this);
						blocks = wJQ("article", field);
						tallest = 0;
						blocks.each(function(){
							currentH = wJQ(this).outerHeight();
							if(currentH > tallest){
								tallest = currentH;
							}
						})

						blocks.height(tallest);
					});

			}
		}



	});
};

/**
	Instagram api, takes latest pic
**/
PT6.enhances.instagramAPI = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			inst_img, inst_text, inst_link, inst_content,
			isOshKosh = (typeof inst.data('oshkosh') !== 'undefined' ? inst.data('oshkosh') : false);

		if(isOshKosh){
			var myUrl, myList = "<ul class='insta-list clearfix'>",
				myTag = inst.data('oshtag'),
				i = 0, maxImg;

			myUrl = "https://api.instagram.com/v1/users/22453804/media/recent?count=10&access_token=30519696.1ce09b4.3e70bdde751e4b64ad12d88b12f42fe4"
			wJQ.ajax({
		        type: "GET",
		        dataType: "jsonp",
		        cache: false,
		        url: myUrl,
		        success: function(data) {
		        	//console.log(data.data.length);
		        	maxImg = data.data.length > 9 ? 9 : data.data.length;
		        	for( ; i < maxImg; i++){
		        	inst_img = data.data[i].images.low_resolution.url;
		        	inst_link = data.data[i].link;
						myList += "<li><a href='" + inst_link + "' target='_blank'><img src='" + inst_img + "' alt=''></li>";
		        	}
		        	myList += "</ul>";
		        	myList += "<a href='http://instagram.com/pt6nation' target='_blank' class='extra-insta'>";
		        	myList += inst.data('extralink');
		        	myList += "</a>";
		        	inst.append(myList);
		        },
		        error: function(){
		        	//
					inst_content = "<a href='http://instagram.com/pt6nation' target='_blank'><img src='../assets/images/default-instagram.jpg' alt=''></a>";
		        	inst.append(inst_content);
		        }
		    });	

		}else{
			wJQ.ajax({
		        type: "GET",
		        dataType: "jsonp",
		        cache: false,
		        url: "https://api.instagram.com/v1/users/22453804/media/recent?count=1&access_token=30519696.1ce09b4.3e70bdde751e4b64ad12d88b12f42fe4",
		        success: function(data) {
		        	//console.log(data)
		        	inst_text = data.data[0].caption.text;
		        	inst_img = data.data[0].images.low_resolution.url;
		        	inst_link = data.data[0].link;
		        	inst_content = "<a href='" + inst_link + "' target='_blank'><img src='" + inst_img + "' alt=''><p>";
		        	inst_content += inst_text;
		        	inst_content += "</p></a>";
		        	inst.html(inst_content);
		        },
		        error: function(){
		        	//
					inst_content = "<a href='http://instagram.com/pt6nation' target='_blank'><img src='../assets/images/default-instagram.jpg' alt=''></a>";
		        	inst.html(inst_content);
		        }
		    });	
		}	

	});
};

/**
	All issues
**/
PT6.enhances.seeAllIssues = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			issues = wJQ(".other-issues"),
			inactiveIssues = wJQ(".future-issue", issues),
			activeIssues = wJQ(".see-all-issue", issues),
			closeLink = wJQ(".close", issues);

		issues.insertBefore("section.banner");

		var myDiv, elem, elemH, topVal, doneOnce = false;
		inst.on("click", function(e){
			e.preventDefault();
			//console.log(PT6.support.isie)
			if(PT6.support.isie){issues.toggle();}
							else{issues.slideToggle();}
			//center iamges text, only one
			if(!doneOnce){
				activeIssues.each(function(){
					elem = wJQ(this);
					myDiv = elem.find("div");
					elemH = elem.height();
					//console.log(elemH, myDiv.height())
					topVal = (elemH / 2) - (myDiv.height() / 2);
					myDiv.css({top : topVal});
				});
				doneOnce = true;
			}

			wJQ(".wings").toggle();
		});

		inactiveIssues.on("click", function(e){
			e.preventDefault();
		})

		closeLink.on("click", function(e){
			if(PT6.support.isie){issues.toggle();}
							else{issues.slideToggle();}
			wJQ(".wings").show();
		})

	});
};

/**
 * Validate change password
 *
 * @param ctx
 */
PT6.enhances.validatePwdform = function(ctx) {
    var myform = wJQ(this.elems);

    /*
     * Translated default messages for the jQuery validation plugin.
     * Locale: FR, En
     */

    if(global_lang == 'fr'){
        wJQ.extend(wJQ.validator.messages, {
            required: "Ce champ est requis.",
            equalTo: "Veuillez entrer une nouvelle fois la même valeur."
        });
    }else{
        wJQ.extend(wJQ.validator.messages, {
            required: "This field is required.",
            equalTo: "Please enter the same value again."
        });
    }

    /*
     * Ajax call
     */

    var options = {
        dataType:  'json',
        beforeSubmit: function() {
            return myform.validate();
        },
        success: function(data){
            if (data.error) {
                if (data.redirect){
                    window.location.href = data.redirect;
                } else {
                    wJQ('#global_error').html(data.error ? data.err_desc : myform.data("profupdated"))
                                        .removeClass('global-confirmation').addClass("global-error")
                                        .show();
                }
            } else {
                wJQ('#global_error').html(myform.data("profupdated"))
                                    .removeClass('global-error').addClass("global-confirmation")
                                    .show();
            }
            wJQ('html, body').animate({scrollTop:wJQ('#global_error').position().top}, 'fast');
        }
    };

    myform.ajaxForm(options);

    /*
     * Ajax call
     */
    myform.validate({
        rules: {
            password: "required",
            new_password:"required",
            confirmpassword: {
                equalTo: "#newpassword"
            }
        },
        errorElement: 'div',
        errorPlacement: function(error, element) {
            error.appendTo(element.parent());
        }
    });
}

/**
 * Validate form
 * @param ctx
 */
PT6.enhances.validateform = function(ctx) {
	var myform = wJQ(this.elems),
		myform_type =  myform.data('type'); //edit, signup, article

	/*
	 * Translated default messages for the jQuery validation plugin.
	 * Locale: FR, En
	 */

	if(global_lang == 'fr'){
		wJQ.extend(wJQ.validator.messages, {
			required: "Ce champ est requis.",
			remote: "Veuillez remplir ce champ pour continuer.",
			email: "Veuillez entrer une adresse courriel valide.",
			url: "Veuillez entrer une URL valide.",
			date: "Veuillez entrer une date valide.",
			dateISO: "Veuillez entrer une date valide (ISO).",
			number: "Veuillez entrer un nombre valide.",
			digits: "Veuillez entrer (seulement) une valeur numérique.",
			equalTo: "Veuillez entrer une nouvelle fois la même valeur.",
			accept: "Veuillez entrer une valeur avec une extension valide.",
			maxlength: wJQ.validator.format("Veuillez ne pas entrer plus de {0} caractà¨res."),
			minlength: wJQ.validator.format("Veuillez entrer au moins {0} caractà¨res."),
			rangelength: wJQ.validator.format("Veuillez entrer entre {0} et {1} caractà¨res."),
			range: wJQ.validator.format("Veuillez entrer une valeur entre {0} et {1}."),
			max: wJQ.validator.format("Veuillez entrer une valeur inférieure ou égale à   {0}."),
			min: wJQ.validator.format("Veuillez entrer une valeur supérieure ou égale à   {0}.")
		});
	}else{
		wJQ.extend(wJQ.validator.messages, {
			required: "This field is required.",
			remote: "Please fix this field.",
			email: "Please enter a valid email address.",
			url: "Please enter a valid URL.",
			date: "Please enter a valid date.",
			dateISO: "Please enter a valid date (ISO).",
			number: "Please enter a valid number.",
			digits: "Please enter only digits.",
			equalTo: "Please enter the same value again.",
			accept: "Please enter a value with a valid extension.",
			maxlength: wJQ.validator.format("Please enter no more than {0} characters."),
			minlength: wJQ.validator.format("Please enter at least {0} characters."),
			rangelength: wJQ.validator.format("Please enter a value between {0} and {1} characters long."),
			range: wJQ.validator.format("Please enter a value between {0} and {1}."),
			max: wJQ.validator.format("Please enter a value less than or equal to {0}."),
			min: wJQ.validator.format("Please enter a value greater than or equal to {0}.")
		});
	}

	/**
	 * Additional Method, behavior
	 */

	wJQ.validator.addMethod("videourl", function(url, element) {
		if(url == '') return true;
		var p = /^(http|https):\/\/(?:.*?)\.?(youtube|vimeo)\.com\/(watch\?[^#]*v=(\w+)|(\d+)).+$/,
			result =  url.match(p) ? true : false ;
		return result;
	}, "Please enter a valid url");

	// Captcha refresh button - only use in SIGN UP form
	wJQ('.js-captcha-refresh').on('click', function() {
		wJQ.get(wJQ(this).data('url'), function(data) {
			wJQ('#captcharefresh').html(data);
			wJQ('#id_captcha_1').val('').keyup();
		});
	});

	/*
	* Ajax call
	 */

	var options = {
		dataType:  'json',
		beforeSubmit: function() {
			// Put the captcha into low case. Only for SIGN UP form
			if(myform_type == 'signup')
				wJQ('#id_captcha_1').val().toLowerCase();

			return myform.validate();
		},
		success: function(data){

			if(myform_type == 'edit'){
				// EDIT PROFILE confirmation

				if (data.error) {
					wJQ('#global_error').html(data.error ? data.err_desc : myform.data("profupdated"))
						.removeClass('global-confirmation').addClass("global-error")
						.show();
				}else{
					wJQ('#global_error').html(data.error ? data.err_desc : myform.data("profupdated"))
						.removeClass('global-error').addClass("global-confirmation")
						.show();

                    if (data.navpicture40){
                        wJQ('#navpicture40').attr('src', data.navpicture40);
                    }
				}

				wJQ('html, body').animate({scrollTop:wJQ('#global_error').position().top}, 'fast');
			}else if(myform_type == 'signup'){
				if (data.error) {
					// Reset the captcha
					wJQ('.js-captcha-refresh').trigger('click', function(){
						wJQ('#id_captcha_1').val('').keyup();
					});
					// Find the error
					if (data.error_field) {
						for (var key in data.error_field) {
							//console.log(key);
							if (key == 'captcha') {
								//todo: show error only when the user didn't enter it correctly
							}
						}
					}

                    if (data.err_desc) {
                        wJQ('#global_error').html(data.err_desc)
                            .removeClass('global-confirmation').addClass("global-error")
                            .show();
                        wJQ('html, body').animate({scrollTop:wJQ('#global_error').position().top}, 'fast');
                    }

					return wJQ(this.elems).validate();
				}else{
					// SIGN UP confirmation
					wJQ('#btnsubmit, #btncancel, #global-error-message').hide();
					wJQ('#global_error').hide();
					wJQ('#confirmation').show();
					wJQ('#confirmationimage').html(wJQ('#mainthumbnail').html());
					wJQ('html, body').animate({scrollTop:wJQ('#confirmation').position().top}, 'fast');
				}
			}
		}
	};

	if(myform_type == 'article'){
		myform.validate();
	}else{
		// Captcha refresh button - only use in SIGN UP form
		wJQ('.js-captcha-refresh').on('click', function() {
			wJQ.get(wJQ(this).data('url'), function(data) {
				wJQ('#captcharefresh').html(data);
				wJQ('#id_captcha_1').val('').keyup();
			});
		});

		/*
		 * Ajax call
		 */

		var options = {
			dataType:  'json',
			beforeSubmit: function() {
				// Put the captcha into low case. Only for SIGN UP form
				if(myform_type == 'signup')
					wJQ('#id_captcha_1').val().toLowerCase();
				return myform.validate();
			},
			success: function(data){

				if(myform_type == 'edit'){
					// EDIT PROFILE confirmation
                    if (data.error) {
						wJQ('#global_error').html(data.error ? data.err_desc : myform.data("profupdated"))
							.removeClass('global-confirmation').addClass("global-error")
							.show();
					}else{
						wJQ('#global_error').html(data.error ? data.err_desc : myform.data("profupdated"))
							.removeClass('global-error').addClass("global-confirmation")
							.show();

                        if (data.navpicture40){
                            wJQ('#navpicture40').attr('src', data.navpicture40);
                        }
					}

					wJQ('html, body').animate({scrollTop:wJQ('#global_error').position().top}, 'fast');
				}else if(myform_type == 'signup'){
					if (data.error) {
						// Reset the captcha
						wJQ('.js-captcha-refresh').trigger('click', function(){
							wJQ('#id_captcha_1').val('').keyup();
						});
						// Find the error
						if (data.error_field) {
							for (var key in data.error_field) {
								//console.log(key);
								if (key == 'captcha') {
									//todo: show error only when the user didn't enter it correctly
								}
							}
						}

						if (data.err_desc) {
							wJQ('#global_error').html(data.err_desc)
								.removeClass('global-confirmation').addClass("global-error")
								.show();
							wJQ('html, body').animate({scrollTop:wJQ('#global_error').position().top}, 'fast');
						}

						return wJQ(this.elems).validate();
					}else{
						// SIGN UP confirmation
						wJQ('#btnsubmit, #btncancel, #global-error-message').hide();
						wJQ('#global_error').hide();
						wJQ('#confirmation').show();
						wJQ('#confirmationimage').html(wJQ('#mainthumbnail').html());
						wJQ('html, body').animate({scrollTop:wJQ('#confirmation').position().top}, 'fast');
					}
				}
			}
		};

		myform.ajaxForm(options);

		/*
		 * Ajax call
		 */
		myform.validate({
			rules: {
				ignore:'[]',
				password: "required",
				password_confirm: {
					equalTo: "#password"
				},
				captcha: "required",
				profil:"required",
				videourl: true,
				captcha_1:{
					required: true
				}
			},
			errorElement: 'div',
			errorPlacement: function(error, element) {
				if(element.attr("type") != undefined && element.attr("type") == "radio"){
					wJQ(".sidebar-block-2 legend").after(error)
				}else{
					error.appendTo(element.parent());
				}

			}
		});
	}

	wJQ('input, textarea', myform).keyup(function() {
		wJQ('#global_error').text('');
	});
	wJQ('select, input[type="checkbox"], input[type="radio"]', myform).change(function() {
		wJQ('#global_error').text('');
	});

};


/**
	Manages events for individual posts displayed on commun page, plus adds moment.js funcionality
 // transform datetime to moment string, expected format is YYYY-MM-DD HH:mm:ss
 */
PT6.enhances.indPost = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			elems = wJQ(".moment-time", inst),
			dateStr,
			isInCommuPage = (typeof inst.data('hasshare') !== 'undefined' ? inst.data('hasshare') : false),
			isTouchDevice = Modernizr.touch;
        if (global_lang == 'fr') {
            moment.lang('fr', {
                relativeTime : {
                    future : "dans %s",
                    past : "Il y a %s",
                    s : "quelques secondes",
                    m : "une minute",
                    mm : "Il y a %d minutes",
                    h : "une heure",
                    hh : "%d heures",
                    d : "un jour",
                    dd : "%d jours",
                    M : "un mois",
                    MM : "%d mois",
                    y : "une année",
                    yy : "%d années"
                }
            });
            //moment.lang(global_lang);
        }

		elems.each(function(){
			var thisMoment = wJQ(this);
			dateStr = thisMoment.text();
			thisMoment.text(moment(dateStr, "YYYY-MM-DD HH:mm:ss").fromNow());
		});

		//very random bug where ie9 will lose focus state when hovering over this link
		//i included it here because this function is run on the same instance as the moment.js
		if(PT6.support.isie9){
			inst.on({
			    mouseenter: function() {
			        wJQ(this).closest(".shareButton").addClass("fix-top-ie");
			    },
			    mouseleave: function() {
			        wJQ(this).closest(".shareButton").removeClass("fix-top-ie");
			    }
			}, ".addthis_button_facebook_like");
		}
		if(isInCommuPage){
			var shareElem, shareBox, listToAdd = "",
				shareElems = wJQ(".share", inst),
				idstart = inst.data('id'),
				currentElem, myId;

			//set unique ids for all share elems
			shareElems.each(function(index){
				currentElem = wJQ(this);
				myId = idstart + (index + 1);
				currentElem.attr("id", myId)
			});

			listToAdd += "<a class='addthis_button_facebook_like' fb:like:layout='button_count'></a>";
			listToAdd += "<a class='addthis_button_google_plusone' g:plusone:size='medium' g:plusone:annotation='bubble'></a>";
			listToAdd += "<a class='addthis_button_twitter icon-share-t'></a>";
			//listToAdd += "<a class='addthis_button_google_plusone_badge icon-share-g' g:plusone:size='small' g:plusone:href='https://plus.google.com/107322991576785974275/'></a>";
			listToAdd += "<a class='addthis_button_linkedin icon-share-l'></a>";
			listToAdd += "<a class='addthis_button_email icon-share-e'></a>";

			inst.on({
			    mouseenter: function() {
			        shareElem = wJQ(this);
			        shareBox = wJQ(".addthis_toolbox", shareElem);
			        if(!shareElem.hasClass("isSet")){
			        	shareBox.html(listToAdd);
			        	shareBox.find("a").attr("addthis:url", shareElem.data("url"))
			        	myId = "#" + shareElem.attr("id");
			        	//adds social addthis dinamically only on hover
			        	addthis.toolbox(myId);
			        	shareElem.addClass("isSet");
			        }
			    },
			    mouseleave: function() {
			    }
			}, ".share");

			if(isTouchDevice){
				var shareTouch = wJQ(".shareHover", inst);
				//this fires the enter event in touch devices
				inst.on("click", ".shareHover", function(){})
			}
		}

	});
};



/**
 * Mansory grid layout for post
 * @param ctx
 */
PT6.enhances.postgrid = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
		windowObj = wJQ(window);

		if(windowObj.width() > 960){
			inst.masonry({
				itemSelector: 'article',
				isResizable : true,
				columnWidth: function( containerWidth ) {
					//console.log(containerWidth)
				    return containerWidth / 3;
				}
			});
		}else if((windowObj.width() <= 960) && (windowObj.width() > 600)){
			inst.masonry({
				itemSelector: 'article'
			});
		}
		//for screens under 600 no masonry required.

	});

};



/**
 * Add many links
 */
PT6.enhances.addlinks = function(ctx) {
	wJQ(this.elems).each(function () {
		var elm = wJQ(this);

		// Edit link
		elm.on("click", ".edit-link", function(e){
			e.preventDefault();
			var elm = wJQ(this),
				parent = elm.parent().parent();
			wJQ('.item-input', parent).show(0);
			wJQ('.edit-link', parent).hide(0);
			wJQ('.submit-link', parent).show(0);
			wJQ('.item-link', parent).hide(0);
		});

		// Submit the link (it become a clickable link that you can edit)
		elm.on("click", ".submit-link", function(e){
			e.preventDefault();
			var elm = wJQ(this),
				parent = elm.parent().parent(),
				item_input = wJQ('.item-input', parent),
				fieldValue = item_input.val();
			if(fieldValue !== '' && !item_input.hasClass('error')){
				wJQ('.item-value', parent).val(fieldValue);
				item_input.hide(0);
				elm.hide(0);
				wJQ('.edit-link', parent).show(0).css('overflow','visible');
				wJQ('.item-link', parent).attr('href', fieldValue).text(fieldValue).show(0);
			}
		});

		elm.on("click", ".remove-element",function(e){
			e.preventDefault();
			if(wJQ(this).hasClass("remove-text")){
				var elm = wJQ(this),
					parent = elm.parent().parent();
				if(parent.find('.delete-element').length < 1){
					parent.remove();
				}else{
					parent.find('.delete-element').val('on');
					parent.hide();
				}
			}
		});

		// Add a new link
		elm.on("click", ".add-link", function(e){
			e.preventDefault();
			var elm = wJQ(this),
				parent = wJQ(this).parents('.input'),
				count = wJQ('.items-wrapper', parent).children().length,
				type = parent.data('type'),
				tmplMarkup = wJQ('#' + type + '-template').html(),
				compiledTmpl;
			// todo: when we delete link it is possible that the count already exists, we don't want this
			while( wJQ('#id_' + type + '-' + count + '-id').length > 0 ){
				count++;
			}

			compiledTmpl = _.template(tmplMarkup, { id : count });
			wJQ('.items-wrapper', parent).append(compiledTmpl);
			// update form count
			wJQ('#id_' + type + 's-TOTAL_FORMS').attr('value', count+1);
		});
	});
};



/**
 * Events calendar
 */
PT6.enhances.calendar = function(ctx) {
	wJQ(this.elems).each(function () {
		var elm = wJQ(this),
			parent = elm.parents('.sidebar'),
			url,
			calendarTitle = wJQ('.title-calendar', parent).text(),
			eventsTitle = wJQ('.title-event', parent).text(),
			seeMoreText=wJQ('.see-more-title', parent).text();
		// Update content sidebar
		function getContent(url){
			url = url + '?title=' + calendarTitle + '&events_title=' + eventsTitle + '&see_more=' + seeMoreText;
			wJQ.ajax({
				url: url
			}).done(function(data) {
				parent.html(data);
			});
		}
		// Add a new link
		parent.on("click", '.prev', function(e){
			e.preventDefault();
			var button = wJQ('.prev', parent);
			url = button.attr('href');
			getContent(url);
		});
		// Add a new link
		parent.on("click", '.next', function(e){
			e.preventDefault();
			var button = wJQ('.next', parent);
			url = button.attr('href');
			getContent(url);
		});

		// Add a new link
		parent.on("click", '.see-more', function(e){
			e.preventDefault();
			var elm =  wJQ(this);
			wJQ('.more', parent).toggleClass('hidden');
			elm.toggleClass('active').hide();
		});
	});
};



/**
 * Wall of fame
 */
PT6.enhances.wallOfFame = function(ctx) {
	wJQ(this.elems).each(function () {
		var inst = wJQ(this),
			mask = wJQ(".wall-mask", inst),
			wallFame = wJQ("#wall-of-fame"),
			overLay = wJQ("#wall-overlay"),
			wallWrapper = wJQ(".wall-viewport"),
			windowObj = wJQ(window),
			currentMemberID, randomId;


		var closeMe = function(){
			if(!isTrigger){
	            location.reload(true);
			}else{
				overLay.hide();
				wJQ("#signup-mask").fadeOut();
			}
		}

		var resetFind = function(){
			wallFame.removeClass("found-me");
			wJQ(".isFound", inst).removeClass("isFound");
		}

		var fillGrid = function(){

			var membersNum, tempMembersNum, tempWall_of_fame, newWall_of_fame,
				randomNum, i = 0, randomMember,
				myString = "",
				myLink = "<a href='#' class='member-link'><span></span>",
				myLinkClose = "</a>",
				memberBox = wJQ(".member-alert", inst),
				memberName = wJQ(".member-name", memberBox),
				memberLoc = wJQ(".member-loc", memberBox),
				memberPic = wJQ(".member-pic", memberBox),
				memberFlag = wJQ(".member-flag", memberBox),
				memberLink = wJQ(".member-profile", memberBox);

			membersNum = wall_of_fame.length;	
			tempWall_of_fame = wall_of_fame;
			
			//checks if #members is less than 300
			//duplicates content
			while(membersNum < 300){
				tempWall_of_fame = wall_of_fame.concat(tempWall_of_fame);
				membersNum = tempWall_of_fame.length;	
			}	
			if(membersNum > 312){
				tempWall_of_fame = tempWall_of_fame.slice(0, 312);
				membersNum = tempWall_of_fame.length;
			}
			wall_of_fame = tempWall_of_fame;

			//if current member on wall, then add it.
			if (current_member) {
				currentMemberID = Math.floor(Math.random()*wall_of_fame.length);
				wall_of_fame.splice(currentMemberID, 0, current_member);
				//console.log(currentMemberID);
			};
			membersNum = wall_of_fame.length;

			//build list of ~300 members for wall
			for(; i < membersNum; i++){
				myString += myLink;
				myString += "<img src='" + wall_of_fame[i].picture50x50 + "' id='num-" + i +"' data-num='" + i +"'>";
				myString += myLinkClose;
			}

			//plugin that builds the grid
			wallFame.mapz();
			wJQ("#wall-content").html("").append(myString);


			var myImage, numId;
			//individual thumbs click
			inst.on("click",".member-link", function(e){
				e.preventDefault();
				resetFind();
				myImage = wJQ(this).find("img");
				numId = myImage.data("num");
				memberName.text(wall_of_fame[numId].fullname);
				memberLoc.text(wall_of_fame[numId].location);
				memberPic.attr("src",wall_of_fame[numId].picture110);
				memberFlag.attr("src","/static/assets/images/flags/" + wall_of_fame[numId].flag.toLowerCase() + ".gif");
				memberLink.attr("href",wall_of_fame[numId].profile);

				memberBox.css({left : ((wallWrapper.width() / 2) - (memberBox.width() / 2)), top : ((wallWrapper.height() / 2) - (memberBox.height() / 2))})
				//alert(memberBox.height() + "   -  "  + memberBox.css("top"))
				if(windowObj.width() < 600) {
					memberBox.css({top: 85})
				}
				memberBox.fadeIn();
				mask.fadeIn();
			});

			//closes member overlay
			inst.on("click",".icon-close, .wall-mask, .find-me ", function(e){
				memberBox.fadeOut();
				mask.hide();
			});

		}

		var shareHoveronOverlay = function(){
			var listToAdd = "", 
				extraShare = wJQ("#extraShare"),
				shareElem;

			listToAdd += '<a class="addthis_button_facebook_like" fb:like:layout="button_count"></a>';
	        listToAdd += '<a class="addthis_button_tweet"></a>';
	        listToAdd += '<a class="addthis_button_google_plusone" g:plusone:size="medium"></a>';
	        listToAdd += "<a class='addthis_button_linkedin icon-share-l'></a>";
	        listToAdd += '<a class="addthis_button_email icon-share-e"></a>';

			overLay.on({
			    mouseenter: function() {
			        shareElem = wJQ(this);
			        if(!shareElem.hasClass("isSet")){
			        	extraShare.html(listToAdd);
			        	//adds social addthis dinamically only on hover
			        	addthis.toolbox("#extraShare");
			        	shareElem.addClass("isSet");
			        }
			    },
			    mouseleave: function() {
			    }
			}, ".share");

			if(Modernizr.touch){
				var shareTouch = wJQ(".shareHover", overLay);
				overLay.on("click", ".shareHover", function(){})
			}
		};


		var addMeToWall = function(){
			var el = wJQ(".add-me", inst),
				url= inst.data("addmeurl");
           // wJQ.getJSON(el.attr('href'), function(data) {
            wJQ.getJSON(url, function(data) {
                //console.log(data)
                if (data.redirect) {
                	callAddMeAgain = true;
                    //console.log('set session url')
                    //console.log(el.data('setsession'));
                    wJQ.get(el.data('setsession'));
                    wJQ("html, body").animate({ scrollTop: 0 }, 500, function(){
						wJQ('.signUpLink').trigger('click');
					});
                } else {
                	//console.log("fsd")
                    if (data.adddone) {
                        //console.log('build the overlay')
                        //console.log(data);
						shareHoveronOverlay();
				    	var docW = windowObj.width(),
				    		docH = windowObj.height(),
				    		leftVal = (docW / 2) - (overLay.outerWidth() / 2),
				    		topVal = (docH / 2) - (overLay.outerHeight() / 2),
				    		maskFull, memberBox = wJQ(".member-alert", overLay);


						wJQ(".member-name", overLay).text(data.fullname)
						wJQ(".member-loc", overLay).text(data.location)
						wJQ(".member-pic", overLay).attr("src",data.picture110);
						wJQ(".member-flag", overLay).attr("src","/static/assets/images/flags/" + data.flag.toLowerCase() + ".gif");
						wJQ(".member-profile", overLay).attr("href", data.profile )


                        if(!Modernizr.touch){
		                    wJQ("html, body").animate({ scrollTop: 0 }, 500, function(){
								overLay.css({left: leftVal, top: topVal}).show();
							});

							windowObj.off().on('scroll', function(){
								var scrollTop = windowObj.scrollTop();
								overLay.css({top: topVal + scrollTop})
							});
					    } else {
					    	wJQ("html, body").animate({ scrollTop: 0 }, 500);
					    	overLay.addClass("show-in-mobile")
				    			   .insertAfter(".top-bar");
				    		overLay.slideDown();
					    }


						if(!wJQ("#signup-mask").length){
							wJQ("body").append("<span id='signup-mask' />");
						}
						maskFull = wJQ("#signup-mask");
						maskFull.fadeIn()
							.height(wJQ(document).height());

						maskFull.off().on("click", closeMe);

                    }
                }
            });
			overLay.on("click",".close-overlay", closeMe);
		}


		//actions

		fillGrid();

		// trigger for add me button
        inst.on("click",".add-me", function(e){
            e.preventDefault();
            addMeToWall();
        });

        //find me functionality
		var findMe = function(elem){
				var maxLimits = wJQ(".wall-constraint").position(),
					currentWallPos = wallFame.position();

				//randomId =  wJQ("#num-" + (Math.floor(Math.random()*312))).parent();
				randomId =  wJQ("#num-" + currentMemberID ).parent();


				var clickedItemLeft = parseInt(randomId.position().left),
				    clickedItemTop = parseInt(randomId.position().top),
				    currentWallLeft = Math.abs(currentWallPos.left),
				    currentWallTop = Math.abs(currentWallPos.top),
				    leftWidthPos = parseInt(wallWrapper.width() + currentWallLeft),
				    topHeightPos = parseInt(wallWrapper.height() + currentWallTop),
				    isGoodLeft, isGoodTop, valueToMoveTop, valueToMoveLeft;

				//console.log("item top:  " + clickedItemTop, "   -wall pos top:  " + currentWallTop,"   -whatcurrentwall top:  " + topHeightPos )

				wJQ(".isFound", inst).removeClass("isFound");

				isGoodLeft = clickedItemLeft > currentWallLeft && clickedItemLeft < (leftWidthPos-80) ? true : false;
				isGoodTop = clickedItemTop > currentWallTop && clickedItemTop < (topHeightPos-80) ? true : false;

				var setValuetoMove = function(isTop, isLeft){
					var value;
					if(isTop){
          				value = clickedItemTop == 0 ? 0 : (-(clickedItemTop) < maxLimits.top ? maxLimits.top : -(clickedItemTop));
					}
					if(isLeft){
          				value = clickedItemLeft == 0 ? 0 : (-(clickedItemLeft) < maxLimits.left ? maxLimits.left : -(clickedItemLeft));
					}
					return value;
				}

				var onMoveComplete = function(){
					wallFame.addClass("found-me");
					randomId.addClass("isFound");
					testtime = setTimeout(function () {
						randomId.trigger("click");
						resetFind();
		            },1000);
				}

				if(isGoodLeft && isGoodTop ){
				      onMoveComplete();
				}else{
				      if(isGoodLeft && !isGoodTop ){
				          valueToMoveTop = setValuetoMove(true, false);
				          wallFame.animate({top:valueToMoveTop},500, onMoveComplete);
				      }else if(!isGoodLeft && isGoodTop ){
				          valueToMoveLeft = setValuetoMove(false, true);
				          wallFame.animate({left:valueToMoveLeft},500, onMoveComplete);
				      }else{
				          valueToMoveTop = setValuetoMove(true, false);
				          valueToMoveLeft = setValuetoMove(false, true);
				          wallFame.animate({left:valueToMoveLeft, top: valueToMoveTop},500, onMoveComplete);
				      }
				}

		}


		inst.on("click",".find-me", function(){
			findMe(wJQ(this));
		});

		if(isTrigger){
            addMeToWall();
		}

		//fix social weird hover on IE where .share loses focus
		if(PT6.support.isie){
			overLay.on({
			    mouseenter: function() {
			        wJQ(this).closest(".share").addClass("fix-top-ie");
			    },
			    mouseleave: function() {
			        wJQ(this).closest(".share").removeClass("fix-top-ie");
			    }
			}, ".addthis_toolbox > a");
		}

	});
};



/** Enhance placeholder capabilities for IE < 10 **/
PT6.enhances.placeholder = function(ctx) {
    // Test for placeholder support
    var test = document.createElement('input');
    PT6.support.placeholder = ('placeholder' in test);

    // Placeholder is not support so we need to fake the same functionality
    if(!PT6.support.placehoder) {
        wJQ(this.elems).each(function () {
            var wJQinst = wJQ(this),
                wJQform = (this.tagName == 'FORM' ? wJQinst : wJQinst.parents('form:first')), // Current form
                wJQinputs = wJQ('input[placeholder], textarea[placeholder]', wJQform).not(':password,:checkbox,:radio,[type=hidden]'), // Get all inputs in current form
                active = document.activeElement; // Get current active element

            wJQinputs.focus(function () {
                var wJQthis = wJQ(this);
                if (wJQthis.val() == wJQthis.attr('placeholder')) {
                    wJQthis.val('').removeClass('hasPlaceholder');
                }
            }).blur(function () {
                var wJQthis = wJQ(this),
                    val = wJQthis.val(),
                    ph = wJQthis.attr('placeholder');
                if (val == '' || val == ph) {
                    wJQthis.val(ph).addClass('hasPlaceholder');
                }
            }).blur(); // Force a blur on all input to init the placeholder

            wJQ(active).focus(); // Re-focus on the original active element

            // Remove placeholder value on form submit
            wJQform.submit(function () {
                wJQ(this).find('.hasPlaceholder').each(function() {
                    wJQ(this).val('');
                });
            });

        });
    }
};

