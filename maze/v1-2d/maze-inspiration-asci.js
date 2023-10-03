
/**
 * Maze generator using Prim's algorithm
 * @author m0ose
 * cody smith   2011     m0ose at yahoo dot com
 */

const GenerateMaze = ({width=10, height, seed=3}) => {
	if(!height) height=width
	let __VISITED = 0;
	let __UNVISITED = 1;

	const maze=new Array(width);


	/**
	 * Seeder
	 *  @author mulberry32 
	 * @source https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
	 */
	class Seeder {
		constructor(seed = 0, ) {
		this.s = seed
		}
		get() {
		let t = this.s += 0x6D2B79F5;
		t = Math.imul(t ^ t >>> 15, t | 1);
		t ^= t + Math.imul(t ^ t >>> 7, t | 61);
		return ((t ^ t >>> 14) >>> 0) / 4294967296;
		} 
	}
	const seeder=new Seeder(seed)

	class cell {
		constructor(x, y) {
			this.x = x;
			this.y = y;
			this.up = true;
			this.down = true;
			this.left = true;
			this.right = true;
			this.state = __UNVISITED;

			this.getNeighbors = function () {
				let result = {
					up: whatsAt(x, y - 1),
					down: whatsAt(x, y + 1),
					left: whatsAt(x - 1, y),
					right: whatsAt(x + 1, y)
				};
				return result;
			};
		}
	}
	function whatsAt(x, y) {
		if (x < 0 || x >= width || y < 0 || y >= height) {
			return null;
		}
		return maze[x][y];
	}

	class Mazer {
		constructor() {
			this.totalCells = 0;
			this.visited = [];

			// init grid
			for (let i = 0; i < width; i++) {
				maze[i] = new Array(height);
				for (let j = 0; j < height; j++) {
					let newCell = new cell(i, j, this);
					maze[i][j] = newCell;
					this.totalCells++;
				}
			}
		}

		makeAMaze() {
			//get the first cell. a random one.	
			let current = maze[Math.floor(seeder.get() * width)][Math.floor(seeder.get() * height)];
			current.state = __VISITED;
			this.visited.push(current);

			while (this.visited.length < this.totalCells) {
				current = this.visited[Math.floor(seeder.get() * this.visited.length)];
				let canMove = true;
				while (canMove) {
					let directions = ['left', 'right', 'up', 'down'];
					directions.sort(randomSort);
					let neighbors = current.getNeighbors();
					canMove = false;
					while (directions.length > 0 && canMove == false) {
						let dir = directions.pop();
						if (neighbors[dir] && neighbors[dir].state == __UNVISITED) {
							//move there
							canMove = true;
							let past = current;
							current = neighbors[dir];
							if (dir == 'up') {
								past.up = false;
								current.down = false;
							}
							if (dir == 'down') {
								past.down = false;
								current.up = false;
							}
							if (dir == 'left') {
								past.left = false;
								current.right = false;
							}
							if (dir == 'right') {
								past.right = false;
								current.left = false;
							}
							current.state = __VISITED;
							this.visited.push(current);
						}
					}
				}

			}
		};



		constructVertices() {
			if (this.totalCells <= 0) {
				return null;
			}
			this.vertices = [];
			for (let y = 0; y < height; y++) {
				for (let x = 0; x < width; x++) {
					let aCell = whatsAt(x, y);
					if (aCell) {
						if (aCell.down == true)
							this.vertices.push({
								cell:aCell,
								p1: {
									x: x,
									y: y + 1
								},
								p2: {
									x: x + 1,
									y: y + 1
								}
							});
						if (aCell.right == true)
							this.vertices.push({
								cell:aCell,
								p1: {
									x: x + 1,
									y: y
								},
								p2: {
									x: x + 1,
									y: y + 1
								}
							});
						if (y == 0)
							this.vertices.push({
								cell:aCell,
								p1: {
									x: x,
									y: 0
								},
								p2: {
									x: x + 1,
									y: 0
								}
							});
						if (x == 0)
							this.vertices.push({
								cell:aCell,
								p1: {
									x: 0,
									y: y
								},
								p2: {
									x: 0,
									y: y + 1
								}
							});
					}
				}
			}
		};

		draw() {
			let xRatio = cnv.width / width;
			let yRatio = cnv.height / height;

			for (let v = 0; v < this.vertices.length; v++) {
				const{p1,p2}=this.vertices[v];
				ctx.beginPath();
				ctx.strokeStyle=COLORS.random()


				ctx.moveTo(p1.x * xRatio, p1.y * yRatio);
				ctx.lineTo(p2.x * xRatio, p2.y * yRatio);
				ctx.closePath();
				ctx.stroke();
				



				if(p1.x==3 && p1.y==3) {
					console.info(maze.flat().flat().filter(i=>i.x==3&&i.down))
					console.info(maze.flat().flat()[v])

					markPoint(p1.x * xRatio, p1.y * yRatio, 20)
				}
				else point(p1.x * xRatio, p1.y * yRatio, 5, "red")

				fillText(v+": "+JSON.stringify(p1), ((p1.x * xRatio)+p2.x * xRatio)/2-20, (p1.y * yRatio)+20, "black")

			}
		};

		init() {
			this.makeAMaze();
			this.constructVertices();
			this.draw();
			console.log(maze)
			window.maze=maze
			return this.vertices;
		}
	}



	function randomSort(a, b) {
		return Math.floor(seeder.get() * 4) - 1;
	}



	const daMaze = new Mazer();
	return daMaze.init();
}

const res=GenerateMaze({width:10, height:10})
window.r=res
console.log(res)