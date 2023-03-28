$(function(e) {

	// area chart 2
	var ctx = document.getElementById( "AreaChart2" );
	var myChart = new Chart( ctx, {
		type: 'line',
		data: {
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			type: 'line',
			datasets: [{
				data: [30, 35, 52, 47, 79, 69, 100],
				label: 'Sessions',
				backgroundColor: 'rgba(0, 153, 255, 0.1)',
				borderColor: 'rgba(0, 153, 255,0.2)',
				fill: true,
				borderWidth: '1',
				pointBorderColor: 'transparent',
				pointBackgroundColor: 'transparent',
				lineTension: 0.3,
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				intersect: false,
				mode: 'index',
			},
			scales: {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						display: false
					}
				},
				tooltip: {
					enabled: true
				}			
			},
		}
	} );
	
	// area chart 3
	var ctx = document.getElementById( "AreaChart3" );
	var myChart = new Chart( ctx, {
		type: 'line',
		data: {
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			type: 'line',
			datasets: [{
				data: [30, 45, 40, 77, 59, 72, 100],
				label: 'Sessions',
				backgroundColor: 'rgba(237, 49, 76, 0.1)',
				borderColor: 'rgba(237, 49, 76,0.2)',
				fill: true,
				borderWidth: '1',
				pointBorderColor: 'transparent',
				pointBackgroundColor: 'transparent',
				lineTension: 0.3,
				
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				intersect: false,
				mode: 'index',
			},
			scales: {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						display: false
					}
				},
				tooltip: {
					enabled: true
				}			
			},
		}
	} );

	// area chart 4
	var ctx = document.getElementById( "AreaChart4" );
	var myChart = new Chart( ctx, {
		type: 'line',
		data: {
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			type: 'line',
			datasets: [{
				data: [30, 45, 32, 67, 89, 72, 150],
				label: 'Sessions',
				backgroundColor: 'rgba(42, 169, 36, 0.1)',
				borderColor: 'rgba(42, 169, 36,0.2)',
				fill: true,
				borderWidth: '1',
				pointBorderColor: 'transparent',
				pointBackgroundColor: 'transparent',
				lineTension: 0.3,
				
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				intersect: false,
				mode: 'index',
			},
			scales: {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						display: false
					}
				},
				tooltip: {
					enabled: true
				}			
			},
		}
	} );

	// circle 2
	$('#circle2').circleProgress({
		value: 0.5,
		size: 55,
		lineCap: 'round',
		fill: {
			color: ["#0099ff"]
		}
	})
	.on('circle-animation-progress', function (event, progress) {
		$(this).find('strong').html(Math.round(50 * progress) + '<i>%</i>');
	});

	// circle 3
	$('#circle3').circleProgress({
		value: 0.85,
		size: 55,
		lineCap: 'round',
		fill: {
			color: ["#ff1a1a"]
		}
	})
	.on('circle-animation-progress', function (event, progress) {
		$(this).find('strong').html(Math.round(85 * progress) + '<i>%</i>');
	});

	// datatable
	$('#product').DataTable();

	// Select2 
	$('.select2').select2({
		minimumResultsForSearch: Infinity,
	});

});

function index1() {
	/*----AreaChart1----*/
	document.querySelector(".card-over-data").innerHTML = '<canvas id="AreaChart1" class="overflow-hidden"></canvas>';
	var ctx = document.getElementById( "AreaChart1" );
	var myChart = new Chart( ctx, {
		type: 'line',
		data: {
			labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
			type: 'line',
			datasets: [{
				data: [30, 45, 35, 57, 80, 72, 100],
				label: 'Sessions',
				backgroundColor: hexToRgba(myVarVal, 0.1),
				borderColor: hexToRgba(myVarVal, 0.2),
				fill: true,
				borderWidth: '1',
				pointBorderColor: 'transparent',
				pointBackgroundColor: 'transparent',
				lineTension: 0.3,
			}]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				intersect: false,
				mode: 'index',
			},
			scales: {
				x: {
					display: false,
				},
				y: {
					display: false,
				},
			},
			plugins: {
				legend: {
					display: false,
					labels: {
						display: false
					}
				},
				tooltip: {
					enabled: true
				}			
			}
		}
	} );
	/*----End AreaChart1----*/
}

function salesStats() {

	var options = {
		series: [{
			name: 'Orders',
			type: 'column',
			data: [53, 31, 42, 37, 23, 60, 47, 30, 35, 32, 47, 23]
		}, {
			name: 'Profits',
			type: 'line',
			data: [40, 35, 46, 40, 55, 45, 54, 50, 43, 66, 40, 55]
		}, {
			name: 'Sales',
			type: 'area',
			data: [74, 60, 77, 68, 52, 80, 73, 64, 85, 63, 77, 62]
		}],
		chart: {
			height: 285,
			type: 'line',
			stacked: false,
			toolbar: {
				show: false
			},
			redrawOnWindowResize: true
		},
		stroke: {
			width: [0, 2, 2],
			curve: 'smooth',
			dashArray: [0, 5, 0]
		},
		plotOptions: {
			bar: {
				columnWidth: '15%',
				borderRadius: 3,
			}
		},
		colors: [myVarVal, hexToRgba(myVarVal, 0.7), 'rgba(0, 153, 255, 0.1)'],
		labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		markers: {
			size: 0
		},
		xaxis: {
			type: 'month',
		},
		yaxis: {
			min: 0,
			max: 100,
			tickAmount: 10																				
		},
		grid: {
			show: false
		},
		legend: {
			position: 'top',
			markers: {
				width: 12,
				height: 12,
				radius: 2,
			},
		},
		tooltip: {
			shared: true,
			intersect: false,
			y: {
				formatter: function (y) {
					if (typeof y !== "undefined") {
						return y.toFixed(0) + " $";
					}
					return y;
				}
			}
		}
	};

	document.querySelector("#salesStats").innerHTML = '';
	var chart = new ApexCharts(document.querySelector("#salesStats"), options);
	chart.render();
}

function customerStats() {

	var options = {
		series: [{
			name: 'New Customers',
			data: [31, 40, 78, 51, 92, 65, 90],
		}, {
			name: 'Existing Customers',
			data: [50, 34, 45, 82, 34, 52, 41],
		}],
		chart: {
			height: 280,
			type: 'line',
			toolbar: {
				show: false
			}
		},
		colors: [myVarVal, 'rgba(0, 153, 255, 0.1)' ],
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth',
			width: [3, 3],
		},
		tooltip: {
			show: true
		},
		xaxis: {
			categories: [2016, 2017, 2018, 2019, 2020, 2021, 2022],
		},
		yaxis: {
			min: 0,
			max: 100,
			tickAmount: 5
		},
		grid: {
			show: true,
			borderColor: '#f3f3f3',
		},
		legend: {
			show: false,
			position: 'top'
		}

	};

	document.querySelector("#customerStats").innerHTML = '';
	var chart = new ApexCharts(document.querySelector("#customerStats"), options);
	chart.render();

}

function circle() {

	$('#circle1').circleProgress({
		value: 0.65,
		size: 55,
		lineCap: 'round',
		fill: {
			color: [myVarVal]
		}
	})
	.on('circle-animation-progress', function (event, progress) {
		$(this).find('strong').html(Math.round(65 * progress) + '<i>%</i>');
	});

}

function newusers() {
	var options = {
		series: [{
			name: 'New Users',
			data: [19, 15, 25, 18, 16, 14, 17]
		}],
		chart: {
			height: 70,
			type: 'bar',
			width: '100%',
			toolbar: {
				show: false
			}
		},
		colors: [myVarVal],
		plotOptions: {
			bar: {
				columnWidth: '20%',
				distributed: true,
				borderRadius: 2,
				colors: {
					ranges: [{
						from: 0,
						to: 24,
						color: hexToRgba(myVarVal, 0.2)
					}],
					backgroundBarColors: [],
					backgroundBarOpacity: 1,
					backgroundBarRadius: 0,
				},
			}
		},
		dataLabels: {
			enabled: false,
		},
		legend: {
			show: false
		},
		xaxis: {
			show: false,
			labels: {
				style: {
					colors: [myVarVal],
					fontSize: '12px'
				},
				show: false
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			}
		},
		yaxis: {
			show: false
		},
		grid: {
			show: false
		}
	};

	  document.querySelector("#newusers").innerHTML = '';
	  var chart = new ApexCharts(document.querySelector("#newusers"), options);
	  chart.render();
}