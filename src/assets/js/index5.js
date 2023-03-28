function profits() {

	var options = {
		series: [{
			name: "Total profits",
			data: [15, 18, 12, 14, 10, 15, 12, 14, 10, 15, 7, 14],
			type: 'line',
		},{
			name: "Total amount",
			data: [10, 14, 10, 20, 07, 14, 15, 20, 10, 15, 7, 14],
			type: 'area',
		}],
		chart: {
			height: 385,
			width: '100%',
			zoom: {
				enabled: false
			},
			redrawOnWindowResize: true
		},
		colors: [myVarVal,  hexToRgba(myVarVal, 0.15)],
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: 'smooth',
			width: 3
		},
		xaxis: {
			categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
		},
		yaxis: {
			min: 0,
			max: 30,
			tickAmount: 5
		},
		grid: {
			show: true,
			borderColor: '#f3f3f3',
		},
		legend: {
			position: 'top'
		}
	};

	document.querySelector("#profits").innerHTML = '';
	var chart = new ApexCharts(document.querySelector("#profits"), options);
	chart.render();
	
}

function leads() {

	var options = {
		series: [{
			name: 'leads',
			data: [200, 109, 350]
		}],
		chart: {
			height: 230,
			type: 'bar',
			toolbar: {
				show: false
			},
			width: '100%'
		},
		colors: [myVarVal, '#0099ff', '#21C44C'],
		plotOptions: {
			bar: {
				borderRadius: 7,
				columnWidth: '30%',
				dataLabels: {
					position: 'top'
				},
				distributed: true
			}
		},
		dataLabels: {
			enabled: true,
			formatter: function (val) {
				return val + "k";
			},
			offsetY: -20,
			style: {
				fontSize: '12px',
				colors: ["#a3a9ad"]
			}
		},
		legend: {
			show: false
		},
		grid: {
			show: true,
			borderColor: '#f3f3f3',
		},
		xaxis: {
			categories: ["Campaign", "Email", "Direct"],
			position: 'bottom',
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false
			},
			tooltip: {
				enabled: true,
			}
		},
		yaxis: {
			axisBorder: {
				show: false
			},
			axisTicks: {
				show: false,
			},
			labels: {
				show: false,
				formatter: function (val) {
					return val + "k";
				}
			}
		}
	};

	document.querySelector("#leads").innerHTML = '';
	var chart = new ApexCharts(document.querySelector("#leads"), options);
	chart.render();
}