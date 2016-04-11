/**
 * Get the current URL.
 *
 * @param {function(string)} callback - called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {

	var queryInfo = {
		active: true,
		currentWindow: true
	};

	chrome.tabs.query(queryInfo, function(tabs) {
		// chrome.tabs.query invokes the callback with a list of tabs that match the
		// query. When the popup is opened, there is certainly a window and at least
		// one tab, so we can safely assume that |tabs| is a non-empty array.
		// A window can only have one active tab at a time, so the array consists of
		// exactly one tab.
		var tab = tabs[0];

		// A tab is a plain object that provides information about the tab.
		// See https://developer.chrome.com/extensions/tabs#type-Tab
		var url = tab.url;

		// tab.url is only available if the "activeTab" permission is declared.
		// If you want to see the URL of other tabs (e.g. after removing active:true
		// from |queryInfo|), then the "tabs" permission is required to see their
		// "url" properties.
		console.assert(typeof url == 'string', 'tab.url should be a string');
		if(url.indexOf("wikipedia.org") > -1)
			callback(url);
		else
			callback("");
		
	});

	// Most methods of the Chrome extension APIs are asynchronous. This means that
	// you CANNOT do something like this:
	//
	// var url;
	// chrome.tabs.query(queryInfo, function(tabs) {
	//   url = tabs[0].url;
	// });
	// alert(url); // Shows "undefined", because chrome.tabs.query is async.
		// }

};

/**
 * @param {string} searchTerm - Search term for Google Image search.
 * @param {function(string,number,number)} callback - Called when an image has
 *   been found. The callback gets the URL, width and height of the image.
 * @param {function(string)} errorCallback - Called when the image is not found.
 *   The callback gets a string that describes the failure reason.
 */
function getImageUrl(search_url, callback, errorCallback) {

	var x = new XMLHttpRequest();
	x.open('GET', searchUrl);
	// The Google image search API responds with JSON, so let Chrome parse it.
	x.responseType = 'json';
	x.onload = function() {
		// Parse and process the response from Google Image Search.
		var response = x.response;
		if (!response || !response.responseData || !response.responseData.results ||
				response.responseData.results.length === 0) {
			errorCallback('No response from Google Image search!');
			return;
		}
		var firstResult = response.responseData.results[0];
		// Take the thumbnail instead of the full image to get an approximately
		// consistent image size.
		var imageUrl = firstResult.tbUrl;
		var width = parseInt(firstResult.tbWidth);
		var height = parseInt(firstResult.tbHeight);
		console.assert(
				typeof imageUrl == 'string' && !isNaN(width) && !isNaN(height),
				'Unexpected respose from the Google Image Search API!');
		callback(imageUrl, width, height);
	};
	x.onerror = function() {
		errorCallback('Network error.');
	};
	x.send();
}

function renderStatus(statusText) {

	document.getElementById('status').textContent = statusText;
}


function parse_page(url){
	renderStatus("Fetching page"  + "... ");	
	$("#fake-loader").show();
	$.get( url, function( data ) {
		$("#fake-loader").hide();
		console.log(data);
		renderStatus("");
		// create a range object for fast xml parsing
		var a = $(data).find("p");
		console.log(a);
		var in_text = "";
		for(var counter = 0; counter<a.length;counter++){
			in_text += a[counter].innerText;
			// console.log(a[counter+1]);
			if (a[counter+1].innerText==""){break;}
		}

		// for(var counter=0; counter<)

		// generate respective html elements
		var aa = $("<p class=''>"+in_text+"</p>");
		var titleofpage = $(data).find("h1").text();
		var title_page_element = $("<h3>"+titleofpage+"</h3>")
		


		// append respective elements
		$("#body_container111").append(title_page_element);
		$("#body_container111").append(aa);
		// title_page_element.appendTo('body_container111');
		// aa.appendTo('body_container111');



	})

	.fail(function(){
		renderStatus("Network Error");
	})
	;


}

function not_a_wiki_page(){
	renderStatus("NOT A WIKI PAGE");
}



// Add listener to receive messages from background page
chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		console.log(request);
	}
);



document.addEventListener('DOMContentLoaded', function() {

	
	// getCurrentTabUrl(function(url) {
	// 	// parse currnt web page
	// 	console.log(url);
	// 	if(url == ""){
	// 		console.log("not a wiki page");
	// 		not_a_wiki_page();
	// 	}
	// 	else{
	// 			// parse_page("https://en.wikipedia.org/wiki/Fraction_(mathematics)");

	// 	}
	// 	parse_page("https://en.wikipedia.org/wiki/Fraction_(mathematics)");
	// });
});


