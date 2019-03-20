/**
 * Function for generate random number (not including max value)
 * @param {Number} max
 * @param {Number} min [min="0"]
 * @return {Number}
 */
export const generateRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;


/**
 * Function for generate random boolean - true/false
 * @return {Boolean}
 */
export const generateRandomBoolean = () => generateRandomNumber(2) === 0;

/**
 * Function for find random value in array
 * @param {Array} values
 * @return {*}
 */
export const getRandomValue = (values) => values[generateRandomNumber(values.length)];


/**
 * Function for find few (1 or more) random values in array
 * @param {Array} values
 * @param {Number} amount
 * @return {Array}
 */
export const getRandomValues = (values, amount) => values.slice(values.length - generateRandomNumber(amount + 1));


/**
 * Function for creating DOM element
 * @param {String} template
 * @return {Node}
 */
export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstChild;
};


/**
 * Function for creating DOM elements (with no one wrapper)
 * @param {String} template
 * @return {Node}
 */
export const createElements = (template) => {
  const element = document.createElement(`template`);
  element.innerHTML = template;
  return element.content;
};
