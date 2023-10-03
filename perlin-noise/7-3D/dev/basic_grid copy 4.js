const gridDetail = 30
const grid = []

// noise
const df= 800,
noiseScale= 1;
let zoff= 10000
const viewDepth=900


// this.angle rotation
const cx = Xmax / 2;
const cy = Ymax / 2;
const cz = 0;

class GridPoint {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;

        this.x0 = x;
        this.y0 = y;


        this.x1 = x;
        this.y2 = y;
        this.x2 = x;
        this.y2 = y;

        this.projScale = viewDepth / (viewDepth + this.z);
        this.size = 10 * (1 - this.projScale);
        this.noiseVector=null

    }
    project() {
        const value = noise.perlin3(this.x / df, this.y / df, zoff+this.z/(df))
        this.noiseVector =rotateVector(this.x0 * noiseScale, this.y0, ((1 + value) * 1.1 * 128) / (PI * 2))


        this.x1 = (this.x0 + this.noiseVector.x) * this.projScale;
        this.y1 = (this.y0 + this.noiseVector.y) * this.projScale;
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x1, this.y1,this.size, 0, Math.PI * 2);
        // ctx.stroke()
        ctx.fill();
        ctx.closePath();
    }
}


/** Layer of points */
class Layer {
    constructor(x,y,z) {

        this.angle = degRad(0.30); 
        this.strength = 1;
        this.grid=[]

        this.cosa=Math.cos(this.angle) * this.strength
        this.sina=Math.sin(this.angle) * this.strength


        for (let _x of range(Xmax)) {
            for (let _y of range(Ymax)) {
                if (_x % gridDetail == 0 && _y % gridDetail == 0)
                    this.grid.push(new GridPoint(x+_x, y+_y, (x+_x + y+_y+z) / 3)); 
            }
        }
    }

    animate() {


        // this.rotateY();
        // this.angle += 0.001;
        // this.cosa=Math.cos(this.angle) * this.strength
        // this.sina=Math.sin(this.angle) * this.strength

        for (let i of this.grid) i.project();

    }
    rotateX() {
        for (let v of this.grid) {
            v.y0 = v.y * this.cosa - v.z * this.sina
            v.z0 = v.z * this.sina + v.z * this.cosa
        }
    }

    rotateZ() {
        // rotate z, 2d rotation around origin
        for (let v of this.grid) {
            v.x0 = v.x * this.cosa - v.y * this.sina
            v.y0 = v.x * this.sina + v.y * this.cosa
        }
    }


    rotateY() {
        // rotate in depth,y-axis upwards you know
        for (let v of this.grid) {
            v.x0 = v.z * this.cosa - v.x * this.sina
            v.z0 = v.z * this.sina + v.x * this.cosa
        }
    }


}


function createLayer(amt=5,steps=3,x=0,y=0){
    const l=[]
    for(let i of range(amt)){
        l.push(new Layer(x,y,i*gridDetail*steps))
    }
    return l
}




const layers=createLayer(20)
ctx.strokeStyle = "#2222335a";
ctx.fillStyle = "#2222335a";



async function animation() {
    clear();
    //rect(0,0,Xmax,Ymax,null,"#fff1")
    // textCenter(toFixed(layers[0].angle), 30, "red");



    ctx.translate(Xmid / 2, Ymid / 2);
    layers.forEach(l=>l.animate())

    ctx.beginPath();
    layers.forEach(l=>{
        ctx.moveTo(l.grid[0].x1,l.grid[0].y1)
        for (let i of l.grid) {
            if(i.y0==0) ctx.moveTo(i.x1, i.y1)
            else ctx.lineTo(i.x1, i.y1)
        }
    })
    ctx.stroke()
    ctx.translate(-Xmid / 2, -Ymid / 2);

    //textCenter(toFixed(layers.reduce((p,c,idx)=>p+c.grid.length,0)), 30, "red");


    zoff += 0.003

    await pauseHalt(false, false);
    requestAnimationFrame(animation);
}


animation();