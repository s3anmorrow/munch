import { Character } from "./Character";
import { AssetManager } from "./AssetManager";
import { SNAKE_MAX_SPEED, SNAKE_SLOW_DELAY } from "./Constants";

export class Snake extends Character {
    
    // mouse x and y coordinates
    private mouseX:number;
    private mouseY:number;

    // custom event for dispatching
    private eventKilled:createjs.Event;
    private eventSpeedChange:createjs.Event;

    // slow down timer and delay
    private slowDownTimer:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        super(stage, assetManager, "snake/alive");

        // construct custom event objects
        this.eventKilled = new createjs.Event("snakeKilled", true, false);
        this.eventSpeedChange = new createjs.Event("snakeSpeedChange", true, false);
    }

    // --------------------------------------------------- public methods
    public killMe():void {
        // snake is now killed!
        this._state = Character.STATE_DEAD;
        // stop the snake's sprite animation
        this.stopMe();
        // listen for animation to be finished (and auto remove event listener after first occurrence)
        this._sprite.on("animationend", function() {
            // cleanup
            this._sprite.stop();
        }, this, true);
        // play the snake's death animation
        this._sprite.gotoAndPlay("snake/dead");
        // dispatch event that snake has been killed!
        this._sprite.dispatchEvent(this.eventKilled);
        // stop the slowdown timer
        window.clearInterval(this.slowDownTimer);
    }

    public rotateMe():void {
        // save mouse x,y coordinates
        this.mouseX = this.stage.mouseX;
        this.mouseY = this.stage.mouseY;
        // rotate snake towards mouse pointer
        // right angle triangle trigonometry
        // know the x,y of two points of hypotenuse - to get angle you ArcTan the lengths of two sides of triangle
        let radians:number = Math.atan2((this.mouseY - this._sprite.y) , (this.mouseX - this._sprite.x));
        // update rotation of sprite
        super.rotateMe(this.toDegrees(radians));
    }

    public energizeMe():void {
        // snake can only gain more energy if less than maximum
        if (this._speed < SNAKE_MAX_SPEED) {
            this._speed++;
            this._sprite.dispatchEvent(this.eventSpeedChange);
        }
        console.log("Snake energized: " + this.speed);
        
        // reset slowdown timer so the interval starts again
        window.clearInterval(this.slowDownTimer);
        this.slowDownTimer = window.setInterval(() => this.onSlowDown(), SNAKE_SLOW_DELAY);
    }    

    public update():void {
        super.update();
        // is it time to stop the snake?
        if ((Math.abs(this._sprite.x - this.mouseX) < 15) && (Math.abs(this._sprite.y - this.mouseY) < 15)) {
            this.stopMe();
        }
    }

    public startSlowDown():void {
        // start the slowdown timer!
        this.slowDownTimer = window.setInterval(() => this.onSlowDown(), SNAKE_SLOW_DELAY);
    }

    public resetMe():void {
        this._sprite.gotoAndStop("snake/alive");
        this._sprite.x = 300;
        this._sprite.y = 300;
        this._sprite.rotation = 0;
        this._speed = SNAKE_MAX_SPEED;
        this._state = Character.STATE_IDLE;
    }    

    // --------------------------------------------------- event handlers
    private onSlowDown():void {
        // adjust speed of MovingObject
        this._speed = this._speed - 1;
        this._sprite.dispatchEvent(this.eventSpeedChange);
        console.log("Snake slowed: " + this._speed);
        // check if snake is dead
        if (this._speed <= 0) {
            this.killMe();
        }
    }

}