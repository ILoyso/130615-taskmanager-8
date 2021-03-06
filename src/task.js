import Component from './component';
import moment from 'moment';

/** Class representing a task */
export default class Task extends Component {

  /**
   * Create task
   * @param {Object} task
   */
  constructor(task) {
    super();

    this._title = task.title;
    this._tags = task.tags;
    this._picture = task.picture;
    this._color = task.color;
    this._dueDate = task.dueDate;
    this._repeatingDays = task.repeatingDays;

    this._element = null;
    this._state = {
      isDone: false
    };
    this._isDeleted = false;
    this._onEdit = null;
    this._onEditButtonClick = this._onEditButtonClick.bind(this);
  }

  /**
   * Method for add deadline class if needed
   * @return {string}
   * @private
   */
  _getDeadlineClass() {
    let deadlineClass = ``;
    if ((this._dueDate) && (this._dueDate < Date.now())) {
      deadlineClass = `card--deadline`;
    }
    return deadlineClass;
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
   * Getter for task template
   * @return {string}
   */
  get template() {
    return `<article class="card card--${this._color} ${this._isRepeating() ? `card--repeat` : ``} ${this._getDeadlineClass()}">
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
                      placeholder="${this._dueDate ? moment(this._dueDate).format(`DD MMMM`) : ``}"
                      name="date"
                    />
                  </label>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__time"
                      type="text"
                      placeholder="${this._dueDate ? moment(this._dueDate).format(`hh:mm a`) : ``}"
                      name="time"
                    />
                  </label>
                </fieldset>
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
    this._element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._onEditButtonClick);
  }

  /** Method for unbing function from edit button */
  unbind() {
    this._element.querySelector(`.card__btn--edit`).removeEventListener(`click`, this._onEditButtonClick);
  }

  /**
   * Method for update task regarding new data params
   * @param {Object} task
   */
  update(task) {
    this._title = task.title;
    this._tags = task.tags;
    this._picture = task.picture;
    this._color = task.color;
    this._dueDate = task.dueDate;
    this._repeatingDays = task.repeatingDays;
  }

  /** Method for add deleted marker for task */
  delete() {
    this._isDeleted = !this._isDeleted;
  }
}
