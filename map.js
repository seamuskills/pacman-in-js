let CELL = Math.floor(window.innerHeight/30) //TODO: fix this
if (isMobile()){
	CELL = Math.floor(window.innerWidth/26)
}

const textMap =[
'000000000000000000000000000',
'0............0............0',
'0O0000.00000.0.00000.0000O0',
'0.0000.00000.0.00000.0000.0',
'0.0000.00000.0.00000.0000.0',
'0.........................0',
'0.0000.00.0000000.00.0000.0',
'0.0000.00.0000000.00.0000.0',
'0......00....0....00......0',
'000000.00000.0.00000.000000',
'+++++0.00000.0.00000.0+++++',
'+++++0.00+-------+00.0+++++',
'+++++0.00|000_000|00.0+++++',
'000000.00|0111110|00.000000',
'tttttt.--+0111110+--.tttttt',
'000000.00|0000000|00.000000',
'+++++0.00+-------+00.0+++++',
'+++++0.00.0000000.00.0+++++',
'000000.00.0000000.00.000000',
'0............0............0',
'0O0000.00000.0.00000.0000O0',
'0.0000.00000.0.00000.0000.0',
'0...00.......+.......00...0',
'000.00.00.0000000.00.00.000',
'000.00.00.0000000.00.00.000',
'0......00....0....00......0',
'0.0000000000.0.0000000000.0',
'0.0000000000.0.0000000000.0',
'0.........................0',
'000000000000000000000000000'
];

let pfGridArr = []
for (let y = 0; y < textMap.length; y++){
	let arr = []
	for (let x = 0; x < textMap[y].length;x++){
		if (textMap[y][x] == "0"){
			arr.push(0)
		}else{
			arr.push(1)
		}
	}
	pfGridArr.push(arr)
}
let pfGrid = new Graph(pfGridArr)

function setUpDots(){
	for (let y = 0; y < textMap.length; y++){
		for (let x = 0; x < textMap[y].length;x++){
			if (textMap[y][x] == "."){
				new Dot(x,y)
			}
			if (textMap[y][x] == "O"){
				new PowerPellet(x,y)
			}
		}
	}
}

let drawMap = () => {
	let c
	background(0x0,0x0,0x0,255-(255*(powerTimer/10))+((1-fadeEffect)*255))
	if (powerTimer <= 0){
		powerScore = 100
		c = color(0x0,0x0,0xff)
	}else{
		c = color(powerTimer*25.5,0,255-(powerTimer*25.5))
	}
	if (dots.length == 0 && tick % 32 < 16){
		c = color(0xff)
	}
	if (fancyWalls){
		stroke(c)
		fill(0)
	}else{
		fill(c)
	}
	strokeWeight(3)
	for (let y = 0; y < textMap.length; y++){
		for (let x = 0; x < textMap[y].length;x++){
			if (textMap[y][x] == '0'){
				if (fancyWalls){
					if (x == 0){
						line(x*CELL,y*CELL,x*CELL,(y+1)*CELL)
					}else if (textMap[y][x-1] != "0"){ //needs to be an else if despite having the same code because if there is no left than the game will look for an array entry that doesn't exist and crash
						line(x*CELL,y*CELL,x*CELL,(y+1)*CELL)
					}
					if (x == textMap[y].length-1){
						line((x+1)*CELL,y*CELL,(x+1)*CELL,(y+1)*CELL)
					}else if (textMap[y][x+1] != "0"){
						line((x+1)*CELL,y*CELL,(x+1)*CELL,(y+1)*CELL)
					}
					if (y == textMap.length - 1){
						line(x*CELL,(y+1)*CELL,(x+1)*CELL,(y+1)*CELL)
					}else if (textMap[y+1][x] != "0"){
						line(x*CELL,(y+1)*CELL,(x+1)*CELL,(y+1)*CELL)
					}
					//im not doing this optimization to the bottom because I don't hate myself that much right now
					if (y == 0){
						if (x == 0){
							let right = 0
							for (let i = x; i<textMap[y].length-1;i++){
								if (textMap[y][i] == "0"){
									right++
								}else{
									break
								}
							}
							line(x*CELL,y*CELL,(x+right+1)*CELL,y*CELL)
						}
					}else if (textMap[y-1][x] != "0"){
						let drawLine = false
						if (x == 0){
							drawLine = true
						}else if (textMap[y][x-1] != "0"){
							drawLine = true
						}else if (textMap[y-1][x-1] == "0"){
							drawLine = true
						}
						if (drawLine){
							let right = 0
							for (let i = x; i<textMap[y].length;i++){
								if (textMap[y][i] == "0"){
									if (textMap[y-1][i] == "0"){
										right--
										break
									}
									right++
								}else{
									right--
									break
								}
							}
							line(x*CELL,y*CELL,(x+right+1)*CELL,y*CELL)
						}
					}
				}else{
					rect(x*CELL,y*CELL,CELL,CELL)
				}
			}
			if (textMap[y][x] == "_"){
				noStroke()
				fill(0xff,0xC0,0xCB)
				rect(x*CELL,y*CELL+(CELL/2),CELL,CELL/4)
				fill(c)
				if (fancyWalls){stroke(c)}
			}
		}
	}
	noStroke()
}