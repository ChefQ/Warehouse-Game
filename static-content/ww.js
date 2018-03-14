// Stage
// Note: Yet another way to declare a class, using .prototype.
class Actor {

	constructor(x,y,elapsedTime,stage) {
		this.x = x;
		this.y = y;
		this.stage = stage;
		this.elapsedTime = elapsedTime;
  	}

	move(x,y,width){

		var next_position = this.findCoordinates(this.x+x,this.y+y,width);
		var actor = this.stage[next_position];

		if(actor == 1){
			this.moveActor(this.x,this.y,x,y,width,'s');
			this.x = this.x + x;
			this.y = this.y + y;
		} else if(actor == 3 ){
			if(this.moveBox(this.x + x,this.y + y,x,y,width)){
				this.moveActor(this.x,this.y,x,y,width,'r');
				this.x = this.x + x;
				this.y = this.y + y;
			}

		} else if (actor == 4) {
			this.endGame();
		}
	}

	moveActor(actor_x,actor_y,x,y,width,type){
		var current_position = this.findCoordinates(actor_x,actor_y,width);
		var actorElement = $("#" + current_position);
		var next_position = this.findCoordinates(actor_x+x,actor_y+y,width);
		var newElement = $("#" + next_position);
		var actor = this.stage[next_position];
		//updates the stage
		var stageCurrentPosition = this.stage[current_position];
		switch(type){

			case "s":
			  this.stage[current_position] = this.stage[next_position];
			  this.stage[next_position] = stageCurrentPosition;
			  var tempActor = actorElement.children()[0];
			  actorElement.children()[0].remove();
			  newElement.prepend(tempActor);
			  break;

			case "r":
				this.stage[current_position] = 1;
				this.stage[next_position] = stageCurrentPosition;
				var tempActor = actorElement.children()[0];
				actorElement.children()[0].remove();
				newElement.children()[0].remove();
				newElement.prepend(tempActor);
			  break;

			case "a":
				this.stage[next_position] = stageCurrentPosition;
				var tempActor = $(".box:first").clone();
				newElement.prepend(tempActor);
			break;
		}
	}

	// MOVE BOX FUNCTION
	moveBox(box_x,box_y,x,y,width){

		var next_position = this.findCoordinates(box_x+x,box_y+y,width);
		var actor = this.stage[next_position];

		if(actor == 3){
			if(this.moveBox(box_x+x,box_y+y,x,y,width)){
				return true
			}
			return false;
		}

		if(actor == 1){
			this.moveActor(box_x,box_y,x,y,width,'a')
			return true;
		}
		return false;
	}



	endGame() {

		// Clear timer interval that spawns monster
		clearInterval(gameTimer);

		// Calculate elapsed time to complete game
		var endTime = new Date();
		var timeDiff = endTime - this.elapsedTime;
		var time = this.getCompletionTime(timeDiff);

		// Update User Score
		this.updateUserScore(time,timeDiff);
		alert("GAME OVER");
	}

	getCompletionTime(time) {
		var seconds = Math.round(time/1000);
		var minutes = Math.round(seconds/60);
		seconds = seconds % 60;
		return minutes + " minutes and " + seconds + " seconds";
	}

	updateUserScore(timeCompleted,timeDiff) {
		var user_authentication = user+':'+pass;
		$.ajax({
	        method: "POST",
	        url: "/user/updateScore/" + user,
			data: {score:timeDiff,time:timeCompleted},
			headers: {'Authentication': window.btoa(user_authentication)}
	    }).done(function(data){

	    }).fail(function(err){
	        console.log(err.status);
	    });

	}

	findCoordinates(y,x,width){
		return (x)*(width+2)+1+y-1;
	}

}

class Monster extends Actor {

	constructor(x,y,xDir,yDir,elapsedTime,stage) {
		super(x,y,elapsedTime,stage);
		this.xDir = xDir;
		this.yDir = yDir;
		this.lives = 4;
  	}


	move(x,y,width){

		var current_position = this.findCoordinates(this.x,this.y,width);
		var next_position = this.findCoordinates(this.x+x,this.y+y,width);

		var actorElement = $("#" + current_position);
		var newElement = $("#" + next_position);

		var actor = this.stage[next_position];

		// If next spot is a blank.
		if (actor == 1){

			this.x = this.x + x;
			this.y = this.y + y;
			var stageCurrentPosition = this.stage[current_position];
			this.stage[current_position] = this.stage[next_position];
			this.stage[next_position] = stageCurrentPosition;

			var tempActor = actorElement.children()[0];
			// Remove the player image from previous coordinate
			actorElement.children()[0].remove();
			// Prepend actor element to new coordinate. Prepend because we want
			// image to be before blank (if not display issues)
			newElement.prepend(tempActor);

		// Monster hit a box or a wall. Switch direction
		} else if (actor == 3 || actor == 0) {

			this.xDir = -this.xDir;
			this.yDir = -this.yDir;

			var next_position = this.findCoordinates(this.x+this.xDir,this.y+this.yDir,width);
			var actor = this.stage[next_position];

			if(this.lives == 0){
				this.stage[current_position] = 1;
				actorElement.children()[0].remove();
				return true;
			} else if(actor!=1){
				this.lives--;
			}
			return false;
		} else if (actor == 2) {
			this.endGame();
		}
	}
}

class SuperMonster extends Monster{

	constructor(x,y,xDir,yDir,elapsedTime,stage,player) {
		super(x,y,xDir,yDir,elapsedTime,stage);
		this.player = player;
  	}

	move(x,y,width){

		var current_position = this.findCoordinates(this.x,this.y,width);
		var player_position = this.findCoordinates(this.player.x,this.player.x,width);

		var s = 0;
		var p = 0;
		if(this.x < this.player.x){
			console.log("smaller x")
			s = 1;
		}else if (this.x > this.player.x){
			console.log("bigger x")
			s = -1;
		}
		else{
			console.log("same x")
			s = 0;
		}

		if(this.y < this.player.y){
			console.log("smaller y")
			p = 1;
		}else if (this.y > this.player.y){
			console.log("bigger y")
			p = -1;
		}
		else{
			console.log("same y")
			p= 0;
		}

		var next_position = this.findCoordinates(this.x+s,this.y+p,width);
		var actor = this.stage[next_position];

		if (actor == 1){
			this.moveActor(this.x,this.y,s,p,width,'s');
			this.x += s;
			this.y += p;
		}	else if(actor == 2){
			this.moveActor(this.x,this.y,s,p,width,'r');
			this.x += s;
			this.y += p;
		}else{
			//this.xDir = -this.xDir;
			//this.yDir = -this.yDir;
			var nextX = [1,1,0,-1,0,-1];
			var nextY = [0,1,1,0,-1,-1];
			var count = 0;
			while(count < 6){
				s = nextX[Math.floor(Math.random()*6)];
				p = nextY[Math.floor(Math.random()*6)];
				next_position = this.findCoordinates(this.x+s,this.y+p,width);
				if(this.stage[next_position]== 1){
					this.moveActor(this.x,this.y,s,p,width,'s');
					this.x += s;
					this.y += p;
					break;
				}
				count++;
			}
		}
	}
}



class Player extends Actor {
	constructor(x,y,stage,elapsedTime) {
		super(x,y,elapsedTime,stage);
  	}
}


function Stage(width, height, stageElementID){
 	// all actors on this stage (monsters, player, boxes, ...)
	// the logical width and height of the stage
	this.width=width;
	this.height=height;

	var playerX = Math.floor(this.height/2 + 1)
	var playerY = Math.floor(this.width/2 + 1)


	// a special actor, the player
	this.player=2;
	this.wall=0;
	this.blank=1;
	this.box=3;
	this.monster=4;
	this.superMonster = 5;
	this.null='*';
	// all actors on this stage (monsters, player, boxes, ...)

	var wallRow = [];
	wallRow.length = this.width+2;
	wallRow.fill(0);

	this.actors=[];
	this.stage = [];
	this.stage = wallRow;

	var playground = [];
	var temp = []
	var count = 0;

	// for columns
	for (var i = 1; i < this.height+1;i++){
		count++;
		if (i == playerX){
			count++;
			temp = temp.concat(this.rows(i,true));
		} else{
			temp = temp.concat(this.rows(i,false));
		}
		playground = playground.concat(temp);
		temp = [];
	}

	this.stage = this.stage.concat(playground);
	this.stage = this.stage.concat(wallRow);

	this.stage[this.width+3] = this.superMonster;

	this.player= new Player(playerX,playerY,this.stage);
	for (i = 0; i < this.actors.length; i++) {
		this.actors[i].stage = this.stage;
	}

	// the element containing the visual representation of the stage
	this.stageElementID=stageElementID;

	// take a look at the value of these to understand why we capture them this way
	// an alternative would be to use 'new Image()'
	this.blankImageSrc=document.getElementById('blankImage').src;
	this.monsterImageSrc=document.getElementById('monsterImage').src;
	this.superMonsterImageSrc=document.getElementById('superMonster').src;
	this.playerImageSrc=document.getElementById('playerImage').src;
	this.boxImageSrc=document.getElementById('boxImage').src;
	this.wallImageSrc=document.getElementById('wallImage').src;

}

// function rows(width,height,actors,atCentre){
Stage.prototype.rows = function(y,atCentre){

	var rowWithWall = [];
	rowWithWall[0] = this.wall

	var board = []
	board.length = this.width;
	board.fill('*');

	boardActualLength = board.length;
	numBoxes = Math.floor(boardActualLength/4)
	//console.log("number of boxex"+ numofbox)


	for(i = 0; i < numBoxes; i++){
		board[Math.floor(Math.random()*boardActualLength)] = this.box;
	}

	for(i = 0; i < boardActualLength; i++){
		// If board has no boxes or player, fill with blank values
		if (board[i] == '*') board[i] = this.blank;
	}

	ranMonster = Math.floor(Math.random()*board.length);
	board[ranMonster] = this.monster;

	var monster = new Monster(ranMonster+1,y,-1,-1)
	this.actors.push(monster);
	// One line if statement
	if (atCentre) board[Math.floor((boardActualLength)/2)] = this.player;

	// Code that was already commented out
	//temp[this.width-1] = this.wall

	// Add first wall to our row.
	rowWithWall = rowWithWall.concat(board);
	rowWithWall[this.width+1] = this.wall
	return rowWithWall;
}
// initialize an instance of the game
Stage.prototype.initialize=function(){

	// Create a table of blank images, give each image an ID so we can reference it later
	var s='<table>';

	wall = "<td class='wallTableData'>" + "<img id = 'wall'class='wall' src=" + this.wallImageSrc + ">" + "</td>";
	blank = "<td class='blankTableData'>" + "<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";
	player = "<td class='blankTableData'>" + "<img id= 'player' class='player' src=" + this.playerImageSrc + ">" + "<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";
	monster = "<td class='blankTableData'>" + "<img class='monster' src=" + this.monsterImageSrc + ">" +"<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";
	box = "<td class='blankTableData'>" + "<img class='monster' src=" + this.boxImageSrc + ">" +"<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";

	var count = 1;

	for(var i = 0; i < this.stage.length;i++){

		if(count == 1){
			s+="<tr>";
		}

		if(this.stage[i] == 0 ){
			s+= "<td id= '" +i +"' " + "class='wallTableData'>" + "<img class='wall' src=" + this.wallImageSrc + ">" + "</td>";;
		} else if(this.stage[i] == 1 ){
			s+= blank = "<td id= '" +i +"' " + "class='blankTableData'>" + "<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";
		} else if(this.stage[i] == 2){
			s+= "<td id= '" +i +"' " + " class='blankTableData'>" + "<img class='player' src=" + this.playerImageSrc + ">" + "<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";
		} else if(this.stage[i] == 3){
			s+= "<td id= '" +i +"' " + " class='blankTableData'>" + "<img class='box' src=" + this.boxImageSrc + ">" +"<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";
		} else if(this.stage[i] == 4){
			s+=  "<td id= '" +i +"' " + " class='blankTableData'>" + "<img class='monster' src=" + this.monsterImageSrc + ">" +"<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";;
		}else if(this.stage[i] == 5){
			s+=  "<td id= '" +i +"' " + " class='blankTableData'>" + "<img class='superMonster' src=" + this.superMonsterImageSrc + ">" +"<img class='blank' src=" + this.blankImageSrc + ">" + "</td>";;
		}
		if (count == this.width+2 ) {
			s+="</tr>";
			count = 0;
		}
		count +=1;
	}
	s+="</table>";


	// Put it in the stageElementID (innerHTML)
	$("#" + this.stageElementID).html(s);
	// console.log(this.actors[0].findCoordinates(this.actors[0].x, this.actors[0].y, this.width));

	// Start time of game
	var elapsedTime = new Date();
	this.player.elapsedTime = elapsedTime;
	for (i = 0; i < this.actors.length; i++) {
		this.actors[i].elapsedTime = elapsedTime;
	}
	var superMonster = new SuperMonster(1,1,1,1,elapsedTime,this.stage,this.player)
	this.actors.push(superMonster);
	// Add the player to the center of the stage - DONE
	// Add walls around the outside of the stage, so actors can't leave the stage

	// Add some Boxes to the stage

	// Add in some Monsters


}
// Return the ID of a particular image, useful so we don't have to continually reconstruct IDs
Stage.prototype.getStageId=function(x,y){
	var coordinates = this.player.findCoordinates(x,y,this.width);
	return this.stage[coordinates];
}

Stage.prototype.addActor=function(actor){
	this.actors.push(actor);
}

Stage.prototype.removeActor=function(actor){
	// Lookup javascript array manipulation (indexOf and splice).
}

// Set the src of the image at stage location (x,y) to src
Stage.prototype.setImage=function(x, y, src){

}

// Take one step in the animation of the game.
Stage.prototype.step=function(){

	for (i=0;i<this.actors.length;i++){
		// console.log(stage.actors[i].x);
		// console.log(stage.actors[i].y);
		// console.log(stage.actors[i]);
		if(this.actors[i].move(this.actors[i].xDir,this.actors[i].yDir,this.width)){
			this.actors.splice(i,1);
		}
		// Only one actor left: boss, end game.
		if(this.actors.length == 1) this.player.endGame();

	}
}

// return the first actor at coordinates (x,y) return null if there is no such actor
// there should be only one actor at (x,y)!
Stage.prototype.getActor=function(x, y){
	return null;
}
// End Class Stage
