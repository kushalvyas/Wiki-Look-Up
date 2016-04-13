// content.js
$(document).ready(function(){

	var port = chrome.runtime.connect({"name": "wiki_lookup_port_2016"});

	$("<div>").attr({id:"fake_pbar"	}).appendTo('body');
	$("<div>").attr({id:"pbar_elem"	}).appendTo('#fake_pbar');

	// write delay method for user to hover for at-least 2 sec
	var delay = function(x, e, callback){
		console.log(x);
		var timeout = null;
		// x.onmouseover =  function(){
		// $("#fake_pbar").dialog("option", { position: [e.pageX, e.pageY] });
		$("#pbar_elem").progressbar({value:false});
		$("#fake_pbar").dialog({
			height:80,
			width:80,
			title:$(x).attr("title")
		});
		console.log("inside onmouseover");
		timeout = setTimeout(callback, 2000);
		// }
		x.onmouseout = function(){
			if($("#fake_pbar").dialog("isOpen")){
				$("#fake_pbar").dialog("close");
			}
			console.log("inside onmouseout");
			clearTimeout(timeout);
		};
	};


	document.addEventListener('mouseover', function(event){
		var targetnode = event.srcElement;
		// console.log(targetnode.nodeName);
		if (targetnode.nodeName ===  'A'){
			console.log("inside A");
			delay(targetnode, event, function(){
				console.log("here inside delay");
				var url = "www.wikipedia.org"+$(targetnode).attr("href");
				port.postMessage({"message":"ok", "url":url});		
			});
		}
	});




	var port = chrome.runtime.connect({"name":"wiki_lookup_port_2016"});
	port.onMessage.addListener(function(message){
		parse_output(message.answer);
	});



	function parse_output(data){

		var a = $(data).find("p");
		var in_text = "";
		for(var counter = 0; counter<a.length;counter++){
			in_text += a[counter].innerText;
			// console.log(a[counter+1]);
			if (a[counter+1].innerText==""){break;}
		}

		// generate respective html elements
		var aa = $("<p>"+in_text+"</p>"); // final to be displayed text
		var titleofpage = $(data).find("h1").text();
		var title_page_element = $("<h3>"+titleofpage+"</h3>") ;// final to be displayed title


		console.log(title_page_element);
		console.log(aa);
		// alert(title_page_element.text()+"\n"+aa.text());

		$("<div>").attr({
			id:"wiki_lookup_modal"
		}).appendTo('body');

		$("#wiki_lookup_modal").html(aa);

		if($("#fake_pbar").dialog("isOpen")){
			$("#fake_pbar").dialog("close");
		}


		$("#wiki_lookup_modal").dialog({
			maxHeight:300,
			maxWidth:300,
			title:titleofpage
		});

		// if($("#wiki_lookup_modal").dialog("isOpen")){
		// 	$(document).fadeOut();
		// }else{
		// 	$(document).fadeIn();

		// }
	}

});

function delay_animate_(){
	setTimeout(function(){
		console.log("wait a while");
	}, 2000);
}