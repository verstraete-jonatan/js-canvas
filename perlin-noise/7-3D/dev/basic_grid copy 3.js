const gridDetail = 20
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

let angle = degRad(0)// * Math.PI * 2;
const strength=1
// const cosa=cos(angle)*strength
// const sina=sin(angle)*strength





function noisify(x,y){
    const value = noise.perlin3(x/df,  y/df,  zoff)
        
    const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
    return [
        rotateVector(x * noiseScale*.6, y, angle),
        rotateVector(x * noiseScale*2, y, angle)
    ]
}

function rotateX(){
    for (let v of grid) {
        let dy = v.y - cy;
        let dz = v.z - cz;
        let y = dy * Math.cos(angle) - dz * Math.sin(angle);
        let z = dy * Math.sin(angle) + dz * Math.cos(angle);
        v.y = y + cy;
        v.z = z + cz;
    }
}

function rotateZ(){
    // rotate z, 2d rotation around origin
    for (let v of grid) {
        v.x0 = (v.x * Math.cos(angle)*strength - v.y * Math.sin(angle)*strength)
        v.y0 = (v.x * Math.sin(angle)*strength + v.y  * Math.cos(angle)*strength)
    }
}


function rotateY(){
    // rotate in depth,y-axis upwards you know
    for (let v of grid) {
        v.x0 = (v.z * Math.cos(angle)*strength - v.x * Math.sin(angle)*strength)
        v.z0 = (v.z * Math.sin(angle)*strength + v.x  * Math.cos(angle)*strength)
    }
}

class GridPoint {
    constructor(x, y, z) {
        this.x = x
        this.y = y
        this.z = z

        this.x0 = x
        this.y0 = y


        this.x1 = x
        this.y2 = y
        this.x2=x
        this.y2=y

        this.projScale = viewDepth/ (viewDepth+ this.z)
        this.size=20*(1-this.projScale)

    }
    project(){
        const [small,large]=noisify(this.x0,this.y0)


        this.x1=(this.x0+small.x)* this.projScale
        this.y1=(this.y0+small.y)* this.projScale

        // this.x2=this.x0+large.x
        // this.y2=this.y0+large.y
        
    }
    draw() {
        // line(this.x1, this.y1, this.x2, this.y2)
        // point(this.x2, this.y2, 5, "#222233aa")
        point(this.x1, this.y1, this.size, "#00002266")


    }
}



 
async function main() {
   // ctx.invert()
    for(let x of range(Xmax)) {
        for(let y of range(Ymax)) {
            if(x%gridDetail==0 && y%gridDetail==0) grid.push(new GridPoint(x, y, (x+y)/2))//(x+y)/2
        }
    }
    ctx.strokeStyle="#1111119f"
    ctx.lineWidth=5




    async function animation() {
        clear()
        //rect(0,0,Xmax,Ymax,null,"#fff1")


        rotateY()
        textCenter(toFixed(angle),30,"red" )


        ctx.translate(Xmid/2,Ymid/2)
        for(let i of grid) i.project()
        for(let i of grid) i.draw()
        ctx.translate(-Xmid/2,-Ymid/2)

        //zoff += 0.003
        angle+=0.01

        await pauseHalt(false,false)
       if(!exit) requestAnimationFrame(animation)
    }

    animation()
}

function addSlider(){
    const slider=document.createElement('input')
    slider.type="range"
    slider.min=0
    slider.max=360
    slider.value=0
    slider.style.width="100vw"
    slider.addEventListener('mouseup',()=>{
        angle=degRad(slider.value)
    })
    
    document.body.appendChild(slider)
}

addSlider()
main()