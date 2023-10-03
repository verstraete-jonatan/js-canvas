const gridDetail = 26
const grid = []

// noise
const df= 1200,
noiseScale= 3;
let zoff= 1
const viewDepth=900


// angle rotation
const cx = Xmax / 2;
const cy = Ymax / 2;
const cz = 0;

let angle = degRad(180-20)// * Math.PI * 2;
const strength=1






function noisify(x,y,z=0){
    const value = noise.perlin3(x/df,  y/df,  zoff+z)
        
    const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
    return rotateVector(x * noiseScale*.6, y, angle)
}


const Rotations={
    cosa: cos(angle)*strength,
    sina: sin(angle)*strength,
    x:()=>{
        for (let v of grid) {
            v.y0 = (v.y * this.cosa - v.z * this.sina)
            v.z0 = (v.z * this.sina + v.z * this.cosa)
        }
    },
    x2:()=>{
        for (let v of grid) {
            v.y0 = (v.y * Math.cos(angle)*strength - v.z * Math.sin(angle)*strength)
            v.z0 = (v.y * Math.sin(angle)*strength + v.z  * Math.cos(angle)*strength)
        }
    },
    y:()=>{
        for (let v of grid) {
            v.x0 = (v.z * this.cosa - v.x * this.sina)
            v.z0 = (v.z * this.sina + v.x  * this.cosa)
        }
    },
    y2:()=>{
        for (let v of grid) {
            v.x0 = (v.z * Math.cos(angle)*strength - v.x * Math.sin(angle)*strength)
            v.z0 = (v.z * Math.sin(angle)*strength + v.x  * Math.cos(angle)*strength)
        }
    },
    z:()=>{
        for (let v of grid) {
            v.x0 = (v.x * this.cosa - v.y * this.sina)
            v.y0 = (v.x * this.sina + v.y  * this.cosa)
        }
    },
    z2:()=>{
        for (let v of grid) {
            v.x0 = (v.x * Math.cos(angle)*strength - v.y * Math.sin(angle)*strength)
            v.y0 = (v.x * Math.sin(angle)*strength + v.y  * Math.cos(angle)*strength)
        }
    }
}

class GridPoint {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

        this.x0 = x
        this.y0 = y
        this.z0 = z

        this.x1 = x
        this.y2 = y
        this.x2=x
        this.y2=y

        this.projScale = viewDepth/ (viewDepth+ this.z)
        this.size=(1+this.projScale/5)
        // this.size=2

    }
    project(){
        this.noiseEffect= noisify(this.x0,this.y0, this.z/1000)


        this.x1=(this.x0+this.noiseEffect.x)* this.projScale
        this.y1=(this.y0+this.noiseEffect.y)* this.projScale

        // this.x2=this.x0+large.x
        // this.y2=this.y0+large.y
        
    }
    draw() {
        // line(this.x1, this.y1, this.x2, this.y2)
        // point(this.x2, this.y2, 5, "#222233aa")
        // point(this.x1, this.y1, this.size)
        ctx.beginPath();
        ctx.arc(this.x1, this.y1, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
}

function createSlide(_x=0,_y=0,_z=0){
    for(let x of range(Xmax/2)) {
        for(let y of range(Ymax)) {
            if(x%gridDetail==0 && y%gridDetail==0) {
                grid.push(new GridPoint(  (x+_x)/2, (y+_y)/2,  _z  ))//(x+y)/2 //((x+_x)/2+(y+_y)/2)/df+1 // (x+y+_z+0.1)/df/3
            }
        }
    }
}

 
async function main() {
    // ctx.invert()
    // cnv.height = window.innerHeight /2
    // cnv.width = window.innerWidth/2
    ctx.strokeStyle="#1111119f"
    ctx.fillStyle="#2222335a"
    ctx.lineWidth=5

    const amt=5
    const m=Xmax/(amt+1)
    for(let i of range(amt)){
        // log((Xmax/(i+1)),Ymid,i)
        createSlide(m*(i+1),0,(i+1)*50)//i+(m*(i+1)+Ymid)/df
    }



    async function animation() {
        clear()

        //rect(0,0,Xmax,Ymax,null,"#fff1")
        // angle+=0.1
        // textCenter(angle)


        // Rotations.x2()
        // Rotations.z2()
        Rotations.y2()




        ctx.translate(Xmid,Ymid/2)
        for(let i of grid) i.project()

        for(let i of grid) {
            i.draw()
        }
        ctx.translate(-Xmid,-Ymid/2)

        zoff += 0.003
        await pauseHalt(false,false)
       if(!exit) requestAnimationFrame(animation)
    }

    animation()
}


main()