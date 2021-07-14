let pac //hoisted variable for pacman
let input = []; //input list
let gameSpeed = 0.125 // for pacman collision to work must be a half number (1, 0.5, 0.25, 0.125, etc)
let tick = 0 //gameticks
let stopped = true // is the game stopped for some reason
let width // maze width
let height //maze height
let middleText = "" //text under ghost gate
let level = 0 //level
let powerTimer = 0 //how pellet time
let score = 0 //score
let powerScore = 100 //score for chomping ghosts
let dotScore = 10 //score for eating dots
let lives = 3 //life count
let livesEnabled = true //lives enabled
let soundEnabled = false //sound enabled
let sound = {} //sounds
let loop //looping sound
let dotsEaten = 0
let ghosts = [] //list of ghosts
let dots = [] //list of dots
let eyes = [] //list of eyes
let textList = [] //list of text

document.body.onkeydown = function() { //get input
	if (!(input.includes(event.key))){
		input.push(event.key)
	}
}
document.body.onkeyup = function() { //get input release
	input.splice(input.indexOf(event.key),1)
	if (event.key == "l"){ //toggle lives
		livesEnabled = !livesEnabled
	}else if (event.key == "m"){ //toggle sound
		soundEnabled = !soundEnabled
	}else if (event.key == " " && !(middleText != "paused" && stopped) && middleText != "go!"){ //pause game
		stopped = !stopped
		if (stopped){
			middleText = "paused"
		}else{
			middleText = ""
		}
	}else if (event.key == "r" && !(middleText != "paused" && stopped) && middleText != "go!"){
		let canvas = document.querySelector('#defaultCanvas0');
		//canvas to blob async
		let canvasBlob = (canvas) => new Promise((resolve, reject) => canvas.toBlob(blob => resolve(blob), 'image/png', 0.95));
		let screenShot = async (canvas) => {
      try {
        // get image blob
      let blob = await canvasBlob(canvas);
      //set clip board
      const data = [new ClipboardItem({ [blob.type]: blob })]
      await navigator.clipboard.write(data);
			middleText = "copied to clipboard" 
			setTimeout(()=>{stopped = false; middleText = ""},1000)
    	} catch (err) {
      	console.log(err);
      	const downloader = document.createElement('a');
      	downloader.href = canvas.toDataURL('image/png');
      	downloader.target = '_blank';
      	downloader.download = "nameoffile";
      	downloader.click();
				middleText = "paused"
  		}
		}
		screenShot(canvas);
		stopped = true
	}
}
window.onresize = function(){ //resize with screen
	window.resizeCanvas(window.innerWidth,window.innerHeight)
	CELL = Math.floor(window.innerHeight/30)
	textSize(CELL)
}

function toRad(degrees){ //get rad from deg
	var pi = Math.PI;
	return degrees * (pi/180);
}

class Dot{ //dot
	constructor(x,y){
		this.pos = createVector(x,y)
		dots.push(this)
	}
	show(){
		fill(0xff)
		circle(this.pos.x*CELL+(CELL/2),this.pos.y*CELL+(CELL/2),CELL/4)
	}
}
class PowerPellet{ //power pellet
	constructor(x,y){
		this.pos = createVector(x,y)
		dots.push(this)
	}
	show(){
		fill(0xff)
		if (tick % 60 < 30){ //make it flashing
			circle(this.pos.x*CELL+(CELL/2),this.pos.y*CELL+(CELL/2),CELL/2)
		}
	}
}

eyes = [] //list of eyes
class Eyes {
	constructor(type,x,y){
		let p //path variable
		eyes.push(this)
		this.type = type //store ghost type
		this.pos = createVector(x,y) //position
		let end = pfGrid.grid[14][13] //go to ghost pen
		let start = pfGrid.grid[floor(this.pos.y)][floor(this.pos.x)] //start point
		for (let node of pfGrid.nodes){
			node.closed = false
		} //unclose all nodes
		p = astar.search(pfGrid,start,end) //gets path
		this.target = createVector(p[0].y, p[0].x) //get inital target
		this.p = p //store path for later
		this.pathIndex = 0 //where in the path are we?
	}
	update(){
		let move = createVector(this.pos.x,this.pos.y) //to be modified
		if (this.pos.dist(this.target) < gameSpeed){ //if close enough to target
			this.pathIndex++ //we are farther in the path
			if (this.pathIndex >= this.p.length-1){ //if the last entry
				this.pos = createVector(13,13) //set pos (can cause errors otherwise)
				ghosts.push(new Ghost(this.pos.x,this.pos.y,this.type,true));
				eyes.splice(eyes.indexOf(this),1) //remake the ghost but this time they are eaten, then delete these eyes.
			}
			this.target = createVector(this.p[this.pathIndex].y,this.p[this.pathIndex].x) //otherwise reset target to next in path.
		}
		move.sub(this.target) //get difference vector
		move.normalize() //normalize it
		move.mult(gameSpeed) //movespeed
		this.pos.sub(move) //move
		if (this.pos.x > textMap[floor(this.pos.y)].length-1){ //wrap screen just incase
			this.pos.x = 1
		}
		if (this.pos.x < 1){
			this.pos.x = textMap[floor(this.pos.y)].length-1
		}
	}
	show(){
		fill(0xaa)
		circle(this.pos.x*CELL+(CELL/2),this.pos.y*CELL+(CELL/2),CELL*1.5)
	}
}


class ScoreText{
	constructor(x,y,simple,text,color=[0xff,0xff,0xff]){
		this.pos = createVector(x,y)
		this.text = text
		textList.push(this)
		this.timer = 100
		this.vsp = 0.1
		this.ogy = y
		this.simple = simple
		this.color = color
	}
	show(){
		if (this.pos.y < this.ogy+0.1){
			this.pos.y -= this.vsp
		}
		this.vsp -= 0.01
		this.timer--
		if (this.timer <= 0){
			textList.splice(textList.indexOf(this),1)
		}
		push()
		//stroke(0x0)
		strokeWeight(4)
		fill(color(this.color[0],this.color[1],this.color[2],this.timer*2.55))
		if (this.simple){
			textSize(CELL*0.60)
		}
		text(this.text,this.pos.x*CELL+(CELL/2),this.pos.y*CELL+(CELL/2))
		pop()
	}
}

function reset(full=1){ //reset positions, level, or game
	ghosts = [] //clear ghosts eyes and power pellets
	eyes = []
	powerTimer = 0
	if (full >= 1){ //reset dots level
		dots = []
		setUpDots()
	}
	if (full >= 2){ //reset game
		lives = 3
		level = 0
		score = 0
	}
	new Ghost(13,11,0) //recreate ghosts
	new Ghost(13,13,1)
	new Ghost(14,14,2)
	new Ghost(12,14,3)
	pac = new PAC() //reset pacman
	middleText = "ready?" //are you ready?
	if (soundEnabled){
		sound.intro.play()
	}
	setTimeout(function(){ //wait to start
		middleText = "go!" //go!
		stopped = false
		setTimeout(function(){middleText=""},500) //after a bit get rid of the go text
	},4000)
}

function preload(){
	console.log("loading sounds.")
	let start = new Date().getTime()
	sound.chomp = loadSound("sound/chomp.mp3")
	sound.death = loadSound("sound/death.mp3")
	sound.eatGhost = loadSound("sound/chomp ghost.mp3")
	sound.extraLife = loadSound("sound/1up.mp3")
	sound.eyes = loadSound("sound/ghost eaten.mp3")
	sound.eyes.playMode('untilDone')
	sound.intro = loadSound("sound/intro.mp3")
	sound.powerPellet = loadSound("sound/power pellet.mp3")
	sound.powerPellet.playMode('untilDone')
	sound.ghosts = loadSound("sound/ghosts.mp3")
	sound.ghosts.playMode('untilDone')
	sound.fruit = loadSound("sound/fruit.mp3")
	let end = new Date().getTime()-start
	console.log(`sounds loaded in ${end}ms`)
}

function setup(){
	loop = sound.ghosts
	frameRate(60) //make sure fps is 60
	noStroke() //no outlines
	resizeCanvas(window.innerWidth,window.innerHeight)
	drawMap() //make canvas correct size
	colors = [color(0xff,0x0,0x0),color(0x0,0xff,0xff),color(0xff,0xc0,0xcb),color(0xff,0xa5,0x0)] //ghost colors
	pac = new PAC() //pacman
	width = textMap[0].length-1 //set width and height
	height = textMap.length-1
	setUpDots() // set up dots
	textSize(CELL) //set textSize
	reset() //call reset to make ghosts.
}
function draw(){
	if (soundEnabled){
		if (!stopped){
			loop.play()
		}else{
			loop.pause()
		}
		if (eyes.length > 0 && loop != sound.eyes){
			loop.stop()
			loop = sound.eyes
		}else if (powerTimer > 0 && loop != sound.powerPellet 	&& eyes.length == 0){
			loop.stop()
			loop = sound.powerPellet
		}else if (powerTimer <= 0 && eyes.length == 0 && loop 	!= sound.ghosts){
			loop.stop()
			loop = sound.ghosts
		}
	}else{
		loop.pause()
	}
	tick++ //increase tick
	drawMap()
	fill(0xff)
	text(middleText,13*CELL+(CELL/2),17*CELL-(CELL/2)) //middle text
	if (dots.length == 0 && !stopped){ //if level is complete
		level++
		stopped = true
		setTimeout(reset,1500) //stop and after a bit reset (level flashing white is contained in map.js)
	}
	if (powerTimer > 0 && !stopped){ //if powerpellet
		powerTimer -= 1/60 //reduce 1 per second from timer
	}
	for (let dot of dots){ //draw dots
		dot.show()
	}
	for (let pair of eyes){ //draw/update eyes
		if (!stopped){
			pair.update()
		}
		pair.show()
	}
	for (let string of textList){
		string.show()
	}
	for (let ghost of ghosts){ //draw ghosts and update them
		if (!stopped){
			ghost.update()
		}
		ghost.show()
	}
	pac.show() //draw/update pacman
	if (!stopped){
		pac.update(eyes)
	}
	fill(0x0)
	rect(width*CELL+CELL,0,window.innerWidth-(width*CELL),window.innerHeight)
	textAlign(LEFT,TOP)
	fill(0xff)
	text(`score: ${score}\nlives: ${lives}\nlevel: ${level+1}\nsound enabled: ${soundEnabled} (m to toggle)\nlives enabled: ${livesEnabled} (l to toggle)`,textMap[0].length*CELL,0) //draw information
	textAlign(CENTER,CENTER) //realign text
}