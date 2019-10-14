let MAX_POINTS = 20;
class Point
		{
			constructor(x,y)
			{	
				this.x = x;
				this.y = y;
			}
		}

let coordinates = [new Point(100,150), new Point(200,250),  new Point(300,200)];
let array = []
let poly_size = 3;
let clipper_size = 4;
let clipper_points;
//debugger
let poly_points = [[coordinates[0].x, coordinates[0].y], [coordinates[1].x, coordinates[1].y], [coordinates[2].x, coordinates[2].y]];

function x_intersect(x1,y1,x2, y2, x3, y3, x4, y4)
{
  
	 let num = (x1*y2 - y1*x2) * (x3-x4) -  (x1-x2) * (x3*y4 - y3*x4); 
     let den = (x1-x2) * (y3-y4) - (y1-y2) * (x3-x4); 
    return Math.trunc(num/den); 
}

function y_intersect(x1,y1,x2,y2,x3,y3,x4,y4) 
{ 
    let num = (x1*y2 - y1*x2) * (y3-y4) - (y1-y2) * (x3*y4 - y3*x4); 
    let den = (x1-x2) * (y3-y4) - (y1-y2) * (x3-x4); 
    return Math.trunc(num/den); 
} 

function clip(poly_points,x1,y1,x2,y2) 
{ 
   // debugger
    let new_points=[];
    let new_poly_size = 0; 
    // (ix,iy),(kx,ky) are the co-ordinate values of 
    // the points 
    for (let i = 0; i < poly_size; i++) 
    { 
        // i and k form a line in polygon 
        let k = (i+1) % poly_size; 
        let ix = poly_points[i][0];
        let iy = poly_points[i][1]; 
        let kx = poly_points[k][0];
        let ky = poly_points[k][1]; 
  
        // Calculating position of first point (clipper line)
        let i_pos = (x2-x1) * (iy-y1) - (y2-y1) * (ix-x1); 
  
        // Calculating position of second point (clipper line)
        let k_pos = (x2-x1) * (ky-y1) - (y2-y1) * (kx-x1); 
  
        // Case 1 : When both points are inside 
        if ((i_pos < 0)  && (k_pos < 0))
        { 
            //Only second point is added 
            new_points[new_poly_size] = [];
            new_points[new_poly_size][0] = kx; 
            new_points[new_poly_size][1] = ky; 
            new_poly_size++; 
        } 
  
        // Case 2: When only first point is outside 
        else if ((i_pos >= 0)  && (k_pos < 0)) 
        { 
            // Point of intersection with edge 
            // and the second point is added
            new_points[new_poly_size] = []; 
            new_points[new_poly_size][0] = x_intersect(x1,y1, x2, y2, ix, iy, kx, ky);  //change made here
            new_points[new_poly_size][1] = y_intersect(x1,y1, x2, y2, ix, iy, kx, ky);  //change i and k
            new_poly_size++; 
  
  			new_points[new_poly_size] = []; 
            new_points[new_poly_size][0] = kx; 
            new_points[new_poly_size][1] = ky; 
            new_poly_size++; 
        } 
  
        // Case 3: When only second point is outside 
        else if ((i_pos < 0)  && (k_pos >= 0)) 
        { 
            //Only point of intersection with edge is added 
            new_points[new_poly_size] = [];
            new_points[new_poly_size][0] = x_intersect(x1,y1, x2, y2, ix, iy, kx, ky); 
            new_points[new_poly_size][1] = y_intersect(x1,y1, x2, y2, ix, iy, kx, ky); 
            new_poly_size++; 
        } 
        else
        {

        }
        // Case 4: When both points are outside 
    } 
  
    // Copying new points into original array 
    // and changing the no. of vertices 
    poly_size = new_poly_size; 
    for (let i = 0; i < poly_size; i++) 
    { 

    	poly_points[i] = [];
        poly_points[i][0] = new_points[i][0]; 
        poly_points[i][1] = new_points[i][1]; 
    } 
} 
function SuthHodgClip()
{
           // let clipper_points = [[array[0], array[1]], [array[0] + array[2], array[1]], [array[0]+array[2], array[1]+array[3]], array[0],array[1]+array[3]];
           // let poly_points = [[coordinates[0].x, coordinates[0].y], [coordinates[1].x, coordinates[1].y], [coordinates[2].x, coordinates[2].y]];
           clipper_points = [[array[0], array[1]],[array[0],array[1]+array[3]] , [array[0]+array[2], array[1]+array[3]],[array[0] + array[2], array[1]]];
                        //i and k are two consecutive indexes 
                        for (let i=0; i<clipper_size; i++) 
                        { 
                            let k = (i+1) % clipper_size; 
                      
                            // We pass the current array of vertices, it's size 
                            // and the end points of the selected clipper line 
                          
                            clip(poly_points, clipper_points[i][0],clipper_points[i][1], clipper_points[k][0], clipper_points[k][1]); 
                            for (let index = 0; index < poly_size; index++) {
                                console.log(poly_points[index][0]+" "+poly_points[index][1]);
                            }
                            console.log(" ")
                        } 
                    
             return poly_points;     
} 

function Init(canvas, context,coordinates)
{
	let i = 0;
	canvas.height = 500;
	canvas.width = 500;
	context.fillStyle ="#FF0010";//"#FF0010";
	//context.fillRect(0,0,canvas.height, canvas.width);
	
    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);

	for(let i = 1; i < coordinates.length; i++)
        context.lineTo(coordinates[i].x, coordinates[i].y);
        
    context.fill();
	context.closePath();
}

function DrawClip()
{
	let canvas = $("#draw")[0];
	let context = canvas.getContext("2d");
	canvas.height = 500;
	canvas.width = 500;
	context.fillStyle ="#FF0010";//"#FF0010";
    let result_points = SuthHodgClip();

	context.strokeRect(array[0], array[1], array[2], array[3]);
    context.beginPath();
    context.moveTo(result_points[0][0], result_points[0][1]);

	for(let i = 1; i < poly_size; i++) //draws triangle here coordinates.length
	    context.lineTo(result_points[i][0], result_points[i][1]);


    context.fill();
	context.closePath();

}

window.onload = function()
{
		let canvas = $("#frame")[0];
		let context = canvas.getContext("2d");		
		
		Init(canvas, context,coordinates);
		$("#create").on("click", createWindow);

		
		$("#clipper").on("click", DrawClip);
		function createWindow()
		{ 
			array = [];
			let inputArray = $("input");
			for(let i = 0; i < inputArray.length; i++)
			{
				let coord = $(inputArray[i]).val();
				array.push(+coord);
			}
			context.strokeRect(array[0], array[1], array[2], array[3]);
		}	
}	
