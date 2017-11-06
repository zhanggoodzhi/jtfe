var cloudKnowledge = (function($,undefined){
	var method = {
		getTree : function(url, treeId, idName, parentIdName, textName){
			$.get(url, {}, function(data){
				$("#" + treeId).ligerTree({  
			        data:data, 
			        idFieldName : idName,
			        parentIDFieldName: parentIdName,
			        textFieldName : textName,
			        isExpand : 3
			    });
			}, "json");
		},
		reloadGrid:function(gridManager, url, param){
			
		}
	};
	
	return method;
})(jQuery);
