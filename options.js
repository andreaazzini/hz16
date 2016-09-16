// Saves options to chrome.storage
function save_options() {
  var grantedPermissions = document.getElementById('grant').checked;
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then(function(stream) {
      var track = stream.getTracks()[0];
      track.stop();
    });
  }
  chrome.storage.sync.set({
    grantedPermissions: grantedPermissions
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    grantedPermissions: false
  }, function(items) {
    document.getElementById('grant').checked = items.grantedPermissions;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
