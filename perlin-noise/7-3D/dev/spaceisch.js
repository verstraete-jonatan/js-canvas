const gridDetail = 20
const grid = []


const df= 1200,
noiseScale= 3;
let zoff= 1






function noisify(x,y){

    const value = noise.perlin3(x/df,  y/df,  zoff)
        
    const angle = ((1 + value) * 1.1 * 128) / (PI * 2)
    return [
        rotateVector(x * noiseScale*.6, y, angle),
        rotateVector(x * noiseScale*2, y, angle)
    ]
}


class GridPoint {
    constructor(x, y) {
        this.x = x
        this.y = y

        this.x0 = x
        this.y0 = y

        this.z=y/2

        this.x1 = x
        this.y2 = y
        this.x2=x
        this.y2=y
    }
    loop(){
        const [small,large]=noisify(this.x0,this.y0)

        this.x1=this.x+small.x
        this.y1=this.y+small.y

        this.x2=this.x+large.x
        this.y2=this.y+large.y
        
    }
    draw() {
        // line(this.x1, this.y1, this.x2, this.y2)
        point(this.x1, this.y1, 5, 0x00000066)
        point(this.x2, this.y2, 8, 0x000000aa)

    }
}



 
async function main() {
   // ctx.invert()
    for(let x of range(Xmax)) {
        for(let y of range(Ymax)) {
            if(x%gridDetail==0 && y%gridDetail==0) grid.push(new GridPoint(x, y))
        }
    }
    ctx.strokeStyle="#1111119f"
    ctx.lineWidth=5


    const Zmid=0
    let angle = degRad(3)// * Math.PI * 2;


    async function animation() {
        clear()

        // for (let v of grid) {
        //     let dx = v.x - Xmid
        //     let dy = v.y - Ymid
        //     let x = dx * Math.cos(angle) - dy * Math.sin(angle)
        //     let y = dx * Math.sin(angle) + dy * Math.cos(angle)
        //     v.x0 = (x + Xmid)
        //     v.y0 = (y + Ymid)
        // }
            // rotate the cube along the x axis
            for (let v of grid) {
                let dy = v.y - Ymid;
                let dz = v.z - Zmid;
                let y = dy * Math.cos(angle) - dz * Math.sin(angle);
                let z = dy * Math.sin(angle) + dz * Math.cos(angle);
                v.y0 += y /10;
                v.z0 += z /10;
            }

        for(let i of grid) i.loop()
        for(let i of grid) i.draw()

        //zoff += 0.003
        angle+=0.01

        await pauseHalt()
       if(!exit) requestAnimationFrame(animation)
    }

    animation()
}

main()