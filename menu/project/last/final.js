var bgVol;

function controlMusic() {
  window.focus();
  $("#sound-bg").prop("volume", bgVol);

  $("#sound-bg").get(0).play();

  setTimeout(function () {
    controlMusic();
  }, 1);
}

$(document).ready(function () {

    setTimeout(function(){
    var link = "../menu/menu.html"
    $("body").fadeOut(2000);  
    location.replace(link);
    }, 31000);
    setTimeout(function(){
      $(".credits").css("display", "none");
    }, 27000);
    bgVol = localStorage.getItem("bgVol");
    controlMusic();
})