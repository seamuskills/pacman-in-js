let CELL = Math.floor(window.innerHeight/30) //TODO: fix this
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
	background(0x0,0x0,0x0,255-(255*(powerTimer/10)))
	if (powerTimer <= 0){
		powerScore = 100
		c = color(0x0,0x0,0xff)
	}else{
		c = color(powerTimer*25.5,0,255-(powerTimer*25.5))
	}
	if (dots.length == 0 && tick % 32 < 16){
		c = color(0xff)
	}
	fill(c)
	for (let y = 0; y < textMap.length; y++){
		for (let x = 0; x < textMap[y].length;x++){
			if (textMap[y][x] == '0'){
				rect(x*CELL,y*CELL,CELL,CELL)
			}
			if (textMap[y][x] == "_"){
				fill(0xff,0xC0,0xCB)
				rect(x*CELL,y*CELL+(CELL/2),CELL,CELL/4)
				fill(c)
			}
		}
	}
}