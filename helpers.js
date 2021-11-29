const numMap = (_in, in_min, in_max, out_min, out_max) => 
  (_in - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
let drawShape = (
  shape,
  scale=[0,0],
  size=[0,0],
  offset=[0,0],
  mirror=false,
  mirrorRange=0
) => {
  //handle scaling
  fill(shape.color);
  beginShape();
  shape.points.forEach(
    ([x, y]) => 
      vertex(
        numMap((mirror ? -x+mirrorRange : x)+offset[0], 0, size[1], 0, scale[1]),
        numMap(y+offset[1], 0, size[1], 0, scale[1])
      )
  );
  endShape(CLOSE);
}
const drawShapes = (scale, size, ...shapes) => 
  shapes.forEach((shape) => drawShape(shape[0], scale, size, ...shape.slice(1)));

function isMobile() {
		return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
}