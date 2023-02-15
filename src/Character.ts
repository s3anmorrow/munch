import { SNAKE_MAX_SPEED } from "./Constants";
import { AssetManager } from "./AssetManager";

export class Character {
    // state class constants
    public static STATE_IDLE:number = 1;
    public static STATE_MOVING:number = 2
    public static STATE_DEAD:number = 3;

    // property variables
    protected _speed:number;
    protected _state:number;
    protected _sprite:createjs.Sprite;

    // protected variables
    protected stage:createjs.StageGL;  

    // the x and y displacement per tick
    protected xDisplace:number;
    protected yDisplace:number;

    constructor(stage:createjs.StageGL, assetManager:AssetManager, animation:string) {
        // initialization
        this._speed = SNAKE_MAX_SPEED;
        this._state = Character.STATE_IDLE;
        this.stage = stage;
        this.xDisplace = 0;
        this.yDisplace = 0;

        // construct sprite and position center of stage
        this._sprite = assetManager.getSprite("sprites", animation, 300, 300);
    }

    // --------------------------------------------------- get/sets
    set speed(value:number) {
        this._speed = value;
    }
    get speed():number {
        return this._speed;
    }

    get state():number {
        return this._state;
    }

    get sprite():createjs.Sprite {
        return this._sprite;
    }

    // -------------------------------------------------- protected methods
    protected toRadians(degrees:number):number {
        return (degrees * (Math.PI / 180));
    }   

    protected toDegrees(radians:number):number {
        return (radians * (180/Math.PI));
    }     

    // -------------------------------------------------- public methods
    public showMe():void {
        this.stage.addChild(this._sprite);  
    }

    public hideMe():void {
        this.stopMe();
        this.stage.removeChild(this._sprite);  
    }

    public rotateMe(degrees:number):void {
        if (this._state == Character.STATE_DEAD) return;
        
        // rotate the sprite
        this._sprite.rotation = degrees;
    }

    public startMe():void {
        if (this._state == Character.STATE_DEAD) return;

        let radians:number = this.toRadians(this._sprite.rotation);
        // calculating X and Y displacement
        this.xDisplace = Math.cos(radians) * this._speed;
        this.yDisplace = Math.sin(radians) * this._speed;
        this._sprite.play();
        this._state = Character.STATE_MOVING;
    }

    public stopMe():void {
        if (this._state == Character.STATE_DEAD) return;

        this._sprite.stop();
        this._state = Character.STATE_IDLE;
    }
    
    public update():void {
        if ((this._state == Character.STATE_DEAD) || (this._state == Character.STATE_IDLE)) return;        

        // move sprite
        this._sprite.x = this._sprite.x + this.xDisplace;
        this._sprite.y = this._sprite.y + this.yDisplace;
    }
}