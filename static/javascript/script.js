$(document).ready(function() {
  if (!window.WebSocket) {
    alert("Browser don't support WebSocket!");
    return;
  }

  var protocol = "ws";
  if (location.protocol == "https:") {
    protocol = "wss";
  }
  var url = protocol + "://" + location.host + "/ws";
  console.log("[websocket] established url: " + url);
  // ws is a handler for WebSocket with JavaScript
  var ws = new ReconnectingWebSocket(url);
  var established = false;

  var photobooth;
  ws.onopen = function() {
    if (established) {
      return;
    }
    established = true;
    photobooth = $('#container').photobooth();


    photobooth.on('image', function(event, dataUrl) {
      $(".result_img").fadeOut(300).delay(500).remove();
      $(".status").attr("src", "/static/assets/swaping.gif");

      ws.onmessage = function(event) {
        var result = JSON.parse(event.data);
        if (result.action == "finish") {
          console.log("replace " + result.id);
          var id = result.id;
          var data = result.data;
          var container = ".lsti" + id;
          $(container + " .result_img").remove();
          $("<img />", {"src": result.data, "class": "result_img"}).appendTo($(container));
        } else if (result.action == "failed") {
          alert("No face detected, try again!");
        }
        else {
          var newUrl = "/static/assets/" + result.status + ".gif";
          $('.status').attr("src", newUrl);
        }
      }

      var data = {"action": "query", "content": dataUrl};
      ws.send(JSON.stringify(data));

    });
  }

});
