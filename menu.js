let changeCooldown = 0
let unselectable = false

buttons = {
	"main":{
		"play": () => {gameState = "game"; reset()},
		"options": () => {menuIndex = "options";selectedIndex = 0}
	},
	"options":{
		"back": () => {menuIndex = "main";selectedIndex = 0},
		"`sound enabled:${soundEnabled}`": () => {soundEnabled = !soundEnabled},
		"`lives enabled:${livesEnabled}`": () => {livesEnabled = !livesEnabled},
		"`power pellet effect:${fadeEffect}`": () => {fadeEffect = !fadeEffect},
		"`fancy ghost graphics: ${fancyGhost}`": () => {fancyGhost = !fancyGhost},
		"`fancy wall graphics: ${fancyWalls}`": () => {fancyWalls = !fancyWalls}
	}
}

drawMenuButtons = () => {
	textSize(CELL*1.5)
	changeCooldown--
	let len = Object.keys(buttons[menuIndex]).length
	for (let i=0; i < len;i++){
		selectedIndex == i ? stroke(0xff,0xff,0x00) : stroke(0,0,0,0)
		if (Object.keys(buttons[menuIndex])[i][0] == "`"){
			text(eval(Object.keys(buttons[menuIndex])[i]),width/2,height*0.25+((height/len)*0.8*(i+1)*CELL))
		}else{
			text(Object.keys(buttons[menuIndex])[i],width/2,width*0.25+((height/len)*0.2*(i+1)*CELL))
		}
	}
	if (changeCooldown <= 0 && input.includes("s")){
		changeCooldown = 15
		selectedIndex++
	}
	if (changeCooldown <= 0 && input.includes("w")){
		changeCooldown = 15
		selectedIndex--
	}
	selectedIndex = Math.min(len-1,selectedIndex)
	selectedIndex = Math.max(0,selectedIndex)
	if (!unselectable && input.includes("Enter")){
		buttons[menuIndex][Object.keys(buttons[menuIndex])[selectedIndex]]()
		unselectable = true
	}
	if (!input.includes("Enter") && unselectable){
		unselectable = false
	}
}