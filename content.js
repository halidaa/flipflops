var pageImages = [];

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if(request.ping) { sendResponse({pong: true}); return; }
    if( request.message === "clicked_browser_action" ) {
		console.log(pageImages);
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
		pageImages.push($(this)[0].src);
	})
}