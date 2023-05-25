$(".options").hide();
$(".about").hide();
var AudioContext;
var audioContext;
var bgVol;
var mainVol;
var speedselect;
localStorage.setItem('bgVol',bgVol);
localStorage.setItem('effVol',mainVol);
localStorage.setItem('speedselect', speedselect);

function init() {
  oOpen = false;
  aOpen = false;
  bgVol = 1;
  mainVol = 1;
  speedselect=1;
  animate();
  controlSound();
  controlMusic();
}

function start() {
  setTimeout(function () {
    $("#contain").fadeOut(1000);
  }, 1000);
  setTimeout(function () {
    location.href = "../map/map.html";
  }, 2000);
}

function controlSound() {
  $(".sound-bg").prop("volume", bgVol)
  $(".sound-1").prop("volume", mainVol)
  localStorage.setItem('bgVol',bgVol);
  localStorage.setItem('effVol',mainVol);
}

function controlMusic() {
  $(".sound-bg").get(0).play();

  setTimeout(function () {
    controlMusic();
  }, 1);
}

function animate() {
  setInterval(function () {
    $(".button").each(function (i) {
      spinTime = Math.floor(Math.random() * 20 + 1);
      spinRev = Math.floor(Math.random() * 2 + 1);
      if (spinRev == 2) {
        spinTime = spinTime * -1;
      }
      $(this).css("transform", "rotateZ(" + spinTime + "deg)");
    });
  }, 2000);
}

function reset() {
  $(".options").css("transform", "rotateY(80deg)");
  $(".about").css("transform", "rotateY(80deg)");
  if (oOpen == true) {
    setTimeout(function () {
      $("#contain").removeClass("ca");
    }, 500);
    $(".options").fadeOut(500);
    oOpen = false;
  }
  if (aOpen == true) {
    setTimeout(function () {
      $("#contain").removeClass("pa");
    }, 500);
    $(".about").fadeOut(500);
    aOpen = false;
  }
}

$(".button").click(function () {
  $(".sound-1").get(0).play();
  reset();
});

$(".button:nth-child(1)").click(function () {
  $(".sound-1").get(0).play();
  start();
});

$(".button:nth-child(2)").click(function () {
  $("#contain").addClass("ca");
  $(".options").show();
  $(".options").css("transform", "rotateY(0)");
  oOpen = true;
});

$(".button:nth-child(3)").click(function () {
  $("#contain").addClass("pa");
  $(".about").show();
  $(".about").css("transform", "rotateY(0)");
  aOpen = true;
});

$(".bgmusic").slider({
  step: 0.1,
  min: 0,
  max: 1,
  value: 1,
  slide: function (event, ui) {
    $(".option:nth-child(1)").text("Background Music: " + ui.value + "");
    bgVol = ui.value;
    controlSound();
  },
});

$(".effsound").slider({
  step: 0.1,
  min: 0,
  max: 1,
  value: 1,
  slide: function (event, ui) {
    $(".option:nth-child(3)").text("Effect Sound: " + ui.value + "");
    mainVol = ui.value;
    controlSound();
  },
});

$(".speedselect").slider({
  step: 0.25,
  min: 0.5,
  max: 1.5,
  value: 1,
  slide: function (event, ui) {
    $(".option:nth-child(5)").text("Speed: X" + ui.value + "");
    speedselect = ui.value * 1;
    controlSound();
  },
});

window.onload = function () {
  init();
};
