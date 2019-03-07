// Random number - not including max value
export const generateRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

export const generateRandomBoolean = () => generateRandomNumber(2) === 0;

export const getRandomValue = (values) => values[generateRandomNumber(values.length)];

export const getRandomValues = (values, amount) => values.slice(values.length - generateRandomNumber(amount + 1));

export const months = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`
];

export const createElement = (template) => {
  const element = document.createElement(`div`);
  element.innerHTML = template;
  return element.firstChild;
};
