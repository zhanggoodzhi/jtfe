
function onSelectThemonths(val){
	$.post(appName + "/spss/queryStatTopWord", {
		"themonth" : val
	},function(data){
		var spanStr="";
		document.getElementById('divStatTopWord').innerHTML= "";
		var $maximumOccurences=-1;
		$(data).each(function(key, val) {
			if ($maximumOccurences == - 1)
				$maximumOccurences = val.occurences;
			$size = val.occurences / $maximumOccurences, 0.4  ;
			$increaseR = ($size * 179.5);
			if($increaseR>255) $increaseR =255;
			$increaseG =  ($size * 142.8 + 98);
			if($increaseG>255) $increaseG =255;
			$increaseB =  ($size * - 186  + 223);
			if($increaseB<0) $increaseB =1;
			$increaseR = Math.round($increaseR);
			$increaseG = Math.round($increaseG);
			$increaseB = Math.round($increaseB);
			 spanStr+='<span style="font-size:'+($size* 24 + 12)+'px;letter-spacing:2px;line-height:30px;padding:5px;color:rgb('+$increaseR+','+$increaseG+','+$increaseB+');"  href ="#" title="出现次数:'+val.occurences+'">'+val.token+'</span>';
		});
		document.getElementById('divStatTopWord').innerHTML= spanStr;
	}, "json");
	
}
