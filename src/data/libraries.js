const libraries = [
  {
    id: 1,
    branch: 'downtown',
  },
  {
    id: 2,
    branch: 'riverside',
  },
];

const books = [
  {
    id: 1,
    title: 'The Awakening',
    author: [1, 2],
    branch: 2,
  },
  {
    id: 2,
    title: 'City of Glass',
    author: [2, 1],
    branch: 1,
  },
];

const authors = [
  {
    id: 1,
    name: 'Kate Chopin',
  },
  {
    id: 2,
    name: 'Paul Auster',
  },
];

export { libraries, books, authors };
