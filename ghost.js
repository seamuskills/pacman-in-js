class Ghost{
	constructor(x,y,type,eaten = false){
		this.eaten = eaten //previously eaten (invulnerable to current power pellet due to being eaten previously)
		this.pos = createVector(x,y)
		this.type = type //which ghost it is (inky, pinky, blinky, or clyde not respectively)
		this.target = this.pos.copy() //where this ghost is going
		this.color = colors[type] //color of ghost
		this.prev = createVector(0,0) //where it was
		ghosts.push(this)
		this.speed = gameSpeed
		this.prevpos = this.pos
	}
	update(){
		this.prevpos = this.pos.copy()
		let end //hoisted end variable
		if (this.type == 0){ //blinky
			end = pfGrid.grid[floor(pac.pos.y)][floor(pac.pos.x)] //end is pacmans coords
		}else if (this.type == 2){ //pinky
			let x = floor(pac.pos.x+(pac.direction.x*4))
			let y = floor(pac.pos.y+(pac.direction.y*4))//end is where pacman is facing 4 tiles ahead (originally 3 but 4 works better with current maze layout)
			let mult = 3
			while ((x > width || y > height || y < 0 || x < 0) || (pfGridArr[y][x] == 0)){ //while the target is invalid bring it closer to pacman.
				x = floor(pac.pos.x+(pac.direction.x*mult))
				y = floor(pac.pos.y+(pac.direction.y*mult))
				mult--
			}
			end = pfGrid.grid[y][x] //set the end
		}else if (this.type == 3){ //clyde
			if (this.pos.dist(pac.pos) > (6)){ //target pacman without a distance less than 6
				end = pfGrid.grid[floor(pac.pos.y)][floor(pac.pos.x)]
			}else{ //go to bottom left corner
				end = pfGrid.grid[textMap.length-2][1]
			}
		}else if (this.type == 1){ //inky
			let blinky = this //failsafe for if blinky doesnt exist
			for (let ghost of ghosts){ //get blinky
				if (ghost.type == 0){
					blinky = ghost
				}
			}
			if (this.pos.dist(pac.pos) > blinky.pos.dist(pac.pos)+1){ //go toward pacman as long as we arent closer than blinky
				end = pfGrid.grid[floor(pac.pos.y)][floor(pac.pos.x)]
			}else{ //go to the bottom left corner
				end = pfGrid.grid[textMap.length-2][1]
			}
		}
		let move = createVector(this.pos.x,this.pos.y) // will be modified later.
		if (this.pos.dist(this.target) < this.speed){ //if close enough to current target
			if (textMap[this.pos.y][this.pos.x] != "t"){ //can turn around in tunnel (to prevent errors)
				pfGrid.grid[this.prev.y][this.prev.x].closed = true
			}
			this.prev = createVector(floor(this.pos.x),floor(this.pos.y)) //set previous
			let start = pfGrid.grid[floor(this.pos.y)][floor(this.pos.x)] //start point
			let p = astar.search(pfGrid,start,end) //gets path
			if (p.length == 0){ //if no path
				for (let node of pfGrid.nodes){ //unclose all nods
					node.closed = false
				}
				end = pfGrid.grid[1][1] //go to top left
				if (this.pos.x < 2 && this.pos.y < 2){ //otherwise go to ghost pen
					end = pfGrid.grid[13][13]
				}
				p = astar.search(pfGrid,start,end) //try again
			}
			this.target = createVector(p[0].y,p[0].x) //set target
			for (let node of pfGrid.nodes){ //unclose nodes (should be done by lib but isnt)
				node.closed = false
			}
		}
		move.sub(this.target) // get difference vector
		move.normalize() //normalize it
		if (powerTimer > 0 && !this.eaten){ //slow when power pelleted
			this.speed = gameSpeed/2
			move.mult(gameSpeed/2)
		}else{
			this.speed = gameSpeed
			if (this.pos.x % gameSpeed != 0 || this.pos.y % gameSpeed != 0 ){
				this.pos.x -= this.pos.x % gameSpeed
				this.pos.y -= this.pos.y % gameSpeed
			}
			move.mult(gameSpeed)
		}
		this.pos.sub(move) //subtract from pos to move it
		if (this.pos.x > textMap[floor(this.pos.y)].length-1){ //screen wrap just in case
			this.pos.x = 1
		}
		if (this.pos.x < 1){
			this.pos.x = textMap[floor(this.pos.y)].length-1
		}
	}
	show(){
		push()
		fill(this.color)
		if (powerTimer > 0 && !this.eaten){ //if I should be a scared ghost
			fill(0x0,0x0,0xff)
			if (tick % 60 <= 30 && powerTimer <= 4){
				fill(0xff) //white flashing toward end of power pellet
			}
		}
		//determine scale
		//depending on left or right mirror
		translate(this.pos.x*CELL-(7/CELL), this.pos.y*CELL-(7/CELL))
		scale((CELL*1.25)/14);
		//eyes
		noStroke();
	
		let diff = this.pos.copy().sub(this.prevpos)
		let mirrorvalue = (value, range) => -value+range;
		let mirror = diff.x < 0 ? false : true
		beginShape()
		for (let i=0;i<ghostBase.length;i++){
			vertex(mirror ? mirrorvalue(ghostBase[i][0], 14) : ghostBase[i][0], ghostBase[i][1])
		}
		endShape()
		fill(0xff)
		beginShape()
		for (let i=0;i<eyeShapes.base.length;i++){
			vertex(mirror ? mirrorvalue(eyeShapes.base[i][0], 14) : eyeShapes.base[i][0], eyeShapes.base[i][1])
		}
		endShape()
		pop()
	}
		//fill(this.color)
		//if (powerTimer > 0 && !this.eaten){ //if I should be a scared ghost
		//	fill(0x0,0x0,0xff) 
		//	if (tick % 60 <= 30 && powerTimer <= 4){
		//		fill(0xff) //white flashing toward end of power pellet
		//	}
		//}
		//circle(this.pos.x*CELL+(CELL/2),this.pos.y*CELL+(CELL/2),CELL*1.5) 
	//}
}