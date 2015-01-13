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