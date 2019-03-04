import {generateRandomNumber} from './utils';
import makeFilter from './make-filter';
import generateTasks from './generate-tasks';
import filters from './filters';

const MAX_NUMBER_OF_TASKS = 7;

const filterContainer = document.querySelector(`.main__filter`);
const taskContainer = document.querySelector(`.board__tasks`);

const createFiltersTemplate = (filtersData) => {
  let filtersTemplate = ``;
  for (const filter of filtersData) {
    const isChecked = filter.isChecked;
    const randomNumber = isChecked ? generateRandomNumber(30, 1) : generateRandomNumber(30);
    filtersTemplate += makeFilter(filter.name, randomNumber, isChecked);
  }
  return filtersTemplate;
};

const renderFilters = (filtersData) => {
  filterContainer.insertAdjacentHTML(`beforeend`, createFiltersTemplate(filtersData));
};

const renderTasks = (dist, amount) => {
  dist.insertAdjacentHTML(`beforeend`, generateTasks(amount).join(``));
};

const onFilterClick = (evt) => {
  const clickedTagName = evt.target.tagName.toLowerCase();
  if (clickedTagName === `input`) {
    taskContainer.innerHTML = ``;
    renderTasks(taskContainer, generateRandomNumber(10, 1));
  }
};

filterContainer.addEventListener(`click`, onFilterClick);

renderFilters(filters);
renderTasks(taskContainer, MAX_NUMBER_OF_TASKS);
