// RETRIEVE OPTIONS PARAMETERS
var TARGET_EMAIL = null
var nextDeferedToggleToPro = null

console.log('background.js starts V2 !')


/* --------------------------------------------------
   Listen tabs messages
   action requests by tabs are to set or get the
   next email account to toggle
-------------------------------------------------- */
function listenTabMessages() {

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('request from tab.id=', sender.tab.id, request.action);
    if (request.action == 'setNextDeferedToggleToPro'){
      nextDeferedToggleToPro = request.userEmail
    }else if (request.action == 'getNextDeferedToggleToPro') {
      console.log('answer=', nextDeferedToggleToPro)
      const answer = nextDeferedToggleToPro
      sendResponse(answer)
    }
  })

}


/* --------------------------------------------------
   User clicks on the browser action button
   => open Zoom page and activate the email to
   toggle
-------------------------------------------------- */
function listenBrowserAction() {

  function openPage() {
    nextDeferedToggleToPro = TARGET_EMAIL
    browser.tabs.create({
      url: 'https://zoom.us/account/user'
    })
  }

  browser.browserAction.onClicked.addListener(openPage);

}


/* --------------------------------------------------
   Retrieve mail and update when changed by options
-------------------------------------------------- */
function retrieveEmail() {

  function onGet(result) {
    console.log("retrieveEmail result", result)
    TARGET_EMAIL = ''
    if (result.email) {
      TARGET_EMAIL = result.email
    }else {
      console.log("try open options");
      browser.runtime.openOptionsPage()
    }
  }

  function onError(err) {
    console.log(`Error retrieveEmail: ${err}`)
  }

  function onEmailChange(changes) {
    if (changes.email) {
      TARGET_EMAIL = changes.email.newValue
      console.log("email changed detected inbackground, email is now :", TARGET_EMAIL)
    }
  }

  browser.storage.local.get().then(onGet, onError)

  browser.storage.onChanged.addListener(onEmailChange)

}


/* --------------------------------------------------
   Actions !
-------------------------------------------------- */

retrieveEmail()
listenBrowserAction()
listenTabMessages()
