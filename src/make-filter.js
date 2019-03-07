/**
 * Function for generate filter template
 * @param {String} text
 * @param {Number} amount
 * @param {Boolean} isChecked
 * @return {String}
 */
const getFilterTemplate = (text, amount, isChecked = false) => {
  const filterId = text.toLowerCase();
  const checkedState = isChecked ? `checked` : ``;
  const state = amount ? checkedState : `disabled`;
  return `<input
  type="radio"
  id="filter__${filterId}"
  class="filter__input visually-hidden"
  name="filter"
  ${state}
  />
  <label for="filter__${filterId}" class="filter__label">
    ${text} <span class="filter__${filterId}-count">${amount}</span></label
  >`;
};

export default getFilterTemplate;
