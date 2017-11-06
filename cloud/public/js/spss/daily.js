/**
 * 
 */

$(function(){
	client.init();
});

var client = (function($,undefined){
	var $clientBar = undefined;
	
	var showBar = {
			height: 460,
            width: 550,
            title: "",
            url: editUrl, 
            showMax: false,
            showMin: false,
            isResize: true,
            slide: false,
            data: {
                refresh: function(){
                	gridManager.reload();
                }
            },
            myDataName: "hello",
            buttons: [
                      { 
                    	  text: '确定',
                    	  onclick: function (item, dialog) {
                    	  }
                      }, 
                      { 
                    	  text: '取消',
                    	  onclick: function (item, dialog) {
                    		  dialog.close(); 
                    	  } 
                      } 
            ]
	};
	
	method = {	
			init : function(){
				$clientBar = $("#clientBar");
								
				cloudKnowledge.getTree("classifys", "classifysTree", "id", "parentId", "value");
				treeManager = $("#classifysTree").ligerGetTreeManager();
				
				initGrid();
				$gridQuery.click(gridQueryClick);
			},
			editCorpus : function(rowindex){
				editCorpus(rowindex);
			},
			deleteCorpusClick : function (rowindex) {
				pairIds = new Array();
				pairIds.push(gridManager.getRow(rowindex).id);
				deleteCorpus();
			}
		};
	
})(jQuery);