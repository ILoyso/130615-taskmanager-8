import getFilterTemplate from './make-filter';
import getTaskTemplate from './make-task';

const filterContainer = document.querySelector(`.main__filter`);
const taskContainer = document.querySelector(`.board__tasks`);
const filtersData = [
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

const MAX_NUMBER_OF_TASKS = 7;

// Random number - not including max value
const generateRandomNumber = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

const createFiltersTemplate = (filters) => {
  let filtersTemplate = ``;
  for (const filter of filters) {
    const isChecked = filter.isChecked;
    const randomNumber = isChecked ? generateRandomNumber(30, 1) : generateRandomNumber(30);
    filtersTemplate += getFilterTemplate(filter.name, randomNumber, isChecked);
  }
  return filtersTemplate;
};

const renderFilters = (filters) => {
  filterContainer.insertAdjacentHTML(`beforeend`, createFiltersTemplate(filters));
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

renderFilters(filtersData);
renderTasks(MAX_NUMBER_OF_TASKS);
