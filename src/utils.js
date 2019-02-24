// Random number - not including max value
export const generateRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;
