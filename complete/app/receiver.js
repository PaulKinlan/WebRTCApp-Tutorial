var pc;
var localstream;

function trace(text) {
  // This function is used for logging.
  if (text[text.length - 1] == '\n') {
    text = text.substring(0, text.length - 1);
  }
  console.log((performance.webkitNow() / 1000).toFixed(3) + ": " + text);
}

function pickup() {
  var offer = new SessionDescription(vid2txt.value);
  pc.setRemoteDescription(pc.SDP_OFFER, offer);
  var answerOffer = pc.createAnswer(offer.toSdp(),
                                {has_audio:true, has_video:true});
  pc.setLocalDescription(pc.SDP_ANSWER, answerOffer);
  vid2answer.value = answerOffer.toSdp();

  pc.startIce();
}

function gotRemoteStream(e){
  vid2.src = webkitURL.createObjectURL(e.stream);
  trace("Received remote stream");
}

var calleeRemoteDesc = false;
function iceCallback(candidate,bMore){
  if(candidate) {
    trace(candidate);
    txtAnswerCandidates.value += JSON.stringify({label: candidate.label, candidate: candidate.toSdp()}) + "\n";
  }
}

btnPickup.onclick = pickup; 
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
