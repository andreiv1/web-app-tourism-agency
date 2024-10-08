const { fakerRO, faker } = require("@faker-js/faker");

const getStartDate = () => {
  const date = faker.date.future({
    years: 1,
  });
  
  return date.toISOString().split("T")[0];
};
const getEndDate = (start) => {
  const daysToAdd = faker.number.int({ min: 2, max: 10 });
  const endDate = new Date(start);
  endDate.setDate(endDate.getDate() + daysToAdd);
  return endDate.toISOString().split("T")[0];
};

const getDestinations = () => {
  const numberOfDestinations = faker.number.int({ min: 1, max: 5 });
  const destinations = [];
  for (let i = 0; i < numberOfDestinations; i++) {
    destinations.push(fakerRO.location.city());
  }
  return destinations;
};

const getItinerary = (startDate, endDate) => {
  x = {};
  const current = new Date(startDate);
  const end = new Date(endDate);
  while(current <= end){
    const numberOfObjectives = faker.number.int({ min: 1, max: 5 });
    const objectives = [];
    for (let i = 0; i < numberOfObjectives; i++) {
      objectives.push(faker.lorem.words(3, 10));
    }
    x[current.toISOString().split("T")[0]] = {
      title: faker.lorem.sentence({min: 3, max: 10}),
      description: faker.lorem.sentences({min: 2, max: 4}),
      objectives: objectives,
    };
    current.setDate(current.getDate() + 1);
  }
  return x;
};

function roundToNearest5(number) {
    return Math.round(number / 5) * 5;
}

function generateTrip() {
  const trip = {};
  const words = faker.lorem.words({min: 5, max: 12});
  trip.title = words.charAt(0).toUpperCase() + words.slice(1);
  trip.description = faker.lorem.sentences({min: 3, max: 20})
  trip.startDate = new Date(getStartDate());
  trip.endDate = new Date(getEndDate(trip.startDate));
  trip.departure = "București";
  trip.destinations = getDestinations();
  trip.minParticipants = roundToNearest5(faker.number.int({ min: 5, max: 20 }));
  trip.maxParticipants = roundToNearest5(faker.number.int({ min: 20, max: 50 }));
  trip.price = roundToNearest5(faker.number.int({ min: 100, max: 9000 }));
  trip.currency = "RON";
  trip.transport = faker.helpers.arrayElements(["bus", "plane", "ship"], {
    min: 1,
    max: 3,
  });
  trip.itinerary = getItinerary(trip.startDate, trip.endDate);
  return trip;
}

module.exports = {
  generateTrip,
};
