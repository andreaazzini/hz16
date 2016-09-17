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

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === "clicked_browser_action") {
      buildModal();
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
          setInterval(function() {
            context.drawImage(video, 0, 0, 640, 480);
            var dataUrl = canvas.toDataURL("image/jpeg", 1.0);
            $.ajax({
              type: "POST",
              url: "http://localhost:3000/images",
              data: {
                image: dataUrl,
                index: j
              }
            });
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
