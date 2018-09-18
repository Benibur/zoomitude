function saveOptions(e) {
  e.preventDefault();
  console.log("saveOptions")
  browser.storage.local.set({
    email: document.querySelector("#email").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    console.log("restoreOptions", result)
    document.querySelector("#email").value = result.email;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get();
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
