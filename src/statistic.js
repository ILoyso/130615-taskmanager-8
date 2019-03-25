import Component from "./component";
import {createElement, isNumeric, colorsHex, getRandomArrayElements} from "./utils";
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


/** Class representing a statistic */
export default class Statistic extends Component {

  /**
   * Create statistic
   * @param {Object} tasks
   */
  constructor(tasks) {
    super();

    this._data = tasks;
    this._periodBegin = moment().startOf(`isoWeek`);
    this._periodEnd = moment().endOf(`isoWeek`);

    this._flatpickr = null;
    this._onChangeDate = this._onChangeDate.bind(this);
  }

  /**
   * Method for filtering by color
   * @return {Array[]}
   * @private
   */
  _filterByColors() {
    let filteredTasks = {};

    this._data.forEach((task) => {
      if ((task.dueDate) && (moment(task.dueDate) >= this._periodBegin) && (moment(task.dueDate) <= this._periodEnd)) {
        filteredTasks[task.color] = isNumeric(filteredTasks[task.color]) ? filteredTasks[task.color] + 1 : 1;
      }
    });

    const colors = Object.keys(filteredTasks);
    const colorsCount = Object.values(filteredTasks);
    const colorsBackground = colors.map((color) => colorsHex[color]);

    return [colors, colorsCount, colorsBackground];
  }

  /**
   * Method for filtering by tags
   * @return {Array[]}
   * @private
   */
  _filterByTags() {
    let filteredTasks = {};

    this._data.forEach((task) => {
      if ((task.dueDate) && (moment(task.dueDate) >= this._periodBegin) && (moment(task.dueDate) <= this._periodEnd)) {
        Array.from(task.tags).map((tag) => {
          filteredTasks[tag] = isNumeric(filteredTasks[tag]) ? filteredTasks[tag] + 1 : 1;
        });
      }
    });

    const tags = Object.keys(filteredTasks).map((tag) => `#${tag}`);
    const tagsCount = Object.values(filteredTasks);
    const tagsBackground = getRandomArrayElements(Object.values(colorsHex), tags.length);

    return [tags, tagsCount, tagsBackground];
  }

  /**
   * Method for generate all charts
   * @private
   */
  _generateCharts() {
    const [colorLabels, colorAmounts, colorBackgrounds] = this._filterByColors();
    const [tagsLabels, tagsAmounts, tagsBackgrounds] = this._filterByTags();

    this._colorsChart = new Chart(this._element.querySelector(`.statistic__colors`), this._getChart(`COLORS`));
    this._tagsChart = new Chart(this._element.querySelector(`.statistic__tags`), this._getChart(`TAGS`));

    this._colorsChart.data = {
      labels: colorLabels,
      datasets: [{
        data: colorAmounts,
        backgroundColor: colorBackgrounds
      }]
    };

    this._tagsChart.data = {
      labels: tagsLabels,
      datasets: [{
        data: tagsAmounts,
        backgroundColor: tagsBackgrounds
      }]
    };

    this._colorsChart.update();
    this._tagsChart.update();
  }

  /**
   * Method for generate pie chart properties
   * @param {String} name
   * @private
   * @return {Object}
   */
  _getChart(name) {
    return {
      plugins: [ChartDataLabels],
      type: `pie`,
      options: {
        plugins: {
          datalabels: {
            display: false
          }
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem, data) => {
              const allData = data.datasets[tooltipItem.datasetIndex].data;
              const tooltipData = allData[tooltipItem.index];
              const total = allData.reduce((acc, it) => acc + parseFloat(it));
              const tooltipPercentage = Math.round((tooltipData / total) * 100);
              return `${tooltipData} TASKS — ${tooltipPercentage}%`;
            }
          },
          displayColors: false,
          backgroundColor: `#ffffff`,
          bodyFontColor: `#000000`,
          borderColor: `#000000`,
          borderWidth: 1,
          cornerRadius: 0,
          xPadding: 15,
          yPadding: 15
        },
        title: {
          display: true,
          text: `DONE BY: ${name}`,
          fontSize: 16,
          fontColor: `#000000`
        },
        legend: {
          position: `left`,
          labels: {
            boxWidth: 15,
            padding: 25,
            fontStyle: 500,
            fontColor: `#000000`,
            fontSize: 13
          }
        }
      }
    };
  }

  /**
   * Method for update dates
   * @private
   */
  _onChangeDate() {
    const newDate = this._element.querySelector(`.statistic__period-input`).value.split(` - `);
    this._periodBegin = moment(newDate[0], `DD MMM`).startOf(`day`);
    this._periodEnd = newDate.length > 1 ? moment(newDate[1], `DD MMM`).endOf(`day`) : moment(newDate[0], `DD MMM`).endOf(`day`);

    this._colorsChart.destroy();
    this._tagsChart.destroy();

    this._generateCharts();
  }

  /**
   * Getter for statistic template
   * @return {string}
   */
  get template() {
    return `<div><div class="statistic__line">
          <div class="statistic__period">
            <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

            <div class="statistic-input-wrap">
              <input
                class="statistic__period-input"
                type="text"
                placeholder="01 Feb - 08 Feb"
              />
            </div>

            <p class="statistic__period-result">
              In total for the specified period
              <span class="statistic__task-found">0</span> tasks were fulfilled.
            </p>
          </div>
          <div class="statistic__line-graphic visually-hidden">
            <canvas class="statistic__days" width="550" height="150"></canvas>
          </div>
        </div>

        <div class="statistic__circle">
          <div class="statistic__tags-wrap">
            <canvas class="statistic__tags" width="400" height="300"></canvas>
          </div>
          <div class="statistic__colors-wrap">
            <canvas class="statistic__colors" width="400" height="300"></canvas>
          </div>
        </div></div>`;
  }

  /** Method for bing functions to statistic */
  bind() {
    this._flatpickr = flatpickr(this._element.querySelector(`.statistic__period-input`), {
      mode: `range`,
      dateFormat: `j M`,
      defaultDate: [
        this._periodBegin.format(`DD MMM`),
        this._periodEnd.format(`DD MMM`)
      ],
      locale: {
        rangeSeparator: ` - `,
        firstDayOfWeek: 1
      },
      onClose: this._onChangeDate,
    });

  }

  /**
   * Method for render statistic
   * @return {Node}
   */
  render() {
    this._element = createElement(this.template);
    this.bind();
    this._generateCharts();
    return this._element;
  }

  /** Method for unbind functions from statistic */
  unbind() {
    this._flatpickr.destroy();
  }
}
