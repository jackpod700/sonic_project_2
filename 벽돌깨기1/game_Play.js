var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");
var canvasX = canvas.offsetLeft;
var game = null; //Game 클래스 객체
var g_level = 0; //현재 레벨 상태
var ballSpeeds = [6, 7, 10];
var userballSpeed = parseFloat(localStorage.getItem("speedselect"));
var brickData; //현재 벽돌 데이터
var myReq; //rAF 아이디
var ring = 0; //링 개수
var supersonic = 0; //슈퍼소닉 아이템
var clock = 0; //공 속도저하 아이템(시간 아이템이라 하겠음)
var Knuckles = 0; //너클즈 아이템
var is_supersonic = false; //슈퍼소닉 상태
var score = 0; //게임 총 점수 - 게임 새로 시작할때 초기화 필요
//각 이미지 돌리기 변수
var sonicimg_count = 0;
var ringimg_count = 0;
var supersonicimg_count = 0;
var Knucklesimg_count = 0;
//볼륨 변수
var bgVol = 1; //배경볼륨
var effVol = 1; //이펙트볼륨
//사운드 설정
function controlSound() {
  $("#sound-bg").prop("volume", bgVol);
  $("#sound-ring-get").prop("volume", effVol);
  $("#sound-ring-fall").prop("volume", effVol);
  $("#sound-jump").prop("volume", effVol);
  $("#sound-supersonic").prop("volume", effVol);
  $("#sound-item-get").prop("volume", effVol);
  $("#sound-clock").prop("volume", effVol);
  $("#sound-knucles").prop("volume", effVol);
}

function controlMusic() {
  $("#sound-bg").get(0).play();

  setTimeout(function () {
    controlMusic();
  }, 1);
}

$(document).ready(function () {
  //공 속도설정
  ballSpeeds[0] = ballSpeeds[0] * userballSpeed;
  ballSpeeds[1] = ballSpeeds[1] * userballSpeed;
  ballSpeeds[2] = ballSpeeds[2] * userballSpeed;
  //레벨에 맞게 게임 자동 시작

  var level = localStorage.getItem("level");
  startGame(level);
  //볼륨 설정
  bgVol = localStorage.getItem("bgVol");
  effVol = localStorage.getItem("effVol");
  //음악 종류 설정
  if (level == 1) $("#sound-bg").attr("src", "music/lv1_bgm.mp3");
  else if (level == 2) $("#sound-bg").attr("src", "music/lv2_bgm.mp3");
  else if (level == 3) $("#sound-bg").attr("src", "music/boss1.mp3");
  controlSound();
  controlMusic();
  //이미지들 돌리기
  setInterval(function () {
    //링
    ring_img.src = "ring/ring-sonic/ring-" + ringimg_count + ".png";
    if (ringimg_count == 7) ringimg_count = 0;
    else ringimg_count++;
    //너클즈
    Knuckles_img.src = "Knuckles/Knuckles_ball-" + Knucklesimg_count + ".png";
    if (Knucklesimg_count == 4) Knucklesimg_count = 0;
    else Knucklesimg_count++;
  }, 70);
  setInterval(function () {
    //소닉
    sonicImg.src = "sonic/sonic_ball-" + sonicimg_count + ".png";
    if (sonicimg_count == 7) sonicimg_count = 0;
    else sonicimg_count++;
    //슈퍼소닉
    supersonic_img.src =
      "supersonic/supersonic_ball-" + supersonicimg_count + ".png";
    if (supersonicimg_count == 7) supersonicimg_count = 0;
    else supersonicimg_count++;
  }, 20);
  $("#pause_btn").on("click", function () {
    if (game.state == "play") game.state = "pause";
  });
});

//레벨 을 인자로 받아 게임 시작
function startGame(level) {
  if (myReq) cancelAnimationFrame(myReq);
  g_level = level;
  if (level != 3) {
    brickData = mkBricks(g_level);
  }
  game = new Game(g_level);
  mainLoop();
}

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const BALL_RADIUS = 20;
const PADDLE_WIDTH = 150;
const PADDLE_HEIGHT = 30;
const PADDLE_X = (WIDTH - PADDLE_WIDTH) / 2;
const PADDLE_Y = HEIGHT - PADDLE_HEIGHT - 10;

/**변수로 볼 이미지, paddle 이미지 추가후 생성자 수정 필요 **/
//이미지들
var ballImg = new Image(30, 30);
ballImg.src = "sonic/sonic_ball-0.png";
var sonicImg = new Image(30, 30);
sonicImg.src = "sonic/sonic_ball-0.png";
var ring_img = new Image();
ring_img.src = "ring/ring-sonic/ring-0.png";
var supersonic_img = new Image();
supersonic_img.src = "supersonic/supersonic_ball-0.png";
var clock_img = new Image();
clock_img.src = "clock/clock.gif";
var Knuckles_img = new Image();
Knuckles_img.src = "Knuckles/Knuckles_ball-0.png";
var paddle_img = new Array(3);
for (var i = 0; i < 3; i++) {
  paddle_img[i] = new Image();
  paddle_img[i].src = "paddle/paddle" + (i + 1) + ".png";
}
var lv1Img = new Image();
lv1Img.src = "blocks/lv1block.png";
var lv2Img = new Image();
lv2Img.src = "blocks/lv2block.png";
var lv3Img = new Image();
lv3Img.src = "blocks/lv3block.png";
/**임시 색상 **/
const COLOR = "dodgerblue";
/**data(brick 배치) 레벨별로 디자인 후 정의 필요 **/
/**임시 data **/

//브릭데이터 생성
function mkBricks(level) {
  if (level == 1) {
    var row = 3;
    var col = 5;
    var data = [];
    for (var r = 0; r < row; r++) {
      var line = new Array(col);
      for (var c = 0; c < col; c++) {
        if (c % 2) line[c] = new Brick(lv1Img, 2);
        //아이템 랜덤 생성시 브릭을 매번 생성해줘야됨
        else line[c] = new Brick(lv1Img, 1);
      }
      data.push(line);
    }
    return data;
  }
  if (level == 2) {
    var row = 3;
    var col = 5;
    var data = [];
    for (var r = 0; r < row; r++) {
      var line = new Array(col);
      for (var c = 0; c < col; c++) {
        if (c % 2) line[c] = new Brick(lv2Img, 2);
        else line[c] = new Brick(lv2Img, 2);
      }
      data.push(line);
    }
    return data;
  }
}

var ck = 1;

//배경 설정
function setBackground(level) {
  var back = document.getElementById("back-ground");
  var url = "background/lv" + level + ".gif";
  back.style.backgroundImage = "url(" + url + ")";
  back.style.backgroundRepeat = "no-repeat";
  back.style.backgroundSize = "cover";
}
function setLevelBar(level) {
  var bar = document.getElementById("level-bar");
  bar.innerText = "-- level" + level + " --";
}

//공
class Ball {
  constructor(x, y, radius, speed, angle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.speed = speed;
    this.setAngle(angle);
    this.angle = angle;
    this.count = 0;
    this.is_sonic = true;
    this.colx;
    this.coly;
  }
  setAngle(angle) {
    var radian = (angle / 180) * Math.PI;
    this.mx = this.speed * Math.cos(radian);
    this.my = -this.speed * Math.sin(radian);
  }
  move(k) {
    this.x = this.x + this.mx * k;
    this.y = this.y + this.my * k;
  }

  get collideX() {
    if (this.mx > 0) return this.x + this.radius;
    else return this.x - this.radius;
  }

  get collideY() {
    if (this.my > 0) return this.y + this.radius;
    else return this.y - this.radius;
  }

  collideWall(left, top, right) {
    if (this.mx < 0 && this.collideX < left) {
      if (ck == 0) {
        ck = 1;
      }
      this.mx *= -1;
      this.colx = this.x;
      this.coly = this.y;
      $("#sound-wall-collide").get(0).play();
    }
    if (this.mx > 0 && this.collideX > right) {
      if (ck == 0) {
        ck = 1;
      }
      this.mx *= -1;
      this.colx = this.x;
      this.coly = this.y;
      $("#sound-wall-collide").get(0).play();
    }
    if (this.my < 0 && this.collideY < top) {
      if (ck == 0) {
        ck = 1;
      }
      this.my *= -1;
      this.colx = this.x;
      this.coly = this.y;
      $("#sound-wall-collide").get(0).play();
    }
  }

  draw(ctx) {
    //소닉 이미지 변경
    if (this.is_sonic) {
      //소닉일때
      if (is_supersonic) ballImg = supersonic_img;
      else ballImg = sonicImg;
      ctx.beginPath();
      ctx.drawImage(
        ballImg,
        this.x - this.radius,
        this.y - this.radius,
        2 * this.radius,
        2 * this.radius
      );
      ctx.closePath();
    } else {
      //너클즈일때
      ctx.beginPath();
      ctx.drawImage(
        Knuckles_img,
        this.x - this.radius,
        this.y - this.radius,
        2 * this.radius,
        2 * this.radius
      );
      ctx.closePath();
    }
  }
}

var eggman1Img = new Image();
eggman1Img.src = "eggman1.gif";
var bossx = WIDTH / 2;
var bossy = HEIGHT - 640;
var bossr = 40;

class Eggman1 {
  constructor(x, y, hp) {
    this.x = x;
    this.y = y;
    this.hp = hp;
    this.bx = bossx;
    this.by = bossy + 185;
  }

  collide(ball) {
    var check = () => (ball.x - bossx) ** 2 + (ball.y - bossy) ** 2 < 3600;
    if (check()) {
      if (ck == 1) {
        var radian =
          Math.atan((bossy - ball.y) / (bossx - ball.x)) -
          Math.atan((ball.coly - ball.y) / (ball.colx - ball.x));
        var angle = (-1 * radian * 180) / Math.PI;
        ball.setAngle(angle);
        ck = 0;
      }
    }
  }

  collideb(ball) {
    var check = () =>
      (ball.x - bossx) ** 2 + (ball.y - (bossy + 180)) ** 2 < 3025;
    if (check()) {
      if (ck == 1) {
        var radian =
          Math.atan((bossy + 180 - ball.y) / (bossx - ball.x)) -
          Math.atan((ball.coly - ball.y) / (ball.colx - ball.x));
        var angle = (radian * 180) / Math.PI;
        ball.setAngle(angle);
        ck = 0;
      }
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(bossx, bossy, 40, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.arc(this.bx, this.by, 35, 0, 2 * Math.PI, false);
    ctx.fillStyle = "black";
    ctx.fill();
    ctx.drawImage(eggman1Img, this.x, this.y, 350, 300);
    ctx.closePath();
  }
}

//패들
class Paddle {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.halfWidth = width / 2;
    this.height = height;
    this.color = color;
  }

  get center() {
    return this.x + this.halfWidth;
  }

  collide(ball) {
    var yCheck = () =>
      this.y - ball.radius < ball.y && ball.y < this.y + ball.radius;
    var xCheck = () => this.x < ball.x && ball.x < this.x + this.width;
    if (ball.my > 0 && yCheck() && xCheck()) {
      const hitPos = ball.x - this.center;
      var angle = 80 - (hitPos / this.halfWidth) * 60;
      ball.setAngle(angle);
      ball.colx = ball.x;
      ball.coly = ball.y + ball.radius;
      ck = 1;
      $("#sound-jump").get(0).play();
    }
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.drawImage(
      paddle_img[g_level - 1],
      this.x,
      this.y,
      this.width,
      this.height
    );
    ctx.closePath();
  }
}

//브릭
class Brick {
  constructor(img, hp) {
    this.img = img;
    this.hp = hp;
    //아이템들 추가
    this.has_ring = Math.random() > 0.7;
    if (!this.has_ring) this.has_supersonic = Math.random() > 0.9;
    if (!this.has_ring && !this.has_supersonic)
      this.has_clock = Math.random() > 0.9;
    if (!this.has_ring && !this.has_supersonic && !this.has_clock)
      this.has_Knuckles = Math.random() > 0.95;
  }
}

//브릭데이터를 기반으로 실시간 브릭처리
class Bricks {
  /**(Brick)data = Brick의 2차원 배열, 없으면 value=0 **/
  constructor(data, x, y, width, height) {
    this.rows = data.length;
    this.cols = data[0].length;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.brickWidth = width / this.cols;
    this.brickHeight = height / this.rows;
    this.data = data;
    this.count = 0;
    for (var r = 0; r < this.rows; r++)
      for (var c = 0; c < this.cols; c++) if (data[r][c]) this.count++;
  }
  collide(x_Ball, y_Ball) {
    var row = Math.floor((y_Ball - this.y) / this.brickHeight);
    var col = Math.floor((x_Ball - this.x) / this.brickWidth);
    if (row < 0 || row >= this.rows) return false;
    if (col < 0 || col >= this.cols) return false;
    if (this.data[row][col]) {
      //부딪혔을 때 아이템이 들어있을 시 아이템+1
      if (this.data[row][col].has_ring) {
        ring++;
        document.getElementById("ring_count").innerText = ring;
        $("#sound-ring-get").get(0).play();
      } else if (this.data[row][col].has_supersonic) {
        $("#sound-item-get").get(0).play();
        supersonic++;
        document.getElementById("supersonic_count").innerText = supersonic;
      } else if (this.data[row][col].has_clock) {
        $("#sound-item-get").get(0).play();
        clock++;
        document.getElementById("clock_count").innerText = clock;
      } else if (this.data[row][col].has_Knuckles) {
        $("#sound-item-get").get(0).play();
        Knuckles++;
        document.getElementById("Knuckles_count").innerText = Knuckles;
      }
      //블럭 없애기
      this.data[row][col] = 0;
      this.count--;
      score++; //블럭당 점수 1점( 수정 가능 )
      $("#sound-brick-collide").get(0).play();
      return true;
    } else return false;
  }
  draw(ctx) {
    ctx.strokeStyle = "lightgray";
    for (var r = 0; r < this.rows; r++) {
      for (var c = 0; c < this.cols; c++) {
        if (!this.data[r][c]) continue;
        var x_Brick = this.x + this.brickWidth * c;
        var y_Brick = this.y + this.brickHeight * r;
        ctx.beginPath();
        ctx.drawImage(
          this.data[r][c].img,
          x_Brick,
          y_Brick,
          this.brickWidth,
          this.brickHeight
        );
        ctx.closePath();
        //블럭에 아이템이 들어있을 시 아이템 이미지 삽입
        if (this.data[r][c].has_ring) {
          ctx.drawImage(
            ring_img,
            x_Brick + this.brickWidth / 2 - 20,
            y_Brick + this.brickHeight / 2 - 15,
            40,
            30
          );
        }
        if (this.data[r][c].has_supersonic) {
          ctx.drawImage(
            supersonic_img,
            x_Brick + this.brickWidth / 2 - 18,
            y_Brick + this.brickHeight / 2 - 18,
            36,
            36
          );
        }
        if (this.data[r][c].has_clock) {
          ctx.drawImage(
            clock_img,
            x_Brick + this.brickWidth / 2 - 18,
            y_Brick + this.brickHeight / 2 - 18,
            36,
            36
          );
        }
        if (this.data[r][c].has_Knuckles) {
          ctx.drawImage(
            Knuckles_img,
            x_Brick + this.brickWidth / 2 - 18,
            y_Brick + this.brickHeight / 2 - 18,
            36,
            36
          );
        }
      }
    }
  }
}
var mouseX; //상대적(canvas) x좌표

function onMouseMove(e) {
  mouseX = e.pageX - canvasX;
  if (canvasX + PADDLE_WIDTH / 2 >= e.pageX) mouseX = PADDLE_WIDTH / 2;
  if (e.pageX >= WIDTH + canvasX - PADDLE_WIDTH / 2)
    mouseX = WIDTH - PADDLE_WIDTH / 2;
}
canvas.addEventListener("mousemove", onMouseMove, false);

//키보드 입력으로 아이템 사용
document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key == "1") {
    //슈퍼소닉 사용
    if (supersonic > 0) {
      $("#sound-supersonic").get(0).play();
      is_supersonic = true;
      supersonic--;
      document.getElementById("supersonic_count").innerText = supersonic;
      //슈퍼소닉 5초유지
      setTimeout(function () {
        is_supersonic = false;
      }, 5000);
    }
  }
  if (key == "2") {
    //시간아이템 사용
    if (clock > 0) {
      $("#sound-clock").get(0).play();
      //소닉 속도 변경
      //마지막 * 숫자가 시간아이템 사용시의 속도
      game.ball[0].mx = (game.ball[0].mx / game.ball[0].speed) * 1;
      game.ball[0].my = (game.ball[0].my / game.ball[0].speed) * 1;
      game.ball[0].speed = 1;
      //너클즈 속도변경
      if (game.ball[1] != null) {
        game.ball[1].mx = (game.ball[1].mx / game.ball[1].speed) * 1;
        game.ball[1].my = (game.ball[1].my / game.ball[1].speed) * 1;
        game.ball[1].speed = 1;
      }
      clock--;
      document.getElementById("clock_count").innerText = clock;
      //시간아이템 10초 유지
      setTimeout(function () {
        game.ball[0].speed = ballSpeeds[game.level - 1];
        game.ball[0].mx = game.ball[0].mx * game.ball[0].speed;
        game.ball[0].my = game.ball[0].my * game.ball[0].speed;

        if (game.ball[1] != null) {
          game.ball[1].speed = ballSpeeds[game.level - 1];
          game.ball[1].mx = game.ball[1].mx * game.ball[1].speed;
          game.ball[1].my = game.ball[1].my * game.ball[1].speed;
        }
      }, 10000);
    }
  }
  if (key == "3") {
    //너클즈 사용
    if (Knuckles > 0) {
      $("#sound-knuckles").get(0).play();
      game.ball[1] = new Ball(
        game.paddle.center,
        PADDLE_Y - BALL_RADIUS,
        BALL_RADIUS,
        ballSpeeds[game.level - 1],
        80
      );
      game.ball[1].is_sonic = false;
      Knuckles--;
      document.getElementById("Knuckles_count").innerText = Knuckles;
    }
  }
  if (key == "c" && game.state == "pause") {
    //continue
    game.state = "play";
  }
  if (
    key == "m" &&
    (game.state == "pause" || game.state == "lose" || game.state == "clear")
  ) {
    //Main-Menu
    if (myReq) cancelAnimationFrame(myReq);
    score = 0; //점수 초기화
    location.href = "../메뉴/프로젝트/menu/menu.html";
  }
  if (key == "r" && (game.state == "lose" || game.state == "clear")) {
    //Retry
    score = 0; //점수 초기화
    if(g_level<3) $("#sound-bg").attr("src", "music/lv" + g_level + "_bgm.mp3");
    else $("#sound-bg").attr("src", "music/boss1.mp3");
    controlMusic();
    startGame(g_level);
  }
});

class Game {
  constructor(level) {
    var brickSettings = [brickData, 0, 50, WIDTH, 150];
    var boss = [(WIDTH - 350) / 2, HEIGHT - 700, 3];

    this.level = level;

    this.state = "start"; //게임의 현재 상태("start" / "play" // "lose" // "clear")
    this.timeCount = 0;
    this.paddle = new Paddle(
      PADDLE_X,
      PADDLE_Y,
      PADDLE_WIDTH,
      PADDLE_HEIGHT,
      COLOR
    );
    this.ball = [];
    this.ball[0] = new Ball(
      this.paddle.center,
      PADDLE_Y - BALL_RADIUS,
      BALL_RADIUS,
      ballSpeeds[level - 1],
      80
    );
    if (level != 3) {
      this.bricks = new Bricks(...brickSettings);
    } else {
      this.boss = new Eggman1(...boss);
    }
    this.ball[1] = null;
    setBackground(level);
    setLevelBar(level);
  }

  update() {
    if (this.state == "start") {
      this.timeCount++;
      if (this.timeCount >= 100) this.state = "play";
      return;
    }
    //삭제 해ㅐ애ㅐ애
    if (this.level == 2 && this.state == "go2Lv3") this.state = "clear"; //임시!!!!!!!!!!(보스전 만들면 삭제 필)
    //삭제 해ㅐ애애ㅐㅇ
    if (this.state != "play") return;

    this.paddle.x = mouseX - PADDLE_WIDTH / 2;

    //공의 벽이나 패들과의 충돌 여부 확인(for문 -> 정확도 높임)
    const DIV = 10;
    for (var i = 0; i < DIV; i++) {
      this.ball[0].move(1 / DIV);
      this.ball[0].collideWall(0, 0, WIDTH);
      this.paddle.collide(this.ball[0]);
      if (this.level != 3) {
        if (this.bricks.collide(this.ball[0].collideX, this.ball[0].y)) {
          if (!is_supersonic) {
            this.ball[0].mx *= -1;
          }
        }
        if (this.bricks.collide(this.ball[0].x, this.ball[0].collideY)) {
          if (!is_supersonic) {
            this.ball[0].my *= -1;
          }
        }
      } else {
        this.boss.collide(this.ball[0]);
        this.boss.collideb(this.ball[0]);
      }
      //너클즈가 존재한다면
      if (this.ball[1] != null) {
        this.ball[1].move(1 / DIV);
        this.ball[1].collideWall(0, 0, WIDTH);
        this.paddle.collide(this.ball[1]);
        if (this.bricks.collide(this.ball[1].collideX, this.ball[1].y)) {
          this.ball[1].mx *= -1;
        }
        if (this.bricks.collide(this.ball[1].x, this.ball[1].collideY)) {
          this.ball[1].my *= -1;
        }
      }
    }
    //승리, 실패 조건
    if (this.ball[0].y > HEIGHT + this.ball[0].radius) {
      //링이 남아 있을시
      if (ring > 0) {
        //this.paddle.x=PADDLE_X;
        this.ball[0].x = this.paddle.center;
        this.ball[0].y = PADDLE_Y - BALL_RADIUS;
        this.ball[0].setAngle(80);
        ring--;
        document.getElementById("ring_count").innerText = ring;
        is_supersonic = false;
        $("#sound-ring-fall").get(0).play();
      } else {
        this.state = "lose";
      }
    }
    //너클즈가 떨어진다면 너클즈 삭제
    if (this.ball[1] != null) {
      if (this.ball[1].y > HEIGHT + this.ball[1].radius) {
        this.ball[1] = null;
      }
    }
    if (this.level != 3) {
      if (this.bricks.count == 0) {
        if (this.level == 1) game.state = "go2Lv2";
        else if (this.level == 2) game.state = "go2Lv3";
        else game.state = "clear";
      }
    }
  }

  draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    this.paddle.draw(ctx);
    this.ball[0].draw(ctx);
    if (this.ball[1] != null) {
      //너클즈 있을때 너클즈 그리기
      this.ball[1].draw(ctx);
    }
    if (this.level != 3) {
      this.bricks.draw(ctx);
    } else {
      this.boss.draw(ctx);
    }
    document.getElementById("score_count").innerHTML = score;
  }
}
//결과+멈춤창 함수
function resultScreen(result) {
  ctx.beginPath();
  ctx.fillStyle = "black";
  ctx.fillRect(80, 110, 550, 550);
  ctx.globalAlpha = 0.7;
  ctx.closePath();
  if (result == "nextStage") resultScreen_nextStage();
  if (result == "END") resultScreen_end();
  if (result == "PAUSE") resultScreen_pause();
}
//다음 스테이지 넘어가는 캔버스 그리기
function resultScreen_nextStage() {
  if (myReq) cancelAnimationFrame(myReq);
  ctx.beginPath();
  ctx.fillStyle = "#ff8831";
  ctx.font = "40px sonic";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  var str = "Go stage" + (Number(g_level) + 1);
  ctx.fillText(str, WIDTH / 2, HEIGHT * 0.45);

  ctx.fillStyle = "#17569b";
  ctx.font = "20px sonic";
  ctx.textBaseline = "middle";
  var str = "current score: " + score;
  ctx.fillText(str, WIDTH / 2, HEIGHT * 0.55);
  ctx.closePath();
  var timeCnt = 0;
  var req = setInterval(function () {
    timeCnt++;
    if (timeCnt == 3) {
      clearInterval(req);
      location.href =
        "../메뉴/프로젝트/item_ex/explain" + (Number(g_level) + 1) + ".html";
    }
  }, 1000);
}
var continue_img = new Image();
continue_img.src = "resultScreen_btn/continue.png";
var main_menu_img = new Image();
main_menu_img.src = "resultScreen_btn/main-menu.png";
var retry_img = new Image();
retry_img.src = "resultScreen_btn/retry.png";
//종료(클리어 or 실패) 결과 화면 캔버스 그리기
function resultScreen_end() {
  if (myReq) cancelAnimationFrame(myReq);
  if (game.state == "lose") {
    $("#sound-bg").attr("src", "music/gameOver_bgm.mp3");
    $("#sound-bg").get(0).play();
  } else if (game.state == "clear") {
    $("#sound-bg").attr("src", "music/gameClear_bgm.mp3");
    $("#sound-bg").get(0).play();
  }
  ctx.beginPath();
  ctx.fillStyle = "#ff8831";
  ctx.font = "40px sonic";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (game.state == "lose") var str = "You Lose..";
  else var str = "You Win!";
  ctx.fillText(str, WIDTH / 2, HEIGHT * 0.4);

  ctx.fillStyle = "#17569b";
  ctx.font = "20px sonic";
  ctx.textBaseline = "middle";
  var str = "Your score: " + score;
  ctx.fillText(str, WIDTH / 2, HEIGHT * 0.5);

  ctx.font = "15px sonic";
  ctx.fillStyle = "#ff8832";
  ctx.fillText("Retry", WIDTH * 0.37, HEIGHT * 0.7);
  ctx.drawImage(retry_img, WIDTH * 0.35, HEIGHT * 0.6, 40, 40);

  ctx.fillStyle = "#ff8833";
  ctx.fillText("Main-Menu", WIDTH * 0.67, HEIGHT * 0.7);
  ctx.drawImage(main_menu_img, WIDTH * 0.65, HEIGHT * 0.6, 40, 40);
  ctx.closePath();
}
//멈춤 화면 캔버스 그리기
function resultScreen_pause() {
  ctx.beginPath();
  ctx.fillStyle = "#ff8831";
  ctx.font = "40px sonic";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  var str = "Pause";
  ctx.fillText(str, WIDTH / 2, HEIGHT * 0.4);

  ctx.fillStyle = "#17569b";
  ctx.font = "20px sonic";
  ctx.textBaseline = "middle";
  var str = "current score: " + score;
  ctx.fillText(str, WIDTH / 2, HEIGHT * 0.5);

  ctx.font = "15px sonic";
  ctx.fillStyle = "#ff8832";
  ctx.fillText("Continue", WIDTH * 0.37, HEIGHT * 0.7);
  ctx.drawImage(continue_img, WIDTH * 0.35, HEIGHT * 0.6, 40, 40);

  ctx.fillStyle = "#ff8833";
  ctx.fillText("Main-Menu", WIDTH * 0.67, HEIGHT * 0.7);
  ctx.drawImage(main_menu_img, WIDTH * 0.65, HEIGHT * 0.6, 40, 40);
  ctx.closePath();
}

//반복 함수
function mainLoop() {
  myReq = requestAnimationFrame(mainLoop);
  game.update();
  game.draw();
  if (game.state == "lose" || game.state == "clear") resultScreen("END");
  if (game.state == "go2Lv2" || game.state == "go2Lv3")
    resultScreen("nextStage");
  if (game.state == "pause") resultScreen("PAUSE");
}
