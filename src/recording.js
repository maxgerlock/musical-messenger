let mediaRecorder;

function setupRecording() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
     console.log('getUserMedia supported.');
     navigator.mediaDevices.getUserMedia (
        // constraints - only audio needed for this app
        {
           audio: true
        })

        // Success callback
        .then(function(stream) {
          mediaRecorder = new MediaRecorder(stream);
        })

        // Error callback
        .catch(function(err) {
           console.log('The following getUserMedia error occured: ' + err);
        }
     );
  } else {
     console.log('getUserMedia not supported on your browser!');
  }
}
