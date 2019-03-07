import {generateRandomNumber, generateRandomBoolean, getRandomValue, getRandomValues} from './utils';

const Time = {
  WEEK: 7,
  DAY: 24,
  HOUR: 60,
  MINUTE: 60,
  SECOND: 1000
};

const titles = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];

const tags = new Set([
  `homework`,
  `theory`,
  `practice`,
  `intensive`,
  `keks`,
  `important`,
  `entertaiment`
]);

const colors = new Set([
  `black`,
  `yellow`,
  `blue`,
  `green`,
  `pink`
]);

/**
 * Function for generate random boolean for every day
 * @return {Object}
 */
const getDays = () => ({
  'mo': generateRandomBoolean(),
  'tu': generateRandomBoolean(),
  'we': generateRandomBoolean(),
  'th': generateRandomBoolean(),
  'fr': generateRandomBoolean(),
  'sa': generateRandomBoolean(),
  'su': generateRandomBoolean()
});


/**
 * Function for generate mock data for tasks
 * @return {Object}
 */
export default () => ({
  title: getRandomValue(titles),
  dueDate: Date.now() + generateRandomNumber(Time.WEEK + 1, -Time.WEEK) * Time.DAY * Time.HOUR * Time.MINUTE * Time.SECOND,
  tags: getRandomValues(Array.from(tags), 3),
  picture: `http://picsum.photos/100/100?r=${generateRandomNumber(100)}`,
  color: getRandomValue(Array.from(colors)),
  repeatingDays: getDays(),
  isFavorite: generateRandomBoolean(),
  isDone: generateRandomBoolean()
});
