fruits = {
	"cherry":100,
	"strawberry":300,
	"orange":500,
	"melon":1000,
	"bell":3000,
	"key":5000
}

class Fruit{
	constructor(wandering=false){
		this.pos = createVector(13,16)
		this.fruit = Object.keys(fruits)[Math.min(level,Object.keys(fruits).length-1)]
	}
	update(){
		if (this.pos.dist(pac.pos) < 1){
			new ScoreText(this.pos.x,this.pos.y,false,fruits[this.fruit])
			score += fruits[this.fruit]
			currentfruit = null
		}
	}
	show(){
		switch (this.fruit){
			case "cherry":
				stroke(0x0,0xff,0x0)
				line((this.pos.x+0.25)*CELL,(this.pos.y+0.75)*CELL,(this.pos.x+0.5)*CELL,(this.pos.y+0.25)*CELL)
				line((this.pos.x+0.75)*CELL,(this.pos.y+0.75)*CELL,(this.pos.x+0.5)*CELL,(this.pos.y+0.25)*CELL)
				noStroke()
				fill(0xff,0x0,0x0)
				circle((this.pos.x+0.25)*CELL,(this.pos.y+0.75)*CELL,CELL/2)
				circle((this.pos.x+0.75)*CELL,(this.pos.y+0.75)*CELL,CELL/2)
			break
			case "strawberry":
				fill(0xff,0x0,0x0)
				triangle((this.pos.x+0.5)*CELL,(this.pos.y+0.85)*CELL,(this.pos.x+0.15)*CELL,(this.pos.y+0.25)*CELL,(this.pos.x+0.85)*CELL,(this.pos.y+0.25)*CELL)
				fill(0x0,0xff,0x0)
				ellipse((this.pos.x+0.5)*CELL,(this.pos.y+0.25)*CELL,CELL*0.7,CELL*0.1)
			break
			case "orange":
				stroke(0x0,0xff,0x0)
				line((this.pos.x+0.35)*CELL,(this.pos.y+0.1)*CELL,(this.pos.x+0.5)*CELL,(this.pos.y+0.5)*CELL)
				noStroke()
				fill(0xff,0xa5,0x0)
				circle((this.pos.x+0.5)*CELL,(this.pos.y+0.6)*CELL,CELL*0.75)
			break
			case "melon":
				stroke(0x0,0xff,0x0)
				line((this.pos.x+0.35)*CELL,(this.pos.y+0.1)*CELL,(this.pos.x+0.5)*CELL,(this.pos.y+0.5)*CELL)
				noStroke()
				fill(0x00,0x99,0x0)
				circle((this.pos.x+0.5)*CELL,(this.pos.y+0.6)*CELL,CELL*0.75)
			break
			case "bell":
				fill(0xff,0xff,0x0)
				triangle((this.pos.x+0.5)*CELL,(this.pos.y+0.15)*CELL,(this.pos.x+0.15)*CELL,(this.pos.y+0.75)*CELL,(this.pos.x+0.85)*CELL,(this.pos.y+0.75)*CELL)
				fill(0x0,0xff,0xff)
				ellipse((this.pos.x+0.5)*CELL,(this.pos.y+0.75)*CELL,CELL*0.7,CELL*0.2)
			break
			case "key":
				fill(0x66)
				rect((this.pos.x+0.35)*CELL,(this.pos.y+0.21)*CELL,3,8)
				fill(0x0,0xff,0xff)
				rect((this.pos.x+0.3)*CELL,(this.pos.y+0.2)*CELL,4,4)
			break
		}
	}
}