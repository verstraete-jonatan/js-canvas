
let density = ""
density = "Ñ@#W$9876543210?!abc;:+=-,._                    ";
density = '.:-i|=+%O#@'
//density = '.•`*+ù£#      '
const detail = 1
const vidWidth = 128
const vidHeight = 96
const pxScale = 10
const amtOfWords = 300

let video;
let words = []
let frameCount=0
const lerpIntv = 10

const rows=10
const cols=10
const scale=10


function setup() {
  // video = createCapture(VIDEO);
  // video.size(128, 96);
}

function draw() {
  clear()
  // video.loadPixels();

  let x, y;
  for (x = 0;x < rows; x++) {
     let yoff = 0
     let xoff = 0
     ctx.beginPath();
     for (y = 0; y < cols; y++) {
        let value = noise.simplex3(x / df, y / df, zoff);
        value = (1 + value) * 1.1 * 128;
        let angle = value / ( PI * 2)
        const v = rotateVector(x * scale, y * scale, angle)


     ctx.lineTo(x*scale+v.x+xoff, y*scale+v.y+yoff)
     }
     ctx.stroke();
  }
  zoff += 0.005;
  requestAnimationFrame(drawFrame)
}