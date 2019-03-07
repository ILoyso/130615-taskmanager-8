import {months, createElement} from './utils';

/** Class representing a task */
export default class Task {

  /**
   * Create c task
   * @param {Object} data
   */
  constructor(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._picture = data.picture;
    this._color = data.color;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;

    this._element = null;
    this.state = {
      isDone: false
    };
    this._onEdit = null;
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
   * Method for check for function and if yes to white it in this._onEdit
   * @private
   */
  _onEditButtonClick() {
    if (typeof this._onEdit === `function`) {
      this._onEdit();
    }
  }

  /**
   * Setter for function that will be work on Edit Button click
   * @param {Function} fn
   */
  set onEdit(fn) {
    this._onEdit = fn;
  }

  /**
   * Getter for DOM element (if it is)
   * @return {DOM/null}
   */
  get element() {
    return this._element;
  }

  /**
   * Getter for task template
   * @return {string}
   */
  get template() {
    return `<article class="card card--${this._color} ${this._isRepeating() ? `card--repeat` : ``} ${this._dueDate < Date.now() ? `card--deadline` : ``}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">
              edit
            </button>
            <button type="button" class="card__btn card__btn--archive">
              archive
            </button>
            <button type="button" class="card__btn card__btn--favorites card__btn--disabled">
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
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list">
                  ${this._getRepeatHashtagsTemplate()}
                </div>
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
          </div>
        </div>
      </form>
    </article>`;
  }

  /** Method for bing function to edit button */
  bind() {
    this._element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._onEditButtonClick.bind(this));
  }

  /**
   * Method for renred this task and add events
   * @return {DOM/null}
   */
  render() {
    this._element = createElement(this.template);
    this.bind();
    return this._element;
  }

  /** Method for unbing function from edit button */
  unbind() {
    this._element.querySelector(`.card__btn--edit`).removeEventListener(`submit`, this._onEditButtonClick.bind(this));
  }

  /** Method for unrender this task */
  unrender() {
    this.unbind();
    this._element = null;
  }
}
