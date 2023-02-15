import { SNAKE_MAX_SPEED } from "./Constants";
import { AssetManager } from "./AssetManager";

export class UserInterface {

    // private property variables
    private _kills:number;
    private _speed:number;

    // other private variables
    private sprite:createjs.Sprite;
    private stage:createjs.StageGL;
    private txtBugs:createjs.BitmapText;
    private speedBar:createjs.Sprite;
    
    constructor(stage:createjs.StageGL, assetManager:AssetManager) {
        this.stage = stage;

        // grab sprite for UserInterface and add to stage canvas
        this.sprite = assetManager.getSprite("sprites","misc/userInterface",10,10);
        stage.addChild(this.sprite);

        this.txtBugs = new createjs.BitmapText("0", assetManager.getSpriteSheet("glyphs"));
        this.txtBugs.x = 177;
        this.txtBugs.y = 13;
        this.txtBugs.letterSpacing = 2;
        stage.addChild(this.txtBugs);

        this.speedBar = assetManager.getSprite("sprites", "misc/speedBar",41,15);
        stage.addChild(this.speedBar);

        // property initialization
        this.resetMe();
    }

    // -------------------------------------------------- gets/sets
    public set kills(value:number) {
        this._kills = value;
        // update bugs eaten bitmapText object
        this.txtBugs.text = String(this._kills);
    }

    public set speed(value:number) {
        this._speed = value;

        // update speed bar (adjust width)
        let factor:number = value / SNAKE_MAX_SPEED;
        // draw a new rectangle shape to reflect snake's current speed
        this.speedBar.scaleX = factor;
    }

    // -------------------------------------------------- public methods
    public resetMe():void {
        this.kills = 0;
        this.speed = SNAKE_MAX_SPEED;
        this.speedBar.scaleX = 1;
    }
}