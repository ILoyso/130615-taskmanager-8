import {months, createElement} from './utils';

/** Class representing a edit version of task */
export default class TaskEdit {

  /**
   * Create c task
   * @param {Object} data
   * @param {Number} dayId
   */
  constructor(data, dayId) {
    this._title = data.title;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._dayId = dayId;

    this._element = null;
    this._onSubmit = null;
  }

  /**
   * Method for converting data
   * @return {Object}
   * @private
   */
  _convertDate() {
    const dateStandart = new Date(this._dueDate);
    const convertedDate = dateStandart.toString().split(` `);
    let fullDate = {};
    fullDate.day = convertedDate[2];
    fullDate.month = months[dateStandart.getMonth()];
    fullDate.time = convertedDate[4].substr(0, 5);

    return fullDate;
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
    return this._tags.map((tag) => `<span class="card__hashtag-inner">
      <input
        type="hidden"
        name="hashtag"
        value="repeat"
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
    return Object.values(this._repeatingDays).some((it) => it === true);
  }

  /**
   * Method for check for function and if yes to white it in this._onSubmit
   * @param {Event} evt
   * @private
   */
  _onSubmitButtonClick(evt) {
    evt.preventDefault();
    if (typeof this._onSubmit === `function`) {
      this._onSubmit();
    }
  }

  /**
   * Setter for function that will be work on Submit Button click
   * @param {Function} fn
   */
  set onSubmit(fn) {
    this._onSubmit = fn;
  }

  /**
   * Getter for DOM element (if it is)
   * @return {DOM/null}
   */
  get element() {
    return this._element;
  }

  /**
   * Getter for taskEdit template
   * @return {string}
   */
  get template() {
    return `<article class="card card--${this._color} ${this._isRepeating() ? `card--repeat` : ``} ${this._dueDate < Date.now() ? `card--deadline` : ``} card--edit">
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
                  date: <span class="card__date-status">no</span>
                </button>

                <fieldset class="card__date-deadline" ${this._dueDate ? `` : `disabled`}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder="${this._convertDate().day} ${this._convertDate().month}"
                      name="date"
                    />
                  </label>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__time"
                      type="text"
                      placeholder="${this._convertDate().time}"
                      name="time"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${this._isRepeating() ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${this._isRepeating() ? `` : `disabled`}>
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
    this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onSubmitButtonClick.bind(this));
  }

  /**
   * Method for renred this taskEdit and add events
   * @return {DOM/null}
   */
  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  /** Method for unbing function from submit button */
  unbind() {
    this._element.querySelector(`.card__form`).removeEventListener(`submit`, this._onSubmitButtonClick.bind(this));
  }

  /** Method for unrender this taskEdit */
  unrender() {
    this.unbind();
    this._element = null;
  }
}
