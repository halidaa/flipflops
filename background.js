chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    //chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
	  var options = {
		type: "image",
		title: "A Message from Mr Flop",
		message: "The crowd has spoken, this is the one they prefer:",
		iconUrl: "icon_larger.png",
		imageUrl: "https://s-media-cache-ak0.pinimg.com/564x/d0/aa/9c/d0aa9c57bf031554fc132cbe28e3f8fb.jpg"
	  }
	  chrome.notifications.create("test", options, function(){});
  });
});
