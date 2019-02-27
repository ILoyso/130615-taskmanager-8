// Random number - not including max value
export const generateRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

export const generateRandomBoolean = () => [true, false][generateRandomNumber(2)];

export const getRandomValue = (values) => values[generateRandomNumber(values.length)];

export const getRandomValues = (values, amount) => values.slice(values.length - generateRandomNumber(amount + 1));
