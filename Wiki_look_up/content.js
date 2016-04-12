// content.js
$(document).ready(function(){

	var port = chrome.runtime.connect({"name": "wiki_lookup_port_2016"});

	// write delay method for user to hover for at-least 2 sec
	var delay = function(x, callback){
		console.log(x);
		var timeout = null;
		// x.onmouseover =  function(){
		console.log("inside onmouseover");
		timeout = setTimeout(callback, 2000);
		// }
		x.onmouseout = function(){
			console.log("inside onmouseout");
			clearTimeout(timeout);
		};
	};


	document.addEventListener('mouseover', function(event){
		var targetnode = event.srcElement;
		// console.log(targetnode.nodeName);
		if (targetnode.nodeName ===  'A'){
			console.log("inside A");
			delay(targetnode, function(){
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