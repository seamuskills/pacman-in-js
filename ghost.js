 class Ghost{
	constructor(x,y,type,eaten = false){
		this.eaten = eaten //previously eaten (invulnerable to current power pellet due to being eaten previously)
		this.pos = createVector(x,y)
		this.type = type //which ghost it is (inky, pinky, blinky, or clyde not respectively)
		this.target = this.pos.copy() //where this ghost is going
		this.color = colors[type] //color of ghost
		this.prev = createVector(0,0) //where it was
		this.speed = gameSpeed
		this.prevpos = this.pos
    this.frame = 0;
    
    this.shape = JSON.parse(JSON.stringify(ghost));
	}
	update(){
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
			this.prevpos = this.pos.copy()
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
			if (fancyGhost){
				//debug tool: uncomment to show prev position
				//rect(this.prev.x*CELL,this.prev.y*CELL,CELL,CELL)
				let ghost = this.shape;
				push()
				this.shape.body.color = this.color;
				this.shape.feet.color = this.color;
				this.shape.feet2.color = this.color;
				if (powerTimer > 0 && !this.eaten){ //if I should be a scared ghost
					this.shape.body.color = color(0x0,0x0,0xff);
					this.shape.feet.color = color(0x0,0x0,0xff);
					this.shape.feet2.color = color(0x0,0x0,0xff);
					if (tick % 60 <= 30 && powerTimer <= 4){
						//white flashing toward end of power pellet
						this.shape.body.color = color(0xff);
						this.shape.feet.color = color(0xff);
						this.shape.feet2.color = color(0xff);
					}
				}
				noStroke();
				translate(this.pos.x*CELL-(7/CELL), this.pos.y*CELL-(7/CELL))
				//calculate the eye translations
				let eyeX = Math.sign(this.prevpos.x-this.pos.x)*-1;
				let eyeY = Math.sign(this.prevpos.y-this.pos.y)*-1;
				eyeY = eyeX == 0 ? eyeY : Math.min(eyeY, 0);
				// calculate scale for each part up here
				drawShapes(
					[CELL*1.25, CELL*1.25], [14, 14],
					[ ghost.body ],
					[ tick % 25 < 12 ? ghost.feet : ghost.feet2, [0,0], this.frame == 1, 7 ],
					[ tick % 25 < 12 ? ghost.feet : ghost.feet2, [7,0], this.frame == 0, 7 ],
					[ ghost.eyeBack, [eyeX==1?2:0,0] ],
					[ ghost.eyeBack, [eyeX==1?8:6,0] ],
					[ ghost.eye, [eyeX + (eyeX==1?2:0),eyeY] ],
					[ ghost.eye, [eyeX + (eyeX==1?8:6),eyeY] ]
				)
				pop()
			}else{
				fill(this.color)
				if (powerTimer > 0 && !this.eaten){ //if I should be a scared ghost
					fill(0x0,0x0,0xff) 
					if (tick % 60 <= 30 && powerTimer <= 4){
						fill(0xff) //white flashing toward end of power pellet
					}
				}
				circle(this.pos.x*CELL+(CELL/2),this.pos.y*CELL+(CELL/2),CELL*1.5) 
		}
	}
}