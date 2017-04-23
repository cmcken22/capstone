// var data = [];
// var newData = [];
// var self = this;
// self.onmessage = function (msg) {
//     console.log("DATA RECEIVED BY WORKER");
//     console.log(msg.data);
//     var object = document.getElementById('my-modalGraph-2');
//     console.log(object);
//     // data = msg.data;
//     // console.log(data);
// }

// var label = 0;
// var dataIndex = 0;
// var ts = 0;
// var addData = function(){
//     console.log('ADD DATA');
//     console.log(data[dataIndex]);
//     newData[dataIndex] = data[dataIndex++]; 
//     // if(dataIndex%50 == 0) vm.rtGraph.data.labels[dataIndex++] = ts++; 
//     // else vm.rtGraph.data.labels[dataIndex++] = ''; 
//     // vm.rtGraph.update();
//     // if(dataIndex == vm.graphData.datasets[0].data.length) vm.stop();
// };

// var i = 0;

// function timedCount() {
//     i = i + 1;
//     // console.log('called');
//     // addData();
//     postMessage(i);
//     setTimeout("timedCount()", 200);
// }
// timedCount();

//------------------------------------------------------------------------------