import { getRandomInteger, shuffle } from '../utils/common';

const generateName = () => {
  const destinations = ['Amsterdam', 'Chamonix', 'Geneva', 'Ankara', 'Moscow', 'Milan', 'Barcelona', 'Beijing', 'Beirut'];
  const randomDestination = getRandomInteger(0, destinations.length - 1);

  return destinations[randomDestination];
};

const generateDescription = () => {
  const MAX_SIZE = 5;
  const descriptions = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
    'Aliquam erat volutpat.',
    'Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
  ];

  const copyOfDescriptions = [...descriptions];
  shuffle(copyOfDescriptions);
  const randomDescriptionLength = getRandomInteger(0, MAX_SIZE);
  const description = copyOfDescriptions.slice(0, randomDescriptionLength).join(' ');

  return description;
};

const generatePics = () => {
  const picsURL = 'http://picsum.photos/248/152?r=';
  const randomPicsAmount = getRandomInteger(0, 10);
  const pics = [];

  for (let i = 0; i < randomPicsAmount; i++) {
    const randomPicNum = getRandomInteger(0, 10);
    pics.push(picsURL + randomPicNum);
  }

  return pics;
};


export const generateDestination = () =>  ({
  name: generateName(),
  description: generateDescription(),
  pics: generatePics(),
});
