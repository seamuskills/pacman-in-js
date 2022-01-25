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
				push()
				translate(this.pos.x*CELL,this.pos.y*CELL)
				noStroke()
				drawShape(fruitShapes.cherry,[CELL/12,-CELL/12],[1,1],[-6,-6])
				pop()
			break
			case "strawberry":
				push()
				translate(this.pos.x*CELL,this.pos.y*CELL)
				noStroke()
				drawShape(fruitShapes.strawberry,[CELL/12,-CELL/12],[1,1],[-6,-6])
				pop()
			break
			case "orange":
				push()
				translate(this.pos.x*CELL,this.pos.y*CELL)
				noStroke()
				drawShape(fruitShapes.orange,[CELL/12,-CELL/12],[1,1],[-6,-6])
				pop()
			break
			case "melon":
				push()
				translate(this.pos.x*CELL,this.pos.y*CELL)
				noStroke()
				drawShape(fruitShapes.melon,[CELL/12,-CELL/12],[1,1],[-6,-6])
				pop()
			break
			case "bell":
				push()
				translate(this.pos.x*CELL,this.pos.y*CELL)
				noStroke()
				drawShape(fruitShapes.bell,[CELL/12,-CELL/12],[1,1],[-6,-6])
				pop()
			break
			case "key":
				push()
				translate(this.pos.x*CELL,this.pos.y*CELL)
				noStroke()
				drawShape(fruitShapes.key,[CELL/12,-CELL/12],[1,1],[-6,-6])
				pop()
			break
		}
	}
}