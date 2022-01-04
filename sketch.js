var score;
//setting the game state to play 
var gameState = "PLAY";

//character and background variables
var fox,fox_running,sad_fox;
var bird,bird_flying;
var bg, invisibleGround, bgImage;

//obstacle variables and group
var obstaclesGroup, rock, iceberg, ice_hole;

//end state images
var gameOverImg,restartImg;

function preload(){

  //loading all the images 
  fox_running = loadAnimation("arctic_fox1.png","arctic_fox2.png","arctic_fox3.png","arctic_fox4.png");
  bird_flying = loadAnimation("bird1.png","bird2.png","bird3.png","bird4.png","bird3.png","bird2.png");
  
  bgImage = loadImage("bg.png");
  
  rock = loadImage("rock.png");
  iceberg = loadImage("iceberg.png");
  iceberg2 = loadImage("iceberg2.png");
  ice_hole = loadImage("ice_hole.png");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("game_over.png");

}

function setup() {

  //creating a canvas
  createCanvas(800,300);

  //setting the background
  bg = createSprite(320,100,10,20);
  bg.addImage("ground",bgImage);
  bg.scale = 1.15;

  //creating the sprites
  fox = createSprite(700,220,20,50);
  fox.addAnimation("running", fox_running);
  fox.scale = 0.35;

  bird = createSprite(120,50,20,20);
  bird.addAnimation("flying",bird_flying, bird_flying);
  bird.scale = 0.2;

  //creating the end state images
  gameOver = createSprite(400,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.3;

  restart = createSprite(400,160);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  
  //the invisible ground so that the fox does not fall out of the canvas
  invisibleGround = createSprite(200,240,1300,10);
  invisibleGround.visible = false;

  //create obstacles group
  obstaclesGroup = createGroup();

  //adjusting the collider of the fox
  fox.setCollider("rectangle",-70,30,270,250);
  //fox.debug = true;

  //assigning a value to the variable 'score'
  score = 0;
}

function draw() {

  //the game states
  if(gameState === "PLAY"){
    //setting the velocities
    bird.velocityX = 0;
    bg.velocityX = (4 + 3* score/300)

    gameOver.visible = false;
    restart.visible = false;
    
    //increasing the score
    score = score + Math.round(getFrameRate()/60);
    
    //creating and infinite background
    if (bg.x > 500){
        bg.x = 350;
      }

    
    //jump when the up arrow key is pressed
    if(keyDown("up")&& fox.y >= 100) {
        fox.velocityY = -12;
    }

    //add gravity so the fox comes back down after key is pressed
    fox.velocityY = fox.velocityY + 0.8;

    //spawning the obstacles
    spawnObstacles();
    
    //changing the game state to end when an obstacle touches the fox
    if(obstaclesGroup.isTouching(fox)){
        gameState = "END";
      }

  }
  else if (gameState === "END") {
    //making the game over and restart images visible
    gameOver.visible = true;
    restart.visible = true;

    //setting the velocities
    bg.velocityX = 0;
    fox.velocityY = 0;
    bird.velocityX = -5;
    
    //make the fox look like it is not moving
    fox.pause();
  
    //destroying the bird as soon as it leaves the canvas
    if (bird.x <= -5){
      bird.destroy();
    }
    
    //set lifetime to the obstacles so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);   
    
    //calling the reset function to restart the game if the user wishes to do so
    if(mousePressedOver(restart)) {
      reset();
    }

  }

  //stop fox from falling down
  fox.collide(invisibleGround);
  
  //drawing everything
  drawSprites();

  //displaying score
  textSize(17)
  fill(255);
  text("Score: "+ score, 670,50);  
    
}

function reset(){
  //changing the game state
  gameState = "PLAY";

  //making the end state images invisible again
  gameOver.visible = false;
  restart.visible = false;

  //destroying the obstacles we previously set an infinite lifetime to
  obstaclesGroup.destroyEach();

  //make the fox run again
  fox.play();

  //creating a bird again
  bird = createSprite(70,50,20,20);
  bird.addAnimation("flying",bird_flying, bird_flying);
  bird.scale = 0.2;
  bird.setVelocityY = 0;

  //resetting the score
  score = 0;
}
  
//making a function to create obstacles
function spawnObstacles(){

  //spawing an obstacle per 60 frames
  if (frameCount % 60 === 0){

    //declaring a local variable,obstacle
    var obstacle = createSprite(0,0,10,40);
    //setting a velocity depending on the score
    obstacle.velocityX = (6 + score/100);
    obstacle.scale = 0.3;
    
    //generate different obstacles randomly
    var rand = Math.round(random(1,4));
    //using a switch case statement
    switch(rand) {
      //first obstacle - the rock
      case 1: obstacle.addImage(rock);
              obstacle.y = 210;
              obstacle.setCollider("rectangle",0,0,70,100);
              obstacle.scale = 0.2;
              break;
      //second obstacle - iceberg one
      case 2: obstacle.addImage(iceberg);
              obstacle.y = 210;
              obstacle.setCollider("rectangle",0,0,70,100);
              obstacle.scale = 0.5;
              break;
      //third obstacle - iceberg 2
      case 3: obstacle.addImage(iceberg2);
              obstacle.y = 210;
              obstacle.setCollider("rectangle",0,0,70,150);
              obstacle.scale = 0.2;
              break;
      //fourth obstacle - iceberg 3
      case 4: obstacle.addImage(ice_hole);
              obstacle.y = 230;
              obstacle.setCollider("rectangle",0,0,18,20);
              break;
      default: break;
    }
    
    //assigning depth and lifetime to the obstacle           
    obstacle.lifetime = 300;
    obstacle.depth = fox.depth - 1;
    
    //obstacle.debug = true;
    
    //adding each obstacle to the obstacles group
    obstaclesGroup.add(obstacle);
  }
}
