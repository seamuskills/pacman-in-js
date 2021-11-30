class PAC{
	constructor(){
		this.dead = false //im not dead!
		this.pos = createVector(13,22) //set position
		this.mOpen = 0.1 //how open pacman's mouth is
		this.animPolarity = 1 //if its opening mouth or closing mouth
		this.direction = createVector(1,0) //where pacman is going
		this.scoring = false //if I should display scoring text for chomping ghosts
		this.displayed = false
	}
	update(eyes) {
		let move = createVector(Number(input.includes("d")-input.includes("a")),Number(input.includes("s")-input.includes("w"))) //get where the player wants to move
		if (move.x != 0 && move.y != 0){
			move.y = 0 //no diagonal movement
		}
		if (textMap[Math.ceil(this.pos.y)+this.direction.y][this.pos.x+this.direction.x] != 0 || textMap[Math.floor(this.pos.y)+this.direction.y][this.pos.x+this.direction.x] != 0 ){ //if im not going to run into a wall
			this.pos.x += this.direction.x*(gameSpeed)
			this.pos.y += this.direction.y*(gameSpeed) //move
		}
		if (pac.pos.x % 1 == 0 && pac.pos.y % 1 == 0){ //if pos flat number
			if (textMap[Math.floor(this.pos.y)+move.y][this.pos.x	+move.x] != 0 && (move.x != 0 || move.y != 0)){ // and I wont turn into a wall.
				this.direction = move //turn
			}
		}
		if (this.pos.x > textMap[floor(this.pos.y)].length-1){ //screen wrap
			this.pos.x -= width
		}
		if (this.pos.x < 0){
			this.pos.x += width
		}
		for (let dot of dots){ //dot collision
			if (dot.pos.x == this.pos.x && this.pos.y == dot.pos.y){
				if (dot instanceof PowerPellet){ //if power pellet
					powerTimer = max(0,10-level) //set timer
					if (soundEnabled){
						sound.fruit.play()
					}
					for (let ghost of ghosts){
						ghost.eaten = false //no ghosts are eaten
					}
				}
				if (dotsEaten >= (10-(level/2)) && dotScore < 100){
					dotsEaten = 0
					dotScore += 10
				}else{
					dotsEaten++
				}
				if (level == 255){
					dotScore = 256
					new ScoreText(this.pos.x,this.pos.y,true,dotScore.toString(),[0xff,0xd7,0x0])
				}else{
					if (dotScore > 100) {dotScore = 100}
					new ScoreText(this.pos.x,this.pos.y,true,dotScore.toString())
				}
				score += dotScore //up score
				if (score % 100000 < dotScore){ //give 1up
					lives++
					if (soundEnabled){
						sound.extraLife.play()
					}
				}
				dots.splice(dots.indexOf(dot),1) //remove dot
				if (soundEnabled){
					sound.chomp.play()
				}
			}
		}
		for (let ghost of ghosts){ //ghost collision
			if (ghost.pos.dist(this.pos) < 1 && god == 0){
				if (powerTimer <= 0 || ghost.eaten == true){ //no power pellet active or the ghost was eaten already
					this.dead = true //im dead!
					dotScore = 10
					dotsEaten = 0
					if (soundEnabled){
						sound.death.play()
					}
					
					if (livesEnabled){ //if lives are enable reduce by a life
						lives--
					}
				}else{ //if power pellet
					eyes.push(new Eyes(ghost.type,ghost.pos.x,ghost.pos.y)); //spawn eyes
					ghosts.splice(ghosts.indexOf(ghost),1) //get rid of ghosts
					stopped = true //game stopped
					this.scoring = true //scoring true
					if (powerScore < 6400){ //up powerScore with a max of 6400
						powerScore *= 2
					}
					score += powerScore // add to score
					if (soundEnabled){
						sound.eatGhost.play()
					}
					if (score % 100000 < powerScore){ //1up
						lives++
						if (soundEnabled){
							sound.extraLife.play()
						}
					}
					setTimeout(function(){ //reset after 500ms
						pac.scoring = false
						stop(false,false)
					},500)
				}
			}
		}
	}
	show(){
		if (this.scoring == false){ //if not showing score
			if (this.dead){ //if im dead
				stopped = true //stop game
				if (this.mOpen < 170){ //open mouth and basically eat myself
					this.mOpen += 2
				}
				if (this.mOpen >= 169){ //once mouth is open then reset
					input = []
					reset((lives<=0)*2)
				}
			}else{ //otherwise
				this.mOpen += this.animPolarity*8 //open (or close) mouth
				if (this.mOpen <= 1 || this.mOpen >= 45){ //if angle > 45 or mouth is closed then reverse animation
					this.animPolarity *= -1
				}
			}
			let d //direction in terms of angles not vector
			if (this.direction.x == 1){
				d = 0
			}else if (this.direction.x == -1){
				d = 180
			}else if (this.direction.y == 1){
				d = 90
			}else if (this.direction.y == -1){
				d = 270
			}
			fill(0xff,0xff,0x0)
			arc(this.pos.x*CELL+(CELL/2),this.pos.y*CELL+(CELL/2),CELL*1.5,CELL*1.5,toRad(d+this.mOpen),toRad(d-this.mOpen)) //draw a filled arc
			if (textMap[floor(this.pos.y)][floor(this.pos.x)] == "t"){
				arc(this.pos.x*CELL+(CELL/2)-(width*CELL),this.pos.y*CELL+(CELL/2),CELL*1.5,CELL*1.5,toRad(d+this.mOpen),toRad(d-this.mOpen))
				arc(this.pos.x*CELL+(CELL/2)+(width*CELL),this.pos.y*CELL+(CELL/2),CELL*1.5,CELL*1.5,toRad(d+this.mOpen),toRad(d-this.mOpen))
			}
			this.displayed = false
		}else{ //display score text
			if (!this.displayed){
				new ScoreText(this.pos.x,this.pos.y,false,powerScore.toString(),[0xff,0xff,0x0])
				this.displayed = true
			}
		}
	}
}