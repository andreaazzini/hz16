var defaultMessageTypes = {
  'alert': alert,
  'log': console.log
};
function buildModal() {
  var modal = document.createElement('div');
  modal.className = 'hz16-modal';

  var container = document.createElement('div');
  container.id = "container";

  var redDot = document.createElement('div');
  redDot.id = "red-dot";

  var video = document.createElement('video');
  video.id = "video";
  video.setAttribute("width", "640");
  video.setAttribute("height", "480");
  video.autoplay = true;
  video.hidden = true;

  var canvas = document.createElement('canvas');
  canvas.id = "canvas";
  canvas.setAttribute("width", "640");
  canvas.setAttribute("height", "480");
  canvas.hidden = true;

  modal.appendChild(container);
  modal.appendChild(redDot);
  modal.appendChild(video);
  modal.appendChild(canvas);

  document.body.appendChild(modal);
}
function moduleDidLoad() {
  ImageProcModule = document.getElementById('nacl_module');
  updateStatus('RUNNING');

}
function startsWith(s, prefix) {
  // indexOf would search the entire string, lastIndexOf(p, 0) only checks at
  // the first index. See: http://stackoverflow.com/a/4579228
  return s.lastIndexOf(prefix, 0) === 0;
}

function updateStatus(opt_message) {
  if (opt_message) {
    statusText = opt_message;
  }
  var statusField = document.getElementById('statusField');
  if (statusField) {
    statusField.innerHTML = statusText;
  }
}
function handleMessage(message_event) {
  	console.log('message incoming ');
  if (typeof message_event.data === 'string') {
  	console.log('message: ' + message_event.data);
    for (var type in defaultMessageTypes) {
      if (defaultMessageTypes.hasOwnProperty(type)) {
        if (startsWith(message_event.data, type + ':')) {
          func = defaultMessageTypes[type];
          func(message_event.data.slice(type.length + 1));
          return;
        }
      }
    }
  }

  if (typeof window.handleMessage !== 'undefined') {
    window.handleMessage(message_event);
    return;
  }

  console.log('Unhandled message: ' + message_event.data);
}
function attachDefaultListeners() {
  var listenerDiv = document.getElementById('listener');
  listenerDiv.addEventListener('load', moduleDidLoad, true);
  listenerDiv.addEventListener('message', handleMessage, true);
  if (typeof window.attachListeners !== 'undefined') {
    window.attachListeners();
  }
}
function createNaClModule(name, path, width, height, attrs) {
  var moduleEl = document.createElement('embed');
  moduleEl.setAttribute('name', 'nacl_module');
  moduleEl.setAttribute('id', 'nacl_module');
  moduleEl.setAttribute('width', width);
  moduleEl.setAttribute('height', height);
  moduleEl.setAttribute('path', path);
  moduleEl.setAttribute('src', "http://localhost:3000/nacl" + '/' + name + '.nmf');
	moduleEl.setAttribute('type', 'application/x-pnacl');

  // Add any optional arguments
  if (attrs) {
    for (var key in attrs) {
      moduleEl.setAttribute(key, attrs[key]);
    }
  }


  // The <EMBED> element is wrapped inside a <DIV>, which has both a 'load'
  // and a 'message' event listener attached.  This wrapping method is used
  // instead of attaching the event listeners directly to the <EMBED> element
  // to ensure that the listeners are active before the NaCl module 'load'
  // event fires.
	var listenerDiv = document.createElement('div');
	var modal = document.getElementsByClassName('hz16-modal')[0];	
	listenerDiv.id = 'listener';
	modal.appendChild(listenerDiv);
  listenerDiv.appendChild(moduleEl);

  // Request the offsetTop property to force a relayout. As of Apr 10, 2014
  // this is needed if the module is being loaded on a Chrome App's
  // background page (see crbug.com/350445).
  moduleEl.offsetTop;
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      buildModal();
			createNaClModule("image_proc", "nacl", 640, 480);
      var modal = document.getElementsByClassName("hz16-modal")[0];
      if (modal.style.display == 'block') {
        modal.style.display = 'none';
        for (var i in document.body.children) {
          if (document.body.children[i].className != "hz16-modal") {
            if (document.body.children[i].style) {
              document.body.children[i].style.filter = "none";
            }
          }
        }
      } else {
        modal.style.display = 'block';
        for (var i in document.body.children) {
          if (document.body.children[i].className != "hz16-modal") {
            if (document.body.children[i].style) {
              document.body.children[i].style.filter = "blur(2px)";
            }
          }
        }

        function toMorse(string) {
          var alphabet = {
              'a': '.-',    'b': '-...',  'c': '-.-.', 'd': '-..',
              'e': '.',     'f': '..-.',  'g': '--.',  'h': '....',
              'i': '..',    'j': '.---',  'k': '-.-',  'l': '.-..',
              'm': '--',    'n': '-.',    'o': '---',  'p': '.--.',
              'q': '--.-',  'r': '.-.',   's': '...',  't': '-',
              'u': '..-',   'v': '...-',  'w': '.--',  'x': '-..-',
              'y': '-.--',  'z': '--..',
              '1': '.----', '2': '..---', '3': '...--', '4': '....-',
              '5': '.....', '6': '-....', '7': '--...', '8': '---..',
              '9': '----.', '0': '-----',
          };

          return string
            .split('')
            .map(function(e){
              return alphabet[e.toLowerCase()] || '';
            })
            .join('');
        }

        function success(stream) {
          var video = document.getElementById('video');
          video.src = window.URL.createObjectURL(stream);
          video.play();

          var title = document.title;
          var morseString = toMorse(title);

          var colors = {
            '.': 'white',
            '-': 'black'
          };

          var i = 0;
          setInterval(function() {
            document.getElementsByClassName("hz16-modal")[0].style.backgroundColor = colors[morseString[i]];
            i + 1 == morseString.length ? i = 0 : i += 1;
          }, 200);

          var canvas = document.getElementById('canvas');
          var context = canvas.getContext('2d');
          var j = 0;
					console.log("1");
          setInterval(function() {
            context.drawImage(video, 0, 0, 640, 480);
            var dataUrl = canvas.toDataURL("image/jpeg", 1.0);
	  				dataUrl = dataUrl.replace(/^data:image\/jpeg+;base64,/, "");
  					dataUrl = dataUrl.replace(/ /g, '+');
						var data = {
							data : dataUrl,
							index : j					
						}
						console.log("2");
			      ImageProcModule = document.getElementById('nacl_module');
						ImageProcModule.postMessage(data);
						console.log("3");
						/*chrome.runtime.sendMessage(data, function(response) {
							console.log(response.farewell);
						});*/

            j += 1;
          }, 1000);
        }

        function fail() {
          console.log("Error");
        }

        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            success(stream);
          });
        } else if (navigator.getUserMedia) {
          navigator.getUserMedia({ video: true }, function(stream) {
            success(stream)
          }, fail);
        } else {
          fail();
        }
      }
    }
  }
);
