function poolAnswers(hitID){
	console.log('\n',Date.now());
	var _hitID = hitID;
	$.ajax({
		url:"http://stevenjamesmoore.com/api/values/GetHITResults?hitID="+_hitID,
		dataType:"json",
		beforeSend:function(){
			console.log("tried:","http://stevenjamesmoore.com/api/values/GetHITResults?hitID="+_hitID)
		},
		success:function(response){
			var resp;
			try{
				resp = JSON.parse(response);
			}
			catch(e){
				resp = "{'Ready':false}";
			}
			if(resp.Ready){
				triggerNotification(_hitID,resp);
				var _storage = [];
				chrome.storage.sync.get("activeHIT",function(items){
					_storage = items.activeHIT;
					var remove = _storage.indexOf(_hitID);
					if(remove > -1) _storage.splice(remove,1);
					chrome.storage.sync.set({"activeHIT":_storage},function(){})
				})
			}
			else{
				setTimeout(function(){
					poolAnswers(_hitID);
				},180000)
			}
		}
	})
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

function tryGetResults(){
	var _ids = [];
	chrome.storage.sync.get("activeHIT",function(items){
		_ids = items.activeHIT;
		for(var i = 0; i < _ids.length; i++){
			poolAnswers(_ids[i]);
		}
	})
}

function checkCurrentResult(hitID){
	var _hitID = hitID;
	$.ajax({
		url:"http://stevenjamesmoore.com/api/values/GetHITResults?hitID="+_hitID,
		dataType:"json",
		success:function(response){
			console.log(JSON.parse(response))
		}
	})
}