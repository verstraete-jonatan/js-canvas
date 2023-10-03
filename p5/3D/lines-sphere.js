const noiseAmt = 200
const noiseDF = 2

let frames = 0
const gridSize = 10
const tsx = 1
const tsy = 1

const circleSetup =  {
   radius: 300,
   center: {
      x: 200,
      y: 200,
   },
   depth: 900,
}

class Point {
   constructor(x, y, z) {
      this.theta = (x+y+z)*100
      this.phi =  x+z+ x/PI//x+z+ y/PI

      this.cx = x
      this.cy = y
      this.cz = z

      this.x = x
      this.y = y
      this.z = z
      this.projX = x
      this.projY = y
   }
   project() {
      this.x = circleSetup.radius * sin(this.phi) * cos(this.theta)
      this.y = circleSetup.radius * cos(this.phi)
      this.z = circleSetup.radius * sin(this.phi) * sin(this.theta) + circleSetup.radius

      this.projScale = (circleSetup.depth / (circleSetup.depth + this.z)) * 2
      this.projX = (this.x * this.projScale) + circleSetup.center.x
      this.projY = (this.y * this.projScale) + circleSetup.center.y

      this.alpha = map(this.z, 0, circleSetup.depth, 0, 1)

      this.theta += 0.002
      return this
   }
}


class Sphere{
    constructor(flipped) {
      this.points = []
      this.flipped = !!flipped
    }
    render() {
      beginShape();

      for(let x = 0; x < gridSize; x++) {
         for(let y = 0; y < gridSize; y++) {       
            const {projX, projY, alpha} = this.points[x][y].project()
            const ang = map((x+y), 0, (gridSize**2), 0, TWO_PI)
            const rad = noiseAmt * noise((x+frames)/noiseDF, (y+frames)/noiseDF)
            const px = projX*tsx+(rad * cos(ang))
            const py = projY*tsy+(rad * sin(ang))
            

            if(this.flipped) curveVertex(py, px)
            else curveVertex(px, py)
         }
        }
        endShape();
    }

}
const sphere = new Sphere()
const sphere2 = new Sphere(true)

function setup() {
   noiseSeed(99);
   createCanvas(window.innerWidth, window.innerHeight, WEBGL);
   //setAttributes('antialias', true);
   strokeWeight(0.3);


   for(let x = 0; x < gridSize; x++) {
      const row = []
      for(let y = 0; y < gridSize; y++) {
         row.push(new Point(x, y, (x+y)/2))
      }
      sphere.points.push(row)
      sphere2.points.push(row)

   }
}

async function draw() {
   if(pause) return
   clear()
   translate(-200, -200, -400)
   stroke('#f00')
   //noFill()
   fill('#f883');




   //rotateZ(frames)
   sphere.render()
   
   stroke('#00f')
   fill('#88f3');

   //sphere2.render()


   frames+=0.01
}

/** change line 19 for effects */