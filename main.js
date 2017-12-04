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
	if (val < 0.1) {
		return "level0";
	} else if (val >= 0.1 && val < 0.2 ) {
		return "level1";
	} else if (val>= 0.2 && val < 0.3) {
		return "level2";
	} else if (val>= 0.3 && val < 0.4) {
		return "level3";
	} else if (val>= 0.4 && val < 0.5) {
		return "level4";
	} else if (val>= 0.5 && val < 0.6) {
		return "level5";
	} else if (val>= 0.6 && val < 0.7) {
		return "level6";
	} else if (val>= 0.7 && val < 0.8) {
		return "level7";
	} else if (val>= 0.8 && val < 0.9) {
		return "level8";
	} else if (val>= 0.9 && val < 1) {
		return "level9";
	}
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
	.attr("x", function(d) {
			return d*width;
		})
	.attr("y", 0)
	.attr("width", width)
	.attr("height", height)
	.attr("fill", "black");

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

// Creating rectangles
// Remove all the spaces after comma in the csv file, otherwise it will not work
//d3.csv("trial.csv", function (error, data) {
d3.csv("LinerSvm_30.csv", function (error, data) {
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
					console.log("class= " + i + ", assignedClass= " + data[j].Assigned_Class + ", TrueClass= " + data[j].True_Class + ", tpCount = " + sumList[classStr][levelStr].tpCount + ", fpCount= " + sumList[classStr][levelStr].fpCount + ", SCore= " + data[j].Predicted_Score + ", Level= " + levelStr);
				} else {
					//False Positive
					sumList[classStr][levelStr].fpCount = sumList[classStr][levelStr].fpCount + 1;
					console.log("class= " + i + ", assignedClass= " + data[j].Assigned_Class + ", TrueClass= " + data[j].True_Class + ", tpCount = " + sumList[classStr][levelStr].tpCount + ", fpCount= " + sumList[classStr][levelStr].fpCount + ", SCore= " + data[j].Predicted_Score + ", Level= " + levelStr);
				}
			}
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
