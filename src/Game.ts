// createjs typescript definition for TypeScript
/// <reference path="./../node_modules/@types/createjs/index.d.ts" />

// importing createjs framework
import "createjs";
// importing game constants
import { STAGE_WIDTH, STAGE_HEIGHT, FRAME_RATE, ASSET_MANIFEST, BUG_MAX, BUG_START_DELAY, BUG_DELAY_INCREASE } from "./Constants";
import { AssetManager } from "./AssetManager";
import { Snake } from "./Snake";
import { Bug } from "./Bug";
import { UserInterface } from "./UserInterface";
import { ScreenManager } from "./ScreenManager";

// game variables
let stage:createjs.StageGL;
let canvas:HTMLCanvasElement;
let assetManager:AssetManager;

// game objects
let background:createjs.Sprite;
let snake:Snake;
let bugPool:Bug[] = [];
let userInterface:UserInterface;
let screenManager:ScreenManager;

// bug timer to add gameplay
let bugTimer:number;
let bugDelay:number;
// number of bugs eaten
let bugsEaten:number;

// --------------------------------------------------- event handler
function onReady(e:createjs.Event):void {
    console.log(">> spritesheet loaded – ready to add sprites to game");

    // construct game objects here
    screenManager = new ScreenManager(stage, assetManager);
    screenManager.showIntro();

    userInterface = new UserInterface(stage, assetManager);
    
    snake = new Snake(stage, assetManager);

    // pooling Bug objects
    for (let i:number=0; i<BUG_MAX; i++) {
        bugPool.push(new Bug(stage, assetManager, snake));
    }

    // listen on stage for clicks to detect mouse position
    stage.on("mousedown", onMoveSnake);

    // listen for game events
    stage.on("gameStart", onGameEvent);
    stage.on("gameReset", onGameEvent);    
    stage.on("bugEaten", onGameEvent);
    stage.on("snakeKilled", onGameEvent);
    stage.on("snakeSpeedChange", onGameEvent);

    // startup the ticker
    createjs.Ticker.framerate = FRAME_RATE;
    createjs.Ticker.on("tick", onTick);        
    console.log(">> game ready");
}

function onAddBug():void {
    // find bug in pool and add to game
    for (let newBug of bugPool) {
        if (newBug.used == false) {
            // setting used property here is not required – included for clarity
            newBug.used = true;
            newBug.showMe();
            break;
        }
    }
}

function onMoveSnake(e:createjs.Event):void {
    //console.log(stage.mouseX, stage.mouseY);
    snake.rotateMe();
    snake.startMe();
}

function onGameEvent(e:createjs.Event):void {
    switch (e.type) {
        case "gameStart":
            // resetting everything and showing game screen
            screenManager.showGame();
            snake.showMe();
            snake.startSlowDown();

            bugsEaten = 0;
            // construct and setup bugtimer to drop bugs on displaylist
            bugDelay = BUG_START_DELAY;
            bugTimer = window.setInterval(onAddBug, bugDelay);

            break;
        case "gameReset":
            // showing intro screen
            screenManager.showIntro();
            userInterface.resetMe();
            // remove all the bugs
            for (let bug of bugPool) bug.hideMe();
            // reset the snake and user interface
            snake.resetMe();
            snake.hideMe();
            break;
        case "bugEaten":
            // increment bug counter
            bugsEaten++;
            // energize the snake with energy
            snake.energizeMe();
            // decrease the amount of bugs on the screen every ten bugs eaten
            if ((bugsEaten % 10) == 0) {
                bugDelay = bugDelay + BUG_DELAY_INCREASE;
                window.clearInterval(bugTimer);
                bugTimer = window.setInterval(onAddBug, bugDelay);
            }

            // update UI
            userInterface.kills = bugsEaten;
            
            break;
        case "snakeKilled":
            // gameOver
            window.clearInterval(bugTimer);
            screenManager.showGameOver();

            break;
        case "snakeSpeedChange":
            userInterface.speed = snake.speed;
            break;
    }
}

function onTick(e:createjs.Event) {
    // console.log("TICK!");
    document.getElementById("fps").innerHTML = String(createjs.Ticker.getMeasuredFPS());

    // this is your game loop
    // update the snake
    snake.update(); 
    
    // bug.update();
    // update all bugs in pool if currently used
    for (let bug of bugPool) {
        if (bug.used) bug.update();
    }

    // update the stage
    stage.update();
}

// --------------------------------------------------- main method
function main():void {
    // get reference to canvas
    canvas = <HTMLCanvasElement> document.getElementById("game-canvas");
    // set canvas width and height - this will be the stage size
    canvas.width = STAGE_WIDTH;
    canvas.height = STAGE_HEIGHT;    

    // create stage object
    stage = new createjs.StageGL(canvas, { antialias: true });

    // AssetManager setup
    assetManager = new AssetManager(stage);
    stage.on("allAssetsLoaded", onReady, null, true);
    // load the assets
    assetManager.loadAssets(ASSET_MANIFEST);
}

main();