//d3.csv("LinerSvm_30.csv", function (error, data) {
//	if (error) throw error;
//	console.log(data);
//	// Parses the csv and creates data as csvParse.
//	data.forEach(x=>console.log(x));
//})

// SVG dimensions
var height = 200;
var width = 120;

function createSvg(sel) {
	sel.append("svg")
		.attr("width", 10*width)
		.attr("height", height)
		.attr("id", "svgPlot")
};

// functions
function getPredClass (data) {
	var predictScore = 0;
	var predictClass = 0;
	for (var i=0; i<10; i++) {
		var classStr = ("C"+ i);
		console.log("classStr= " + classStr);
		console.log(classStr + "= " + data[classStr] );
		if (predictScore < data[classStr]) {
			predictScore = data[classStr];
			predictClass = i;
		}
	}
	console.log("PredictClass= " + predictClass + ", PredictScore= " + predictScore); 
	return {"predictClass": predictClass, "predictScore": predictScore};
}

// getLevel returns the level according to the predictedScore
function getLevel (val) {
	if (val <= 0.1) {
		return "level0";
	} else if (val > 0.1 && val <= 0.2 ) {
		return "level1";
	} else if (val> 0.2 && val <= 0.3) {
		return "level2";
	} else if (val> 0.3 && val <= 0.4) {
		return "level3";
	} else if (val> 0.4 && val <= 0.5) {
		return "level4";
	} else if (val> 0.5 && val <= 0.6) {
		return "level5";
	} else if (val> 0.6 && val <= 0.7) {
		return "level6";
	} else if (val> 0.7 && val <= 0.8) {
		return "level7";
	} else if (val> 0.8 && val <= 0.9) {
		return "level8";
	} else if (val> 0.9 && val <= 1) {
		return "level9";
	}
}

// getLine takes in input as the data of rectangles and gets x,y,width and height for the boxes and returns a 
// path to plot the center line

function getLine(boxData) {
	console.log("boxData= " + boxData);
	var box_x = boxData.x.baseVal.value;
	var box_y = boxData.y.baseVal.value;
	var box_width = boxData.width.baseVal.value;
	var box_height = boxData.height.baseVal.value;
	console.log("x= " + box_x + ", y= " + box_y + ", width= " + box_width + ", height= " + box_height);
	return ("M " + (box_x+(box_width/2)) + " " + box_y + " L " + (box_x+(box_width/2)) + " " + (box_y+box_height) );
}


d3.selection.prototype.callReturn = function (callable) {
	return callable(this);
};

// For creating 10 rects
var num = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];


d3.select("#linearSVM")
	.callReturn(createSvg)

// Instead of rectangles we will be appending multiple squares in place of each rect
// Creates the template to work on. creates 10 rectangles for 10 classes
d3.selectAll("#svgPlot")
	.selectAll(".rect")
	.data(num)
	.enter()
	.append("g")
	.append("rect")
	.attr("class", "rectBox")
	.attr("x", function(d) {
			return d*width;
		})
	.attr("y", 0)
	.attr("width", width)
	.attr("height", height)
	.attr("fill", "white");

// ------------------------
// Create sumList that will have the values required to make rectangles 
// sumList contains the TP, FP and FN for each class
var sumList = {}


//var C0={}
//for (var i=0; i<10; i++) {
//	//Create a list of objects
//	var str = ("level"+i);
//	C0[str] = {};
//	C0[str].tpCount = 0;
//	C0[str].fpCount = 0;
//	C0[str].fnCount = 0;
//}

// ------------------------
// Create a line in the center of each box
var box = d3.selectAll(".rectBox")._groups[0];
console.log("box= " + box.length);

d3.selectAll("#svgPlot")
	.selectAll("empty")
	.data(box)
	.enter()
	.append("g")
	.append("path")
	.attr("d", getLine)
	.attr("stroke", "black")
	.attr("stroke_width", 3);


// ------------------------

// Creating rectangles
// Remove all the spaces after comma in the csv file, otherwise it will not work
//d3.csv("trial.csv", function (error, data) {
//d3.csv("LinerSvm_30.csv", function (error, data) {
d3.csv("t_100.csv", function (error, data) {
	if (error) throw error;
	console.log(data);
	// Parses the csv and creates data as csvParse.
	data.forEach(x=>console.log(x));
	for (var i=0; i<data.length; i++) {
		//console.log("C9= " + data[i].C9);
		var predict= getPredClass(data[i]);
		console.log("## actualClass= " + data[i].True_Class + ", predictClass= " + predict.predictClass + ", PredictScore= " + predict.predictScore);
	}

	for (var i=0; i<10; i++){
		// i controls the number of class
		var classStr = "C"+i;
		sumList[classStr] = {};
		for (var j=0; j<10; j++) {
			// j controls the # of levels
			var levelStr = "level"+j;
			sumList[classStr][levelStr] = {};
			sumList[classStr][levelStr].tpCount = 0;
			sumList[classStr][levelStr].fpCount = 0;
			sumList[classStr][levelStr].fnCount = 0;
			// Create a list of data elements that are in the class levels
			sumList[classStr][levelStr].tpList = [];
			sumList[classStr][levelStr].fpList = [];
			sumList[classStr][levelStr].fnList = [];
		}
		console.log("^^^ Created " + classStr  + ", sumList= " + sumList[classStr][levelStr].tpCount);
	}

	for (var i=0; i<10; i++) {
		//i loops over the class
		console.log("Startins the tp loop");
		var classStr = "C"+i;
		for (j=0; j<data.length; j++) {
			// j loops over all data elements
			//console.log("classStr= " + classStr + ", levelStr= " + levelStr + ", assignedClass= " + data[j].Assigned_Class + ", trueClass= " + data[j].True_Class)
			var levelStr = getLevel(data[j].Predicted_Score);
			//console.log("SumList= " + sumList[classStr][levelStr].tpCount);
			if(data[j].Assigned_Class == i) {
				// iterate for data points when the predicted class is equal to 'i'
				if(data[j].Assigned_Class === data[j].True_Class) {
					//TruePositive
					sumList[classStr][levelStr].tpCount = sumList[classStr][levelStr].tpCount + 1;
					sumList[classStr][levelStr].tpList.push(data[j]);
					console.log("class= " + i + ", assignedClass= " + data[j].Assigned_Class + ", TrueClass= " + data[j].True_Class + ", tpCount = " + sumList[classStr][levelStr].tpCount + ", fpCount= " + sumList[classStr][levelStr].fpCount + ", SCore= " + data[j].Predicted_Score + ", Level= " + levelStr);
				} else {
					//False Positive
					sumList[classStr][levelStr].fpCount = sumList[classStr][levelStr].fpCount + 1;
					sumList[classStr][levelStr].fpList.push(data[j]);
					console.log("class= " + i + ", assignedClass= " + data[j].Assigned_Class + ", TrueClass= " + data[j].True_Class + ", tpCount = " + sumList[classStr][levelStr].tpCount + ", fpCount= " + sumList[classStr][levelStr].fpCount + ", SCore= " + data[j].Predicted_Score + ", Level= " + levelStr);
				}
			}
		}
	}

	// ----------------------------------------

	// Create table in body, header and tableBody
	var table = d3.select('body').append('table').attr("id", "newTable");
	var thead = table.append("thead");
	var tbody = table.append("tbody");
	
	// Array for header , contains the keys that are to be used for the data
	header = Object.keys(data[0]);
	
	// Creating the header for the table
	thead.append("tr").selectAll("th")
			.data(header)
			.enter()
			.append("th")
			.text(function(d) {
					return d;
				});
	
	var rows = tbody.selectAll('tr')
									.data(data)
									.enter()
									.append('tr')
									.attr("id", "tableRow");
	
	var cells = rows.selectAll('td')
		.data(function (row) {
			return header.map(function(column) {
				return {column: column, value: row[column]};
			});
		})
		.enter()
		.append('td')
		.text(function(d) { return d.value;} );

	// ----------------------------------------

	d3.selectAll("#tableRow")
		.on("mouseover", mouseClick)
		.on("mouseout", mouseOut);
		//.on("mousedown", mouseClick);

	//createChart 
	//createChart(6, 9, 3, 1, maxCount);

	var maxCount = getMaxCount(sumList);

	for (var i=0; i<10; i++) {
		// i loops over all classes
		for (var j=0; j<10; j++) {
			//j loops over levels in each class
			var classStr = "C"+i;
			var levelStr = "level"+j;
			createChart(i, j, sumList[classStr][levelStr].tpCount, sumList[classStr][levelStr].fpCount, maxCount);
		}
	}

	// data is actually the data to be used inside the loop now
	//d3.select("#svgPlot")
	//	.append("g")
	//	.selectAll("empty")
	//	.data(data)
	//	.enter()
	//	.append("rect")
	//	.attr("x", function(d) {
	//		console.log("C0= " + d.C0);
	//		var predict = getPredClass(d);
	//		console.log("## predictClass= " + predict.predictClass + ", PredictScore= " + predict.predictScore);
	//		return d.C0;
	//	})
})

// -------------------------------------
function mouseClick (d,i) {
	console.log("mouseCLick data = " + d.C0);
	d3.select("#svgPlot")
		.selectAll("empty")
		// Always input list to the data
		.data([d])
		.enter()
		//.exit()
		.append("g")
		.append("path")
		.attr("class", "newLine")
		.attr("d", createLine)
		.attr("fill", "none")
		.attr("stroke", "blue")
		.attr("stroke_width", 3);
}

// createLine creates lines on the svg where element is selected fromt the table
function createLine(d) {
	console.log("d in createLine = " + d);
	// height is the svg height which is globbaly defined at the top
	var yScale = d3.scaleLinear().domain([0,1]).range([height, 0]);
	console.log("-- ## -- C0 = " + yScale(d.C0));
	var y0 = yScale(d.C0);
	var y1 = yScale(d.C1);
	var y2 = yScale(d.C2);
	var y3 = yScale(d.C3);
	var y4 = yScale(d.C4);
	var y5 = yScale(d.C5);
	var y6 = yScale(d.C6);
	var y7 = yScale(d.C7);
	var y8 = yScale(d.C8);
	var y9 = yScale(d.C9);
	console.log("y1= " + y1 + ", y5= " + y5 + ", y9= " + y9);
	var x0 = 0*width + width/2;
	var x1 = 1*width + width/2;
	var x2 = 2*width + width/2;
	var x3 = 3*width + width/2;
	var x4 = 4*width + width/2;
	var x5 = 5*width + width/2;
	var x6 = 6*width + width/2;
	var x7 = 7*width + width/2;
	var x8 = 8*width + width/2;
	var x9 = 9*width + width/2;

	return ("M " + x0 + " " + y0 + " L " + x1 + " " + y1 + " L " + x2 + " " + y2
					+ " L " + x3 + " " + y4 + " L " + x5 + " " + y5 + " L " + x6 + " " + y6
					+ " L " + x7 + " " + y7 + " L " + x8 + " " + y8 + " L " + x9 + " " + y9
					+ " L " + x9 + " " + height + " L " + x0 + " " + height +" Z"
					);
}

function mouseOut() {
	d3.selectAll(".newLine")
		.attr("stroke", "grey")
}

// createChart creates the histogram on the svg
function createChart(histClass, histLevel, tpCount, fpCount, maxCount) {
	console.log("CLass= " + histClass + ", level= " + histLevel + ", tpCount= " + tpCount + ", fpCount= " + fpCount);
	var x0 = histClass*width + (width/2);
	var yScale = d3.scaleLinear().domain([9, 0]).range([0, 180]);

	var y0 = yScale(histLevel);
	//var maxCount = tpCount + fpCount;

	var xScale = d3.scaleLinear().domain([0, maxCount]).range([0, width/2]);
	var fpWidth = xScale(fpCount);
	var tpWidth = xScale(tpCount);
	console.log("--&& -- Class = " + histClass + ", level= " + histLevel + ", x0= " + x0 + ", y0= " + y0 + ", fpwidth= " + fpWidth + ", tpWidth= " + tpWidth + ", halfWidth= " + width/2 ); 

	var classId = histClass + "_" + histLevel;
	// Hist for fp 
	d3.select("#svgPlot").append("g")
		.append("rect")
		.attr("class", classId)
		.attr("x", x0)
		.attr("y", y0)
		.attr("height", "20")
		.attr("width", fpWidth)
		.attr("fill", "red");
		//.on("mousedown", chartCLick);

	// Hist for tp
	d3.select("#svgPlot").append("g")
		.append("rect")
		.attr("class", classId)
		.attr("x", x0+fpWidth)
		.attr("y", y0)
		.attr("height", "20")
		.attr("width", tpWidth)
		.attr("fill", "green");
		//.on("mousedown", chartClick);
}

function getMaxCount (sumList) {
	var countList= [];
	for (var i=0; i<10; i++) {
		//i loops over all class
		for (var j=0; j<10; j++) {
			var tp_count = 0;
			var fp_count = 0;
			var sum_count = 0;
			//j loops over all levels
			var classStr = "C"+i;
			var levelStr = "level"+j;
			var tp_count = sumList[classStr][levelStr].tpCount;
			var fp_count = sumList[classStr][levelStr].fpCount;
			var sum_count = tp_count + sum_count;
			countList.push(sum_count);
		}
	}
	return d3.max(countList);
}
