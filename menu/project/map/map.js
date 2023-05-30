var bgVol;
function controlSound() {
  $("#sound-bg").prop("volume", bgVol);
}
function start(num){
    location.href = "../item_ex/explain"+num+".html";
}
function controlMusic() {
  window.focus();
  $("#sound-bg").get(0).play();

  setTimeout(function () {
    controlMusic();
  }, 1);
}



$("#sonicmap").click(function(){
    start(1)
})
$("#shadowmap").click(function(){
    start(2)
})
$("#eggmanmap").click(function(){
    start(3)
})

$(document).ready(function () {

    bgVol = localStorage.getItem("bgVol");
    controlSound();
    controlMusic();
})