import Component from "./component";
import {createElements} from "./utils";

/** Class representing a filter */
export default class Filter extends Component {

  /**
   * Create filter
   * @param {Object} data
   */
  constructor(data) {
    super();

    this._name = data.name;
    this._id = this._name.toLowerCase();

    this._element = null;
    this._state = {
      isChecked: false
    };
    this._onFilter = null;
    this._onFilterClick = this._onFilterClick.bind(this);
  }

  /**
   * Method for check for function and if yes to white it in this._onFilter
   * @private
   */
  _onFilterClick() {
    if (typeof this._onFilter === `function`) {
      this._onFilter();
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
   * Getter for filter id
   * @return {String}
   */
  get filterId() {
    return this._id;
  }

  /**
   * Getter for filter template
   * @return {string}
   */
  get template() {
    return `<input
      type="radio"
      id="filter__${this._id}"
      class="filter__input visually-hidden"
      name="filter"
 
      />
      <label for="filter__${this._id}" class="filter__label">
        ${this._name} <span class="filter__${this._id}-count">n</span></label
    >`;
  }

  /** Method for bing functions to filter */
  bind() {
    this._element.querySelector(`.filter__input`).addEventListener(`click`, this._onFilterClick);
  }

  /**
   * Method for render filter
   * @return {Node}
   */
  render() {
    this._element = createElements(this.template);
    this.bind();
    return this._element;
  }

  /** Method for unbind functions from filter */
  unbind() {
    this._element.querySelector(`.filter__input`).removeEventListener(`click`, this._onFilterClick);
  }
}
