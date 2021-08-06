// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

// https://learn.javascript.ru/task/shuffle
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const generateType = () => {
  const types = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
  const randomType = getRandomInteger(0, types.length - 1);

  return types[randomType];
};

const generateDestinationName = () => {
  const destinations = ['Amsterdam', 'Chamonix', 'Geneva', 'Ankara', 'Moscow', 'Milan', 'Barcelona', 'Beijing', 'Beirut'];
  const randomDestination = getRandomInteger(0, destinations.length - 1);

  return destinations[randomDestination];
};

const generateDestinationDescription = () => {
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

export const generatePoint = () => {
  const type = generateType();

  return {
    icon: `${type}.png`,
    type,
    destination: {
      name: generateDestinationName(),
      description: generateDestinationDescription(),
      pics: generatePics(),
    },
  };
};
