import Phaser from 'phaser'
import { Game } from 'phaser';
import * as GameController from './GameController';
//gravity direction of the palyer
export const gravityDirection =
{
  left: 'left',
  right:'right',
  up:'up',
  down:'down',
  none:'none'
}
Object.freeze(gravityDirection);

const gameState = {};
const keyBoardInput = {};
export const layers = new Object();
var mortyCount= 0;
var mortyCountPre =0;
var gravityArrow = false;
//Level1 scene


export default class GameSceneLv3 extends Phaser.Scene {
    constructor() {
      super('GameSceneLv3');
    }
  

 init(data)
 {
    if(data.score!==undefined)
    mortyCountPre = data.score;
 }
 preload() {
  // this.load.image('lab', 'TileMap/lab.png');
  // this.load.image('red_btn','Assets/red_btn.png');
  // this.load.image('green_btn','Assets/green_btn.png');
  this.load.tilemapTiledJSON('tilemaplv3', 'TileMap/lv3.json');
  // this.load.image('arrow','Assets/arrow.png');
  // this.load.spritesheet('doofusrick','Assets/animation/rick.png',{ frameWidth: 370, frameHeight: 654  });
  // this.load.spritesheet('idlePortal','Assets/animation/portal1.png',{frameWidth:310,frameHeight:350});
  // this.load.spritesheet('openPortal','Assets/animation/portal2.png',{frameWidth:305,frameHeight:332});
  // this.load.spritesheet('miniMorty','Assets/animation/MiniMorty.png',{frameWidth:33,frameHeight:55});
  // this.load.audio('throw','Assets/audio/throw.mp3');
  // this.load.audio('portalOpenAudio','Assets/audio/portalOpen.mp3');
  // this.load.audio('coin','Assets/audio/coinSound.mp3');
  // this.load.audio('gravity','Assets/audio/gravity.mp3');
 }
 


 create() {
       
gravityArrow = false;
  //W A S D for movement
  keyBoardInput.up = this.input.keyboard.addKey('W');
  keyBoardInput.down = this.input.keyboard.addKey('S');
  keyBoardInput.right =this.input.keyboard.addKey('D');
  keyBoardInput.left=this.input.keyboard.addKey('A');
  
  mortyCount = mortyCountPre;

    //Initialization of the map
    const map = this.make.tilemap({ key: 'tilemaplv3' });
    const tileset = map.addTilesetImage('lab', 'lab');
    map.createLayer('TopLayer', tileset);
    const gameOverLayer = map.createLayer('gameOver',tileset);
    const platfromLayer = map.createLayer('platform', tileset);
    layers.Uplayer = map.createLayer('UpArrow',tileset);
    layers.Downlayer= map.createLayer('DownArrow',tileset);
    layers.Leftlayer= map.createLayer('LeftArrow',tileset);
    layers.Rightlayer= map.createLayer('RightArrow',tileset);
   

   
    //create Animations
    
    this.anims.create( {
      key:'run',
      frames: this.anims.generateFrameNumbers( 'doofusrick',
                                            {start: 0, end:3}
                                           ),
                                           frameRate: 20,
                                           repeat: -1
     } );
     this.anims.create( {
      key:'idle',
      frames: this.anims.generateFrameNumbers( 'doofusrick',
                                            {start: 0, end:0}
                                           ),
                                           frameRate: 1,
                                           repeat: -1

     } );
     this.anims.create({
       key:'idlePortal',
       frames:this.anims.generateFrameNames('idlePortal',
                                            {start: 0, end: 7}
                                            ),
                                          frameRate: 5  ,
                                          repeat: -1
     });
    
     
     this.anims.create({
      key:'openPortal',
      frames:this.anims.generateFrameNames('openPortal',
                                           {start: 0, end: 7}
                                           ),
                                         frameRate: 5  ,
                                         repeat: 0
    });
    
    this.anims.create({
      key:'miniMorty',
      frames:this.anims.generateFrameNames('miniMorty',
                                           {start: 0, end: 3}
                                           ),
                                         frameRate:7  ,
                                         repeat: -1
    })
   
    gameState.active = true;
    
    //create Object
    gameState.player = this.physics.add.sprite(250,325, 'doofusrick'   ).setScale(.1); 
    gameState.portal = this.physics.add.sprite(470,375, 'idlePortal').setScale(.35);
    gameState.button = this.physics.add.sprite(690,750,'red_btn').setScale(.2);
    gameState.launchArrow = this.physics.add.sprite(50,100,'arrow').setScale(.25); 
    gameState.projectile = this.physics.add.group();
    gameState.miniMorty = this.physics.add.group();
    gameState.MortyCount = this.add.image(30,20,'miniMorty');
    gameState.mortyCounttext = this.add.text(50,25,"x " + mortyCount);
    gameState.miniMorty.create(400,100,'miniMorty').anims.play('miniMorty');
    gameState.miniMorty.create(150,650,'miniMorty').anims.play('miniMorty');
    gameState.miniMorty.create(750,400,'miniMorty').anims.play('miniMorty');
   
    
  
    layers.Uplayer.setVisible(false);
    layers.Downlayer.setVisible(false);
    layers.Leftlayer.setVisible(false);
    layers.Rightlayer.setVisible(false)
    //initialize GameObject Status
    gameState.launchArrow.setVisible(false);
    gameState.portal.setVisible(false);
    gameState.portal.body.checkCollision.none = true;
   
    gameState.player.flipX = true;
    gameState.portal.body.allowGravity = false;
    gameState.button.body.allowGravity = false;
    gameState.button.body.immovable = true;
    gameState.player.body.gravity.y = 1500
    gameState.player.setCollideWorldBounds(true);
    platfromLayer.setCollisionBetween(1,800);
    gameOverLayer.setCollisionBetween(1,800);
  
    //add Collision Event
    this.physics.add.overlap(gameState.player,gameState.miniMorty,(player,miniMorty)=>{mortyCount++;miniMorty.destroy();gameState.mortyCounttext.setText("x "+mortyCount);this.sound.play('coin')})
    this.physics.add.overlap(gameState.player,gameState.portal,()=> {this.scene.start('GameSceneLv4',{score:mortyCount});});
    this.physics.add.collider(gameState.projectile,platfromLayer);
    this.physics.add.collider(gameState.player, platfromLayer);
    this.physics.add.collider(gameState.player,gameOverLayer,()=>
    {
       
      GameController.GameOver(this.scene,'GameSceneLv3');
     
    });
    this.physics.add.collider(gameState.projectile,gameState.button,()=>{

        layers.Uplayer.setVisible(true);
        layers.Downlayer.setVisible(true);
        layers.Leftlayer.setVisible(true);
        layers.Rightlayer.setVisible(true);
        gravityArrow = true;
        this.sound.play('portalOpenAudio');
      gameState.portal.setVisible(true);
      gameState.button.body.checkCollision.none = true;
      gameState.portal.anims.play('openPortal',false);
      
      gameState.portal.on('animationcomplete',()=>{
        gameState.portal.anims.play('idlePortal',true);

      })
      gameState.portal.body.checkCollision.none = false;
      gameState.portal.body.bounce= 0.00001;
      gameState.button.setTexture('green_btn');
      this.sound.play('button');
  
  
    })
    
    
    
   


      
      }


 update() {

  
    if (gameState.active) {
      if(gravityArrow===true)
      GameController.gravityArrow(gameState.player,layers,this);
        GameController.control(gameState.player,keyBoardInput,gravityDirection);
    }
    GameController.flipPlayerSprite(gameState.player,gravityDirection);
   
   
   
    if (this.input.mousePointer.leftButtonDown())
    {
    GameController.set(gameState.player,this,gameState.launchArrow,this.input);
   
   
    } 
    if(this.input.mousePointer.leftButtonReleased())
    {
        GameController.fire(gameState.player,this,gameState.launchArrow,gameState.projectile,this.input,this.sound.add('throw'));
   
    }

 }

 
}


