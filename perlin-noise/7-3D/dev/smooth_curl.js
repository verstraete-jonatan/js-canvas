const gridDetail = 20
const grid = []


const df= 1200,
noiseScale= 3;
let zoff= 1
const viewDepth=900





function noisify(x,y){

    const value = noise.perlin3(x/df,  y/df,  zoff)
        
    const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
    return [
        rotateVector(x * noiseScale*.6, y, angle),
        rotateVector(x * noiseScale*2, y, angle)
    ]
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
        log(this.projScale)

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
        point(this.x1, this.y1, 8*(this.projScale*2), "#00002266")


    }
}



 
async function main() {
   // ctx.invert()
    for(let x of range(Xmax)) {
        for(let y of range(Ymax)) {
            if(x%gridDetail==0 && y%gridDetail==0) grid.push(new GridPoint(x, y, (x+y)/2))
        }
    }
    ctx.strokeStyle="#1111119f"
    ctx.lineWidth=5


    let angle = degRad(0)// * Math.PI * 2;
    const strength=1
    const cosa=cos(angle)*strength
    const sina=sin(angle)*strength


    async function animation() {
        clear()
        //rect(0,0,Xmax,Ymax,null,"#fff1")

        // rotate z
        // for (let v of grid) {
        //     v.x0 = (v.x * Math.cos(angle)*strength - v.y * Math.sin(angle)*strength)
        //     v.y0 = (v.x * Math.sin(angle)*strength + v.y  * Math.cos(angle)*strength)
        // }

        // rotate y
        for (let v of grid) {
            v.x0 = Xmid+(v.z * Math.cos(angle)*strength - v.x * Math.sin(angle)*strength)
            v.z0 = (v.z * Math.sin(angle)*strength + v.x  * Math.cos(angle)*strength)
        }


        for(let i of grid) i.project()
        for(let i of grid) i.draw()

        zoff += 0.003
        //angle+=0.01

        await pauseHalt()
       if(!exit) requestAnimationFrame(animation)
    }

    animation()
}

main()