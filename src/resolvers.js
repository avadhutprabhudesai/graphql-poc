import { countries } from './data.js';

const resolvers = {
  Query: {
    countries: (parent, args) => {
      return args.name
        ? countries.filter((c) => c.name === args.name)
        : countries;
    },
  },
};

export default resolvers;
