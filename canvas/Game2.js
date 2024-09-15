var myGamePiece;
var myBackground;
var myObstacles = [];
var myScore;
var mySound;
var myMusic;
var gamePaused = false; // Variable to track if the game is paused


function startGame() {

    // Clear existing obstacles and game interval
    myObstacles = []; // Reset obstacles array
    if (myGameArea.interval) {
        clearInterval(myGameArea.interval);
    }

    // Stop the music if it is playing
    if (myMusic) {
        myMusic.stop();
    }

    // Initialize new game objects
    myGamePiece = new gameObject(30, 30, "Bird.png", 10, 120, "image");
    myBackground = new gameObject(480, 270, "Background.jpg", 0, 0, "background");
    mySound = new sound("Death_Sound.mp3");
    myMusic = new sound("BG_Music.mp3");

    // Reset the frame count and play music
    myGameArea.frameNo = 0;
    myMusic.play();
    
    // Set gravity and other properties
    myGamePiece.gravity = 0.05;
    myScore = new gameObject("30px", "Consolas", "White", 280, 40, "text");

    // Start the game loop
    myGameArea.start();
}

function togglePause() {
    var pauseButton = document.getElementById("pauseButton");

    if (gamePaused) {
        // Resume the game
        myGameArea.interval = setInterval(updateGameArea, 20);
        myMusic.play();
        pauseButton.innerHTML = "Pause";  // Change button text to "Pause"
        gamePaused = false;
        
    } else {
        // Pause the game
        clearInterval(myGameArea.interval);  // Stop the game loop
        myMusic.stop();
        pauseButton.innerHTML = "Resume";  // Change button text to "Resume"
        gamePaused = true;
    }
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 480;
        this.canvas.height = 270;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20); // Game loop starts here

        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        });

        window.addEventListener("keyup", function (e) {
            myGameArea.keys[e.keyCode] = false;
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval); // Stops the game
    }
};

function gameObject(width, height, color, x, y, type) {

    this.type = type;
    this.score = 0;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;
    this.gravity =  0;
    this.gravitySpeed = 0;
    this.angle = 0;

    ///here we set the character image

   if (type == "image" || type == "background" || type == "obstacle") {
    this.image = new Image();
    this.image.src = color;
  }

  this.update = function() {
    ctx = myGameArea.context;

    if (this.type == "text") {
        ctx.font = this.width + " " + this.height;
        ctx.fillStyle = color;
        ctx.fillText(this.text, this.x, this.y);
    }

    if (this.type == "image" || this.type == "background" || this.type == "obstacle") {
        ctx.save(); // Save the current drawing state

        // Move the canvas origin to the object's center for rotation
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Apply the rotation
        ctx.rotate(this.angle);
        
        // Draw the image with the rotation applied
        ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

        // Restore the canvas state to the original state
        ctx.restore();

        if (this.type == "background") {
            ctx.drawImage(this.image, 
                this.x + this.width, 
                this.y,
                this.width, this.height);
        }

    } else {
        // Apply transparency if it's a pink hitbox
        if (color === "pink") {
            ctx.globalAlpha = 0.05; // Set transparency to 100%
        }

        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // Reset transparency after drawing the hitbox
        ctx.globalAlpha = 1.0;
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
         // Ensure obstacle speed is consistent across games
        
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

        // Create lower obstacle
    myObstacles.push(new gameObject(40, height, "pink", x, 0)); // Width of obstacle changed to 15
    myObstacles.push(new gameObject(40, x - height - gap, "pink", x, height + gap));

    // Create upper obstacle with rotation
    var upperObstacle = new gameObject(40, height, "Pipe.png", x, 0, "obstacle");
    upperObstacle.angle = Math.PI; // Rotate 180 degrees
    myObstacles.push(upperObstacle);

    var lowerObstacle = new gameObject(40, x - height - gap, "Pipe.png", x, height + gap, "obstacle");
    myObstacles.push(lowerObstacle);
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x -= 2; // Increase or decrease speed of obstacles
        myObstacles[i].update();
    }

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
    myScore.text="SCORE: " + myGameArea.frameNo;
    myScore.update();

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

    // New flag to prevent overlapping sounds
    this.hasPlayed = false;

    this.play = function() {
        if (!this.hasPlayed) {
            this.sound.play();
            this.hasPlayed = true; // Set the flag to true after playing
        }
    }
    
    this.stop = function() {
        this.sound.pause();
        this.sound.currentTime = 0; // Reset to the beginning
        this.hasPlayed = false; // Allow to play again next time
    }
}
