function poolAnswers(ids){
	var _storage = ids;
	for (var i = 0; i < _storage.length - 1; i++){
		var _item = _storage[i];
		$.ajax({
			url:"http://stevenjamesmoore.com/api/values/GetHITResults?hitID="+_item,
			dataType:"json",
			beforeSend:function(){
				console.log("http://stevenjamesmoore.com/api/values/GetHITResults?hitID="+_item)
			},
			success:function(response){
				triggerNotification(_item,JSON.parse(response));
				var remove = _storage.indexOf(_item);
				if(remove > -1) _storage.splice(remove,1);
			}
		})
	}
}

function triggerNotification(hitID,result){
	var percentage = 0;
	if(result.ImageOneCount > result.ImageTwoCount)
		percentage = result.ImageOneCount/(result.ImageOneCount + result.ImageTwoCount);
	else
		percentage = result.ImageTwoCount/(result.ImageOneCount + result.ImageTwoCount);
	percentage = (percentage*100).toFixed(2);
	
	var options = {
		type: "image",
		title: "A Message from Mr Flop",
		message: "The crowd has spoken! With "+percentage+"% of people's support, here's the winning option:",
		iconUrl: "icon_larger.png",
		imageUrl: decodeURIComponent(result.WinningUrl)
	}
	chrome.notifications.create(hitID, options, function(){});
}