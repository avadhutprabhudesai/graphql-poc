import { countries } from './data/countries.js';
import { authors, books, libraries } from './data/libraries.js';
import { compose, prop } from 'ramda';
import {
  flatMapArrayByKey,
  mapIdsToObjects,
  removePrimitiveDulicates,
} from './utils/index.js';
import { employees } from './data/employees.js';
import { GraphQLError, GraphQLScalarType, Kind } from 'graphql';
import isEmail from 'validator/lib/isEmail.js';
import { persons } from './data/Person.js';

const validateEmail = (val) => {
  if (isEmail(val)) {
    return val;
  }
  throw new GraphQLError('Not a valid email');
};

const EmailAddressScalar = new GraphQLScalarType({
  name: 'EmailAddress',
  description: 'A valid Email address',
  parseValue: validateEmail,
  serialize: validateEmail,
  parseLiteral: (ast) => {
    if (ast.kind === Kind.STRING) {
      return ast;
    }
    throw new GraphQLError(
      `An email ast should be STRING but received ${ast.kind}`
    );
  },
});

const resolvers = {
  EmailAddress: EmailAddressScalar,
  alphaCode: {
    two: 'alpha2Code',
    three: 'alpha3Code',
  },
  Query: {
    countries: (parent, args) => {
      return args.name
        ? countries.filter((c) => c.name === args.name)
        : countries;
    },
    libraries: () => {
      return libraries;
    },
    books: () => {
      return books;
    },
    authors: () => {
      return authors;
    },
    employee: (parent, args) => {
      return employees.find((e) => e.id === args.id);
    },
    users: () => persons,
    shopUser: async (parent, args, { dataSources: { users } }) => {
      try {
        const user = await users.findByFields({ id: 1 });
        return user;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Library: {
    books: (parent) => {
      return books.filter((b) => b.branch === parent.id);
    },
    authors: (parent) => {
      const booksInLibrary = books.filter((b) => b.branch === parent.id);
      return compose(
        mapIdsToObjects(authors),
        removePrimitiveDulicates(),
        flatMapArrayByKey('author')
      )(booksInLibrary);
    },
  },
  Book: {
    authors: (parent) => {
      return compose(
        mapIdsToObjects(authors),
        removePrimitiveDulicates(),
        prop('author')
      )(parent);
    },
    libraryBranch: (parent) => {
      return libraries.find((l) => l.id === parent.branch).branch;
    },
  },
  Country: {
    code: (parent, args) => {
      return parent[args.type];
    },
  },
  Employee: {
    __resolveType(obj) {
      if (obj.department === 'ENG') {
        return 'Engineer';
      }
      if (obj.department === 'MGR') {
        return 'Manager';
      }
      if (obj.department === 'ACC') {
        return 'Accountant';
      }
    },
  },
  Searchable: {
    __resolveType(obj) {
      if (obj.title) {
        return 'Book';
      }
      if (obj.name) {
        return 'Author';
      }
    },
  },
};

export default resolvers;
