var defaultMessageTypes = {
  'alert': alert,
  'log': console.log
};

var ImageProcModule = null; 
function buildModal() {
  console.log("Building modal");
  var modal = document.createElement('div');
  modal.className = 'hz16-modal';

  var container = document.createElement('div');
  container.id = "container";

  var redDot = document.createElement('div');
  redDot.id = "red-dot";

  var video = document.createElement('video');
  video.id = "video";
  video.setAttribute("width", "1280");
  video.setAttribute("height", "720");
  video.autoplay = true;
  video.hidden = true;

  var canvas = document.createElement('canvas');
  canvas.id = "canvas";
  canvas.setAttribute("width", "1280");
  canvas.setAttribute("height", "720");
  canvas.hidden = true;

  modal.appendChild(container);
  modal.appendChild(redDot);
  modal.appendChild(video);
  modal.appendChild(canvas);

  document.body.appendChild(modal);
}
function moduleDidLoad() {
  ImageProcModule = document.getElementById('nacl_module');
  console.log("Loaded!");
  console.log(ImageProcModule);
  updateStatus('RUNNING');
  naclReady();
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
  console.log('message incoming ' + message_event.data);
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

  console.log('Unhandled message: ' + message_event.data);
  //if (typeof window.handleMessage !== 'undefined') {
  //  window.handleMessage(message_event);
  //  return;
  //}

}
function attachDefaultListeners(listenerDiv) {
  listenerDiv.addEventListener('load', moduleDidLoad, true);
  listenerDiv.addEventListener('message', handleMessage, true);
  if (typeof window.attachListeners !== 'undefined') {
    window.attachListeners();
  }
}
function createNaClModule(name, path, width, height, attrs) {
  console.log("Creating NACL module");
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
    attachDefaultListeners(listenerDiv);
	modal.appendChild(listenerDiv);
  listenerDiv.appendChild(moduleEl);

  // Request the offsetTop property to force a relayout. As of Apr 10, 2014
  // this is needed if the module is being loaded on a Chrome App's
  // background page (see crbug.com/350445).
  moduleEl.offsetTop;
}

var i = 0;
var colors = {
  '.': 'white',
  '-': 'black'
};
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
  }
  return string
    .split('')
    .map(function(e){
      return alphabet[e.toLowerCase()] || '';
    })
    .join('');

};


function updateMorseCode() {
            var morseString = toMorse(document.title);

            document.getElementsByClassName("hz16-modal")[0].style.backgroundColor = colors[morseString[i]];
            i + 1 == morseString.length ? i = 0 : i += 1;
}

function fetchVideoImage() {
          console.log("Fetch video Data");
          var canvas = document.getElementById('canvas');
          var context = canvas.getContext('2d');
          var j = 0;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          var data = {
              width: canvas.width,
              height: canvas.height,
              data : context.getImageData(0, 0, canvas.width, canvas.height).data.buffer,
              index : j					
          }
          console.log("Fetched video Data");
          ImageProcModule.postMessage(data);
          console.log("Post Message");
          j += 1;
          window.setTimeout(fetchVideoImage, 1);
}
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      console.log("In add listener");
      buildModal();
      createNaClModule("image_proc", "nacl", 1280, 720);
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


        function fail() {
          console.log("Error");
        }

        navigator.getUserMedia =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
            mediaReady(stream);
          });
        } else if (navigator.getUserMedia) {
          navigator.getUserMedia({ video: true }, function(stream) {
            mediaReady(stream)
          }, fail);
        } else {
          fail();
        }
      }
    }
  }
);

var _mediaReady = false;
var _steam;
var _naclReady = false;

function mediaReady(stream) {
  console.log("Media Ready");
  _mediaReady = true;
  _stream = stream;
  if(_naclReady)
    startProcessing();
}

function naclReady() {
  console.log("Nacl Ready");
 _naclReady = true;
  if(_mediaReady)
    startProcessing();
}

function startProcessing() {
  console.log("Start Processing");
  var video = document.getElementById('video');
  video.src = window.URL.createObjectURL(_stream);
  video.play();
  window.setInterval(updateMorseCode, 1000);
  window.setTimeout(fetchVideoImage, 1);
}
