import {generateRandomNumber} from './utils';
import getFilterTemplate from './make-filter';
import getTaskTemplate from './make-task';

const MAX_NUMBER_OF_TASKS = 7;

const filterContainer = document.querySelector(`.main__filter`);
const taskContainer = document.querySelector(`.board__tasks`);
const filters = [
  {
    name: `All`,
    isChecked: true
  },
  {
    name: `Overdue`
  },
  {
    name: `Today`
  },
  {
    name: `Favorites`
  },
  {
    name: `Repeating`
  },
  {
    name: `Tags`
  },
  {
    name: `Archive`
  }
];

const createFiltersTemplate = (filtersData) => {
  let filtersTemplate = ``;
  for (const filter of filtersData) {
    const isChecked = filter.isChecked;
    const randomNumber = isChecked ? generateRandomNumber(30, 1) : generateRandomNumber(30);
    filtersTemplate += getFilterTemplate(filter.name, randomNumber, isChecked);
  }
  return filtersTemplate;
};

const renderFilters = (filtersData) => {
  filterContainer.insertAdjacentHTML(`beforeend`, createFiltersTemplate(filtersData));
};

const createTasksTemplate = (amount) => {
  let tasksTemplate = ``;
  for (let i = 0; i < amount; i++) {
    tasksTemplate += getTaskTemplate();
  }
  return tasksTemplate;
};

const renderTasks = (amount) => {
  taskContainer.insertAdjacentHTML(`beforeend`, createTasksTemplate(amount));
};

const onFilterClick = (evt) => {
  const clickedTagName = evt.target.tagName.toLowerCase();
  if (clickedTagName === `input`) {
    taskContainer.innerHTML = ``;
    renderTasks(generateRandomNumber(10, 1));
  }
};

filterContainer.addEventListener(`click`, onFilterClick);

renderFilters(filters);
renderTasks(MAX_NUMBER_OF_TASKS);
