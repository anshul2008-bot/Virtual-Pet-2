//Create variables here
var dog, dogImage, happyDogImage, database, Food, foodStock, foodObj, feed, foodS,lastFed;

function preload() {
  //load images here
  dogImage = loadImage("images/dogImg.png");
  happyDogImage = loadImage("images/dogImg1.png")
}

function setup() {
  createCanvas(500, 500);

  database = firebase.database();
  foodObj = new food();

  dog = createSprite(250, 250);
  dog.addImage(dogImage);
  dog.scale = 0.3;

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  feed = createButton("Feed the dog");
  feed.position(600, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}


function draw() {

  background(46, 139, 87);
  foodObj.display();

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data) {
    lastFed = data.val();
  });

  fill("yellow");
  textSize(20);
  if (lastFed >= 12) {
    text("Last Feed : " + lastFed % 12 + "pm", 350, 20);
  }

  else if (lastFed == 0) {
    text("Last Feed : 12 am", 350, 20);
  }

  else {
    text("Last Feed : " + lastFed + "am", 350, 20);
  }

  drawSprites();
  //add styles here


}

function display() {
  var x = 80, y = 100;
  imageMode(CENTER);
  image(this.image, 720, 220, 70, 70);
  if (this.foodStock != 0) {
    for (var i = 0; i < this.foodStock; i++) {
      if (i % 10 == 0) {
        x = 80; y = y + 50;
      }
      image(this.image, x, y, 50, 50); x = x + 30;
    }
  }
}
function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog() {
  dog.addImage(happyDogImage);
  foodObj.updateFoodStock(foodObj.getFoodStock() - 1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime: hour()
  })
}

//function to add food in stock 
function addFoods(){ 
  foodS++;
 database.ref('/').update({
    Food:foodS
   }) }
