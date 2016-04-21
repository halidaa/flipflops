chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "clicked_browser_action"});
  });
});

function triggerNotification(_img, stat){
	var options = {
		type: "image",
		title: "A Message from Mr Flop",
		message: "The crowd has spoken! With "+stat.winPercentage+"% of people's support, this is the winning option:",
		iconUrl: "icon_larger.png",
		imageUrl: _img
	}
	chrome.notifications.create(stat.questionID, options, function(){});
}