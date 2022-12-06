var load = d3.json("datav2.json").then(function(data){
    var zipData = data.data.map(d => ({
      zipCode : d[8],
      weekNum : +d[9],
      startDate : d[10],
      endDate : d[11],
      casesWeekly : +d[12],
      casestotal: +d[13],
      casesRate : +d[14],
      casesRateTotal : +d[15],
      testWeekly : +d[16],
      testTotal : +d[17],
      testRateWeekly : +d[18],
      testRateTotal : +d[19],
      percentPos : +d[20],
      percentPosTotal : +d[21],
      deathWeekly : +d[22],
      deathTotal : +d[23],
      deathRateWeekly : +d[24],
      deathRateTotal : +d[25],
      population : +d[26],
      point : d[28]
    })).filter(d => d.casesWeekly !== null && d.zipCode !== "Unknown");


    // STEP 1. Store into Set
    var zipPossible = [];
    let zipSet1 = [];
    
    // 1st filter out the data to week 1
    let week1Data = zipData.filter(d=>d.weekNum==1);

    //push the zipCodes in to the array
    week1Data.forEach(d => {
      zipPossible.push(d.zipCode);
    })

    // turn it into a set and now we have unique values.
    var setZIP = new Set(zipPossible);
    console.log(setZIP);

    // STEP 2. Create HTML checkBoxes based on all the zipCodes
    let boxes = document.querySelector("#userSelect");
    let textField = document.createElement("p");
    textField.setAttribute("id","select");
    textField.setAttribute("type","text");
    
    let btn = document.createElement("button");
    let br = document.createElement("br");
    btn.innerText = "Submit";
    
    boxes.append(textField);
    boxes.append(btn);
    boxes.append(br);
    
    let selectedZIP = [];
    
    let i = 1;
    setZIP.forEach(d =>{
      let b = document.createElement("INPUT");
      b.setAttribute("type","checkbox");
      b.setAttribute("id",d);
      
      let l = document.createElement("Label");

      b.addEventListener('change', e =>{
        if (e.target.checked){
          selectedZIP.push(e.target.id);
          var input = document.querySelector("#select");
          
          input.innerHTML = "";
          selectedZIP.forEach(d=>{
            input.innerText += " " + d
          })
          
          console.log(input);
          console.log(selectedZIP);
        }
        if (!e.target.checked) {
          selectedZIP.pop(e.target.id);
          console.log(selectedZIP);
          
          var input = document.querySelector("#select");

          input.innerHTML = "";
          selectedZIP.forEach(d=>{
            input.innerText += " " + d
          })
        }
          
      });
      
      l.innerHTML = d;
      l.setAttribute("for",d);

      
      boxes.append(b);
      boxes.append("")
      boxes.append(l);
      if (i % 5 == 0) {
        let lb = document.createElement("BR");
        boxes.append(lb);
      }
      
      i++;
    });
    

    btn.addEventListener("click", d => {
      let v1 = document.querySelector("#my_dataviz");
      v1.innerHTML = "";
      let v2 = document.querySelector("#viz2");
      v2.innerHTML = "";
      
      zipSet1 = selectedZIP;
      scatterplotCustom("d.weekNum","d.casesWeekly", x1, y1_0,"Weeks","Weekly Cases", "Chicago COVID-19 Cases Across Weeks","#my_dataviz");
      scatterplotCustom("d.weekNum","d.testWeekly", x1, y1_1,"Weeks","Weekly Tests", "Chicago COVID-19 Tests Across Weeks","#my_dataviz");
      scatterplotCustom("d.weekNum","d.deathWeekly", x1, y1_2,"Weeks","Weekly Deaths", "Chicago COVID-19 Deaths Across Weeks","#my_dataviz");
      legendScatter(zipSet1,"#my_dataviz")
  
      scatterplotCustom("d.testWeekly", "d.casesWeekly",  x1_1, y1_0, "Tests", "Cases", "Relationship Between Weekly Cases & Testing","#viz2");
      scatterplotCustom("d.testWeekly", "d.deathWeekly", x1_1, y1_2, "Tests", "Deaths", "Relationship Between Weekly Deaths & Testing","#viz2");
      barChartTest("#viz2")
    })

    

    //Defining Margins & width/height
    const margin = ({top: 10, right: 20, bottom: 50, left: 105});
    const visWidth = 400;
    const visHeight = 400;

    // ZipCodes to Map

      
    
    

    // Color Scale
    var zipColor1 = d3.scaleOrdinal().domain(zipSet1).range(d3.schemeCategory10);
    
    //x-scale
    var x1 = d3.scaleLinear()
       .domain(d3.extent(zipData, d => d.weekNum))
       .range([0,visWidth]);

    //x-scale for weekly tests
    var x1_1 = d3.scaleLinear()
         .domain(d3.extent(zipData, d => d.testWeekly))
         .range([0,visWidth]);

    // Taking from weekly cases attribute
    var y1_0 = d3.scaleLinear()
        .domain(d3.extent(zipData, d => d.casesWeekly))
       .range([visHeight,0]);

    // y-scale for weekly test
    var y1_1 = d3.scaleLinear()
         .domain(d3.extent(zipData, d => d.testWeekly))
         .range([visHeight,0]);

    // y-scale for weekly deaths
    var y1_2 = d3.scaleLinear()
         .domain(d3.extent(zipData, d => d.deathWeekly))
         .range([visHeight,0]);

    var x2 = d3.scaleLinear().domain(d3.extent(zipData, d => d.population)).range([0,visWidth]);
    var y2_0 = d3.scaleBand()
              .range([0, visHeight])
              .domain(zipSet1)
              .padding(.5); 
    
    // X-axis defintion
    var xAxis = (g, scale, label) =>
      g.attr('transform', `translate(0, ${visHeight})`)
          // add axis
          .call(d3.axisBottom(scale))
          // remove baseline
          .call(g => g.select('.domain').remove())
          // add grid lines
          // references https://observablehq.com/@d3/connected-scatterplot
          .call(g => g.selectAll('.tick line')
            .clone()
              .attr('stroke', '#d3d3d3')
              .attr('y1', -visHeight)
              .attr('y2', 0))
        // add label
        .append('text')
          .attr('x', visWidth / 2)
          .attr('y', 40)
          .attr('fill', 'black')
          .attr('text-anchor', 'middle')
          .text(label)

    var yAxis = (g, scale, label) => 
      // add axis
      g.call(d3.axisLeft(scale))
          // remove baseline
          .call(g => g.select('.domain').remove())
          // add grid lines
          // refernces https://observablehq.com/@d3/connected-scatterplot
          .call(g => g.selectAll('.tick line')
            .clone()
              .attr('stroke', '#d3d3d3')
              .attr('x1', 0)
              .attr('x2', visWidth))
        // add label
        .append('text')
          .attr('x', -40)
          .attr('y', visHeight / 2)
          .attr('fill', 'black')
          .attr('dominant-baseline', 'middle')
          .text(label)


    
    function scatterplotCustom(xVal, yVal, xScale, yScale, xLabel, yLabel, title, div) {
  // set up
  
    const svg = d3.select(div).append('svg')
        .attr('width', visWidth + margin.left + margin.right)
        .attr('height', visHeight + margin.top + margin.bottom);
    
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    // axes
    g.append("g").call(xAxis, xScale, xLabel);
    g.append("g").call(yAxis, yScale, yLabel);
  
   // Title
   svg.append("text")
      .attr("x", visWidth / 2 + 50 )
      .attr("y", 30)
      .style("font-size", "12px")
      .style("text-anchor", "middle")
      .text(title);


  // highlight logic
    const highlight = function(event,d){
      var selectZIP = d.zipCode
  
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", "lightgrey")
        .attr("r", 3)
  
      d3.selectAll("." + "p" +  selectZIP)
        .transition()
        .duration(200)
        .style("fill", d => zipColor1(selectZIP))
        .attr("r", 5)
    }

  // do not highlight logic
    const doNotHighlight = function(event,d){
      d3.selectAll(".dot")
        .transition()
        .duration(200)
        .style("fill", d => zipColor1(d.zipCode))
        .attr("r", 3 )
    }
  
    // dotplot
    // draw points
    g.selectAll("dot")
      .data(zipData.filter(d=> zipSet1.includes(d.zipCode)))
      .enter()
      .append('circle')
        .attr("class", function (d) { return "dot " + "p" + d.zipCode } )
        .attr('cx', d => xScale(eval(xVal)))
        .attr('cy', d => yScale(eval(yVal)))
        .style('fill', d =>  zipColor1(d.zipCode))
        .attr('opacity', 1)
        .attr('r', 3)
        .on("mouseover", highlight)
        .on("mouseleave",doNotHighlight);
        
    
    // return svg.node();
  }
    function legendScatter(zipArray,div) {

      // Creating SVG
      const svg = d3.select(div).append('svg')
          .attr('width', visWidth + margin.left + margin.right)
          .attr('height', visHeight + margin.top + margin.bottom);
      
      const g = svg.append('g')
          .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    
      // Creating Rectangles to show colors of ZIPs
      var size = 20
      g.selectAll("mydots")
        .data(zipArray)
        .enter()
        .append("rect")
          .attr("x", 100)
          .attr("y", function(d,i){ return 100 + i*(size+5)}) 
          .attr("width", size)
          .attr("height", size)
          .style("fill", function(d){ return zipColor1(d)})
    
      // Creating Labels for ZIPs
      g.selectAll("mylabels")
        .data(zipArray)
        .enter()
        .append("text")
          .attr("x", 100 + size*1.2)
          .attr("y", function(d,i){ return 100 + i*(size+5) + (size/2)}) 
          .style("fill", function(d){ return zipColor1(d)})
          .text(function(d){ return d})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
    
        // return svg.node();
    
    }

    function makeNewObj(data, week, value) {
      // Step 1, filter it by Week of interest  
      var weekFilter = zipData.filter(d=> d.weekNum == week) // step 1, filter by week
    
      //arrays holding the zip codes and values
      let zip = [];
      let val = [];
      let valueF = "e."+value;
      // Step 2, filtering data to only have largest value for that week for a zipCode
      weekFilter.filter(e => {
        
        const isDuplicate = zip.includes(e.zipCode);
          
        // if there is no duplicate, push it to the arrays
        if (!isDuplicate) {
          //we put both cases and the zipCode into 2 ararays
          zip.push(e.zipCode);
          val.push(eval(valueF));
          
          return true;
        } 
        if (isDuplicate){
          // logic if duplicate is found, take the one with the higher number ->
          // 1. retrieve the index of duplicate in unique ids
          // 2. go and use the same index for caseNumber
          // 3. compare that value and the current value
          // 4. if this it is larger, then replace the value
      
          // retrieve index of duplicate zip
          var idx = zip.findIndex(x=> x == e.zipCode);
      
          //now use that idx to go and retrive the value idx
          var arrVal = val[idx];
          //now compare them
          
          if (eval(valueF) > arrVal) {
            val[idx] = eval(valueF);
          }
        }
        return false;
      });
    
      //making new object
      var combineArrays = (first, second) => {
         return first.reduce((acc, val, ind) => {
            acc[val] = second[ind];
            return acc;
         }, {});
      };
      return combineArrays(zip,val)
      //now we have 2 arrays with the zips and values, 
    }

    function barChartTest(div) {
    
      // Defining and appending the SVG
      const svg = d3.select(div).append('svg')
          .attr('width', visWidth + margin.left + margin.right)
          .attr('height', visHeight + margin.top + margin.bottom);
      
      const g = svg.append('g')
          .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
      
      const x = d3.scaleBand()
        .range([ 0, visWidth ])
        .domain(zipSet1)
        .padding(0.2);
      
      svg.append("g")
        .attr("transform", `translate(50, ${visHeight})`)
        .call(d3.axisBottom(x))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
    
      let popArr = [];
      let pop = makeNewObj(zipData,1,"population");
      zipSet1.forEach( d=>{
          popArr.push(pop[d])
      })
      var maxPopulation =  Math.max.apply(Math, popArr);
    
      
      
      const y = d3.scaleLinear()
        .domain([0, maxPopulation])
        .range([ visHeight, 0]);
      
      svg.append("g")
        .attr("transform", "translate(50)")
        .call(d3.axisLeft(y));

      
      
      svg.selectAll("mybar")
      .data(zipData.filter(d=> zipSet1.includes(d.zipCode)))
      .enter()
      .append("rect")
        .attr("x", d=> x(d.zipCode))
        .attr("y", d=> y(d.population))
        .attr("transform", "translate(50)")
        .attr("width", x.bandwidth())
        .attr("height", d=> visHeight - y(d.population))
        .attr("fill", d =>  zipColor1(d.zipCode))
    
      svg.append("text")
      .attr("transform", "translate(100,0)")
       .attr("x", 50)
       .attr("y", 50)
       .attr("font-size", "20px")
       .text("Population in ZIP Code")
      
      // return svg.node();
      
    }
    
    function barchartPopulation(div) {

      // Defining SVG
      const svg = d3.select(div).append('svg')
          .attr('width', visWidth + margin.left + margin.right)
          .attr('height', visHeight + margin.top + margin.bottom);
      
      const g = svg.append('g')
          .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
      //x - axis
      svg.append("g")
        .attr("transform", `translate(0, ${visHeight})`)
        .call(d3.axisBottom(x2))
        .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end");
      
      const xAxisGroup = g.append("g")
          .attr("transform", `translate(0, ${visHeight})`);
      
      xAxisGroup.append("text")
          .attr("x", visWidth / 2 - 100)
          .attr("y", 40)
          .attr("fill", "black")
          .attr("text-anchor", "middle")
          .text("Population");
    
      
      const y_axis = d3.axisLeft(y2_0).tickSize(0);
      
      svg.append("g")
        .call(y_axis)
        .selectAll("text")
          .attr("transform", "translate(+40,-30)")
          .style("text-anchor", "end");
    
      
      
      // drawing bars
      svg.selectAll("myRect")
        .data(zipData.filter(d=> zipSet1.includes(d.zipCode)))
        .join("rect")
        .attr("x", x2(0) )
        .attr("y", d => y2_0(d.zipCode))
        .attr("width", d => x2(d.population))
        .attr("height", y2_0.bandwidth())
        .attr("fill", d =>  zipColor1(d.zipCode))
      
      // return svg.node()
    }
    
    // spatial data starts

    // Chicago projection
    
    d3.json("chicago_zipcodes.json").then(
      function(data) {
        //aquiring geojson features
        var projection = d3.geoMercator()
        .scale(visWidth * 90)
        .center([-87.6298, 41.8781])
        .translate([visWidth / 2, visHeight / 2])
        
        var geojson = topojson.feature(data, data.objects["Boundaries - ZIP Codes"]);

     
        
        //Helper function to create dictionary with key,value
        // format "zip : value" for a week
        function makeNewObj(data, week, value) {
          // Step 1, filter it by Week of interest  
          var weekFilter = zipData.filter(d=> d.weekNum == week) // step 1, filter by week
            
          //arrays holding the zip codes and values
          let zip = [];
          let val = [];
          let valueF = "e."+value;
          // Step 2, filtering data to only have largest value for that week for a zipCode
          weekFilter.filter(e => {
                
            const isDuplicate = zip.includes(e.zipCode);
                    
            // if there is no duplicate, push it to the arrays
            if (!isDuplicate) {
              //we put both cases and the zipCode into 2 ararays
              zip.push(e.zipCode);
              val.push(eval(valueF));
                    
              return true;
            } 
            if (isDuplicate){
              // logic if duplicate is found, take the one with the higher number ->
              // 1. retrieve the index of duplicate in unique ids
              // 2. go and use the same index for caseNumber
              // 3. compare that value and the current value
              // 4. if this it is larger, then replace the value
          
              // retrieve index of duplicate zip
              var idx = zip.findIndex(x=> x == e.zipCode);
          
              //now use that idx to go and retrive the value idx
              var arrVal = val[idx];
              //now compare them
              
              if (eval(valueF) > arrVal) {
                val[idx] = eval(valueF);
              }
            }
            return false;
          });
        
          //making new object
          var combineArrays = (first, second) => {
             return first.reduce((acc, val, ind) => {
                acc[val] = second[ind];
                return acc;
             }, {});
          };
          return combineArrays(zip,val)
          //now we have 2 arrays with the zips and values, 
        }

        
        // createMap(zipData,12,"casesWeekly","Weekly COVID-19 Cases")
        function createMap(data,week,value) {
          const svg = d3.select("#map").append('svg')
            .attr('width', 400 + margin.left + margin.right)
            .attr('height', 400 + margin.top + margin.bottom)
            .attr("class","topo");
          
          const g = svg.append('g')
            .attr("class","legendThreshold")
            .attr("transform", `translate(${margin.left+159}, ${margin.bottom})`);


          

          // The following are dictionaries for handling different parts 
          // of map creation based on the 'value'

          //Label for the legend
          var labelName = {
            "casesWeekly" : "Week " + week + " COVID-19 Cases",
            "deathWeekly" : "Week " + week + " COVID-19 Deaths",
            "testWeekly": "Week " + week + " COVID-19 Tests"
          };

          //Colors for the maps
          var colors = {
            "casesWeekly" : d3.schemeBlues[5],
            "deathWeekly" : d3.schemeReds[5],
            "testWeekly": d3.schemeGreens[5]
          };

          //Domains for the color scale
          var domainList= {
            "casesWeekly": [0,50,200,600],
            "deathWeekly": [0,2,5,7],
            "testWeekly": [0,1000,3000,6000]
          };

          //Legend labels
          var labelList= {
            "casesWeekly" : ['0','1-50','51-200','201-600','600+'],
            "deathWeekly" : ['0','1-2','3-5','6-7','7+'],
            "testWeekly" : ['0','1-1000','1001-3000','3001-6000','6000+']
          };

          //appending the name of the label
          g.append("text")
            .attr("class", "caption")
            .attr("x", 0)
            .attr("y", -6)
            .text(labelName[value]);

          // color scheme and scale
          var colorScheme = colors[value];
          var colorScale = d3.scaleThreshold()
            .domain(domainList[value])
            .range(colorScheme);

          // label for the ranges of the values
          var labels = labelList[value];

          
          // Create the legend based on colorScale and our labels
          var legend = d3.legendColor()
            .labels(function (d) { return labels[d.i]; })
            .shapePadding(4)
            .scale(colorScale);
          svg.select(".legendThreshold")
            .call(legend);

          // Extracting data to put on the map
          let scaleDef = makeNewObj(data,week,value);
          //****** ADDING FUNCTIONALITY******TODO

          
          
          //Coloring map based on color
          var data1,data2;
          svg.selectAll("path")
              .data(geojson.features)
              .enter()
              .append("path")
              .attr("fill", function(d, i){
                data1 = d.properties.zip;
                data2 = scaleDef[d.properties.zip]
              return colorScale(scaleDef[d.properties.zip]);
            })
              .attr("d", d3.geoPath(projection)) 
          
        }

        

        //Idea -> show these results with user being able to decide which week to pull up
        //Creating 3 maps for week 45


        document.querySelector("#maps").addEventListener("click", function() {
          createMultMaps();
        });
        
        function createMultMaps(){
          console.log("CLICK")

          document.querySelector("#map").innerHTML = "";
          
          let input = document.body.querySelector("#weekInput").value;
          
          createMap(zipData,parseInt(input),"casesWeekly");
          createMap(zipData,parseInt(input),"testWeekly");
          createMap(zipData,parseInt(input),"deathWeekly");

          console.log("CLICK END");
        }
      
        console.log("DONE");
        
        

        
        
        
        // createMap(zipData,1,"casesWeekly");
        // createMap(zipData,1,"testWeekly");
        // createMap(zipData,1,"deathWeekly");

        
      }
    );

    // We want to allow the user to be able to select which zipCodes to plot
    // 1. We need to go and store all possible ZIPs into an array.
    // 2. We need to go and create HTML checkboxes for each ZIPCode selection
    // 3. We also need to create a button that submits the data
    // 3. We need to add eventListeners for each checkbox that adds them into another array.
    
    // 4. We need to add another event listener that is attached to the button & when clicked it takes the array of selected ZIPs and passes that on to create Data.
    let options = document.querySelector("#zipOptions");
    // 1.
    let zipCodeAll = [];
    
    
  });