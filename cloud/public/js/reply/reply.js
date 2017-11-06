var id=null;
	var selected=null;
	var dg=null;
	$(function() {
		dg = $('#tt');
	 	$qNode=$("#q");
	 	$aNode=$("#a");
		dg.datagrid({
			pagePosition : 'bottom',
			url : 'manual_reply/load',
			singleSelect:true, 
			height : document.body.scrollHeight - 130,
			onSelect:function(rowIndex, rowData){
				id=rowData.id;
				selected=rowIndex;
				$qNode.val(rowData.q);
				$aNode.focus();
			}
		});
		dg.datagrid('getPager').pagination({  
	        pageSize: 50,
	        pageList: [50, 100, 200]
	    });
		dg.datagrid('getPager').pagination('refresh');
	});
	function postData(){
		if(id===null){
			alert("先选中一个问题回复后提交");
			return;
		}
		var val=$aNode.val();
		if(val==null||$.trim(val)==""){
			alert("请输入回复内容后提交");	
			$aNode.val("");
			$aNode.focus();
			return;
		}
		$.post('manual_reply/reply',{
			id:id,
			text:val
		},function(data){
			if(data=='ok'){
				dg.datagrid('deleteRow',selected);
				id=null;
				selected=null;
				$qNode.val('');
				$aNode.val('');
			}else{
				alert('系统异常,请稍后再试');
			}
		},'text');
	}