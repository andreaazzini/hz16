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

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
    var video = document.getElementById('video');
    video.src = window.URL.createObjectURL(stream);
    video.play();

    chrome.tabs.getSelected(null,function(tab) {
      var title = tab.title;
      var morseString = toMorse(title);

      var colors = {
        '.': 'white',
        '-': 'black'
      };

      var i = 0;
      setInterval(function() {
        document.body.style.backgroundColor = colors[morseString[i]];
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
    });
  });
}
