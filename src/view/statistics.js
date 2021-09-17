import SmartView from './smart';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { TYPES } from '../const';
import { formatTimeSpendDuration } from '../utils/statistics';

const renderMoneyChart = (moneyCtx, points) => {
  const BAR_HEIGHT = 55;
  moneyCtx.height = BAR_HEIGHT * (TYPES.length - 2);

  const moneyData = new Map();

  points.forEach((point) => {
    if (moneyData.has(point.type.toUpperCase())) {
      let moneyDataByType = moneyData.get(point.type.toUpperCase());
      moneyDataByType += point.basePrice;
      moneyData.set(point.type.toUpperCase(), moneyDataByType);
    } else {
      moneyData.set(point.type.toUpperCase(), point.basePrice);
    }
  });

  const sortedMoneyData = new Map([...moneyData.entries()].sort((a, b) => b[1] - a[1]));

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedMoneyData.keys()],
      datasets: [{
        data: [...sortedMoneyData.values()],
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, points) => {
  const BAR_HEIGHT = 55;
  typeCtx.height = BAR_HEIGHT * (TYPES.length - 2);

  const typeData = new Map();

  points.forEach((point) => {
    if (typeData.has(point.type.toUpperCase())) {
      let countTypeUse = typeData.get(point.type.toUpperCase());
      countTypeUse += 1;
      typeData.set(point.type.toUpperCase(), countTypeUse);
    } else {
      typeData.set(point.type.toUpperCase(), 1);
    }
  });

  const sortedTypeData = new Map([...typeData.entries()].sort((a, b) => b[1] - a[1]));

  return new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedTypeData.keys()],
      datasets: [{
        data: [...sortedTypeData.values()],
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpendChart = (timeSpendCtx, points) => {
  const BAR_HEIGHT = 55;
  timeSpendCtx.height = BAR_HEIGHT * (TYPES.length - 2);

  const timeSpendData = new Map();

  points.forEach((point) => {
    if (timeSpendData.has(point.type.toUpperCase())) {
      let countTimeSpend = timeSpendData.get(point.type.toUpperCase());
      countTimeSpend += (point.dateTo - point.dateFrom);
      timeSpendData.set(point.type.toUpperCase(), countTimeSpend);
    } else {
      timeSpendData.set(point.type.toUpperCase(), point.dateTo - point.dateFrom);
    }
  });

  const sortedTimeSpendData = new Map([...timeSpendData.entries()].sort((a, b) => b[1] - a[1]));

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedTimeSpendData.keys()],
      datasets: [{
        data: [...sortedTimeSpendData.values()],
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${formatTimeSpendDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatisticsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._points = points;

    this._moneyChart = null;
    this._typeChart = null;
    this._timeSpendChart = null;

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeSpendChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeSpendChart = null;
    }

    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeSpendCtx = this.getElement().querySelector('#time-spend');

    this._moneyChart = renderMoneyChart(moneyCtx, this._points);
    this._typeChart = renderTypeChart(typeCtx, this._points);
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._points);
  }
}
