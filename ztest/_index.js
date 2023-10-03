const width=50
const height=30
const grid={}

class Point{
    constructor(p){
        this.id=sCoord(...p)
        this.checked=false
        this.rpos=p
        this.pos=[scaleNum(p[0],0,width,0,Xmax), scaleNum(p[1],0,height,0,Ymax)]
    }
    show(){
        point(...this.pos,5, this.checked?"red":"green")
    }
}

const street={}

for (let x of range(width)) {
    for (let y of range(height)) {
        if(x%8==0 &&y%8==0){
            street[sCoord(x,y)]=new Point([x,y])
        }
    }
}


const Grid={
    pts:{},
    assing(p){
        this.pts[sCoord(...p.pos)]=p
    },
    init(){
        for (let x of range(width)) {
            for (let y of range(height)) {
                this.pts[sCoord(x,y)]= [x,y]
            }
        }
    },
    draw(){
        for(let i of Object.values(this.pts)){
            point(...i,5, "gray")
        }
    }
}




const player={
    x:0,
    y:0,
    pts:[],
    area:2,
    init(){
        this.pts=JSON.copy(Object.values(grid).map(i=>i.pos))
    },
    move(){
        this.pos=this.pts.next()
        if(this.pts.indexOf(this.pos)===this.pts.lastIndexOf()) this.done=true

    },
    animate(){
        for(let i=-this.area;i<this.area;i++){
            for(let j=-this.area;j<this.area;j++){
                let [x,y]=this.pos
                x=floor(x+i)
                y=floor(y+j)

                if(grid[sCoord(x,y)]){
                    log(1)
                    grid[sCoord(x,y)].checked=true
                }
            }
        }
    }
}


async function animate(){
    clear()
    player.animate()
    for(let i of Object.values(grid)){
        i.show()
    }
    if(!player.done)requestAnimationFrame(animate)
}
player.init()

animate()

