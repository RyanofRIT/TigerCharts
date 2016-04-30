

//Sizes for the Top Employers Graph
var width = "100%",
    height = 100,
    textHeight = 50,
    titleHeight = 50,
    subtitleHeight = 20,
    barWidth = 50,
    barOffset = 5,
    padding = 10;

//List of all Top Employers
var topEmployersObjList = [];

d3.csv("dataset.csv", function(error,data){
    if (error) throw error;
    
    //tableObj[objKey]: Employer, value: Occurrences, plans: list of {tableObj[objKey]: Plan, value: Occurences}
    var tableObj = {};
    //Object containing the top tableObj's
    var topEmployersObj = {};
    var firstObj = "firstObj";
    var secondObj = "secondObj";
    var thirdObj = "thirdObj";
    var fourthObj = "fourthObj";
    var fifthObj = "fifthObj";
    
    //Counts the occurances of each plan at a company and adds it to the tableObj
    data.forEach(function(d){
        if (tableObj[d.Employer] == null){
            tableObj[d.Employer] = {};
            tableObj[d.Employer].name = d.Employer;
            tableObj[d.Employer].value = 1;
            tableObj[d.Employer][d.Plan] = 1;
        } else {
            tableObj[d.Employer].value++;
            if (tableObj[d.Employer][d.Plan] == null){
                tableObj[d.Employer][d.Plan] = 1;
            } else {
                tableObj[d.Employer][d.Plan]++;
            }
        }
    });
    
    //A simple compare function to sort from greatest to least
    function compare (a, b){
        if (a.value < b.value)
            return 1;
        else if (a.value > b.value)
            return -1;
        else
            return 0;
    }
    
    //Adds all employers in the tableObj to the topEmployersObjList and sotrs it
    for(var key in tableObj){
        topEmployersObjList.push(tableObj[key]);
    }
    topEmployersObjList.sort(compare);
    
    console.log(topEmployersObjList[0]);
    
    //Create the div for the tooltip
    var div = d3.select("body").append("div")	
        .attr("class", "tooltip")				
        .style("opacity", 0);
    
    //Loop over the top x number of employers and create their graphs
    var i = 0;
    while(i < 5){
        //The data array that will be passed to d3 to iterate over easily
        var tempArray = [];
        //Iterate over all elements in the i'th topEmployersObj
        //The object has a 'plan', a 'value', and a number of plans such as 'SOFTENG-BS'
        for(var plan in topEmployersObjList[i]){
            if (plan != "value" && plan != "name"){
                //The object that will have a 'plan' and a 'value'
                var rowObj = {};
                rowObj.plan = plan;
                rowObj.value = topEmployersObjList[i][plan];
                //Add this object to the Array of plan objects
                tempArray.push(rowObj);
            }
        }
        //Sort the Array of plan objects greatest to least
        tempArray.sort(compare);
        
        var svg = d3.select('#chart_top_employers')
            .append('svg')
                .attr('width', width)
                .attr('height', titleHeight);
                svg.append('text')
                    .attr('x', barOffset)
                    .attr('y', titleHeight - subtitleHeight - padding)
                    .attr('font-family','sans-serif')
                    .attr('font-size','30')
                    .text(function(d){
                        return topEmployersObjList[i].name;
                    });
                svg.append('text')
                    .attr('x', padding*4)
                    .attr('y', titleHeight - padding)
                    .attr('font-family','sans-serif')
                    .attr('font-size','12')
                    .text(function(d){
                        return "Total: " + topEmployersObjList[i].value;
                    });
        d3.select('#chart_top_employers')
            .append('svg')
                .attr('width', width)
                .attr('height', height)
                .style('background', '#C9D7D6')
                .selectAll('rect').data(tempArray)
                .enter().append('rect')
                    .style('fill', '#C61C6F')
                    .attr('width', barWidth)
                    .attr('height', function(d){
                        return d.value;
                    })
                    .attr('x', function(d,i){
                        return i * (barWidth + barOffset);
                    })
                    .attr('y', function(d){
                        return height - d.value;
                    })
                    .on('mouseover',function(d){
                        div.transition()
                            .duration(100)
                            .style('opacity',.9);
                        div.html(d.plan + ": " + d.value + "<br/>")
                            .style('left', (d3.event.pageX) + "px")
                            .style('top', (d3.event.pageY - 28) + "px");
                    })
                    .on("mouseout", function(d) {		
                        div.transition()		
                            .duration(500)		
                            .style("opacity", 0);	
                    });
        d3.select('#chart_top_employers')
            .append('svg')
                .attr('width',width)
                .attr('height', textHeight)
                .selectAll('text').data(tempArray)
                .enter().append('text')
                    .attr('x', function(d,i){
                        return i * (barWidth + barOffset);
                    })
                    .text(function(d){
                        return d.plan;
                    })
                    .attr('font-family','sans-serif')
                    .attr('font-size','8px')
                    .attr('fill','black')
        
        i++;
    }     
});
    