var effVol=1;
effVol = localStorage.getItem("effVol");
function start() {
  setTimeout(function () {
    $("body").fadeOut(1000);
  }, 1000);
  setTimeout(function () {
    location.href = "../../../벽돌깨기1/game_play.html";
  }, 2000);
}
$("#start_button").click(function () {
  $("#click-sound").prop("volume",effVol);
  $("#click-sound").get(0).play();
  start();
});
localStorage.setItem("level", 1);
