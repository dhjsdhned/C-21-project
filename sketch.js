var PLAY = 1;
var END = 0;
var gameState = PLAY;

var witch, witch1,witch_running, pickachu, pickachu_running;
var cauldron, cauldronImg, poisonImg, poison;
var ground, groundImg, invisibleGround, invisibleGround1;
var ingredient_1, ingredient_2, ingredient_3, ingredient_4, ingredient_5, ingredient_group, ingredient;
var score;
var dead, deadImg,restart, restartImg;
var checkpointSound , explosionSound, jumpSound;

function preload(){
  witch_running = loadAnimation("witch1.png","witch2.png");

  pickachu_running= loadAnimation("pickachu.gif");

  groundImg = loadImage("background.jpeg");

  cauldronImg = loadImage("Cauldron.png");
  
  ingredient_1 = loadImage("ingredient1.png");
  ingredient_2 = loadImage("ingredient2.png");
  ingredient_3 = loadImage("ingredient3.png");
  ingredient_4 = loadImage("ingredient4.png");
  ingredient_5 = loadImage("ingredient5.png");
  
  poisonImg= loadImage("Poison.png");
  deadImg = loadImage("dead.png");
  restartImg = loadImage("restart.png");
  
  checkpointSound = loadSound("checkpointsound.mp3");
  explosionSound = loadSound("explosion noise.wav");
  jumpSound = loadSound("jump.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ground = createSprite(width/2,200);
  ground.addImage("ground",groundImg);
  ground.scale= 1;
  ground.shapeColor = "white";
  ground.velocityX = -1;

  pickachu = createSprite(300,410,600,10);
  pickachu.scale = 0.25;
  pickachu.addAnimation("pickachu_running", pickachu_running);
  pickachu.setCollider("rectangle", 0, 0, pickachu.width,pickachu.height);
  pickachu.debug = false;

  witch = createSprite(100,350,600,10);
  witch.scale = 0.5;
  witch.addAnimation("witch_running",witch_running);
  witch.setCollider("rectangle", 0, 0, witch.width,witch.height);
  witch.debug = false;

  invisibleGround = createSprite(300,425,1050,10);
  invisibleGround.visible = false;

  invisibleGround1 = createSprite(300,350,1050,10);
  invisibleGround1.visible = false;

  dead = createSprite(650,200,300,100);
  dead.addImage(deadImg);
  dead.scale = 1;
  
  restart = createSprite(650,280,300,180);
  restart.addImage(restartImg);
  restart.scale = 0.2;
  
  ingredient_group = createGroup();
  
  score = 0;
  
}

function draw() {
  pickachu.velocityY= pickachu.velocityY+0.8;
  pickachu.collide(invisibleGround);

  witch.velocityY= witch.velocityY+0.8;
  witch.collide(invisibleGround1);

  if (gameState===PLAY){

    witch.visible=true;
    pickachu.visible=true;

    dead.visible=false;
    restart.visible=false;

    score = score + Math.round(getFrameRate()/60);
    
    spawningredient();

    ground.velocityX = -(4 + 3 * score / 100);

    if(score>0 && score%100 === 0){
       checkpointSound.play();
    }
    
    if (ground.x < 0){
      ground.x =ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space") && pickachu.y >= 100) {
        pickachu.velocityY = -12;
        jumpSound.play();
    }

    if (pickachu.isTouching(ingredient_group)) {
      gameState = END;
      explosionSound.play();
    }
  }
else if(gameState===END){
  dead.visible = true;
      restart.visible = true;

      witch.visible = false;
      pickachu.visible = false;
     
      ground.velocityX = 0;
      pickachu.velocityY = 0;

      witch.x = pickachu.x;
      
      //set lifetime of the game objects so that they are never destroyed
      ingredient_group.setLifetimeEach(-1);
      ingredient_group.setVelocityXEach(0);

     if(mousePressedOver(restart)) {
      reset();
}
}
drawSprites();
fill ("yellow");
textSize(20);
text("Score:" + score,100,40);
}
function reset() {
  gameState = PLAY;
  dead.visible = false;
  restart.visible = false;
  pickachu.changeAnimation("pickachu_running", pickachu_running);
  ingredient_group.destroyEach();
  score = 0;
  pickachu.x = 300;
  witch.x=100;
}

function spawningredient(){
  if (frameCount % 90 === 0){
    var ingredient = createSprite(500,410,600,10);
    //to increase the velocity to make it more challenging
    ingredient.velocityX = -6;
    
     //generate random obstacles
     var rand = Math.round(random(1,5));
     switch(rand) {
      case 1: ingredient.addImage(ingredient_1);
              break;
      case 2: ingredient.addImage(ingredient_2);
              break;
      case 3: ingredient.addImage(ingredient_3);
              break;
      case 4: ingredient.addImage(ingredient_4);
              break;
      case 5: ingredient.addImage(ingredient_5);
              break;
      default: break;
     }
     ingredient.scale = 0.09;
     ingredient_group.add(ingredient);
     ingredient.debug = false;
     ingredient.setCollider("circle", 0, 0, 1);
     }
    }
