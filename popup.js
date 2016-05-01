var pageImages = [];
var currentImageIdx = [];
	currentImageIdx["image1"] = 0;
	currentImageIdx["image2"] = 0;

$(document).ready(function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {message: "get_all_images"}, function(response) {
			if(response){
				pageImages = response.allImages;
				$(".options-container").css("background-image","url("+pageImages[0]+")");
				currentImageIdx["image1"] = 0;
				currentImageIdx["image2"] = 0;
			}
		});
	});
	
	chrome.storage.sync.get(null, function(items) {
		if (!chrome.runtime.error) {
		  $("#question").val(items.question);
		  $("#num_of_opinions").val(items.num_of_opinions);
		  $("#payment_rate").val(items.payment_rate);
		  if(items.sessionQuestion != undefined)
			$("#question").val(items.sessionQuestion);
		  if (items.sessionOpinion != undefined)
			$("#num_of_opinions").val(items.sessionOpinion);
		  if (items.sessionPay != undefined)
			$("#payment_rate").val(items.sessionPay);
		  if(items.image1 != undefined && items.image1 != ""){
			$("#image1").css("background-image","url("+items.image1+")");
			var _parent = $("#image1");
			_parent.find(".image-options").hide();
			_parent.find(".close-button").show();
		  }
		  if(items.image2 != undefined && items.image2 != ""){
			$("#image2").css("background-image","url("+items.image2+")");
			var _parent = $("#image2");
			_parent.find(".image-options").hide();
			_parent.find(".close-button").show();
		  }
		  if(items.activeHIT == undefined)
			  chrome.storage.sync.set({"activeHIT" : []},function(){});
		  if(items.description == undefined)
			  chrome.storage.sync.set({"description" : "Please answer this HIT truthfully, since it's important for the person who asked for your opinion :)"},function(){});
		  if(items.payment_rate == undefined)
			  chrome.storage.sync.set({"payment_rate" : 5},function(){});
		  if(items.is_accelerated == undefined)
			  chrome.storage.sync.set({"is_accelerated" : false},function(){});
		}
	});
	
	$(".fa-cog").click(function(){
		chrome.runtime.openOptionsPage(function(){});
	})
	
	$(".fa-list").click(function(){
		$("#results").fadeIn();
	})
	
	$("#results .fa-times").click(function(){
		$("#results .json").text("");
		$("#results").fadeOut();
	})
	
	$("#results button").click(function(e){
		e.preventDefault();
		var _ids = [];
		chrome.storage.sync.get("activeHIT",function(items){
			_ids = items.activeHIT;
			for(var i = 0; i < _ids.length; i++){
				var _hitID = _ids[i];
				$.ajax({
					url:"http://stevenjamesmoore.com/api/values/GetHITResults?hitID="+_hitID,
					dataType:"json",
					beforeSend:function(){
						console.log("http://stevenjamesmoore.com/api/values/GetHITResults?hitID="+_hitID)
					},
					success:function(response){
						$("#results .json").append(response.replace(new RegExp('{', 'g'),'').replace(new RegExp('}', 'g'),'').replace(new RegExp('"', 'g'),'').replace(new RegExp(',', 'g'),"<br />") + "<br /><br />");
					}
				})
			}
		})
	})
	
	$(".click").click(function(){
		if(pageImages.length == 0){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {message: "get_all_images"}, function(response) {
					pageImages = response.allImages;
					if(pageImages.length > 0){
						$(".options-container").css("background-image","url("+pageImages[0]+")");
					}
					else{
						$(".options-container").text("No image found");
					}
				});
			});
		}
		var _parent = $(this).parents(".image");
		_parent.find(".image-options").fadeOut();
		_parent.find(".close-button").fadeIn();
		_parent.find(".select-input").fadeIn();	
	})

	$(".paste").click(function(){
		var _parent = $(this).parents(".image");
		_parent.find(".image-options").fadeOut();
		_parent.find(".close-button").fadeIn();
		_parent.find(".link-input").fadeIn();
	})

	$(".upload").click(function(){
		var _parent = $(this).parents(".image");
		_parent.find(".image-options").fadeOut();
		_parent.find(".close-button").fadeIn();
		_parent.find(".upload-input").fadeIn();
	})

	$(".link-input .go-button").click(function(e){
		e.preventDefault();
		var _this = $(this);
		var _parent = $(this).parents(".link-input");
		_this.find(".fa").removeClass("fa-check").addClass("fa-circle-o-notch fa-spin");
		if(_parent.find("input").val() != ""){
			var _target = _parent.data("target");
			var _src = _parent.find("input").val();
			$("#"+_target).css("background-image","url("+_src+")");
			var storage = new Object();
			storage[_target] = _src;
			chrome.storage.sync.set(storage, function() {
				if (chrome.runtime.error) {
				  console.log("Runtime error.");
				}
			})
			var _img = new Image();
			_img.src = _src;
			_img.onload = function(){
				_parent.fadeOut();
				_this.find(".fa").addClass("fa-check").removeClass("fa-circle-o-notch fa-spin");
			};
		}
	})
	
	$(".upload-input .go-button").click(function(e){
		e.preventDefault();
		var _this = $(this);
		var _parent = $(this).parents(".upload-input");
		var file = _parent.find("input")[0].files[0];
		_this.find(".fa").removeClass("fa-check").addClass("fa-circle-o-notch fa-spin");
		if (file) {
			var _target = _parent.data("target");
			var reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = function(e) {
				$("#"+_target).css("background-image","url("+e.target.result+")");
				_parent.fadeOut();
				_this.find(".fa").addClass("fa-check").removeClass("fa-circle-o-notch fa-spin");
			};
		}
	})
	
	$(".select-input .go-button").click(function(e){
		e.preventDefault();
		var _this = $(this);
		_this.find(".fa").removeClass("fa-check").addClass("fa-circle-o-notch fa-spin");
		var _parent = $(this).parents(".select-input");
		var _target = _parent.data("target");
		var _src = pageImages[currentImageIdx[_target]];
		if(_src == undefined){
			_parent.parents(".image").find(".image-options").fadeIn();
			_parent.parents(".image").find(".close-button").fadeOut();
			_parent.parents(".image").find(".options-container").text("");
		}
		else{
			$("#"+_target).css("background-image","url("+_src+")");
			var storage = new Object();
			storage[_target] = _src;
			chrome.storage.sync.set(storage, function() {
				if (chrome.runtime.error) {
				  console.log("Runtime error.");
				}
			})
		}		
		_parent.fadeOut();
		_this.find(".fa").addClass("fa-check").removeClass("fa-circle-o-notch fa-spin");
	})
	
	$(".select-input .nav-button").click(function(e){
		e.preventDefault();
		var _parent = $(this).parents(".select-input");
		var _target = _parent.data("target");
		if($(this).hasClass("prev-button")){
			if (currentImageIdx[_target] == 0) currentImageIdx[_target] = pageImages.length - 1;
			else currentImageIdx[_target]--;
		}
		else{
			if (currentImageIdx[_target] == pageImages.length - 1) currentImageIdx[_target] = 0;
			else currentImageIdx[_target]++;
		}
		$("#"+_target).find(".options-container").css("background-image","url("+pageImages[currentImageIdx[_target]]+")");
	})
	
	$(".close-button").click(function(){
		var _parent = $(this).parents(".image");
		chrome.storage.sync.remove(_parent.attr("id"), function() {
			if (chrome.runtime.error) {
			  console.log("Runtime error.");
			}
		})
		_parent.css("background-image","none");
		_parent.find(".image-options").fadeIn();
		_parent.find(".link-input").fadeOut();
		_parent.find(".upload-input").fadeOut();
		_parent.find(".select-input").fadeOut();
		_parent.find(".link-input").find("input").val("");
		_parent.find(".upload-input").find("input").val("");
		_parent.find(".options-container").text("");
		_parent.find(".close-button").fadeOut();
	})
	
	$("#question").keyup(function(){
		var question = $(this).val();
		chrome.storage.sync.set({ "sessionQuestion" : question }, function() {
			if (chrome.runtime.error) {
			  console.log("Runtime error.");
			}
		})
	})
	
	$("#num_of_opinions").keyup(function(){
		var n = $(this).val();
		chrome.storage.sync.set({ "sessionOpinion" : n }, function() {
			if (chrome.runtime.error) {
			  console.log("Runtime error.");
			}
		})
	})
	
	$("#payment_rate").keyup(function(){
		var n = $(this).val();
		chrome.storage.sync.set({ "sessionPay" : n }, function() {
			if (chrome.runtime.error) {
			  console.log("Runtime error.");
			}
		})
	})
	
	$("#num_of_opinions").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
	
	$("#flipflop-form").submit(function(e){
		e.preventDefault();
		$(".loading").fadeIn();
		chrome.storage.sync.get(null, function(items) {
			var _storage = items;
			if(_storage.sessionQuestion == undefined || _storage.sessionQuestion == "") _storage.sessionQuestion = _storage.question;
			if(_storage.sessionOpinion == undefined) _storage.sessionOpinion = _storage.num_of_opinions;
			if(_storage.sessionPay == undefined) _storage.sessionPay = _storage.payment_rate;
			if(_storage.sessionAccelerate == undefined) _storage.sessionAccelerate = _storage.is_accelerated;
			$.ajax({
				url: "http://stevenjamesmoore.com/api/values/CreateNewHIT",
				dataType: "json",
				data:{
					image1:_storage.image1,
					image2:_storage.image2,
					question:_storage.sessionQuestion,
					payment_rate:_storage.sessionPay,
					num_of_opinions:_storage.sessionOpinion,
					is_accelerated:_storage.sessionAccelerate,
					description:_storage.description
				},
				success:function(response){
					var activeHIT = _storage.activeHIT;
					activeHIT.push(JSON.parse(response).HitID);
					chrome.storage.sync.set({"activeHIT" : activeHIT},function(){});
					
					var background = chrome.extension.getBackgroundPage();
					background.tryGetResults();
					
					var toRemove = ['sessionQuestion','sessionPay','sessionOpinion','sessionAccelerate','image1','image2'];
					chrome.storage.sync.remove(toRemove, function() {
						if (chrome.runtime.error) {
						  console.log("Runtime error.");
						}
					})
					
					$(".loading").fadeOut();
					$("form input").val("");
					$(".image").css("background-image","none");
					$(".image").find(".image-options").show();
					$(".image").find(".link-input").hide();
					$(".image").find(".upload-input").hide();
					$(".image").find(".select-input").hide();
					$(".image").find(".options-container").text("");
					$(".image").find(".close-button").hide();
					window.close();
				}
			})
			if (chrome.runtime.error) {
			  console.log("Runtime error.");
			}
		})
	})
})