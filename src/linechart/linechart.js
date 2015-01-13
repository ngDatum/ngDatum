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
                        .x(function(d){return xScale(d.date);})
                        .y(function(d){return yScale(d.close);});


    innerSpace = d3.select(element[0])
                    .append('svg')
                            .attr('width', width + margin.left + margin.right)
                            .attr('height', height + margin.top + margin.bottom)
                    .append('g')
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
                .attr('class', 'x axis')
                .attr('transform', tlate(0, height))
                .call(xAxis)
                .selectAll('text')
                    .style('text-anchor', 'end')
                    .attr('dx', '-.8em')
                    .attr('dy', '.15em')
                    .attr('transform', function(d){ return 'rotate(-65)'; });

    innerSpace.append('g')
                .attr('class', 'y axis')
                .call(yAxis);


  }

  return {
    restrict: 'E',
    scope: { dataSet:'=data', margins:'=', size:'=', labels:'=', timeformat:'='},
    link:     link
  };
});