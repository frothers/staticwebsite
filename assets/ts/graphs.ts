import { Chart } from 'chart.js';
import 'chartjs-plugin-colorschemes';
import * as _ from 'lodash';

import { parsePlayerData, parsePointsData, parseCleanSheetData, matchGoals, matchResult, chartGoalsData } from './processors/graphData'

let screenWidth = (window.innerWidth > 0) ? window.innerWidth : screen.width;

let goalsChart: Chart;
let pointsChart: Chart;
let cleanSheetChart: Chart;

/**
 * @summary Get the filter value
 */
export let getYearFilter = function (): number {
    let input = <HTMLInputElement>document.getElementById("yearSelect");
    if (input == null) {
      return;
    }
    return parseInt(input.value);
}

/**
 * @summary Goal scorers graphics.
 */
export let populateGsGraph = async function (year: number) {
    let playerData = await parsePlayerData(year);

    let temp = <HTMLCanvasElement>document.getElementById("stats-panel");

    if (temp == null) {
        return;
    }

    let ctx = temp.getContext("2d");

    if (goalsChart) {
        goalsChart.destroy();
    }

    goalsChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: playerData
        },
        options: {
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 0,
                    bottom: 0
                }
            },
            legend: {
                display: screenWidth > 500,
                position: 'bottom',
                onClick: onClickFunc
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'week'
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 15,
                    }
                }]
            },
            plugins: {
                colorschemes: {
                    scheme: 'brewer.Paired12'
                }
            },
            tooltips: {
                callbacks: {
                    title: function (items, data) {
                        let title = "";
                        items.forEach((item, index) => {
                            title += data.datasets[item.datasetIndex].label;
                            if (index != (items.length - 1)) {
                                title += ", "
                            }
                        })

                        return title
                    },
                    footer: function (item, data) {
                        let dataItem = <matchGoals>data.datasets[item[0].datasetIndex].data[item[0].index];
                        let yourDate = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }).format(dataItem.t);
                        return yourDate
                    },
                    label: function (item, data) {
                        let dataItem = <matchGoals>data.datasets[item.datasetIndex].data[item.index];
                        return "Total:\t" + dataItem.y;
                    },
                    afterLabel: function (item, data) {
                        let dataItem = <matchGoals>data.datasets[item.datasetIndex].data[item.index];
                        return "(Gameday Goals:\t" + dataItem.goals + ")";
                    },
                },
            }
        }
    })
}

/**
 * @summary Points graphics.
 */
export let populatePointsGraph = async function (year: number) {
    let pointsData = await parsePointsData(year);

    let temp = <HTMLCanvasElement>document.getElementById("results-panel");

    if (temp == null) {
        return;
    }
    
    let ctx = temp.getContext("2d");

    if (pointsChart) {
        pointsChart.destroy();
    }

    pointsChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: pointsData,
                label: "Results",
                fill: false,
                steppedLine: true
            }]
        },
        options: {
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 0,
                    bottom: 0
                }
            },
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'week'
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 15,
                    }
                }]
            },
            plugins: {
                colorschemes: {
                    scheme: 'brewer.Paired12'
                }
            },
            tooltips: {
                callbacks: {
                    title: function (items, data) {
                        let title = "";
                        items.forEach((item, index) => {
                            title += data.datasets[item.datasetIndex].label;
                            if (index != (items.length - 1)) {
                                title += ", "
                            }
                        })

                        return title
                    },
                    footer: function (item, data) {
                        let dataItem = <matchResult>data.datasets[item[0].datasetIndex].data[item[0].index];
                        let yourDate = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }).format(dataItem.t);
                        return yourDate
                    },
                    label: function (item, data) {
                        let dataItem = <matchResult>data.datasets[item.datasetIndex].data[item.index];
                        return "Points:\t" + dataItem.y;
                    },
                    afterLabel: function (item, data) {
                        let dataItem = <matchResult>data.datasets[item.datasetIndex].data[item.index];
                        return "(Gameday result:\t"+ dataItem.result + ")";
                    },
                },
            }
        }
    })
}

/**
 * @summary cleansheet graphics.
 */
export let populateCleanSheetGraph = async function (year: number) {
    let data = await parseCleanSheetData(year);

    let temp = <HTMLCanvasElement>document.getElementById("cleansheet-panel");

    if (temp == null) {
        return;
    }

    let ctx = temp.getContext("2d");

    if (cleanSheetChart) {
        cleanSheetChart.destroy();
    }

    cleanSheetChart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: [{
                data: data,
                label: "Clean Sheets",
                fill: false,
                steppedLine: true
            }]
        },
        options: {
            elements: {
                line: {
                    tension: 0, // disables bezier curves
                }
            },
            legend: {
                position: 'bottom'
            },
            responsive: true,
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 50,
                    right: 50,
                    top: 0,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    time: {
                        unit: 'week'
                    }
                }],
                yAxes: [{
                    ticks: {
                        suggestedMin: 0,
                        suggestedMax: 5,
                    }
                }]
            },
            plugins: {
                colorschemes: {
                    scheme: 'brewer.Paired12'
                }
            },
            tooltips: {
                callbacks: {
                    title: function (items, data) {
                        let title = "";
                        items.forEach((item, index) => {
                            title += data.datasets[item.datasetIndex].label;
                            if (index != (items.length - 1)) {
                                title += ", "
                            }
                        })

                        return title
                    },
                    footer: function (item, data) {
                        let dataItem = <matchResult>data.datasets[item[0].datasetIndex].data[item[0].index];
                        let yourDate = new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }).format(dataItem.t);
                        return yourDate
                    },
                    label: function (item, data) {
                        let dataItem = <matchResult>data.datasets[item.datasetIndex].data[item.index];
                        return "Total Clean Sheets:\t" + dataItem.y;
                    },
                },
            }
        }
    })
}

/**
 * @summary Update all graphs
 */
export let updateAllGraphs = async function (year: number) {
    populateGsGraph(year);
    populatePointsGraph(year);
    populateCleanSheetGraph(year);
}

let onClickFunc = function (_e: any, legendItem: { datasetIndex: any; }) {
    var index = legendItem.datasetIndex;
    var ci = this.chart;
    var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

    ci.data.datasets.forEach(function (_e: any, i: number) {
        var meta = ci.getDatasetMeta(i);

        if (i !== index) {
            if (!alreadyHidden) {
                meta.hidden = meta.hidden === null ? !meta.hidden : null;
            } else if (meta.hidden === null) {
                meta.hidden = true;
            }
        } else if (i === index) {
            meta.hidden = null;
        }
    });

    ci.update();
}