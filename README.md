Tutorial
========

WebRTC is an API designed to make video and audio conferencing simple
and available in all browsers.

This is a tutorial on how to get started with WebRTC.  For a more indepth view
please read our [HTML5Rocks Tutorial](http://www.html5rocks.com/en/tutorials/webrtc/basics/#stun)

Prerequistits
-------------

1.   Chrome
2.   Chrome Canary
3.   A Code editor
4.   This tutorial
5.   A web cam

We will be using the new Chrome app Package system, this is to save you
having to host any files remotely, and it allows you to work offline.

Step 1.
-------

Download the [source](https://github.com/PaulKinlan/WebRTCApp-Tutorial/downloads) or clone
the repository.

Step 2.
-------

Open Chrome canary, visit chrome://extensions and click on "Enable Developer Mode".

Then click on "Load unpackaged app":  Load the "complete" folder to test the app.
Then click on "Load unpackaged app":  Load the "start" folder this will be your project.

Step 3.
-------

Launch the project, start with the dialer, click "Start" then "Call".  This will start your webcam

1.  Open the "Dialer":
2.  then copy the text in "Send this Offer to someone" and paste it in to the Reciever window, click "Offer" button.
3.  copy the list of candidates into the Receiver window. Click "Go"
4.  From the reciever, scroll down and copy the text in "Send Answer Offer back to Person"
5.  In Dialer, past the text into "Answer Offer".  Press "Answer"
6.  In the Reciever copy the text from "Then Send Candidate this". 
7.  Go to Dialer, paste text into "Enter this candidates"

If all is good, you will see your video streaming from one window to another.

Step 3.1
--------

If you are brave, rather than copy the text between your windows, send it to your friend next to you via email.

Step 4
------

Now coding.

You have two files that you will need to edit to make this work.  One set of Javascript for the dialer, and one for the reciever.

Choose any one file to start with.  Make it random and then choose the correct Chapter below.

Dialer
======

Initialize WebRTC
-----------------

To use the WebRTC framework, we need to first create the webkitPeerConnection00 object.  This
will allow us to talk to other machines.

There is a callback that will preocess "candidate" messages, these are notification about the
supported codecs and addresses that the other peer should try and talk to.

    var pc; // Global Peer Connection object

    // The ICE Framework will pass candidate messages here.  
    function clientIceCallback(candidate,bMore) {
      if(candidate) {
        txtCandidates.value += JSON.stringify({label: candidate.label, candidate: candidate.toSdp()}) + "\n";
      }
    }

    // Create the peer connection and connect to Stun Server
    function initCaller() {
      pc = new webkitPeerConnection00("STUN stun.l.google.com:19302", clientIceCallback);
    }

    initCaller();


Get Access to the webcam
------------------------

To be able to use the webcam, we need to first get access to its stream of data.
    
    var localstream;
    
    // When we get access to the video, this will be called.
    function gotStream(stream){
       // Attach the web cam to the video element
       vid1.src = webkitURL.createObjectURL(stream);
       localstream = stream;
    }

    function start() {
      navigator.webkitGetUserMedia({audio:true, video:true},
                                   gotStream, function() {});
    }

    btn1.onclick = start; // This will get Access to the webcam

Test this code, you should see the output from your webcam in the page.


Start the call
--------------

We are creating the call.  It is pretty complex process.  We create a thing called
an offer.  An Offer is what I as the client want to use to call the reciever.

The offer is then attached to the inputStream, the input gets sent to the remote client.

We then need to some how transfer the offer to the reciever, this is normally done via a server.  
In our case we are just going to copy an paste the data between the apps and people.

Finally once we have created the offer, we set the PeerConnection up to start the ICE dance (heh).

    // Create an Offer.  
    function call() {
      var offer = pc.createOffer({audio: true, video: true});
      pc.addStream(localstream);
      pc.setLocalDescription(pc.SDP_OFFER, offer);
  
      vid1txt.value = offer.toSdp();
      pc.startIce();
    }

    btn2.onclick = call;

Receiving a stream back.
-----------------------

In this demo we are just sending video to one client, and not recieving a stream back.  This is great
for the game of Chinese Whispers.

We have two steps.  In theory, the reciever would have done some magic and created an Answer token, and a list of
candidates that we can use to talk to it.

In our demo, these are getting pasted into the applicaiton, so we just need to parse the data.

First,  we need to parse the "Answer Offer".  The Answer offer will be read from the text box
and then attached to the incomming stream of data (which we don't use - however this bridges the connections).

    function answer() {
      var offer = new SessionDescription(vid1answer.value);
      pc.setRemoteDescription(pc.SDP_ANSWER, offer);
    }

    btnAnswer.onclick = answer;

Secondly, we now need to parse the list of candidates.  The candidates are a list of IP addresses etc that we can 
talk to the reciever on.

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

In this code, we are looping over the input "candidates" (one per line) and then creating
an IceCandidate with the data contained.  This is the informaion that the PeerConnection framework
needs to be able to find the reciever.  We then call processIceMessage (the framework will do the magic).


Done
----

If all has gone well you should be able to connect to the completed receiver.


Reciever
========


