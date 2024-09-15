var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var Bird_Animation = new Image();
var mySound;
var myMusic;


function startGame() {
    myGamePiece = new gameObject(30, 30, "Bird.png", 10, 120,"image");
    myBackground = new gameObject(480, 270, "Background.jpg", 0, 0, "background");
    mySound = new sound("Death_Sound.mp3");
    myMusic = new sound("BG_Music.mp3");
    myMusic.play();

    myGamePiece.gravity = 0.05;
    myScore = new gameObject("30px", "Consolas", "black", 280, 40, "text");

    
    myGameArea.start();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        ///here is the function to control the character with out keyboard
        window.addEventListener('keydown',function  (e){

            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;

        })

        window.addEventListener("keyup",function  (e){

            myGameArea.keys[e.keyCode] = false;
            
        })

        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function gameObject(width, height, color, x, y, type) {
    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity = 0.05;
    this.gravitySpeed = 0;
    ///here we set the character image

   if (type == "image" || type == "background" || type == "obstacle") {
    this.image = new Image();
    this.image.src = color;
  }

    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image" || type == "background" || this.type == "obstacle") {
            ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
        if (type == "background") {
            ctx.drawImage(this.image, 
                this.x + this.width, 
                this.y,
                this.width, this.height);
        }
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    
    this.newPos = function() {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
              this.x = 0;
            }
        }
        this.hitBottom();
    }
    this.hitBottom = function() {///This is what defines the floor for the character
        var rockbottom = myGameArea.canvas.height - this.height;
        if (this.y > rockbottom) {
            this.y = rockbottom;
            this.gravitySpeed = 0;
        }
    }
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            mySound.play();
            myMusic.stop();
            myGameArea.stop();
            return;
        } 
    }
    myGameArea.clear();
    myBackground.speedX = -1;
    myBackground.newPos();
    myBackground.update();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
        x = myGameArea.canvas.width;
        minHeight = 20;
        maxHeight = 200;
        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap = 200;
        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);

        myObstacles.push(new gameObject(35, height, "green", x, 0)); // Width of obstacle changed to 15
        myObstacles.push(new gameObject(35, x - height - gap, "green", x, height + gap));

        myObstacles.push(new gameObject(35, height, "Bricks_Patter.jpg", x, 0, "obstacle"));
        myObstacles.push(new gameObject(35, x - height - gap, "Bricks_Patter.jpg", x, height + gap, "obstacle"));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= 2; // Increase or decrease speed of obstacles
        myObstacles[i].update();
    }
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();

    ///Here we add the movement to our character

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;

    if( myGamePiece.speedX == 0 ||  myGamePiece.speedY == 0){myGamePiece.image.src = "Bird.png";
    };
    

    if(myGameArea.keys && myGameArea.keys[37]){myGamePiece.speedX = -1
        myGamePiece.image.src = "Bird2.png";
    } ///Movement to the left
    if(myGameArea.keys && myGameArea.keys[39]){myGamePiece.speedX = 1
        myGamePiece.image.src = "Bird2.png";

    } ///Movement to the right
    if(myGameArea.keys && myGameArea.keys[38]){myGamePiece.speedY = -5
        myGamePiece.image.src = "Bird2.png";

    } ///movement up
    if(myGameArea.keys && myGameArea.keys[40]){myGamePiece.speedY = 1
        myGamePiece.image.src = "Bird2.png";

    } ///Movement down

    myGamePiece.newPos();
    myGamePiece.update();
    character2.update();
}

function clearmove() {
    myGamePiece.image.src = "Bird2.png";
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
  }

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}

function accelerate(n) {
    myGamePiece.gravity = n;
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function() {
        if (!this.hasPlayed) {
            this.sound.play();
            this.hasPlayed = true; // Set the flag to true after playing
        }
    }
    this.stop = function() {
        this.sound.pause();
        this.sound.currentTime = 0; // Reset to the beginning
    }
}
