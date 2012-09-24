var pc;
var localstream;

function gotStream(stream){
  vid1.src = webkitURL.createObjectURL(stream);
  localstream = stream;
}

function start() {
  navigator.webkitGetUserMedia({audio:true, video:true},
                               gotStream, function() {});
}

function answer() {
  var offer = new SessionDescription(vid1answer.value);
  pc.setRemoteDescription(pc.SDP_ANSWER, offer);
}

function call() {
  pc.addStream(localstream);
  var offer = pc.createOffer({audio: true, video: true});
  pc.setLocalDescription(pc.SDP_OFFER, offer);

  vid1txt.value = offer.toSdp();
  pc.startIce();
}

function clientIceCallback(candidate,bMore){
  if(candidate) {
    txtCandidates.value += JSON.stringify({label: candidate.label, candidate: candidate.toSdp()}) + "\n";
  }
}

btnCandidates.onclick = function() {
  // Negotiate the routes to connect across.
  var candidates = txtCandidateAnswer.value.split('\n');
  for(var i = 0; i < candidates.length; i++) {
    if(candidates[i].length <= 1) return; 
    var msg = JSON.parse(candidates[i]);
    var candidate = new IceCandidate(msg.label, msg.candidate);
    pc.processIceMessage(candidate);
  }
};


btn1.onclick = start;
btn2.onclick = call;
btnAnswer.onclick = answer;

function initCaller() {
  pc = new webkitPeerConnection00("STUN stun.l.google.com:19302", clientIceCallback);
}

initCaller();
