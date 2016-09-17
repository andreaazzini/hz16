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
    });
  });
}
