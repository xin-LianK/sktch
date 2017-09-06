var sketch = angular.module('sketch',[]);
sketch.controller('sketchController', ['$scope',function($scope){
	$scope.wh = [600,600];
	$scope.tool = 'rect';
	$scope.tools = {
		'画线':'line',
		'画圆':'arc',
		'矩形':'rect',
		'铅笔':'pen',
		'橡皮':'erase',
		'选择':'select'
	};
	$scope.csState = {
		fillStyle:'#000000',
		strokeStyle:'#000000',
		lineWidth:1,
		style:'stroke'
	};

	$scope.setStyle = function(s) {
		$scope.csState.style = s;
	}
	$scope.setTool = function(s) {
		$scope.tool = s;
	}
	$scope.newSketch = function(ev){
		if(history.length){
			if( confirm('是否保存') ){
        ev.srcElement.href=canvas.toDataURL();
        ev.srcElement.download = 'mypic.png';
			}else{
        ev.preventDefault();
      }
		}
		clearCanvas();
	}
	$scope.save = function(ev){
		if(history.length){
			ev.srcElement.href=canvas.toDataURL();
			ev.srcElement.download = 'mypic.png';
		}else{
			alert('空画布');
		}
	}

  $scope.undo = function (ev) {
    ev.stopPropagation();
    clearCanvas();
    history.pop();
    if(history.length){
      ctx.putImageData(history[history.length-1],0,0);
		}
  }

	var
	canvas = document.querySelector('#canvas'),
	ctx = canvas.getContext('2d'),
  history = [];

	var clearCanvas = function() {
		ctx.clearRect(0,0,$scope.wh[0],$scope.wh[1]);
	}
  var redrawLastHistory = function () {
    if( history.length ){
      ctx.putImageData(history[history.length-1],0,0);
    }
  }
	var setmousemove = {
		line:function (e) {
			canvas.onmousemove = function(ev) {
				clearCanvas();
        redrawLastHistory();
				ctx.beginPath();
				ctx.moveTo(e.offsetX,e.offsetY);
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		rect:function(e) {
			canvas.onmousemove = function(ev) {
				clearCanvas();
        redrawLastHistory();
				ctx.beginPath();
				var w = ev.offsetX - e.offsetX;
				var h = ev.offsetY - e.offsetY;
				if($scope.csState.style == 'fill'){
					ctx.fillRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				}else{
					ctx.strokeRect(e.offsetX-0.5,e.offsetY-0.5,w,h);
				}
			}
		},
		arc:function(e) {
			canvas.onmousemove = function(ev) {
				clearCanvas();
        redrawLastHistory();
				ctx.beginPath();
				var r = Math.abs(e.offsetX - ev.offsetX);
				ctx.arc(e.offsetX,e.offsetY,r,0,Math.PI*2);
				if($scope.csState.style == 'fill'){
					ctx.fill();
				}else{
					ctx.stroke();
				}
			}
		},
		erase:function(e) {
			canvas.onmousemove = function(ev){
				ctx.clearRect(ev.offsetX,ev.offsetY,20,20);
			}
		},
		pen:function(e) {
			ctx.beginPath();
			ctx.moveTo(e.offsetX,e.offsetY);
			canvas.onmousemove = function(ev) {
				clearCanvas();
        redrawLastHistory();
				ctx.lineTo(ev.offsetX,ev.offsetY);
				ctx.stroke();
			}
		},
		select:function(e) {
			console.log('select');
		}
	}

	canvas.onmousedown = function(e) {
		ctx.strokeStyle = $scope.csState.strokeStyle;
		ctx.fillStyle   = $scope.csState.fillStyle;
		ctx.lineWidth   = $scope.csState.lineWidth;

		setmousemove[$scope.tool](e);
		document.onmouseup = function() {
			canvas.onmousemove = null;
      history.push( ctx.getImageData(0, 0, $scope.wh[0], $scope.wh[1]) );
		}
	}

}])
