var app = angular.module('app', ['nd'])
app.controller('MyController', ['$scope', function($scope){
  
  ///////////////////////////////////////
  //             BARCHART              //
  ///////////////////////////////////////
  $scope.dataSet = [
    {name:'Patrick',  age:95 },
    {name:'Shawn',    age:31 },
    {name:'Doug',     age:45 },
    {name:'Hayna',    age:90 },
    {name:'Bertha',   age:100},
    {name:'Charlie',  age:100},
    {name:'Brit',     age:140},
    {name:'Hammy',    age:120},
    {name:'Dwight',   age:4  },
    {name:'Brian',    age:57 },
    {name:'Bambi',    age:23 },
    {name:'Coco',     age:78 },
    {name:'Zezu',     age:65 },
    {name:'Panko',    age:105}
    
  ];

  ///////////////////////////////////////
  //             DONUTCHART            //
  ///////////////////////////////////////
  $scope.donutData = [
    { label: 'Abulia',     count: 10 }, 
    { label: 'Betelgeuse', count: 20 },
    { label: 'Cantaloupe', count: 30 },
    { label: 'Dijkstra',   count: 40 }
  ];

  ///////////////////////////////////////
  //              LINECHART            //
  ///////////////////////////////////////


  function randomClose(){
      return _.random(125, 200);
  }

  function createDataSet(){
      return [
          {date: moment('Jan 01'), close: randomClose()},
          {date: moment('Jan 02'), close: randomClose()},
          {date: moment('Jan 03'), close: randomClose()},
          {date: moment('Jan 04'), close: randomClose()},
          {date: moment('Jan 05'), close: randomClose()},
          {date: moment('Jan 06'), close: randomClose()},
          {date: moment('Jan 07'), close: randomClose()},
          {date: moment('Jan 08'), close: randomClose()},
          {date: moment('Jan 09'), close: randomClose()},
          {date: moment('Jan 10'), close: randomClose()},
          {date: moment('Jan 11'), close: randomClose()},
          {date: moment('Jan 12'), close: randomClose()},
          {date: moment('Jan 13'), close: randomClose()},
          {date: moment('Jan 14'), close: randomClose()},
          {date: moment('Jan 15'), close: randomClose()},
          {date: moment('Jan 16'), close: randomClose()},
          {date: moment('Jan 17'), close: randomClose()},
          {date: moment('Jan 18'), close: randomClose()},
          {date: moment('Jan 19'), close: randomClose()},
          {date: moment('Jan 20'), close: randomClose()},
          {date: moment('Jan 21'), close: randomClose()},
          {date: moment('Jan 22'), close: randomClose()},
          {date: moment('Jan 23'), close: randomClose()},
          {date: moment('Jan 24'), close: randomClose()},
          {date: moment('Jan 25'), close: randomClose()},
          {date: moment('Jan 26'), close: randomClose()}
      ];
  }
  

  $scope.lineData = createDataSet()


  ///////////////////////////////////////
  //           MULTILINECHART          //
  ///////////////////////////////////////

  $scope.multilineData = [
    createDataSet(),
    createDataSet(),
    createDataSet(),
    createDataSet(),
    createDataSet(),
    createDataSet()
  ];



}]);