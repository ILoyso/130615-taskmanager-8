import Component from "./component";

/** Class representing a filter */
export default class Filter extends Component {

  /**
   * Create filter
   * @param {Object[]} filters
   */
  constructor(filters) {
    super();

    this._filters = filters;

    this._element = null;
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  /**
   * Method for creating filters template
   * @return {String}
   */
  _getFiltersTemplate() {
    let filtersTemplate = ``;

    this._filters.map((filter) => {
      const name = filter.name;
      const id = name.toLowerCase();
      filtersTemplate += `<input
        type="radio"
        id="filter__${id}"
        class="filter__input visually-hidden"
        name="filter"
        ${filter.isChecked ? `checked` : ``}
        />
        <label for="filter__${id}" class="filter__label">
          ${name} <span class="filter__${id}-count">n</span></label
        >`;
    });

    return filtersTemplate;
  }

  /**
   * Method for check for function and if yes to white it in this._onFilter
   * @param {Event} evt
   * @private
   */
  _onFilterClick(evt) {
    if (typeof this._onFilter === `function`) {
      this._onFilter(evt);
    }
  }

  /**
   * Setter for filtering
   * @param {Function} fn
   */
  set onFilter(fn) {
    this._onFilter = fn;
  }

  /**
   * Getter for filter template
   * @return {String}
   */
  get template() {
    return `<section class="main__filter filter container">
        ${this._getFiltersTemplate()}
      </section>`;
  }

  /** Method for bing functions to filter */
  bind() {
    this._element.querySelectorAll(`.filter__input`).forEach((element) => {
      element.addEventListener(`click`, this._onFilterClick);
    });
  }

  /** Method for unbind functions from filter */
  unbind() {
    this._element.querySelectorAll(`.filter__input`).forEach((element) => {
      element.removeEventListener(`click`, this._onFilterClick);
    });
  }
}
