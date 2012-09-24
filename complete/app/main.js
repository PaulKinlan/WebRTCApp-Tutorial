/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/experimental.app.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function(intentData) {
    chrome.app.window.create('dialer.html', {
        id: "1",
        width: 390 ,
        height: 768
    });

    chrome.app.window.create('receiver.html', {
        "id": "2",
        width: 390,
        height: 768
    });
});
