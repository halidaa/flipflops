var pageImages = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(request.ping) { sendResponse({pong: true}); return; }
    if( request.message === "clicked_browser_action" ) {
    }
	else if(request.message === "get_all_images"){
		getAllImages();
		sendResponse({"allImages":pageImages});
	}
	return true;
  }
);

function getAllImages() {
	$("img").each(function(){
		if($(this).width() > 100)
			pageImages.push($(this)[0].src);
	})
}