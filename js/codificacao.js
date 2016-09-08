Chart.defaults.global.maintainAspectRatio = false;
		
var chartNRZ, chartAMI;

function criarChartNRZ(codigoInicial) {
	var voltagem = {
		'0': 1,
		'1': -1
	}
	
	var data = {
		datasets: [
			{
				label: "NRZ",
				fill: false,
				lineTension: 0,
				backgroundColor: "rgba(75,192,192,0.4)",
				borderColor: "rgba(75,192,192,1)",
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: getDadosGraficoNRZ(codigoInicial),
				spanGaps: false,
			}
		]
	};

	var ctx = document.getElementById('skills').getContext('2d');
	chartNRZ = new Chart(ctx, {
	  type: 'line',
	  data: data,
	  options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom',
					ticks: {
						display: false
					}
				}],
				yAxes: [{
					ticks: {
						max: voltagem['0'] + 1,
						min: voltagem['1'] - 1,
						stepSize: 1
					}
				}]
			}
		}
	});
}

function criarChartAMI(codigoInicial) {
	var data = {
		datasets: [
			{
				label: "Bipolar-AMI",
				fill: false,
				lineTension: 0,
				backgroundColor: "rgba(244,67,192,0.4)",
				borderColor: "rgba(55,12,92,1)",
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: "rgba(75,192,192,1)",
				pointBackgroundColor: "#fff",
				pointBorderWidth: 1,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: getDadosGraficoAMI(codigoInicial),
				spanGaps: false,
			}
		]
	};

	var ctx = document.getElementById('chartAMI').getContext('2d');
	chartAMI = new Chart(ctx, {
	  type: 'line',
	  data: data,
	  options: {
			scales: {
				xAxes: [{
					type: 'linear',
					position: 'bottom',
					ticks: {
						display: false
					}
				}],
				yAxes: [{
					ticks: {
						max: 2,
						min: -2,
						stepSize: 1
					}
				}]
			}
		}
	});
}

var codificarCodigo = function () {
	var codigo = $('#codigoBinario').val();

	if (codigo.length == 0 || /[^01]/.test(codigo)) {
		$('.error-message').removeClass('invisible');
		return;
	} else {
		$('.error-message').addClass('invisible');
	}
	
	updateGrafico(codigo);
};

var updateGrafico = function(codigo) {
	updateDadosGrafico(chartNRZ, getDadosGraficoNRZ, codigo)
	updateDadosGrafico(chartAMI, getDadosGraficoAMI, codigo)
}

function updateDadosGrafico(chart, getDadosGrafico, codigo) {
	chart.data.datasets[0].data = getDadosGrafico(codigo);
	chart.update();
}

var getDadosGraficoNRZ = function(codigo) {
	var helper = {
		'0' : 1,
		'1' : -1
	};
	
	var data = [], x = 0;

	for (var i = 0; i < codigo.length; i++) {
		if (codigo[i] === '0') {
			data.push({x: x, y: helper['0']});
			x++;
			data.push({x: x, y: helper['0']});
		} else if (codigo[i] === '1') {
			data.push({x: x, y: helper['1']});
			x++;
			data.push({x: x, y: helper['1']});
		}
	}
	
	return data;
}

var getDadosGraficoAMI = function(codigo) {
	var pulsoPositivo = true;
	
	var voltagens = {
		'0': 0,
		'1': 1
	}
	
	var data = [], x = 0;

	for (var i = 0; i < codigo.length; i++) {
		if (codigo[i] === '0') {
			data.push({x: x, y: voltagens['0']});
			x++;
			data.push({x: x, y: voltagens['0']});
		} else if ((codigo[i] === '1') && (pulsoPositivo)) {
			data.push({x: x, y: voltagens['1']});
			x++;
			data.push({x: x, y: voltagens['1']});
			pulsoPositivo = false;
		} else if ((codigo[i] === '1') && (! pulsoPositivo)) {
			data.push({x: x, y: - voltagens['1']});
			x++;
			data.push({x: x, y: - voltagens['1']});
			pulsoPositivo = true;
		}
	}
	
	return data;
}


$(document).ready( function() {
	var codigoInicial = '01001100011';
	
	criarChartNRZ(codigoInicial);
	criarChartAMI(codigoInicial);
});
