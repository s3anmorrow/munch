// game constants
export const STAGE_WIDTH:number = 600;
export const STAGE_HEIGHT:number = 600;
export const FRAME_RATE:number = 30;
export const SNAKE_MAX_SPEED:number = 5;
export const SNAKE_SLOW_DELAY:number = 5000;
export const BUG_MAX:number = 50;
export const BUG_START_DELAY:number = 500;
export const BUG_DELAY_INCREASE:number = 500;

export const ASSET_MANIFEST = [
    {
        type:"json",
        src:"./lib/spritesheets/sprites.json",
        id:"sprites",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/sprites.png",
        id:"sprites",
        data:0
    },
    {
        type:"json",
        src:"./lib/spritesheets/glyphs.json",
        id:"glyphs",
        data:0
    },
    {
        type:"image",
        src:"./lib/spritesheets/glyphs.png",
        id:"glyphs",
        data:0
    } 
];