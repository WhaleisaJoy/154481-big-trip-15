import { getRandomInteger, shuffle } from "../utils";

const offers = [
  {
    type: 'taxi',
    offers: [
      {
        name: 'uber',
        title: 'Order Uber',
        price: 20,
      },
    ],
  },

  {
    type: 'bus',
    offers: [],
  },

  {
    type: 'train',
    offers: [],
  },

  {
    type: 'ship',
    offers: [],
  },

  {
    type: 'drive',
    offers: [
      {
        name: 'car',
        title: 'Rent a car',
        price: 200,
      },
    ],
  },

  {
    type: 'flight',
    offers: [
      {
        name: 'luggage',
        title: 'Add luggage',
        price: 30,
      },
      {
        name: 'comfort',
        title: 'Switch to comfort class',
        price: 100,
      },
      {
        name: 'meal',
        title: 'Add meal',
        price: 15,
      },
      {
        name: 'seats',
        title: 'Choose seats',
        price: 5,
      },
      {
        name: 'train',
        title: 'Travel by train',
        price: 40,
      },
    ],
  },

  {
    type: 'check-in',
    offers: [
      {
        name: 'breakfast',
        title: 'Add breakfast',
        price: 50,
      },
    ],
  },

  {
    type: 'sightseeing',
    offers: [
      {
        name: 'tickets',
        title: 'Book tickets',
        price: 40,
      },
      {
        name: 'lunch',
        title: 'Lunch in city',
        price: 30,
      },
    ],
  },

  {
    type: 'restaurant',
    offers: [],
  },
];

const generateOffers = (type) => {
  const offerByType = offers.filter((offer) => offer.type === type);
  const [offer] = offerByType;
  const offersByType = offer.offers;

  if (offersByType) {
    const copyOfOffersByType = [...offersByType];
    if (copyOfOffersByType.length > 1) shuffle(copyOfOffersByType);
    const randomOffersAmount = getRandomInteger(0, offersByType.length);
    const availableOfers = copyOfOffersByType.slice(0, randomOffersAmount);

    return availableOfers;
  }
};

export { generateOffers };
