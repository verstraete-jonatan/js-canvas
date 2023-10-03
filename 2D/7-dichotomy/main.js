const df = 500
const scale = 1
let zoff = 0.01

function getNoiseByPoint(p){
    const {x, y}=p
    const value = (1+noise.simplex3(x / df, y / df, zoff)) * 1.1 * 128;
    return rotateVector(x * scale, y * scale, value / ( PI * 2))
}


class Grid {
    constructor() {
        cnv.width=1200
        cnv.height=600

        this.w = cnv.width
        this.h = cnv.height
        this.s = 40
        this.grid = []

        const w=floor(this.h/this.s)
        const h=floor(this.w/this.s)

        for(let y=0;y<w;y++){
            for(let x=0;x<h;x++){
                this.grid.push([x*this.s,y*this.s])
            }
        }
        this.colors=['red', 'blue', 'yellow', 'green','cyan','blue','purple','red']
    }
    star(x,y, size, depth=1){
        if(depth<=0) return
        const s=size*(0.5*depth)
        //ctx.strokeStyle=this.colors[depth]
        ctx.lineWidth=depth/2

        line(x,y, x, y+s)
        line(x,y, x+s, y)
        line(x,y, x, y-s)
        line(x,y, x-s, y)
        if(depth) {
            this.star(x+s/4, y+s/4, size/2, depth-1)
            this.star(x-s/4, y+s/4, size/2, depth-1)
            this.star(x+s/4, y-s/4, size/2, depth-1)
            this.star(x-s/4, y-s/4, size/2, depth-1)
        }
    }
    draw() {
        for(let p of this.grid )  {
            this.star(p[0],p[1], this.s, 4)


        }
    }
}


function main() {


    const grid = new Grid()

    const animate = async () => {
        clear()

        grid.draw()

        // await pauseHalt()
        // await sleep(.1)
        // zoff+=5
        // requestAnimationFrame(animate)
    }
    animate()
}



ctx.background('#fff')
main()
