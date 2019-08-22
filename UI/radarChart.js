// The Dreamcatcher Function - edyta.p.bogucka
// Inspired by & reused the code of: mthh - 2017, alangrafu, Nadieh Bremer

const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const HALF_PI = Math.PI / 2;

var RadarChart = function RadarChart(parent_selector, data, options) {
	// Wraps SVG text
	const wrap = (text, width) => {
	  text.each(function() {
			var text = d3.select(this),
				words = text.text().split(/\s+/).reverse(),
				word,
				line = [],
				lineNumber = 0,
				lineHeight = 1.4, // ems
				y = text.attr("y"),
				x = text.attr("x"),
				dy = parseFloat(text.attr("dy")),
				tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

			while (word = words.pop()) {
			  line.push(word);
			  tspan.text(line.join(" "));
			  if (tspan.node().getComputedTextLength() > width) {
					line.pop();
					tspan.text(line.join(" "));
					line = [word];
					tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
			  }
			}
	  });
	}
    
	const cfg = {
	 w: 220,				//Width of the circle
	 h: 220,				//Height of the circle
	 margin: {top: 39, right: 95, bottom: 40, left: 175}, //The margins of the SVG
	 levels: 1,				//How many levels or inner circles should there be drawn
	 maxValue: 0, 			//What is the value that the biggest circle will represent
	 labelFactor: 1.31, 	//How much farther than the radius of the outer circle should the labels be placed
	 wrapWidth: 60, 		//The number of pixels after which a label needs to be given a new line
	 opacityArea: 0.7, 	    //The opacity of the area of the blob
	 dotRadius: 4.25, 		//The size of the colored circles of each blog
	 opacityCircles: 0.1, 	//The opacity of the circles of each blob
	 strokeWidth: 0.1, 		//The width of the stroke around each blob
	 roundStrokes: true,	//If true the area and stroke will follow a round path (cardinal-closed)
	 format: '.2%',
	 unit: '',
	 legend: false
	};

	// Put all of the options into a variable called cfg
	if('undefined' !== typeof options){
	  for(var i in options){
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; }
	  }
	}

	// If the supplied maxValue is smaller than the actual one replace by the max in the data
	let maxValue = 0;
	for (let j=0; j < data.length; j++) {
		for (let i = 0; i < data[j].axes.length; i++) {
			data[j].axes[i]['id'] = data[j].name;
			if (data[j].axes[i]['value'] > maxValue) {
				maxValue = data[j].axes[i]['value'];
			}
		}
	}
	maxValue = max(cfg.maxValue, maxValue);

	const allAxis = data[0].axes.map((i, j) => i.axis),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format(cfg.format),			 	//Formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

	//Scale for the radius
	const rScale = d3.scaleLinear()
		.range([0, radius])
		.domain([0, maxValue]);

	/////////////////////////////////
	// Create the container SVG and g 
    /////////////////////////////////

	const parent = d3.select(parent_selector);

	//Remove whatever chart with the same id/class was present before
	parent.select("svg").remove();

	//Initiate the radar chart SVG
	let svg = parent.append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar");

	//Append a g element
	let g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");

	/////////////////////////
	// Draw the Circular grid
	/////////////////////////
    
	//Wrapper for the grid & axes
	let axisGrid = g.append("g").attr("class", "axisWrapper");

	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", d => radius / cfg.levels * d)
		.style("fill", "#ffffff")
		.style("stroke", "white")
        .style("stroke-width", 6) // stroke of the internal circles
		.style("fill-opacity", cfg.opacityCircles);


	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
    
    let beadColor = "gold"
    let beadStrokeColor = "white"
    let smallBeadStrokeWidth = 1.75

	// Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
    
    // Append the net pattern
    var patternSpreadFactor = _currentPattern.patternSpreadFactor;
    var patternShiftFactor = _currentPattern.patternShiftFactor;
    var patternStartFactor = _currentPattern.patternStartFactor;
    
    let netStrokeWidth = 1

    let net = axis.append("path")
        .attr("d", function(d,i){ 
        // define a path of the net
        let bottom = {x : (rScale(maxValue*patternStartFactor) * cos(angleSlice * i - HALF_PI)), y : (rScale(maxValue* patternStartFactor) * sin(angleSlice * i - HALF_PI))};
        let top = {x : (rScale(maxValue*1) * cos(angleSlice * i - HALF_PI)), y : (rScale(maxValue* 1) * sin(angleSlice * i - HALF_PI))};
        let ctrlLeft = {x : (rScale(maxValue*patternSpreadFactor) * cos(angleSlice * i - HALF_PI - patternShiftFactor)), y: (rScale(maxValue* patternSpreadFactor) * sin(angleSlice * i - HALF_PI - patternShiftFactor))};       
        let ctrlRight = {x : (rScale(maxValue*patternSpreadFactor) * cos(angleSlice * i - HALF_PI + patternShiftFactor)), y: (rScale(maxValue* patternSpreadFactor) * sin(angleSlice * i - HALF_PI + patternShiftFactor))};
        let path = 
                `M${bottom.x} ${bottom.y} 
                Q ${ctrlLeft.x} ${ctrlLeft.y}, ${top.x} ${top.y} 
                Q ${ctrlRight.x} ${ctrlRight.y} ${bottom.x} ${bottom.y}, 
                Z`;
        return path;
        })
		.attr("class", "net")
		.style("stroke", "white")
        .style("fill", "none")
		.style("stroke-width", netStrokeWidth); // stroke of the net pattern 
    
	// Append the axes of the data
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", (d, i) => (rScale(maxValue*1) * cos(angleSlice * i - HALF_PI)))
		.attr("y2", (d, i) => (rScale(maxValue* 1) * sin(angleSlice * i - HALF_PI)))
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", 4); // stroke of the radial lines of axes
    
    // Append and style the lines of the hanging strings
    let stringStrokeWidth = 3
    let stringStrokeDasharray = 3
    let stringColor = "white"
    
	let hangingStrings = axis.append("line")
		.attr("x1", (d, i) => rScale(maxValue *1) * cos(angleSlice * i - HALF_PI))
		.attr("y1", (d, i) => rScale(maxValue* 1) * sin(angleSlice * i - HALF_PI))
        .attr("x2", (d, i) => rScale(maxValue *1) * cos(angleSlice * i - HALF_PI))
		.attr("y2", 180)
		.attr("class", "line")
        .attr("stroke-opacity", 0.7)
		.style("stroke", function(d,i){
            if (i == 6) {
                return stringColor;}
            if (i == 4) {
                return stringColor;} 
            if (i == 2) {
                return stringColor;} 
            else {
                return "none";
            }})
        .style("stroke-dasharray", stringStrokeDasharray)
		.style("stroke-width", stringStrokeWidth); // stroke of the radial line
    
    hangingStrings = axis.append("line")
		.attr("x1", (d, i) => rScale(maxValue * 0.75) * cos(angleSlice * i - HALF_PI))
		.attr("y1", (d, i) => rScale(maxValue * 1.25) * sin(angleSlice * i - HALF_PI))
        .attr("x2", (d, i) => rScale(maxValue * 0.75) * cos(angleSlice * i - HALF_PI))
		.attr("y2", 150)
		.attr("class", "line")
        .attr("stroke-opacity", 0.7)
		.style("stroke", function(d,i){
            if (i == 5) {
                return stringColor;} 
            if (i == 3) {
                return stringColor;} 
            else {
                return "none";
            }})
        .style("stroke-dasharray", stringStrokeDasharray)
		.style("stroke-width", stringStrokeWidth); // stroke of the radial line
    
    // Append colorful beads at the end of each axis
    let beads = axis.append("circle")
		.attr("cx", (d, i) => rScale(maxValue *1) * cos(angleSlice * i - HALF_PI))
		.attr("cy", (d, i) => rScale(maxValue* 1) * sin(angleSlice * i - HALF_PI))
        .attr("r", 7)
		.style("fill", function(d,i){
            if (i == 7) {
                return beadColor;}
            if (i == 6) {
                return beadColor;}
            if (i == 5) {
                return beadColor;}
            if (i == 4) {
                return beadColor;} 
            if (i == 3) {
                return beadColor;} 
            if (i == 2) {
                return beadColor;} 
            if (i == 1) {
                return beadColor;} 
            if (i == 0) {
                return beadColor;}
            else {
                return "none";
            }})
        .style("stroke", function(d,i){
                return beadStrokeColor;
            })
		.style("stroke-width", "2px"); // stroke of the radial line 
    
    beads
            .on("mouseover", function(d){
                d3.select(this)
                    .style("stroke-width", 6)
            })
            .on("mouseout", function(){
                d3.select(this)
                    .transition()
                    .style("stroke-width", 3)
            })
            .append("svg:title")
            .text(function(d,i){
                if (i == 7) {
                    return "The number of fictional or dead characters divided by the number of all characters";} 
                if (i == 6) {
                    return "The proportion of female characters within all characters in a dream";} 
                if (i == 5) {
                    return "The proportion of male characters within all characters in a dream";}
                if (i == 4) {
                    return "The share of friends within all characters in a dream";} 
                if (i == 3) {
                    return "The number of animal characters divided by the number of all characters";} 
                if (i == 2) {
                    return "The number of aggressive interactions divided by the total number of interactions in the dream";} 
                if (i == 1) {
                    return "The ratio between the number of negative emotions and the total number of emotions expressed in the dream";} 
                if (i == 0) {
                    return "The share of family members within all characters in a dream";} 
                else {
                    return "none";
                }});
    $('#beads').css('stroke-alignment','outer');

	// Append the labels at each axis
	let legend = axis.append("text")
		.attr("class", "legend")
		.style("font-size", "10px")
        .attr("fill", "white")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", (d,i) => rScale(maxValue * cfg.labelFactor) * cos(angleSlice * i - HALF_PI))
		.attr("y", (d,i) => rScale(maxValue * cfg.labelFactor) * sin(angleSlice * i - HALF_PI))
		.text(d => d)
		.call(wrap, cfg.wrapWidth)

	/////////////////////////////
	// Draw the radar chart blobs
	/////////////////////////////

	// The radial line function
	const radarLine = d3.radialLine()
		.curve(d3.curveLinearClosed)
		.radius(d => rScale(d.value))
		.angle((d,i) => i * angleSlice);

	if(cfg.roundStrokes) {
		radarLine.curve(d3.curveCardinalClosed)
	}

	// Create a wrapper for the blobs
	const blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
    
	// Append the backgrounds
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", d => radarLine(d.axes))
		//.style("fill", (d,i) => cfg.color(i))
        .style("fill", data[0].color)
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function(d, i) {
			//Dim all blobs
			parent.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1);
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);
		})
		.on('mouseout', () => {
			// Bring back all blobs
			parent.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});

	// Create the outlines
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d.axes); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", (d,i) => cfg.color(i))
        .style("stroke", data[0].color)
		.style("fill", "none");
    
	// Append the circles
	blobWrapper.selectAll(".radarCircle")
		.data(d => d.axes)
		.enter()
		.append("circle")
		.attr("class", "radarCircle")
		.attr("r", cfg.dotRadius)
		.attr("cx", (d,i) => rScale(d.value) * cos(angleSlice * i - HALF_PI))
		.attr("cy", (d,i) => rScale(d.value) * sin(angleSlice * i - HALF_PI))
		.style("fill", data[0].color)
        .style("stroke", beadStrokeColor)
        .style("stroke-width", smallBeadStrokeWidth)
		.style("fill-opacity", 1);
}



