// chart.js

angular.module('nd', []);
angular.module('nd')
.directive('ndBarchart', function() {
  function tlate(x, y){return 'translate(' + x + ',' + y + ')';}
  function clog(x){console.log(x);}

  function link(scope, element, attr) {

    var fanciness = [];
    if(attr.fanciness){
      fanciness = attr.fanciness.split(',').map(function(val){ return val.trim(); });
    }




    //ADJUST FONT DYNAMICALLY
    var simpleDates = {
      'short': '%b-%d',
      'med':   '%b-%d \'%y',
      'long':  ''
    };

    //time formats
    //time formatting choosing time.scale
    var customMargins = scope.margins || {};
    var customSize    = scope.size    || {};
    var labels        = scope.labels  || {};
    var margin        = {};


    //TODO: figure out how to make this flexible
    //for CSV/TSV
    var xItems = labels.x || 'NEED X LABEL';
    var yItems = labels.y || 'NEED Y LABEL';
    


    margin.left   = customMargins.left   || 35;
    margin.right  = customMargins.right  || 30;
    margin.top    = customMargins.top    || 50;
    margin.bottom = customMargins.bottom || 55; //can handle "long date"
    

    var width  = (customSize.width  || 800) - margin.left - margin.right;
    var height = (customSize.height || 400) - margin.top  - margin.bottom;




    //figure out how to manage different time formats
    //unix time, check for existence of string length and a dash?
    if(scope.timeformat){
      var temp = scope.timeformat.format;
      var timeformat = (simpleDates[temp]) ? simpleDates[temp] : temp;
      var format = d3.time.format(timeformat);
      scope.dataSet.forEach(function(element){
          element[xItems] = format(new Date(element[xItems]));
      });
    }


    var xScale = d3.scale.ordinal()
        .domain(scope.dataSet.map(function(val){ return val[xItems]; }))
        .rangeBands([0, width], 0.1);

    // var minYLabel = d3.min(scope.dataSet, function(d){ return d[yItems]; });
    var minYLabel = 0;
    var maxYLabel = d3.max(scope.dataSet, function(d){ return d[yItems]; });
    //shouldnt make this min - max on y scale default,
    //should give option to be 0 - max on y scale
    var yScale = d3.scale.linear() 
        .domain([
          minYLabel, 
          maxYLabel
        ])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient('bottom');



    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left');






    //SVG
    var svg = d3.select(element[0]).append('svg')
        .attr('width',  width  + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('class', 'svgContainer');


    //INNER SPACE on SVG
    var innerSpace = svg.append('g')
        .attr('transform', tlate(margin.left, margin.top))
        .attr('class', 'innerSpace');
    
  

    //X AXIS TEXT
    innerSpace.append('g')
              .attr('transform', tlate(0, height))
              .attr('class', 'nd-barchart-xaxis')
              .call(xAxis)
              .selectAll('text')
                  .style('text-anchor', 'end')
                  .attr('dx', '-.8em')
                  .attr('dy', '.30em')
                  .attr('font-size', 11)
                  .attr('transform', function(d){ return 'rotate(-45)'; });
                  //potentially only need rotation if the words are too big
                  //leave by default? dynamically check?

    //Y AXIS LEGEND TEXT
    var yAxisLegend = innerSpace.append('g')
                                  .attr('class', 'nd-barchart-yaxis')
                                  .call(yAxis)
                                  .append('text')
                                      .attr('y', -4)
                                      .attr('dy', '.61em')
                                      .attr('transform', 'rotate(-90)')
                                      .style('text-anchor', 'end')
                                      .style('fill', 'slategrey')
                                      // .attr('font-size', 22)
                                      .text(yItems.charAt(0).toUpperCase() + yItems.slice(1));
                                      //simple in that it uses the property on the object
                                      //but is limiting in that doesnt have custom name outside
                                      //of this option for the y label

    //BARS
    var bars = innerSpace.selectAll('.bar')
              .data(scope.dataSet)
              .enter().append('rect')
                  .attr('class', 'bar')
                  .attr('x', xScale(0))
                  .attr('y', yScale(0))
                  .attr('height', 0);





      ///////////////////////////////////////////////////////////////////////////////////
      //FANCINESS FOR BARS
      ///////////////////////////////////////////////////////////////////////////////////
      

      //TODO remove repeatability
      fanciness.push('defaultVis'); //in case they dont have any BAR appearance animations
      var fancyFunks = {};


      //BAR simple appearance
      fancyFunks.emphasizeLow = function(){
        bars.style('opacity', function(d){ return 1 - (0.5 * d[yItems] / maxYLabel); });
      };
      fancyFunks.emphasizeHigh = function(){
        bars.style('opacity', function(d){ return 0.5 + (0.5 * d[yItems] / maxYLabel); });
      };
      fancyFunks.tip = function(){
        var tooltip = d3.select(element[0]).append('div')
                            .attr('class', 'nd-tooltip');

        bars.on("mouseover", function(d, i){
          tooltip.html('<strong>'+d[xItems] +'</strong><br>'+ d[yItems]);
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(){ return tooltip.style("top", (event.pageY-12)+"px").style("left",(event.pageX+12)+"px");})
        .on("mouseout",  function(){ return tooltip.style("visibility", "hidden");});
      };


      //BAR appearance animations (only one per)
      var fancyBarAnim = ['bounceUp', 'bounceDown', 'grow', 'stepGrow'];

      //use default bar animation if they dont have any bar animations listed in the attribute
      //that collide with our fancyBarAnim list a couple lines above here
      fancyFunks.defaultVis = function(){
        var useDefaultVis = fanciness.every(function(elem){
          if(fancyBarAnim.indexOf(elem) === -1) { return true; }
        });
        
        if(useDefaultVis){
          bars.attr('x', function(d){ return xScale(d[xItems]); })
            .attr('y', function(d){ return yScale(d[yItems]); })
            .attr('width', xScale.rangeBand())
            .attr('height', function(d){ return height - yScale(d[yItems]); });
        }
      };

      fancyFunks.bounceUp = function(){
        bars.transition()
              .attr('x', function(d,i){ return xScale(d[xItems]); })
              .attr('y', function(d,i){ return yScale(d[yItems]); })
              .duration(2000)
              .delay(50)
              .ease('elastic')
              .attr('width', xScale.rangeBand())
              .attr('height', function(d){ return height - yScale(d[yItems]); });
      };

      fancyFunks.grow = function(){
        bars.transition()
            .duration(1000)
            .attr('x', function(d,i){ return xScale(d[xItems]); })
            .attr('y', function(d,i){ return yScale(d[yItems]); })
            .attr('width', xScale.rangeBand())
            .attr('height', function(d){ return height - yScale(d[yItems]); });
      };

      //prototype NOT TESTED
      fancyFunks.stepGrow = function(){
        bars.transition()
            .duration(function(d,i,b){
              //at least 1 second, the rest is for the next
              return 1100 + ((i / scope.dataSet.length) * 1800) ;
            })
            .attr('x', function(d,i){ return xScale(d[xItems]); })
            .attr('y', function(d,i){ return yScale(d[yItems]); })
            .attr('width', xScale.rangeBand())
            .attr('height', function(d){ return height - yScale(d[yItems]); });
      };

      


      //activate given fanciness options
      fanciness.forEach(function(val){
        fancyFunks[val]();
      });




  }//end link()
  
  

  return {
    restrict: 'E',
    scope: { dataSet:'=data', margins:'=', size:'=', labels:'=', timeformat:'='},
    link: link
  };
});
/* 
  TODO:
  - make a directive
  - make configurable
  - update comments
*/
angular.module('nd')
.directive('ndDonutchart', function() {
  function link(scope, element, attr){
    // var dataset = [
    //   { label: 'Abulia', count: 10 }, 
    //   { label: 'Betelgeuse', count: 20 },
    //   { label: 'Cantaloupe', count: 30 },
    //   { label: 'Dijkstra', count: 40 }
    // ];

    var customMargins = scope.margins || {};
    var customSize    = scope.size    || {};
    var labels        = scope.labels  || {};
    var margin        = {};


    // chart dimensions
    var width  = customSize.width  || 360;
    var height = customSize.height || 360;
    var radius = Math.min(width, height) / 2;
    var donutWidth = 75;

    // set colorscheme
    var color = d3.scale.category20b();
    // Alternative
    // var color = d3.scale.ordinal()
    //   .range(['#A60F2B', '#648C85', '#B3F2C9', '#528C18', '#C3F25C']); 

    var svg = d3.select(element[0])
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', 'translate(' + (width/2) + ',' + (height/2) + ')');

    var arc = d3.svg.arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

    var pie = d3.layout.pie()
      .value(function(d) {return d.count; })
      .sort(null);

    var path = svg.selectAll('path')
      .data(pie(scope.dataSet))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', function(d, i){
        return color(d.data.label);
      });

    // setup legend
    var legendRectSize = 18;
    var legendSpacing = 4;

    var legend = svg.selectAll('.legend')
      .data(color.domain())
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', function(d,i){
        var height = legendRectSize + legendSpacing;
        var offset = height * color.domain().length /2;
        var horz =  -2 * legendRectSize;
        var vert =  i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
      });

    legend.append('rect')
     .attr('width', legendRectSize)
     .attr('height', legendRectSize)
     .style('fill', color)
     .style('stroke', color);

    legend.append('text')
      .attr('x', legendRectSize + legendSpacing)
      .attr('y', legendRectSize - legendSpacing)
      .text(function(d) {return d;});

    }//end link()

    return {
      restrict: 'E',
      scope: { dataSet:'=data', margins:'=', size:'=', labels:'=', timeformat:'='},
      link: link
    };


});
angular.module('nd')
.directive('ndLinechart', function(){
  function tlate(x, y){ return 'translate(' + x + ',' + y + ')'; }
  function clog(x){console.log(x);}

  function link(scope, element, attr){
    var margin, width, height, parseDate, xScale, yScale, xAxis, yAxis, valueLine, nextDay,
        dataSet2, dataSet3, dataSet4, innerSpace, labels, xItems, yItems, customMargins, customSize;

    //time formats
    //time formatting choosing time.scale
    customMargins = scope.margins || {};
    customSize    = scope.size    || {};
    labels        = scope.labels  || {};
    margin        = {};

    margin.left   = customMargins.left   || 35;
    margin.right  = customMargins.right  || 30;
    margin.top    = customMargins.top    || 50;
    margin.bottom = customMargins.bottom || 55; //can handle "long date"


    width  = (customSize.width  || 800) - margin.left - margin.right;
    height = (customSize.height || 400) - margin.top  - margin.bottom;

    xScale = d3.time.scale().range([0,width]);
    yScale = d3.scale.linear().range([height, 0]);

    labels = scope.labels  || {};
    xItems = labels.x || 'NEED X LABEL';
    yItems = labels.y || 'NEED Y LABEL';

    xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .tickFormat(d3.time.format('%b-%d'));


    yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left');
     

    valueLine = d3.svg.line()
                        .x(function(d){return xScale(d[xItems]);})
                        .y(function(d){return yScale(d[yItems]);});


    innerSpace = d3.select(element[0])
                    .append('svg')
                            .attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                            .attr('class', 'nd-linechart')
                            .attr('transform', tlate(margin.left, margin.top) );

    //find minimum day
    //find maximum day

    //scale the range of the data for the innerSpace
    xScale.domain( d3.extent(scope.dataSet, function(d){ return d[xItems]; }) );
    yScale.domain( [0, d3.max(scope.dataSet, function(d){ return d[yItems]; })] );


    innerSpace.append('path')
                .attr('class', 'valueline')
                .attr('d', valueLine(scope.dataSet));

    innerSpace.append('g')
                .attr('class', 'xaxis')
                .attr('transform', tlate(0, height))
                .call(xAxis)
                .selectAll('text')
                    .style('text-anchor', 'end')
                    .attr('dx', '-.8em')
                    .attr('dy', '.15em')
                    .attr('transform', function(d){ return 'rotate(-65)'; });

    innerSpace.append('g')
                .attr('class', 'yaxis')
                .call(yAxis);


  }

  return {
    restrict: 'E',
    scope: { dataSet:'=data', margins:'=', size:'=', labels:'=', timeformat:'='},
    link:     link
  };
});
angular.module('nd')
.directive('ndMultilinechart', function(){
  function tlate(x, y){ return 'translate(' + x + ',' + y + ')'; }
  function clog(x){console.log(x);}

  function link(scope, element, attr){
    var margin, width, height, parseDate, xScale, yScale, xAxis, yAxis, valueLine, nextDay,
         innerSpace, labels, xItems, yItems, customMargins, customSize, legends, color, legendSpace;




    //time formats
    //time formatting choosing time.scale
    customMargins = scope.margins || {};
    customSize    = scope.size    || {};
    labels        = scope.labels  || {};
    margin        = {};

    margin.left   = customMargins.left   || 50;
    margin.right  = customMargins.right  || 20;
    margin.top    = customMargins.top    || 30;
    margin.bottom = customMargins.bottom || 110; //can handle "long date"


    color = d3.scale.category10();

    width  = (customSize.width  || 800) - margin.left - margin.right;
    height = (customSize.height || 400) - margin.top  - margin.bottom;

    legendSpace = width / scope.dataSet.length;
    legends = attr.legends.split(',').map(function(elem){ return elem.trim(); });

    xScale = d3.time.scale().range([0,width]);
    yScale = d3.scale.linear().range([height, 0]);

    labels = scope.labels  || {};
    xItems = labels.x || 'NEED X LABEL';
    yItems = labels.y || 'NEED Y LABEL';

    xAxis = d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    // .ticks(20)
                    .tickFormat(d3.time.format('%b-%d'));


    yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left');
     

    valueLine = d3.svg.line()
                        .interpolate('monotone')
                        .x(function(d){ return xScale(d[xItems]); })
                        .y(function(d){ return yScale(d[yItems]); });


    innerSpace = d3.select(element[0])
                    .append('svg')
                            .attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom)
                    .append('g')
                            .attr('class', 'nd-multilinechart')
                            .attr('transform', tlate(margin.left, margin.top) );

    //find minimum day
    //find maximum day


    //grid lines
    function makeXAxis(){
        return d3.svg.axis()
                    .scale(xScale)
                    .orient('bottom')
                    .ticks(5);
    }

    function makeYAxis(){
        return d3.svg.axis()
                    .scale(yScale)
                    .orient('left')
                    .ticks(5);
    }



    //scale the range of the data for the innerSpace
    function maxOfMultipleDataSets(){
        var max = Number.NEGATIVE_INFINITY;
        scope.dataSet.forEach(function(ds){
            max = Math.max(max, d3.max(ds, function(d){ return d[yItems]; }) );
        });
        return max;
    }



    //DEFINE DOMAIN ON SCALES
    xScale.domain( d3.extent(scope.dataSet[0], function(d){ return d[xItems]; }) );
    yScale.domain( [0, maxOfMultipleDataSets()] );





    //ADD LINES AND THEIR LEGEND
    scope.dataSet.forEach(function(ds, index, arrOfDs){

        //SINGLE LINE
        innerSpace.append('path')
                .attr('class', 'valueline')
                .attr('d', valueLine(ds))
                .attr('id', 'tag' + legends[index])
                .style('stroke', color(index));

        //LEGEND w/clickable hide/show
        innerSpace.append('text')
                .attr('x', (legendSpace/2) + (index * legendSpace) )
                .attr('y', height + (margin.bottom/1.5))
                .attr('class', 'legend')
                .style('fill', function(){ return color(index); })
                .on('click', function(){
                    // Determine if current line is visible
                    var active =  ds.active ? false : true;
                    newOpacity = active ? 0 : 1;
                    //Hide or show the elements based on the ID and remove spaces
                    d3.select('#tag' + legends[index])
                        .transition().duration(100)
                        .style('opacity', newOpacity);

                    ds.active = active;                   
                })
                .text(legends[index]);
    });
    




    //X AXIS
    innerSpace.append('g')
                .attr('class', 'xaxis')
                .attr('transform', tlate(0, height))
                .call(xAxis)
                .selectAll('text')
                    .style('text-anchor', 'end')
                    .attr('dx', '-.8em')
                    .attr('dy', '.15em')
                    .attr('transform', function(d){ return 'rotate(-35)'; });

    //Y AXIS
    innerSpace.append('g')
                .attr('class', 'yaxis')
                .call(yAxis);

    //GRID LINES
    innerSpace.append('g')
                .attr('class', 'grid')
                .attr('transform', tlate(0, height))
                .style('fill', 'red')
                .call(makeXAxis()
                        .tickSize(-height, 0, 0)
                        .tickFormat('')
                );

    innerSpace.append('g')
                .attr('class', 'grid')
                .call(makeYAxis()
                        .tickSize(-width, 0, 0)
                        .tickFormat('')
                );









  }//end link()

  return {
    restrict: 'E',
    scope: { dataSet:'=data', margins:'=', size:'=', labels:'=', timeformat:'='},
    link:     link
  };
});