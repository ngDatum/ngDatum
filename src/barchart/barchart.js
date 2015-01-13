angular.module('ngDatum')
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
    


    margin.left   = customMargins.left   || 30;
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

    var minYLabel = d3.min(scope.dataSet, function(d){ return d[yItems]; });
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
              .attr('class', 'x axis')
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
                                  .attr('class', 'y axis')
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
                            .attr('class', 'bobby')
                            .style('position', 'absolute')
                            .style('z-index', '10')
                            .style('visibility', 'hidden')
                            .html('a SIMPLE tooltip');

        bars.on("mouseover", function(d, i){
          tooltip.html('<strong>'+d[xItems] +'<br>'+ d[yItems]+'</strong>');
          return tooltip.style("visibility", "visible");
        })
        .on("mousemove", function(){ return tooltip.style("top", (event.pageY-12)+"px").style("left",(event.pageX+12)+"px");})
        .on("mouseout",  function(){ return tooltip.style("visibility", "hidden");});
      };


      //BAR appearance animations (only one per)
      var fancyBarAnim = ['bounceUp', 'bounceDown', 'grow'];

      //use default bar animation if they dont have any bar animations listed in the attribute
      //that collide with our fancyBarAnim list a couple lines above here
      fancyFunks.defaultVis = function(){
        var useDefaultVis = fanciness.every(function(elem){
          if(fancyBarAnim.indexOf(elem) === -1) return true;
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
            .duration(function(d,i){
              return parseInt(i + '00' );
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


    

    //OLD TOOLTIP
        

    //create tooltip and correlating event handlers
    // var tooltip = d3.select(element[0]).append('div')
    //     .attr('class', 'tooltip')
    //     .style('opacity', 0);


    // bars.on('mouseover', function(d){
    //   tooltip.transition()
    //      .duration(200)
    //      .style('opacity', .9)

    //   tooltip.html('<strong>'+d[xItems] +'</strong><br>'+ d[yItems])
    //          .style('left', (d3.event.pageX) + 'px')
    //          .style('top', (d3.event.pageY - 28) + 'px')
    // })

    // bars.on('mouseout', function(d){
    //   tooltip.transition()
    //           .duration(500)
    //           .style('opacity',0)
    // })

        

    


    
                  
    


  }//end link()
  
  

  return {
    restrict: 'E',
    scope: { dataSet:'=data', margins:'=', size:'=', labels:'=', timeformat:'='},
    link: link
  };
});