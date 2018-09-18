/* ------------------------------------------------------
  Script injected into "https://zoom.us/account/user"
------------------------------------------------------ */

var   users = []
console.log('load content_script');


/* --------------------------------------------------
   check if there is an account to move to pro
-------------------------------------------------- */
function getUserToToggleToPro() {
  browser.runtime.sendMessage({
    action: "getNextDeferedToggleToPro"
  })
  .then((emailToToggleToPro)=>{
    console.log(`Response from the background script:  ${emailToToggleToPro}`);
    if(emailToToggleToPro){
      if(users.admin){
        if (users.admin.email == emailToToggleToPro) {
          return
        }
        toggleCurrentProToBasic()
      }else {
        setNextDeferedToggleToPro(null)
        toggleToPro(emailToToggleToPro)
      }
    }
  }, (error)=>{
    console.log(`Error: ${error}`);
  });
}

/* --------------------------------------------------
  update users list
-------------------------------------------------- */
function findUsers() {
  users = []
  document.querySelectorAll('#user_table tbody tr').forEach((tr)=>{
    var user = {
      email :tr.querySelector('.email').innerText.trim(),
      type  :tr.dataset.type,
      typeEl:tr.querySelector('.user-type'),
      btnEl :tr.querySelector('.action a')
    }
    if (user.type  == 2) {users.admin = user}
    users.push(user)
  })
}

/* --------------------------------------------------
   add a "Go pro" button in user's row
-------------------------------------------------- */
function decorateUsers() {
  users.forEach(user=>{
    if (user.type==1) {
      const text = user.typeEl.innerText
      user.typeEl.innerHTML = `<span>${text}</span></br><span>(</span><a class="go-pro">go pro</a><span>)</span>`
      const a = user.typeEl.querySelector('a')
      a.addEventListener('click', e=>{
        console.log('click, toggle to', user.email);
        setNextDeferedToggleToPro(user.email)
        toggleCurrentProToBasic()
      })
      // console.log("on tente les style sheets", document.styleSheets);
      // document.styleSheets[1].insertRule('a { background-color: red; }', 0); // // TODO
      // var styleSheet = styleEl.sheet
    }
  })
}


function setNextDeferedToggleToPro(userEmail) {
  browser.runtime.sendMessage({
    action: "setNextDeferedToggleToPro",
    userEmail: userEmail
  });
}


function toggleCurrentProToBasic(){
  if (users.admin){
    console.log('cas 1');
    users.admin.btnEl.click() // open modal
    document.querySelector('#editUserDialog tr.user-type [value="1"]').click() // click base radio
    document.querySelector('#editUserDialog .modal-footer button.submit').click() // save
  }
}


function toggleToPro(targetUserEmail){
  var targetUser
  for (user of users) {
    if (user.email == targetUserEmail) {
      targetUser = user
      break
    }
  }
  if (users.admin!=targetUser){
    targetUser.btnEl.click() // open modal
    document.querySelector('#editUserDialog tr.user-type [value="2"]').click() // click pro radio
    document.querySelector('#editUserDialog .modal-footer button.submit').click() // save
  }
}

/* --------------------------------------------------
   ACTION !
-------------------------------------------------- */
findUsers()
decorateUsers()
getUserToToggleToPro()
