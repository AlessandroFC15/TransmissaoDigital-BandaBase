Chart.defaults.global.maintainAspectRatio = false;

String.prototype.replaceAll = function (search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var chartNRZ, chartAMI, chartPseudoternario,
    chartManchester, chartB8ZS, chartHDB3,
    chartManchesterDiferencial, chartNRZ_I;

var criarChart = function (label, chartID, metodoGetDados, primaryColor, secondaryColor, codigoInicial) {
    var data = {
        datasets: [
            {
                label: label,
                fill: false,
                lineTension: 0,
                backgroundColor: secondaryColor,
                borderColor: primaryColor,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: primaryColor,
                pointBackgroundColor: "#fff",
                pointBorderWidth: 1,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: primaryColor,
                pointHoverBorderColor: "rgba(220,220,220,1)",
                pointHoverBorderWidth: 2,
                pointRadius: 1,
                pointHitRadius: 10,
                data: metodoGetDados(codigoInicial),
                spanGaps: false
            }
        ]
    };

    var ctx = document.getElementById(chartID).getContext('2d');
    return new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        display: false,
                        stepSize: 1
                    }
                }],
                yAxes: [{
                    ticks: {
                        max: 2,
                        min: -2,
                        stepSize: 1
                    }
                }]
            },
            legend: {
                display: true,
                labels: {
                    fontSize: 16,
                    fontColor: primaryColor
                }
            }
        }
    });
};

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

var updateGrafico = function (codigo) {
    updateDadosGrafico(chartNRZ, getDadosGraficoNRZ, codigo);
    updateDadosGrafico(chartAMI, getDadosGraficoAMI, codigo);
    updateDadosGrafico(chartPseudoternario, getDadosGraficoPseudoternario, codigo);
    updateDadosGrafico(chartManchester, getDadosGraficoManchester, codigo);
    updateDadosGrafico(chartManchesterDiferencial, getDadosGraficoManchesterDiferencial, codigo);
    updateDadosGrafico(chartB8ZS, getDadosGraficoB8ZS, codigo);
    updateDadosGrafico(chartHDB3, getDadosGraficoHDB3, codigo);
    updateDadosGrafico(chartNRZ_I, getDadosGraficoNRZ_I, codigo);
};

function updateDadosGrafico(chart, getDadosGrafico, codigo) {
    chart.data.datasets[0].data = getDadosGrafico(codigo);
    chart.update();
}

var getDadosGraficoNRZ = function (codigo) {
    var helper = {
        '0': 1,
        '1': -1
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
};

var getDadosGraficoNRZ_I = function (codigo) {
    var helper = {
        true: 1,
        false: -1
    };

    var data = [], x = 0, lastUp = false;

    for (var i = 0; i < codigo.length; i++) {
        if (codigo[i] === '0') {
            data.push({x: x, y: helper[lastUp]});
            x++;
            data.push({x: x, y: helper[lastUp]});
        } else if (codigo[i] === '1') {
            lastUp = ! lastUp;

            data.push({x: x, y: helper[lastUp]});
            x++;
            data.push({x: x, y: helper[lastUp]});
        }
    }

    return data;
};

var getDadosGraficoAMI = function (codigo) {
    var pulsoPositivo = true;

    var voltagens = {
        '0': 0,
        '1': 1
    };

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
        } else if ((codigo[i] === '1') && (!pulsoPositivo)) {
            data.push({x: x, y: -voltagens['1']});
            x++;
            data.push({x: x, y: -voltagens['1']});
            pulsoPositivo = true;
        }
    }

    return data;
};

var getDadosGraficoPseudoternario = function (codigo) {
    var pulsoPositivo = true;

    var voltagens = {
        '0': 1,
        '1': 0
    };

    var data = [], x = 0;

    for (var i = 0; i < codigo.length; i++) {
        if (codigo[i] === '1') {
            data.push({x: x, y: voltagens['1']});
            x++;
            data.push({x: x, y: voltagens['1']});
        } else if ((codigo[i] === '0') && (pulsoPositivo)) {
            data.push({x: x, y: voltagens['0']});
            x++;
            data.push({x: x, y: voltagens['0']});
            pulsoPositivo = false;
        } else if ((codigo[i] === '0') && (!pulsoPositivo)) {
            data.push({x: x, y: -voltagens['0']});
            x++;
            data.push({x: x, y: -voltagens['0']});
            pulsoPositivo = true;
        }
    }

    return data;
};

var getDadosGraficoManchester = function (codigo) {
    var data = [], x = 0;

    for (var i = 0; i < codigo.length; i++) {
        if (codigo[i] === '0') {
            data.push({x: x, y: 1});
            x += 0.5;
            data.push({x: x, y: 1});

            data.push({x: x, y: -1});
            x += 0.5;
            data.push({x: x, y: -1});
        } else if (codigo[i] === '1') {
            data.push({x: x, y: -1});
            x += 0.5;
            data.push({x: x, y: -1});

            data.push({x: x, y: 1});
            x += 0.5;
            data.push({x: x, y: 1});
        }
    }

    return data;
};

var getDadosGraficoManchesterDiferencial = function (codigo) {
    var data = [], x = 0;

    var lastUp = true;

    for (var i = 0; i < codigo.length; i++) {
        if (codigo[i] === '0') {
            if (lastUp) {
                data.push({x: x, y: -1});
                x += 0.5;
                data.push({x: x, y: -1});

                data.push({x: x, y: 1});
                x += 0.5;
                data.push({x: x, y: 1});
            } else {
                data.push({x: x, y: 1});
                x += 0.5;
                data.push({x: x, y: 1});

                data.push({x: x, y: -1});
                x += 0.5;
                data.push({x: x, y: -1});

                lastUp = false;
            }
        } else if (codigo[i] === '1') {
            if (lastUp) {
                data.push({x: x, y: 1});
                x += 0.5;
                data.push({x: x, y: 1});

                data.push({x: x, y: -1});
                x += 0.5;
                data.push({x: x, y: -1});

                lastUp = false;
            } else {
                data.push({x: x, y: -1});
                x += 0.5;
                data.push({x: x, y: -1});

                data.push({x: x, y: 1});
                x += 0.5;
                data.push({x: x, y: 1});

                lastUp = true;
            }
        }
    }

    return data;
};

var getDadosGraficoB8ZS = function (codigo) {
    var codigoScramble = scrambleCodigoB8ZS(codigo);

    console.log(codigoScramble);

    var data = [], x = 0;

    var voltagens = {
        '0': 0,
        '+': 1,
        '-': -1
    };

    for (var i = 0; i < codigoScramble.length; i++) {
        data.push({x: x, y: voltagens[codigoScramble[i]]});
        x++;
        data.push({x: x, y: voltagens[codigoScramble[i]]});
    }

    return data;
};

var getDadosGraficoHDB3 = function (codigo) {
    var codigoScramble = scrambleCodigoHDB3(codigo);

    var data = [], x = 0;

    var voltagens = {
        '0': 0,
        '+': 1,
        '-': -1
    };

    for (var i = 0; i < codigoScramble.length; i++) {
        data.push({x: x, y: voltagens[codigoScramble[i]]});
        x++;
        data.push({x: x, y: voltagens[codigoScramble[i]]});
    }

    return data;
};

var scrambleCodigoB8ZS = function (codigo) {
    var codigoAMI = '';
    var pulsoPositivo = true;

    for (var i = 0; i < codigo.length; i++) {
        if (codigo[i] === '0') {
            codigoAMI += '0'
        } else if ((codigo[i] === '1') && (pulsoPositivo)) {
            codigoAMI += '+';
            pulsoPositivo = false;
        } else if ((codigo[i] === '1') && (!pulsoPositivo)) {
            codigoAMI += '-';
            pulsoPositivo = true;
        }
    }

    return codigoAMI.replaceAll('\\+0{8}', '+000+-0-+').replaceAll('-0{8}', '-000-+0+-');
};

var scrambleCodigoHDB3 = function (codigo) {
    codigo = codigo.replace('0000', '000V').replaceAll('0000', 'B00V');

    var codigoAMI = '';
    var pulsoPositivo = true;

    for (var i = 0; i < codigo.length; i++) {
        if (codigo[i] === '0') {
            codigoAMI += '0'
        } else if ((codigo[i] === '1' || codigo[i] === 'B') && (pulsoPositivo)) {
            codigoAMI += '+';
            pulsoPositivo = false;
        } else if ((codigo[i] === '1' || codigo[i] === 'B') && (!pulsoPositivo)) {
            codigoAMI += '-';
            pulsoPositivo = true;
        } else if (codigo[i] === 'V') {
            codigoAMI += (pulsoPositivo ? '-' : '+');
        }
    }

    return codigoAMI;
};

$(document).ready(function () {
    //var codigoInicial = '0100110100';
    var codigoInicial = '100000000';

    chartNRZ = criarChart('NRZ', 'chartNRZ', getDadosGraficoNRZ, "rgba(75,192,192,1)", "rgba(75,192,192,0.4)", codigoInicial);
    chartAMI = criarChart('Bipolar-AMI', 'chartAMI', getDadosGraficoAMI, "rgba(55,12,92,1)", "rgba(55,12,92,0.4)", codigoInicial);
    chartPseudoternario = criarChart('Pseudoternário', 'chartPseudoternario', getDadosGraficoPseudoternario, "rgba(13, 71, 161, 1)", "rgba(13, 71, 161, 0.4)", codigoInicial);
    chartManchester = criarChart('Manchester', 'chartManchester', getDadosGraficoManchester, "rgba(183, 28, 28, 1)", "rgba(183, 28, 28, 0.4)", codigoInicial);
    chartManchesterDiferencial = criarChart('Manchester Diferencial', 'chartManchesterDiferencial', getDadosGraficoManchesterDiferencial, "rgba(66, 66, 66, 1)", "rgba(66, 66, 66, 0.4)", codigoInicial);
    chartB8ZS = criarChart('B8ZS', 'chartB8ZS', getDadosGraficoB8ZS, "rgba(0, 105, 192, 1)", "rgba(0, 105, 192, 0.4)", codigoInicial);
    chartHDB3 = criarChart('HDB3', 'chartHDB3', getDadosGraficoHDB3, "rgba(230, 81, 0, 1)", "rgba(230, 81, 0, 0.4)", codigoInicial);
    chartNRZ_I = criarChart('NRZ-I', 'chartNRZ-I', getDadosGraficoNRZ_I, "rgba(230, 81, 0, 1)", "rgba(230, 81, 0, 0.4)", codigoInicial);
});
