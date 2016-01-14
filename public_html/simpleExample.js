
"use strict";

var canvasWidth = 1000;
var canvasHeight = 500;
var padding = 20;
var safeDistance = 40;
var lineWidth = 4;
var maxPlayers = 6;
var borderThickness = 6;
//var innerBorder = 5;
var frameColor = "#000000";
var context = document.getElementById('canvasId').getContext("2d");

var xPositionTemp = Math.round(Math.random() * canvasWidth); 
var yPositionTemp = Math.round(Math.random() * canvasHeight);
var fps = 30;
var movingSpeed = 1.8;
var turningSpeed = 0.08;

var allowedSpace = [];
var yRow = [];

var player = [];
var gameRunning = false;

var qCode = 81;
var wCode = 87;
var cCode = 67;
var vCode = 86;
var tCode = 84;
var yCode = 89;
var nCode = 78;
var mCode = 77;
var oCode = 79;
var pCode = 80;
var downCode = 40; 
var rightCode = 39;
var spaceCode = 32;

var playerColor = [];

var skipChance = 0.01;
var skipLength = 4;

var textStart = 8 * padding;
var scoreBoardWidth = 100;

var maxScore = 20;
var isPaused = false;

var highestScore = 0;

window.onload = windowReady;

/**
  windowReady
*/
function windowReady() {
	// Load the context of the canvas
	
        
        context.beginPath();
        context.lineWidth = lineWidth;
        context.fill();
        context.stroke();
        setPlayerColors();

        createPlayers();
        buildControls();
        showIntro();

       // start();
        
        window.addEventListener("keydown", this.check, false);
        window.addEventListener("keyup", this.checkUp, false);
        
        setInterval(act, 1000 / fps);

}
function check(e) {
    var code = keyCodeToName(e.keyCode);
    
    if(gameRunning) {
        switch (code) {
            case player[0].leftKey: player[0].leftPressed = true; break; 
            case player[0].rightKey: player[0].rightPressed = true; break;

            case player[1].leftKey: player[1].leftPressed = true; break;  
            case player[1].rightKey: player[1].rightPressed = true; break;

            case player[2].leftKey: player[2].leftPressed = true; break;  
            case player[2].rightKey: player[2].rightPressed = true; break;

            case player[3].leftKey: player[3].leftPressed = true; break;  
            case player[3].rightKey: player[3].rightPressed = true; break;

            case player[4].leftKey: player[4].leftPressed = true; break;  
            case player[4].rightKey: player[4].rightPressed = true; break;

            case player[5].leftKey: player[5].leftPressed = true; break;  
            case player[5].rightKey: player[5].rightPressed = true; break;
                
            case keyCodeToName(spaceCode): pause(); break; 
        }
    }
    else {
        switch (code) {
            case player[0].leftKey: player[0].rotation = enterGame(0); break; 

            case player[1].leftKey: player[1].rotation = enterGame(1); break; 

            case player[2].leftKey: player[2].rotation = enterGame(2); break; 

            case player[3].leftKey: player[3].rotation = enterGame(3); break; 

            case player[4].leftKey: player[4].rotation = enterGame(4); break; 

            case player[5].leftKey: player[5].rotation = enterGame(5); break; 

            case keyCodeToName(spaceCode): start(); break;
        }
    }
}

function checkUp(e) {
    var code = keyCodeToName(e.keyCode);
    
    if(gameRunning) {
        switch (code) {
            case player[0].leftKey: player[0].leftPressed = false; break; 
            case player[0].rightKey: player[0].rightPressed = false; break;

            case player[1].leftKey: player[1].leftPressed = false; break;  
            case player[1].rightKey: player[1].rightPressed = false; break;

            case player[2].leftKey: player[2].leftPressed = false; break;  
            case player[2].rightKey: player[2].rightPressed = false; break;

            case player[3].leftKey: player[3].leftPressed = false; break;  
            case player[3].rightKey: player[3].rightPressed = false; break;

            case player[4].leftKey: player[4].leftPressed = false; break;  
            case player[4].rightKey: player[4].rightPressed = false; break;

            case player[5].leftKey: player[5].leftPressed = false; break;  
            case player[5].rightKey: player[5].rightPressed = false; break;
        }
    }
}
function act() {
    if(gameRunning && !isPaused) {
        for(let n = 0; n < maxPlayers; n++) {
            var actor = player[n];
            if(actor.isAlive && actor.isPlaying) {
                actor.movePen();
                actor.turn();
                actor.move();
                actor.checkCollision();
                actor.skipDraw();
                actor.occupy();
                actor.redraw();
            }
        }
    }
}
function rotationToXDirection(rotation) {
    return Math.sin(rotation);
}
function rotationToYDirection(rotation) {
    return Math.cos(rotation);
}
function thicknessDirectionX(degrees) {
   return Math.sin(degrees + 90);
}
function thicknessDirectionY(degrees) {
   return Math.cos(degrees + 90);
}
function buildAllowedSpaceSet() {
    for(let n = 0; n < canvasWidth - padding ; n++) {
        yRow[n] = new Set();
        if(n > padding) {
            for (let m = padding; m < canvasHeight - padding; m++) {
                yRow[n].add(m);
            }
        }
        allowedSpace[n] = yRow[n];
    }
}
function checkCollision() {
    player1.checkCollision();
}
function occupy() {
    player1.occupy();
}

class Player {
    constructor (number) {
        this._xPosition = 0;
        this._yPosition = 0;
        this._rotation = 0;
        this._isAlive = false;
        this._color = playerColor[number];
        this._score = 0;
        this._skipDraw = false;
        this._skipNr = 0;
        this._leftKey = 0;
        this._rightKey = 0;
        this._isPlaying = false;
        this._leftPressed = false;
        this._rightPressed = false;
    }
    get leftPressed() {
        return this._leftPressed; 
    }
    set leftPressed(leftPressed) { 
        this._leftPressed = leftPressed; 
    }
    get rightPressed() {
        return this._rightPressed; 
    }
    set rightPressed(rightPressed) { 
        this._rightPressed = rightPressed; 
    }
    get color() {
        return this._color; 
    }
    set isAlive(isAlive) { 
        this._isAlive = isAlive; 
    }
    get isAlive() {
        return this._isAlive; 
    }
    set isPlaying(isPlaying) { 
        this._isPlaying = isPlaying; 
    }
    get isPlaying() {
        return this._isPlaying; 
    }
    set xPosition(xPosition) { 
        this._xPosition = xPosition; 
    }
    
    get xPosition() {
        return this._xPosition; 
    }

    set yPosition(yPosition) {
        this._yPosition = yPosition; 
    }
    get yPosition() {
        return this._yPosition; 
    }
    set rotation(rotation) { 
        this._rotation = rotation;
    }
    get rotation() { 
        return this._rotation;
    }
    set score(score) { 
        this._score = score; 
    }
    get score() {
        return this._score;
    }
    set leftKey(leftKey) { 
        this._leftKey = leftKey; 
    }
    get leftKey() {
        return keyCodeToName(this._leftKey); 
    }
    set rightKey(rightKey) { 
        this._rightKey = rightKey 
    }
    get rightKey() {
        return keyCodeToName(this._rightKey); 
    }
    movePen() {
        context.beginPath();
        context.lineWidth = lineWidth;
        context.moveTo(this._xPosition, this._yPosition);
    }
    turn() {
        if(this._leftPressed) this._rotation += turningSpeed;
        else if(this._rightPressed) this._rotation -= turningSpeed;
    }

    move() {
        this._xPosition += rotationToXDirection(this._rotation) * movingSpeed;
        this._yPosition += rotationToYDirection(this._rotation) * movingSpeed;
    }
    
    checkCollision() {
        cLoop:
        for(let n = 0; n <= lineWidth; n++) {
            var xPos = Math.round(this._xPosition + thicknessDirectionX(this._rotation) * (n - (lineWidth / 2)));
            var xCoordinat = allowedSpace[xPos];
            if (xCoordinat) {
                var yPos = Math.round(this._yPosition + thicknessDirectionY(this._rotation) * (n - (lineWidth / 2)));
                if(!(xCoordinat.has(yPos))) {
                    this._isAlive = false;
                    scoreUp();
                    endGame();
                    break cLoop;
                }
            }
            else {
                this._isAlive = false;
                scoreUp();
                endGame();
                break cLoop;
            }
        }
    }
    skipDraw() {
        if(this._skipNr > 0) this._skipNr--;
        else if(Math.random() < skipChance) {
            this._skipDraw = true;
            this._skipNr = skipLength;
        }
        if(this._skipNr == 0) this._skipDraw = false;
    }
    occupy() {
        if(!this._skipDraw) {
            for(let n = 0; n < lineWidth; n++) {
                var xPos = Math.round(this._xPosition + thicknessDirectionX(this._rotation) * n);
                var toDeleteX = allowedSpace[xPos];
                if(toDeleteX) {
                    var yPos = Math.round(this._yPosition + thicknessDirectionY(this._rotation) * n);
                    toDeleteX.delete(yPos);
                }
            }
        }
    }
    redraw() {
        if(!this._skipDraw && this._isAlive) {
            context.strokeStyle = this._color;
            context.lineTo(this._xPosition, this._yPosition);
            context.stroke();
            context.closePath();
        }
    }
    start() {
        this._xPosition = Math.round(padding + safeDistance + Math.random() * (canvasWidth - 2 * (padding + safeDistance)));
        this._yPosition = Math.round(padding + safeDistance + Math.random() * (canvasHeight - 2 * (padding + safeDistance)));
        this._rotation = Math.round(Math.random() * 360);
        this._score = 0;
    }
    newRound() {
        this._xPosition = Math.round(padding + safeDistance + Math.random() * (canvasWidth - 2 * (padding + safeDistance)));
        this._yPosition = Math.round(padding + safeDistance + Math.random() * (canvasHeight - 2 * (padding + safeDistance)));
        this._rotation = Math.round(Math.random() * 360);
        this._isAlive = true;
    }
}
function createPlayers() {
    for(let n = 0; n < maxPlayers; n++) {
        player[n] = new Player(n);
    }
}
function activatePlayers() {
    for(let n = 0; n < maxPlayers; n++) {
        var pl = player[n];
        if(pl.isPlaying) pl.isAlive = true;
    }
}
function start() {
    if(playingPlayers() > 1) {
        isPaused = true;
        context.closePath();
        showGame();
        buildAllowedSpaceSet();
        startPlayers();
        context.beginPath();
        showScores();
        gameRunning = true;
        oneMove(3);
        window.setTimeout(unPause, 1000);
    }
}
function newRound() {
    isPaused = true;
    context.closePath();
    showGame();
    buildAllowedSpaceSet();
    newPlRound();
    context.beginPath();
    oneMove(3);
    window.setTimeout(unPause, 1000);
}

function newPlRound() {
    for(let n = 0; n < maxPlayers; n++) {
        var pl = player[n];
        if(pl.isPlaying) {
            pl.newRound();
        }
    }
}
function startPlayers() {
    for(let n = 0; n < maxPlayers; n++) {
        player[n].start();
    }
}

function setPlayerColors() {
    playerColor[0] = "#ff0000";
    playerColor[1] = "#ff8000";
    playerColor[2] = "#ffff00";
    playerColor[3] = "#40ff00";
    playerColor[4] = "#0000ff";
    playerColor[5] = "#ff00ff";
}

function scoreUp() {
    var highest = 0;
    for(let n = 0; n < maxPlayers; n++) {
        var scorer = player[n];
        if(scorer.isAlive && scorer.isPlaying) {
            scorer.score = scorer.score + 1;
            if(scorer.score > highest) highest = scorer.score;
        }
    }
    if(highest > highestScore) highestScore = highest;
    showScores();
}

function showScores() {
    context.clearRect(canvasWidth, 0, canvasWidth + scoreBoardWidth, canvasHeight);
    
    context.font= "normal normal bold 40px arial";
    
    for(let n = 0; n < maxPlayers; n++) {
        var pl = player[n];
        context.fillStyle = pl.color;
        var yPos = padding * 3 + n * padding * 4;
        var info = pl.score;
        context.fillText(info, canvasWidth, yPos);
    }   
}

function showGame() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.strokeStyle = frameColor;
    context.strokeRect(padding - lineWidth / 2, padding - lineWidth / 2, canvasWidth - 2 * padding  + lineWidth / 2, canvasHeight - 2 * padding  + lineWidth / 2);
    
}
function showIntro() {
    context.clearRect(0, 0, canvasWidth, canvasHeight);
    gameRunning = false;
    highestScore = 0;
    deactivatePlayers();
    context.font= "normal normal bold 20px arial";
    
    for(let n = 0; n < maxPlayers; n++) {
        var pl = player[n];
        context.fillStyle = pl.color;
        var yPos = textStart + n * padding * 2;
        var info = "(" + pl.leftKey + ", " + pl.rightKey + ")";
        context.fillText(info, 2 * textStart, yPos);
    }   
}

function enterGame(n) {
    var pl = player[n];
    if(!pl.isPlaying) {
        pl.isPlaying = true;
        pl.isAlive = true;
        context.fillStyle = pl.color;
        var yPos = textStart + n * padding * 2;
        var info = "(" + pl.leftKey + ", " + pl.rightKey + ")" + " \u263A";
        context.fillText(info, 2 * textStart, yPos);
    }
    else {
        pl.isPlaying = false;
        pl.isAlive = false;
        context.fillStyle = pl.color;
        var yPos = textStart + n * padding * 2;
        var info = "(" + pl.leftKey + ", " + pl.rightKey + ")";
        context.clearRect(2 * textStart, yPos - 20, padding * 10, padding * 1.2);
        context.fillText(info, 2 * textStart, yPos);
    }
}

function pause() {
    if(alivePlayers() < 2) {
            newRound();
        }
    else if(isPaused) {
        isPaused = false;
    }
    else isPaused = true;
}
function unPause() {
    isPaused = false;
}

function buildControls() {
    player[0].leftKey = qCode;
    player[0].rightKey = wCode;
    
    player[1].leftKey = cCode;
    player[1].rightKey = vCode;
    
    player[2].leftKey = tCode;
    player[2].rightKey = yCode;
    
    player[3].leftKey = nCode;
    player[3].rightKey = mCode;
    
    player[4].leftKey = oCode;
    player[4].rightKey = pCode;
    
    player[5].leftKey = downCode;
    player[5].rightKey = rightCode;
}

function playingPlayers() {
    var result = 0;
    for(var n = 0; n < maxPlayers; n++) {
        if(player[n].isPlaying) result++;
    }
    return result;
}

function deactivatePlayers() {
    for(var n = 0; n < maxPlayers; n++) {
        player[n].isPlaying = false;
    }
}

function alivePlayers() {
    var plLeft = 0;
    for(let n = 0; n < maxPlayers; n++) {
        var pl = player[n];
        if(pl.isAlive && pl.isPlaying) {
            plLeft ++;
        }
    }
    return plLeft;
}

function keyCodeToName(code) {
    switch (code) {
        case qCode: return "Q"; break;
        case wCode: return "W"; break;
        case cCode: return "C"; break;
        case vCode: return "V"; break;
        case tCode: return "T"; break;
        case yCode: return "Y"; break;
        case nCode: return "N"; break;
        case mCode: return "M"; break;
        case oCode: return "O"; break;
        case pCode: return "P"; break;
        case downCode: return "\u2193"; break;
        case rightCode: return "\u2192"; break;
        case spaceCode: return "Space"; break;
            
    }
}
function oneMove(i) {
    for(var m = 0; m < i; m++) {
        for(let n = 0; n < maxPlayers; n++) {
            var actor = player[n];
            if(actor.isAlive && actor.isPlaying) {

                actor.movePen();
                actor.move();
                actor.checkCollision();
                actor.skipDraw();
                actor.occupy();
                actor.redraw();
            }
        }
    }
}

function endGame() {
    if(alivePlayers() < 2) {
        if(highestScore >= 20) showIntro();
        isPaused = true;
    }
}

