var bgVol;
function controlSound() {
  $("#sound-bg").prop("volume", bgVol);
}
function controlMusic() {
  window.focus();
  $("#sound-bg").get(0).play();

  setTimeout(function () {
    controlMusic();
  }, 1);
}

$(document).ready(function () {

    bgVol = localStorage.getItem("bgVol");
    controlMusic();
})