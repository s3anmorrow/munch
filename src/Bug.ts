import { STAGE_WIDTH, STAGE_HEIGHT } from "./Constants";
import { Character } from "./Character";
import { AssetManager } from "./AssetManager";
import { Snake } from "./Snake";

import { randomMe, radiusHit } from "./Toolkit";

export class Bug extends Character {

    private _used:boolean;

    private snake:Snake;
    // custom event for dispatching
    private eventEaten:createjs.Event;

    constructor(stage:createjs.StageGL, assetManager:AssetManager, snake:Snake) {
        super(stage, assetManager, "bug/alive");

        this._used = false;
        this.snake = snake;
        this.eventEaten = new createjs.Event("bugEaten", true, false);
    }

    // ------------------------------------------------------ get/set methods
    public get used() {
        return this._used;
    }

    public set used(value:boolean) {
        this._used = value;
    }

    // ----------------------------------------------------- public methods
    public showMe():void {
        // random selection of speed of bug
        this._speed = randomMe(2,6);
    
        // get width of bug's sprite currently in animation
        let width:number = this._sprite.getBounds().width;
    
        // bug starts on left or right of stage?
        if (randomMe(1, 2) == 1) {
            // move right
            this._sprite.x = -width;
            // randomly select starting y location of mower
            this._sprite.y = randomMe(50, 550);
            // rotate the bug's sprite via rotateMe()
            this._sprite.rotation = randomMe(45, -45);
        } else {
            // move left
            this._sprite.x = STAGE_WIDTH + width;
            this._sprite.y = randomMe(50, 550);
            this._sprite.rotation = randomMe(135, 225);
        }
    
        this.startMe();
        // add bugs so they are below the snake (snake)
        this.stage.addChildAt(this._sprite, this.stage.getChildIndex(this.snake.sprite));
        this._state = Character.STATE_MOVING;
        this._used = true;
    }

    public hideMe():void {
        super.hideMe();
        // adjusting frame to bug/alive for reuse - showMe() only does a play()
        this._sprite.gotoAndStop("bug/alive");
        this._used = false;
    }

    public killMe():void {
        this._state = Character.STATE_DEAD;
        this.stopMe();
        // play the bug's death animation
        this._sprite.gotoAndPlay("bug/dead");
        // listen for animation to be finished (and auto remove event listener after first occurrence)
        this._sprite.on("animationend", (e:createjs.Event) => {
            this.hideMe();
        }, this, true);
        this._sprite.dispatchEvent(this.eventEaten);
    }    
    
    public update():void {
        // only want to check to remove bug if it is currently in the game
        if (this._state == Character.STATE_IDLE) return;

        super.update();

        // get width / height of bug's sprite currently in animation
        let width:number = this._sprite.getBounds().width;
        let height:number = this._sprite.getBounds().height;

        // check if object is off the stage
        if ((this._sprite.x < -width) || (this._sprite.x > (STAGE_WIDTH + width)) || (this._sprite.y < -height) || (this._sprite.y > (STAGE_HEIGHT + height))) {
            console.log("bug off stage – removed");
            this.hideMe();
        }

        // no collision detection if snake or bug is dead!
        if ((this.snake.state == Character.STATE_DEAD) || (this._state == Character.STATE_DEAD)) return;

        // collision detection with snake (5px radius on snake / 20px on bug)
        if (radiusHit(this.snake.sprite, 5 ,this._sprite, 20)) {
            console.log("collision!");
            this.killMe();
        }
    }

}