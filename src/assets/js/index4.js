function activeUsers() {

	var options = {
		series: [{
			name: 'New Users',
			data: [31, 40, 78, 51, 92, 65, 90],
			type: 'line',
		}, {
			name: 'Existing Users',
			data: [50, 34, 45, 82, 34, 52, 41],
            type: 'bar'
		}],
		chart: {
			height: 285,
			toolbar: {
				show: false
			}
		},
		colors: ['rgba(0, 153, 255, 0.5)', myVarVal ],
		dataLabels: {
			enabled: false
		},
        plotOptions: {
            bar: {
                columnWidth: '15%',
                borderRadius: 7,
            }
        },
		stroke: {
			curve: 'smooth',
			width: [3, 1],
            dashArray: [5, 0],
		},
		tooltip: {
			show: true
		},
		xaxis: {
			categories: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
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
			position: 'top',
            markers: {
				width: 12,
				height: 12,
				radius: 2,
			},
            itemMargin: {
                horizontal: 7,
                vertical: 2
            },
		}

	};

	document.querySelector("#active-users").innerHTML = '';
	var chart = new ApexCharts(document.querySelector("#active-users"), options);
	chart.render();

}

function devices() {
	
	var myChart2 = echarts.init(document.getElementById('devices'));
	var option2 = {
		tooltip: {
			trigger: 'item'
		},
		legend: {
			left: 'center',
			show: false
		},
		color: [hexToRgba(myVarVal, 0.7), 'rgba(33,196, 76, 0.7)', 'rgba(255, 178, 9, 0.7)'],
		series: [
			{
				name: 'Viewing From',
				type: 'pie',
				radius: ['60%', '70%'],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: '#f3f3f3',
					borderWidth: 1
				},
				label: {
					show: false,
					position: 'center'
				},
				emphasis: {
					label: {
						show: true,
						fontWeight: 'bold'
					}
				},
				labelLine: {
					show: false
				},
				
				data: [
					{ value: 48, name: 'Desktop' },
					{ value: 18, name: 'Mobile' },
					{ value: 34, name: 'Tablet' },
				],
			}
		]
	};

	myChart2.setOption(option2);
	window.addEventListener('resize',function(){
		myChart2.resize();
	})
	
}



