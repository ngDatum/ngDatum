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
                    .tickFormat(d3.time.format('%b-%d'));


    yAxis = d3.svg.axis()
                    .scale(yScale)
                    .orient('left');
     

    valueLine = d3.svg.line()
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





    //scale the range of the data for the innerSpace
    function maxOfMultipleDataSets(){
        var max = Number.NEGATIVE_INFINITY;
        scope.dataSet.forEach(function(ds){
            max = Math.max(max, d3.max(ds, function(d){ return d[yItems]; }) )
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
                .style('stroke', color(index))

        //LEGEND w/clickable hide/show
        innerSpace.append('text')
                .attr('x', (legendSpace/2) + (index * legendSpace) )
                .attr('y', height + 5 + (margin.bottom / 2))
                .attr('class', 'legend')
                .style('fill', function(){ return color(index); })
                .on('click', function(){
                    // Determine if current line is visible
                    var active =  ds.active ? false : true;
                    newOpacity = active ? 0 : 1;
                    //Hide or show the elements based on the ID and remove spaces
                    d3.select('#tag' + legends[index])
                        .transition().duration(100)
                        .style('opacity', newOpacity)

                    ds.active = active;                   
                })
                .text(legends[index])
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

    innerSpace.append('g')
                .attr('class', 'yaxis')
                .call(yAxis);
  }//end link()

  return {
    restrict: 'E',
    scope: { dataSet:'=data', margins:'=', size:'=', labels:'=', timeformat:'='},
    link:     link
  };
});