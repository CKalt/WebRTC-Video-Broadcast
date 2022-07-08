function log_stamp(str) {
    msg = new Date().toISOString() + ":" + str;
    console.log(msg);
    alert(msg);
}

let peerConnection;
const config = {
  iceServers: [
      { 
        "urls": "stun:stun.l.google.com:19302",
      },
      // { 
      //   "urls": "turn:TURN_IP?transport=tcp",
      //   "username": "TURN_USERNAME",
      //   "credential": "TURN_CREDENTIALS"
      // }
  ]
};

const socket = io.connect(window.location.origin);
const video = document.querySelector("video");
const enableAudioButton = document.querySelector("#enable-audio");

enableAudioButton.addEventListener("click", enableAudio)

socket.on("offer", (id, description) => {
  log_stamp("watch.socket: on offer");
  peerConnection = new RTCPeerConnection(config);
  peerConnection
    .setRemoteDescription(description)
    .then(() => peerConnection.createAnswer())
    .then(sdp => peerConnection.setLocalDescription(sdp))
    .then(() => {
      socket.emit("answer", id, peerConnection.localDescription);
    });
  peerConnection.ontrack = event => {
    log_stamp("watch.perConnection: on track");
    video.srcObject = event.streams[0];
  };
  peerConnection.onicecandidate = event => {
    log_stamp("watch.perConnection: on icecandidate");
    if (event.candidate) {
      socket.emit("candidate", id, event.candidate);
    }
  };
});


socket.on("candidate", (id, candidate) => {
  log_stamp("watch.socket on candidate");
  peerConnection
    .addIceCandidate(new RTCIceCandidate(candidate))
    .catch(e => console.error(e));
});

socket.on("connect", () => {
  log_stamp("watch.socket: on connect");
  socket.emit("watcher");
});

socket.on("broadcaster", () => {
  log_stamp("watch.socket: on broadcaster");
  socket.emit("watcher");
});

window.onunload = window.onbeforeunload = () => {
  socket.close();
  peerConnection.close();
};

function enableAudio() {
  log_stamp("Enabling audio")
  video.muted = false;
}
