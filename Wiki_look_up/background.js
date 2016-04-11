// listen for mouse hovers
chrome.browserAction.onClicked.addListener(function(tab) {
  // Send a message to the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {"message": "wiki_loaded"});
  });
});

var popups = chrome.extension.getViews({type:"popup"});
// console.log(popups);
// chrome.extension.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.message === "ok"){
//         console.log(request.url);  
//         parse_page(request.url);
//         return true;
//     }   
// });


// var port = chrome.runtime.connect({name:"wiki_lookup_port_2016"});

chrome.runtime.onConnect.addListener(function(port){
    console.assert(port.name == "wiki_lookup_port_2016");
    port.onMessage.addListener(function(message){
        console.log(message.url);
        var d= parse_page(message.url);
        d.success(function(data){
            port.postMessage({"answer":data});
            
        })
    });
});

function parse_page(i_url){
    console.log("url is "+ i_url);
    return $.ajax(
            {
                url:"http://"+i_url,
                method:"GET",
                success:function(data){
                    // console.log(data);
                    console.log("in success");
                    // // create a range object for fast xml parsing
                    // var a = $(data).find("p");
                    // console.log(a);
                    // var in_text = "";
                    // for(var counter = 0; counter<a.length;counter++){
                    //     in_text += a[counter].innerText;
                    //     // console.log(a[counter+1]);
                    //     if (a[counter+1].innerText==""){break;}
                    // }     
                    

                }
            }

        );
}
