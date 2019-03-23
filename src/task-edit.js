import Component from './component';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.css';
import moment from 'moment';

/** Class representing a edit version of task */
export default class TaskEdit extends Component {

  /**
   * Create edit task
   * @param {Object} data
   * @param {Number} dayId
   */
  constructor(data, dayId) {
    super();

    this._title = data.title;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._dayId = dayId;

    this._state = {
      isDueDate: this._dueDate !== ``,
      isRepeated: this._isRepeating()
    };

    this._element = null;
    this._onSubmit = null;
    this._onDelete = null;

    this._onSubmitButtonClick = this._onSubmitButtonClick.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onChangeDate = this._onChangeDate.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
  }

  /**
   * Method for creating colors template
   * @return {String}
   * @private
   */
  _getColorsTemplate() {
    const colors = new Set([
      `black`,
      `yellow`,
      `blue`,
      `green`,
      `pink`
    ]);

    return Array.from(colors).map((color, index) => `<input
      type="radio"
      id="color-${color}-${this._dayId}${index}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      ${color === this._color ? `checked` : ``}
    />
    <label
      for="color-${color}-${this._dayId}${index}"
      class="card__color card__color--${color}"
      >${color}</label
    >`).join(``);
  }

  /**
   * Method for creating repeating days template
   * @return {String}
   * @private
   */
  _getRepeatDaysTemplate() {
    let daysTemplate = ``;
    let idIndex = 1;
    for (const day in this._repeatingDays) {
      if (this._repeatingDays.hasOwnProperty(day)) {
        daysTemplate += `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${this._dayId}${idIndex}"
          name="repeat"
          value="${day}"
          ${this._repeatingDays[day] ? `checked` : ``}
        />
        <label class="card__repeat-day" for="repeat-${day}-${this._dayId}${idIndex}"
          >${day}</label
        >`;
        idIndex++;
      }
    }
    return daysTemplate;
  }

  /**
   * Method for creating hashtags template
   * @return {String}
   * @private
   */
  _getRepeatHashtagsTemplate() {
    return Array.from(this._tags).map((tag) => `<span class="card__hashtag-inner">
      <input
        type="hidden"
        name="hashtag"
        value="${tag}"
        class="card__hashtag-hidden-input"
      />
      <button type="button" class="card__hashtag-name">
        #${tag}
      </button>
      <button type="button" class="card__hashtag-delete">
        delete
      </button>
    </span>`).join(``);
  }

  /**
   * Method for check is this task repeating or no
   * @return {boolean}
   * @private
   */
  _isRepeating() {
    return Object.values(this._repeatingDays).some((it) => it);
  }

  /**
   * Method for update or remove due date
   * @private
   */
  _onChangeDate() {
    this._state.isDueDate = !this._state.isDueDate;
    this.unbind();
    this._updateTemplate();
    this.bind();
  }

  /**
   * Method for update or remove repeating days
   * @private
   */
  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this.unbind();
    this._updateTemplate();
    this.bind();
  }

  /**
   * Method for delete task
   * @private
   */
  _onDeleteButtonClick() {
    if (typeof this._onDelete === `function`) {
      this._onDelete();
    }
  }

  /**
   * Method for update data
   * @param {Event} evt
   * @private
   */
  _onSubmitButtonClick(evt) {
    evt.preventDefault();

    const formData = new FormData(this._element.querySelector(`.card__form`));
    const newData = this._processForm(formData);

    if (typeof this._onSubmit === `function`) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  /**
   * Method for saving updated data
   * @param {FormData} formData
   * @return {Object}
   * @private
   */
  _processForm(formData) {
    const entry = {
      title: ``,
      color: ``,
      tags: new Set(),
      dueDate: new Date(this._dueDate),
      repeatingDays: {
        'mo': false,
        'tu': false,
        'we': false,
        'th': false,
        'fr': false,
        'sa': false,
        'su': false,
      }
    };

    const taskEditMapper = TaskEdit.createMapper(entry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;
      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }

    return entry;
  }

  /**
   * Method for update template
   * @private
   */
  _updateTemplate() {
    this._element.innerHTML = this.template;
  }

  /**
   * Setter for function that will be work on Delete Button click
   * @param {Function} fn
   */
  set onDelete(fn) {
    this._onDelete = fn;
  }

  /**
   * Setter for function that will be work on Submit Button click
   * @param {Function} fn
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  /**
   * Getter for taskEdit template
   * @return {string}
   */
  get template() {
    return `<article class="card card--${this._color} ${this._state.isRepeated ? `card--repeat` : ``} ${this._dueDate < Date.now() ? `card--deadline` : ``} card--edit">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive">
              archive
            </button>
            <button
              type="button"
              class="card__btn card__btn--favorites card__btn--disabled"
            >
              favorites
            </button>
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${this._title}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${this._state.isDueDate ? `yes` : `no`}</span>
                </button>
  
                <fieldset class="card__date-deadline" ${this._state.isDueDate ? `` : `disabled`}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder="${moment(this._dueDate).format(`DD MMMM`)}"
                      value="${moment(this._dueDate).format(`DD MMMM`)}"
                      name="date"
                    />
                  </label>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__time"
                      type="text"
                      placeholder="${moment(this._dueDate).format(`hh:mm a`)}"
                      value="${moment(this._dueDate).format(`hh:mm a`)}"
                      name="time"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${this._state.isRepeated ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${this._state.isRepeated ? `` : `disabled`}>
                    <div class="card__repeat-days-inner">                    
${this._getRepeatDaysTemplate()}
                  </div>
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${this._getRepeatHashtagsTemplate()}
                </div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <label class="card__img-wrap ${this._picture ? `` : `card__img-wrap--empty`}">
              <input
                type="file"
                class="card__img-input visually-hidden"
                name="img"
              />
              <img
                src="${this._picture}"
                alt="task picture"
                class="card__img"
              />
            </label>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${this._getColorsTemplate()}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;
  }

  /** Method for bing function to submit button */
  bind() {
    this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__delete`).addEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onChangeRepeated);

    if (this._state.isDueDate) {
      flatpickr(this._element.querySelector(`.card__date`), {
        altInput: true,
        altFormat: `j F`,
        dateFormat: `j F`,
        locale: {
          firstDayOfWeek: 1
        }
      });
      flatpickr(this._element.querySelector(`.card__time`), {
        enableTime: true,
        noCalendar: true,
        altInput: true,
        altFormat: `h:i K`,
        dateFormat: `h:i K`
      });
    }
  }

  /** Method for unbing function from submit button */
  unbind() {
    this._element.querySelector(`.card__form`).removeEventListener(`submit`, this._onSubmitButtonClick);
    this._element.querySelector(`.card__delete`).removeEventListener(`click`, this._onDeleteButtonClick);
    this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onChangeDate);
    this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onChangeRepeated);
  }

  /**
   * Method for update taskEdit regarding new data params
   * @param {Object} data
   */
  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
  }

  /**
   * Method for mapping data from form
   * @param {Object} target
   * @return {Object}
   */
  static createMapper(target) {
    return {
      hashtag: (value) => {
        target.tags.add(value);
      },
      text: (value) => {
        target.title = value;
      },
      color: (value) => {
        target.color = value;
      },
      repeat: (value) => {
        target.repeatingDays[value] = true;
      },
      date: (value) => {
        target.dueDate.date = value;
      },
      time: (value) => {
        target.dueDate.time = value;
      }
    };
  }

}
