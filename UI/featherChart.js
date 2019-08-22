// Call our functions on window load event
window.onload = function(){
    setup(_default_data);
    $('#description_right').css('display','none');
    $('#radarChart').css('visibility','hidden');
    $('#questionPersona').css('display','none');
    $('#showHints').css('display','none');
    $('#showMethods').css('display','none');
    $('#showAbout').css('display','none');
    $('.button_persona').css('display','none');  
}

// Global variables
var _vis;
const PATTERNS = {
    start : { 
        patternSpreadFactor : 0,
        patternShiftFactor : 0,
        patternStartFactor : 0},
    horseplayer : { 
        patternSpreadFactor : 1.2, 
        patternShiftFactor : 196.9970544332369,
        patternStartFactor : 0.1 },
    artist : { 
        patternSpreadFactor : 2.0, 
        patternShiftFactor : 140.33127724323603,
        patternStartFactor : 0.1 },
    blind : { 
        patternSpreadFactor : 1.0, 
        patternShiftFactor : 74.4093,
        patternStartFactor : 0.0 },
    izzy : { 
        patternSpreadFactor : 2.0, 
        patternShiftFactor : 7.6917123523586755,
        patternStartFactor : 0.2 },
    brides : { 
        patternSpreadFactor : 1.5, 
        patternShiftFactor : 632.5460507088995,
        patternStartFactor : 0.1 },
    businessman : { 
        patternSpreadFactor : 2.0, 
        patternShiftFactor : 193.13986790807132,
        patternStartFactor : 0.3 },
    warvet : { 
        patternSpreadFactor : 1.5, 
        patternShiftFactor : 102.81708342412371,
        patternStartFactor : 0.3 },   
};
var _currentPattern = PATTERNS.start;

// Function setup: sets up our visualization environment. You can change the code to not have static paths and element ID's
// function setup(){
function setup(path){
    _vis = new DreamVis();
    _vis.width = d3.select("#vis").attr("width");
    _vis.height = d3.select("#vis").attr("height");
    _vis.svgContainer = d3.select("#vis");
    _vis.svgContainer.selectAll("*")
        .remove();
    _vis.radarChart = d3.select(".radarWrapper");
    _vis.radarChart.selectAll("*")
        .remove();
    updateDreamDescription();
    loadData(path);
}

// Function loadData: loads data from a given CSV file path/url. @param path is a string location of the CSV data file
function loadData(path){
    // call D3's loading function for CSV and load the data to our global variable _data
    d3.csv(path).then(function(data){ //
        _vis.data = data;  // _data = data;
        _vis.createFeathers();
    });
}

/**
 * Constructor function for a Visualization that displays data as "dreams"
 * @param data (not required) the data array to visualize
 * @constructor
 */
var DreamVis = function(data){
    this.data = data;
    this.width;
    this.height;
    this.svgContainer;

    this.FEATHER_WIDTH = 55;    // width for each feather in the visualization
    this.FEATHER_HEIGHT = 55;   // height for each feather in the visualization
    this.feathers; // groups of svg containing svg shapes that form a "feather"
    
    // here comes the color magic
    /**
     * Function that creates all of the small multiple feathers in the visualization
     */
    this.createFeathers = function(){
        let _this = this;               // save the context of the visualization object
        let max_num_of_dreams = 120; // max number of dreams hanging on the strings
        let dreams_on_string1 = 20;  // = max_num_of_dreams/something
        let dreams_on_string2 = 25;
        let dreams_on_string3 = 30;
        let dreams_on_string4 = 25;
        let dreams_on_string5 = 20;
        let x1 = 0;
        let x2 = 50;
        let x3 = 107;
        let x4 = 155;
        let x5 = 220;
        let compression_string1 = 9 // spacing in pixels between each feather
        let compression_string2 = 10
        let compression_string3 = 9
        let compression_string4 = 10
        let compression_string5 = 9
        
        this.feathers = this.svgContainer.selectAll("g") // create an SVG:g element per item in our dataset; stack of the groups that will make a skeleton for 3 hanging strings
            .data(this.data)
            .enter()
            .append("g")
            .style("isolation", "isolate")
            .style("mix-blend-mode", "overlay")
            .attr("width", this.FEATHER_WIDTH)
            .attr("height", this.FEATHER_HEIGHT)
            .attr("transform", function(d, i){
                let x = x1
                let y = (i* compression_string1);
                let s1 = 1
                let s2 = 1
                if (i >= dreams_on_string1 && i <= (dreams_on_string1+dreams_on_string2)){
                    x = x2;
                    y = (i - dreams_on_string1) * compression_string2;
                    //y = (i);
                } if (i > (dreams_on_string1 + dreams_on_string2)){
                    x = x3;
                    y = (i - dreams_on_string1 - dreams_on_string2) * compression_string3;      
                } if (i > (dreams_on_string1 + dreams_on_string2 + dreams_on_string3)){
                    x = x4;
                    y = (i - dreams_on_string1 - dreams_on_string2 - dreams_on_string3) * compression_string4;      
                } if (i > (dreams_on_string1 + dreams_on_string2 + dreams_on_string3 + dreams_on_string4)){
                    x = x5;
                    y = (i - dreams_on_string1 - dreams_on_string2 - dreams_on_string3 - dreams_on_string4) * compression_string5;      
                }
                // scale factor
                if (d["representative"] == 1){
                    s1 = 1.55;
                    s2 = 1.55;
                } else {
                    s1 = 1;
                    s2 = 1;
                }
                return `translate(${x}, ${y}) scale(${s1}, ${s2})`;})
        
        // Returns a random integer between min (include) and max (include)
        // Returns a random integer between min (include) and max (include)
        // Math.floor(Math.random() * (max - min + 1)) + min;
        
        var randomPosition = function (){
            return Math.floor(Math.random() * (_this.FEATHER_HEIGHT/2 + 1))  +  _this.FEATHER_HEIGHT * 0.5
            }
        var feather_start = {x : x1 + _this.FEATHER_WIDTH/2, y : this.FEATHER_HEIGHT*0.6} // y : randomPosition()
            
        // defines the single feather - 
        let feather = this.feathers.append("path")
            .attr("d", function(d){                
                // define a path of the petal 
                let ctrl1 = {x : feather_start.x * 1.19, y: feather_start.y * 1.56, x1: feather_start.x * 1.125, y1: feather_start.x * 1.31 };
                let top = {x : feather_start.x * 1.78, y : feather_start.y * 1.9375, x1 : feather_start.x * 1.28, y1 : feather_start.y * 1.91};            
                let ctrl2 = {x : feather_start.x * 1.125, y: feather_start.y * 1.15, x1: feather_start.x * 2, y1: feather_start.x * 1.53 };
                let ctrl3 = {x : feather_start.x * 1.53, y: feather_start.y * 1.625, x1: feather_start.x * 1.34, y1: feather_start.x * 0.937 };
                let ctrl4 = {x : feather_start.x * 1.06, y: feather_start.y * 1.09, x1: feather_start.x * 1.28, y1: feather_start.x * 0.5 };
                /**    
                * M (x,y) - moves pen to specified point x,y without drawing
                * Q (x1,y1 x,y) - draws a quadratic Bezier curve from current pen point to x,y. x1,y1 is the control point controlling how the curve bends
                * Z - closes the path by drawing a line from current point to first point
                */           
                
                // template literals are introdued by ${} sign
                let path = 
                `M${feather_start.x} ${feather_start.y} 
                Q ${ctrl1.x1} ${ctrl1.y1}, ${ctrl1.x} ${ctrl1.y} 
                Q ${top.x1} ${top.y1} ${top.x} ${top.y}, 
                Q ${ctrl2.x1} ${ctrl2.y1} ${ctrl2.x} ${ctrl2.y},
                L ${ctrl3.x} ${ctrl3.y},
                L ${ctrl4.x} ${ctrl4.y}, 
                Z`;
                return path; 
                })
            .attr("transform", function(d, i){
            // Angles to the left are in range (61 - 10)
            let anglesLeft = Math.floor(Math.random() * 52) + 10;
            //let anglesLeft = Math.floor(Math.random() * 81);
        
            // Angles to the right are in range ((-80) - (-10))
            let anglesRight = Math.floor(Math.random() * 71) - 80;        
        
            // randomize rotation angle
            let randomAngleLeft = function (){
                return Math.random() * anglesLeft
            }
        
            let randomAngleRight = function (){
                return Math.random() * anglesRight
            }    
            
            if (i % 2 == 0){
                x = feather_start.x;
                y = feather_start.y;
                a = randomAngleLeft();
            } else {
                x = feather_start.x;
                y = feather_start.y;   
                a = randomAngleRight();
            }
            return `rotate(${a}, ${x}, ${y})`;})
            .style("opacity", function(d){
                let o = 0.1;
                if (d["representative"] == 1){
                    o = 1;
                } else {
                    o = 0.75;
                }
                return o;
            })
            .style("stroke-alignment", 'outer')
            .style("stroke-width", function(d){
                let s = 1;
                if (d["representative"] == 1){
                    s = 1.5;
                } else {
                    s = 0.8;
                }
                return s;
            }) 
                
            .style("fill", function(d){
                return getColor("dream_category",d);
            })
            
            .style("stroke", function(d){
                //return getStrokeColor("p_healthy",d);
                if (d["representative"] == 1){
                    return "white";
                } else {
                    return getStrokeColor("dream_category",d);
                }  
            });
        
        feather
            .filter(function(d) { return d.representative == 0 })
            .style("z-index", "-1");
        
        feather
            .filter(function(d) { return d.representative == 1 })
            .style("z-index", "100")
            .on("click", function(d){
                updateDreamDescription(d);
                let color = d3.select(this).style("fill");
                let newData = getObjForRadarChart(d, color);
                let radarChart = RadarChart(".radarChart", [newData], radarChartOptions); // 
                })
            .on("mouseover", function(d){
                d3.select(this).raise()
                    .style("stroke-width", 4)
                    .style("opacity", 1);
            })
            .on("mouseout", function(d){
                d3.select(this)
                    .style("stroke-width", 1.5);
            });
            

        
        let stringStrokeDasharray = 3
        let stringStrokeWidth = 3
        
        let points1 = [[x1 + _this.FEATHER_WIDTH/2-2.5, 0],[x1 + _this.FEATHER_WIDTH/2-2, 10], [x1 + _this.FEATHER_WIDTH/2, 25],  [_this.FEATHER_WIDTH * 0.95, 80], [x1 + _this.FEATHER_WIDTH/4, 125], [x1 + 50, 200], [x1 + _this.FEATHER_WIDTH/2 - 10, dreams_on_string1 * 11]]; 
        
        let points2 = [[x2+ _this.FEATHER_WIDTH/2 - 1, 0], [x2+ _this.FEATHER_WIDTH/2 - 1, 5], [x2+ _this.FEATHER_WIDTH/2 - 12, 45], [x2+ _this.FEATHER_WIDTH/2, 60], [x2 + _this.FEATHER_WIDTH/2 + 10, 90], [x2 + _this.FEATHER_WIDTH/2 - 10, 125], [x2 + _this.FEATHER_WIDTH/2 + 20, 180], [x2 + _this.FEATHER_WIDTH/2 - 10, 230], [x2 + _this.FEATHER_WIDTH/2 + 15, dreams_on_string2 * 11]];  
        
        let points3 = [[x3 + _this.FEATHER_WIDTH/2+1, 0], [x3+ _this.FEATHER_WIDTH/2, 45], [x3 + _this.FEATHER_WIDTH/2 + 30, 80], [x3 + _this.FEATHER_WIDTH/2 - 10, 125], [x3 + _this.FEATHER_WIDTH/2 + 30, 180], [x3 + _this.FEATHER_WIDTH/2 - 10, 240], [x3 + _this.FEATHER_WIDTH/2 + 30, 300], [x3 + _this.FEATHER_WIDTH/2, dreams_on_string3 * 10.5]];   
        let points4 = [[x4 + _this.FEATHER_WIDTH/2+ 11, 0], [x4 + _this.FEATHER_WIDTH/2+ 15, 30], [x4+ _this.FEATHER_WIDTH/2, 50], [x4 + _this.FEATHER_WIDTH/2 - 10, 80], [x4 + _this.FEATHER_WIDTH/2 + 40, 125], [x4 + _this.FEATHER_WIDTH/2 - 15, 180], [x4 + _this.FEATHER_WIDTH/2 + 40, 220],  [x4 + _this.FEATHER_WIDTH/2 + 10, dreams_on_string4 * 11]]; 
        
        let points5 = [[x5 + _this.FEATHER_WIDTH/2-2, 0], [x5 + _this.FEATHER_WIDTH/2, 25],  [x5 + 10, 80], [x5 + _this.FEATHER_WIDTH, 125], [x5 - _this.FEATHER_WIDTH/4 + _this.FEATHER_WIDTH/2, 180], [x5 + _this.FEATHER_WIDTH, dreams_on_string5 * 11]]; 
                  
        let lineGenerator = d3.line()
            //.curve(d3.curveNatural);
            //.curve(d3.curveMonotoneX); //different curve shapes are possible
            .curve(d3.curveBasis);
        
        let pathData1 = lineGenerator(points1);
        let pathData2 = lineGenerator(points2);
        let pathData3 = lineGenerator(points3);
        let pathData4 = lineGenerator(points4);
        let pathData5 = lineGenerator(points5);
        
       let catcherString1 = this.svgContainer.append("path")
            .attr("d", pathData1)
            .style("stroke-width", stringStrokeWidth)
            .attr("fill", "none")
            .style("stroke", "white")
            .style("stroke-dasharray", stringStrokeDasharray)
            .style("opacity", 0.8);
        
        let catcherString2 = this.svgContainer.append("path")
            .attr("d", pathData2)
            .attr("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", stringStrokeWidth)
            .style("stroke-dasharray", stringStrokeDasharray)
            .style("opacity", 0.8);
        
        let catcherString3 = this.svgContainer.append("path")
            .attr("d", pathData3)
            .attr("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", stringStrokeWidth)
            .style("stroke-dasharray", stringStrokeDasharray)
            .style("opacity", 0.8);

        let catcherString4 = this.svgContainer.append("path")
            .attr("d", pathData4)
            .attr("fill", "none")
            .style("stroke", "white")
            .style("stroke-width", stringStrokeWidth)
            .style("stroke-dasharray", stringStrokeDasharray)
            //.style("isolation", "isolate")
            //.attr("mix-blend-mode", "multiply")
            .style("opacity", 0.8);         
        
        let catcherString5 = this.svgContainer.append("path")
            .attr("d", pathData5)
            .style("stroke-width", stringStrokeWidth)
            .attr("fill", "none")
            .style("stroke", "white")
            .style("stroke-dasharray", stringStrokeDasharray)
            .style("opacity", 0.8);
        
        var jsonCircles = [
            { "x_axis": x1 + _this.FEATHER_WIDTH/2-2, "y_axis": 6, "radius": 3, "color" : "white" },
            { "x_axis": x1 + _this.FEATHER_WIDTH/2, "y_axis": 15, "radius": 5, "color" : "white"},
            { "x_axis": x1 + _this.FEATHER_WIDTH/2 + 2, "y_axis": 25, "radius": 3, "color" : "white"},
            { "x_axis": x2 + _this.FEATHER_WIDTH/2 - 4, "y_axis": 17, "radius": 3, "color" : "white"},
            { "x_axis": x2 + _this.FEATHER_WIDTH/2 - 6, "y_axis": 25, "radius": 4, "color" : "white"},
            { "x_axis": x3 + _this.FEATHER_WIDTH/2 + 2, "y_axis": 6, "radius": 5, "color" : "white" },
            { "x_axis": x3 + _this.FEATHER_WIDTH/2 + 1, "y_axis": 17, "radius": 4, "color" : "white"},
            { "x_axis": x3 + _this.FEATHER_WIDTH/2 + 1, "y_axis": 26, "radius": 3, "color" : "white"},
            { "x_axis": x4 + _this.FEATHER_WIDTH/2 + 13 , "y_axis": 15, "radius": 3, "color" : "white"},
            { "x_axis": x4 + _this.FEATHER_WIDTH/2 + 13, "y_axis": 25, "radius": 5, "color" : "white"},
            { "x_axis": x5 + _this.FEATHER_WIDTH/2 - 1 , "y_axis": 7, "radius": 3, "color" : "white"},
            { "x_axis": x5 + _this.FEATHER_WIDTH/2 - 1, "y_axis": 16, "radius": 4.5, "color" : "white"},
            { "x_axis": x5 + _this.FEATHER_WIDTH/2 - 2, "y_axis": 25, "radius": 3, "color" : "white"}   
        ];
        
        let smallBeads = this.svgContainer.selectAll("circle")
            .data(jsonCircles)
            .enter()
            .append("circle");
        
        var circleAttributes = smallBeads
            .attr("cx", function (d) { return d.x_axis; })
            .attr("cy", function (d) { return d.y_axis; })
            .attr("r", function (d) { return d.radius; })
            .style("fill", function(d) { return d.color; });     
    }
};

function getObjForRadarChart(data, color){
    let scale = d3.scaleLinear()
        .domain([0,1])
        .range([10,100]);
    let radarObj = { name: data["dream_id"],
					axes: [
                        {axis: 'Family members', value: scale(parseFloat(data["Family"]))},
                        {axis: 'Negative emotions', value: scale(parseFloat(data["NegativeEmotions"]))},
                        {axis: 'Aggressive interactions', value: scale(parseFloat(data["Aggression"]))},
						{axis: 'Animals', value: scale(parseFloat(data["Animal"]))},
						{axis: 'Friends', value: scale(parseFloat(data["Friends"]))},
                        {axis: 'Male characters', value: scale(parseFloat(data["Male"]))},
                        {axis: 'Female characters', value: scale(parseFloat(data["Female"]))},
                        {axis: 'Imaginary beings', value: scale(parseFloat(data["Dead&Imaginary"]))}
					],color: color
				};
    return radarObj;
}

function getColor (selector, data){
    let scale = d3.scaleOrdinal()
        .domain([1,2,3,4])
        .range(["crimson","darkorange","gold","Chartreuse"]);
    return scale(parseFloat(data[selector]));   
}

function getStrokeColor (selector, data){
    let scale = d3.scaleOrdinal()
        .domain([1,2,3,4])
        .range(["Firebrick","chocolate","goldenrod","limegreen"]);
    return scale(parseFloat(data[selector])); 
}

function startExploration (){
    $('.button_persona').css('display','block');
    $('#questionPersona').css('display','block');
    $('#startExploration').css('display','none');
    $('#introText').css('display','block');
    $('#showHints').css('display','block');
    $('#showMethods').css('display','block');
    $('#showAbout').css('display','block');
}

function updatePersonaDescription (description, label, dreamerName, dreamerNamePronoun){
    $('#intro').css('display','none');
    $('#showHints').css('display','block');
    $('#radarChart').css('visibility','visible');
    $("#description").text(description);
    $('#description_right').css('display','inline-block');
    $("#label").text(label);
    $("#dreamerName").text(dreamerName);
    $("#dreamerNamePronoun").text(dreamerNamePronoun);
}

function updateDreamDescription(data){
    if (!data){
        $("#dream_text").text("");
        return;
    }
    $('#dream_text').html(data['text_dream']);
    $('#intro').css('display','inline-block');
    $('#legend').css('display','block');
}

function changeRadarPattern(selector){
    _currentPattern = PATTERNS[selector];
    let radarChart = RadarChart(".radarChart", _default_data, radarChartOptions);
}


