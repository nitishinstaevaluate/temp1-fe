
$(function () {

	/* Circle-progress */
	$('#circle').circleProgress({
		value: 0.85,
		size: 70,
		fill: {
		  gradient: ["#0052cc", "#0052cc"]
		}
    });
	/* Circle-progress closed */

	/* Circle-progress-1 */
	$('#circle-1').circleProgress({
		value: 0.64,
		size: 70,
		fill: {
		  gradient: ["#0099ff", "#0099ff"]
		}
	});
	/* Circle-progress-1 closed */

	/* Circle-progress-2 */
	$('#circle-2').circleProgress({
		value: 0.74,
		size: 70,
		fill: {
		  gradient: ["#26c2f7", "#26c2f7"]
		}
    });
    /* Circle-progress-2 closed */

	/* Circle-progress-3 */
	$('#circle-3').circleProgress({
		value: 0.55,
		size: 70,
		fill: {
		  gradient: ["#f5334f", "#f5334f"]
		}
    });
	/* Circle-progress-3 closed */

	/* Chartjs (#areaChart11) */
	var ctx = document.getElementById('areaChart11').getContext('2d');
	var gradientStroke1 = ctx.createLinearGradient(0, 0, 0, 140);
	gradientStroke1.addColorStop(0, '#0052cc');
	gradientStroke1.addColorStop(1, '#0052cc');
    var myChart = new Chart( ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            type: 'line',
            datasets: [ {
				label: 'Market value',
				data: [30, 70, 30, 100, 50, 130, 100, 140],
				backgroundColor: 'transparent',
				borderColor: gradientStroke1,
				pointBackgroundColor:'#fff',
				pointHoverBackgroundColor:gradientStroke1,
				pointBorderColor :gradientStroke1,
				pointHoverBorderColor :gradientStroke1,
				pointBorderWidth :2,
				pointRadius :2,
				pointHoverRadius :2,
				borderWidth: 2,
                lineTension: 0.5,
            }, ]
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
    });
	/* Chartjs (#areaChart11) closed */

	/* Chartjs (#areaChart2) */
	var ctx = document.getElementById('areaChart2').getContext('2d');
	var gradientStroke1 = ctx.createLinearGradient(0, 0, 0, 140);
	gradientStroke1.addColorStop(0, '#0099ff');
	gradientStroke1.addColorStop(1, '#0099ff');
    var myChart = new Chart( ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            type: 'line',
            datasets: [ {
				label: 'Market value',
				data: [24, 18, 28, 21, 32, 28,30],
				backgroundColor: 'transparent',
				borderColor: gradientStroke1,
				pointBackgroundColor:'#fff',
				pointHoverBackgroundColor:gradientStroke1,
				pointBorderColor :gradientStroke1,
				pointHoverBorderColor :gradientStroke1,
				pointBorderWidth :2,
				pointRadius :2,
				pointHoverRadius :2,
				borderWidth: 2,
                lineTension: 0.5,
            }, ]
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
    });
	/* Chartjs (#areaChart2) closed */

	/* Chartjs (#areaChart3) */
	var ctx = document.getElementById('areaChart3').getContext('2d');
	var gradientStroke1 = ctx.createLinearGradient(0, 0, 0, 140);
	gradientStroke1.addColorStop(0, '#5b5be9');
	gradientStroke1.addColorStop(1, '#5b5be9');
    var myChart = new Chart( ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            type: 'line',
            datasets: [ {
				label: 'Market value',
				data: [30, 70, 30, 100, 50, 130, 100, 140],
				backgroundColor: 'transparent',
				borderColor: gradientStroke1,
				pointBackgroundColor:'#fff',
				pointHoverBackgroundColor:gradientStroke1,
				pointBorderColor :gradientStroke1,
				pointHoverBorderColor :gradientStroke1,
				pointBorderWidth :2,
				pointRadius :2,
				pointHoverRadius :2,
				borderWidth: 2,
                lineTension: 0.5,
            }, ]
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
    });
	/* Chartjs (#areaChart3) closed */

	/* Chartjs (#areaChart4) */
	var ctx = document.getElementById('areaChart4').getContext('2d');
	var gradientStroke1 = ctx.createLinearGradient(0, 0, 0, 180);
	gradientStroke1.addColorStop(0, '#f1644b');
	gradientStroke1.addColorStop(1, '#f94971');
    var myChart = new Chart( ctx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            type: 'line',
            datasets: [ {
				label: 'Market value',
				data: [24, 18, 28, 21, 32, 28,30],
				backgroundColor: 'transparent',
				borderColor: gradientStroke1,
				pointBackgroundColor:'#fff',
				pointHoverBackgroundColor:gradientStroke1,
				pointBorderColor :gradientStroke1,
				pointHoverBorderColor :gradientStroke1,
				pointBorderWidth :2,
				pointRadius :2,
				pointHoverRadius :2,
				borderWidth: 2,
                lineTension: 0.5,
            }, ]
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
    });
	/* Chartjs (#areaChart4) closed */

});



