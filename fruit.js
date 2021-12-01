class Fruit{
	constructor(wandering=false){
		if (!wandering){
			this.pos = createVector(13,16)
		}else{
			this.pos = createVector(0,14)
		}
		this.wander = wandering
	}
	update(){
		if (wandering){
		}
	}
	show(){
	}
}