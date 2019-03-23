export const colorsHex = {
  pink: `#ff3cb9`,
  yellow: `#ffe125`,
  blue: `#0c5cdd`,
  black: `#000000`,
  green: `#31b55c`,
};


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
 * Function for find few random array elements
 * @param {Array} values
 * @param {Number} amount
 * @return {Array}
 */
export const getRandomArrayElements = (values, amount) => {
  let arrayCopy = Array.from(values);
  let newArray = [];

  while (amount > 0) {
    newArray.push(arrayCopy.splice([generateRandomNumber(arrayCopy.length)], 1).join(``));
    amount--;
  }
  return newArray;
};


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
 * Function for check is n number or not
 * @param {*} n
 * @return {Boolean}
 */
export const isNumeric = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n);
};
