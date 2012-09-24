var pc;
var localstream;

function pickup() {
  var offer = new SessionDescription(vid2txt.value);
  pc.setRemoteDescription(pc.SDP_OFFER, offer);
  var answerOffer = pc.createAnswer(offer.toSdp(),
                                {has_audio:true, has_video:true});
  pc.setLocalDescription(pc.SDP_ANSWER, answerOffer);
  vid2answer.value = answerOffer.toSdp();

  pc.startIce();
}

btnPickup.onclick = pickup; 

function gotRemoteStream(e){
  vid2.src = webkitURL.createObjectURL(e.stream);
}

function iceCallback(candidate,bMore){
  if(candidate) {
    txtAnswerCandidates.value += JSON.stringify({label: candidate.label, candidate: candidate.toSdp()}) + "\n";
  }
}

btnCandidates.onclick = function() {
  // Negotiate the routes to connect across.
  var candidates = txtCandidates.value.split('\n');
  for(var i = 0; i < candidates.length; i++) {
    if(candidates[i].length <= 1) return; 
    var msg = JSON.parse(candidates[i]);
    var candidate = new IceCandidate(msg.label, msg.candidate);
    pc.processIceMessage(candidate);
  }
};

function initCallee() {
  pc = new webkitPeerConnection00("STUN stun.l.google.com:19302", iceCallback);
  pc.onaddstream = gotRemoteStream; 
}

initCallee();
