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
let fadeEffect = true
let fancyGhost = false
let mc = undefined
let focused = true
let stoppedBefore = false
let cheatIndex = 0
let cheat = "sddqd"
let god = false
let currentfruit = null
let minFruitTimer = 30
let maxFruitTimer = 60
let fruitTimer = ((Math.random()*(maxFruitTimer-minFruitTimer))+minFruitTimer)*60
let fancyWalls = false

function stop(value,ignoreFocus){
	if (focused || ignoreFocus){
		stopped = value
	}
	stoppedBefore = value
}

window.onblur = () => {
	if (stopped){stoppedBefore = true}
	stopped = true
	focused = false
}
window.onfocus = () => {
	if (middleText != "paused" && !stoppedBefore){
		stopped = false
	}
	focused = true
}

function swiped(event) {
	input = []
	if (event.direction == 4) {
		input.push("d")
	} else if (event.direction == 8) {
		input.push("w")
	} else if (event.direction == 16) {
		input.push("s")
	} else if (event.direction == 2) {
		input.push("a")
	}
}

document.body.onkeydown = function({key}) { //get input
	if (!(input.includes(key))){
		input.push(key)
		if (key == cheat[cheatIndex]){
			cheatIndex++
			if (cheatIndex == cheat.length){
				console.log("degreelessness mode toggled ;)")
				cheatIndex = 0
				god = !god
			}
		}else{
			cheatIndex = 0
		}
	}
}
document.body.onkeyup = function() { //get input release
	input.splice(input.indexOf(event.key),1)
	if (event.key == "l"){ //toggle lives
		livesEnabled = !livesEnabled
	}else if (event.key == "m"){ //toggle sound
		soundEnabled = !soundEnabled
	}else if (event.key == "e"){
		fadeEffect = !fadeEffect
	}else if (event.key == "h"){
		fancyWalls = !fancyWalls
	}else if (event.key == "f"){
		fancyGhost = !fancyGhost
	}else if (event.key == " " && !(middleText != "paused" && stopped) && middleText != "go!"){ //pause game
		stop(!stopped,false)
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
			setTimeout(()=>{stop(false,false); middleText = ""},1000)
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
		stop(true,false)
	}
}
window.onresize = function(){ //resize with screen
	resizeCanvas(window.innerWidth,window.innerHeight)
	CELL = Math.floor(window.innerHeight/30)
	if (isMobile()){
		CELL = Math.floor(window.innerWidth/27)
	}
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
		this.shape = JSON.parse(JSON.stringify(ghost));
		let p //path variable
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
		this.prevpos = this.pos.copy()
	}
	update(){
		this.prevpos = this.pos.copy()
		let move = createVector(this.pos.x,this.pos.y) //to be modified
		if (this.pos.dist(this.target) < gameSpeed){ //if close enough to target
			this.pathIndex++ //we are farther in the path
			if (this.pathIndex >= this.p.length-2){ //if the last entry
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
		if (fancyGhost){
			let ghost = this.shape;
			push()
			noStroke();
			translate(this.pos.x*CELL-(7/CELL), this.pos.y*CELL-(7/CELL))
			//calculate the eye translations
			this.shape.body.color = [0x88,0x88,0x88,128]
			this.shape.feet.color = [0x88,0x88,0x88,128]
			let eyeX = Math.sign(this.prevpos.x-this.pos.x)*-1;
			let eyeY = Math.sign(this.prevpos.y-this.pos.y)*-1;
			eyeY = eyeX == 0 ? eyeY : Math.min(eyeY, 0);
			// calculate scale for each part up here
			drawShapes(
				[CELL*1.25, CELL*1.25], [14, 14],
				[ ghost.body ],
				[ ghost.body, [7,0], true, 7 ],
				[ ghost.feet, [0,0], this.frame == 1, 7 ],
				[ ghost.feet, [7,0], this.frame == 0, 7 ],
				[ ghost.eyeBack, [eyeX==1?2:0,0] ],
				[ ghost.eyeBack, [eyeX==1?8:6,0] ],
				[ ghost.eye, [eyeX + (eyeX==1?2:0),eyeY] ],
				[ ghost.eye, [eyeX + (eyeX==1?8:6),eyeY] ]
			)
			pop()
		}else{
				fill(0x88,0x88,0x88,128)
				circle(this.pos.x*CELL+(CELL/2),this.pos.y*CELL+(CELL/2),CELL*1.5) 
		}
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
	fruitTimer = ((Math.random()*(maxFruitTimer-minFruitTimer))+minFruitTimer)*60
	currentfruit = null
	if (full >= 1){ //reset dots level
		dots = []
		setUpDots()
	}
	if (full >= 2){ //reset game
		lives = 3
		level = 0
		score = 0
	}
	ghosts.push(new Ghost(13,11,0)) //recreate ghosts
	ghosts.push(new Ghost(13,13,1))
	ghosts.push(new Ghost(14,14,2))
	ghosts.push(new Ghost(12,14,3))
	pac = new PAC() //reset pacman
	middleText = "ready?" //are you ready?
	if (soundEnabled){
		sound.intro.play()
	}
	setTimeout(function(){ //wait to start
		middleText = "go!" //go!
		stop(false,false)
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
	loadFont("font.ttf",textFont)
	loop = sound.ghosts
	frameRate(60) //make sure fps is 60
	noStroke() //no outlines
	resizeCanvas(window.innerWidth,window.innerHeight)
	drawMap() //make canvas correct size
	colors = [color(0xff,0x0,0x0),color(0x0,0xff,0xff),color(0xff,0xc0,0xcb),color(0xff,0xa5,0x0)] //ghost colors
	pac = new PAC() //pacman
	width = textMap[0].length-1 //set width and height
	height = textMap.length-1
	textSize(CELL) //set textSize
	reset() //call reset to make ghosts.
	noSmooth()
	//if isMobile(){
		mc = new Hammer(document.body);
		mc.get('swipe').set({threshold:2,velocity:0.1,direction: Hammer.DIRECTION_ALL})
		mc.on("swipe", swiped)
		mc.add(new Hammer.Tap())
		mc.add( new Hammer.Tap({ event: 'doubletap', taps: 2 }))
		mc.get('doubletap').recognizeWith('tap')
		mc.on("tap doubletap", function(ev) {
			if (isMobile() && ev.type == "tap" && !(middleText != "paused" && stopped) && middleText != "go!"){ //pause game
				stop(!stopped,false)
				if (stopped){
					middleText = "paused"
				}else{
					middleText = ""
				}
			}
		})
	//}
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
	if (fruitTimer <= 0){
		currentfruit = new Fruit()
		fruitTimer = ((Math.random()*(maxFruitTimer-minFruitTimer))+minFruitTimer)*60
	}else if (!stopped){
		fruitTimer--
	}else{
		fruitTimer -= 0.1
	}
	drawMap()
	fill(0xff)
	text(middleText,13*CELL+(CELL/2),17*CELL-(CELL/2)) //middle text
	if (dots.length == 0 && !stopped){ //if level is complete
		level++
		stop(true,false)
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
	if (currentfruit != null){
		currentfruit.show()
		currentfruit.update()
	}
	fill(0x0)
	rect(width*CELL+CELL,0,window.innerWidth-(width*CELL),window.innerHeight)
	textAlign(LEFT,TOP)
	fill(0xff)
	if (!isMobile()){
		text(`score: ${score}\nlives: ${lives}\nlevel: ${level+1}\nsound enabled: ${soundEnabled} (m to toggle)\nlives enabled: ${livesEnabled} (l to toggle)\npower pellet effect: ${fadeEffect} (e to toggle)\nfancy ghosts: ${fancyGhost} (f to toggle)\nfancy walls: ${fancyWalls} (h to toggle)\n${Math.round(frameRate())}`,textMap[0].length*CELL,0) //draw information
	}else{
		text(`sco:${score}\nliv:${lives}\nlev:${level}\nfps:${Math.round(frameRate())}`,0,textMap.length*CELL)
	}
	textAlign(CENTER,CENTER) //realign text
}