/*
The Salaryman's Dream, by Jameson Danning, Colin Watterson, Enrico Widodo
completed 5/2/2020

For our game, our group decided to put in a few interesting technical and visual aspects.

Creative tilt:
For technical aspects, we made it so that the player's movement is tweened towards the position of 
the mouse cursor, allowing mouse movement that doesn't feel too jittery. We also made it so that the 
transitions between the scenes happen seamlessly by fading in and out. Lastly, we also implemented a 
local highscore system that keeps track of your highscore whenever you are not ingame.

For visual aspects, all art assets used in the game sections were made by the talented Jameson D
and the music is written by the talented Enrico W. We also managed to add a smooth rainbow
trail that does not spit all the colors out at once for when the player collects a pickup,
which the talented Colin W engineered. Our endless runner is definitely unconventional in
the sense that its theme is atypical of endless runner games and the movement is unrestricted
in all directions. We wanted this to be a representation of a Japanese salaryman experiencing freedom
from his mountainload of work.
*/

let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    resolution: window.devicePixelRatio,
    
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {
                x: 0,
                y: 0,
            },
            checkCollision: {
                left: true,
                right: true,
            },
        },
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    scene: [Loading, Menu, Play],
};

let game = new Phaser.Game(config);


let HighScore = parseInt(localStorage.getItem('highScore')) || 0; //code to do local storage of highscore was based on code from 
                                                                  //https://www.dynetisgames.com/2018/10/28/how-save-load-player-progress-localstorage/
let Score = 0;
let maxSpeed = -10;

let celeryMode = false;