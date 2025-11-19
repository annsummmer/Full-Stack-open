const {ApolloServer} = require('@apollo/server');
const {startStandaloneServer} = require('@apollo/server/standalone');

// let authors = [
//   {
//     name: 'Robert Martin',
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: 'Martin Fowler',
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963
//   },
//   {
//     name: 'test',
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821
//   },
//   {
//     name: 'Joshua Kerievsky', // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: 'Sandi Metz', // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ]
//
// let books = [
//   {
//     title: 'Clean Code',
//     published: 2008,
//     author: 'Robert Martin',
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Agile software development',
//     published: 2002,
//     author: 'Robert Martin',
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ['agile', 'patterns', 'design']
//   },
//   {
//     title: 'Refactoring, edition 2',
//     published: 2018,
//     author: 'Martin Fowler',
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring']
//   },
//   {
//     title: 'Refactoring to patterns',
//     published: 2008,
//     author: 'Joshua Kerievsky',
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'patterns']
//   },
//   {
//     title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
//     published: 2012,
//     author: 'Sandi Metz',
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ['refactoring', 'design']
//   },
//   {
//     title: 'Crime and test',
//     published: 1866,
//     author: 'test',
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'crime']
//   },
//   {
//     title: 'Demons and test',
//     published: 1872,
//     author: 'test',
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ['classic', 'revolution']
//   },
// ]

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const Author = require('./models/authorSchema');
const Book = require('./models/bookSchema');
const User = require('./models/userSchema');
const {GraphQLError} = require("graphql/error");

require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log('connecting to', MONGODB_URI);

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB');
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message);
  });

const jwt = require('jsonwebtoken');

const typeDefs = `
  type author {
    name: String!
    id: ID!
    born: Int
    booksCount: Int
  }
  type book {
    title: String!
    published: Int
    author: author!
    id: ID!
    genres: [String!]!
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type AllBooksResponse {
    books: [book]!
    genres: [String]!
  }
  type Query {
    me: User
    bookCount: Int
    authorCount: Int
    allAuthors: [author]
    allBooks(author: String, genre: String): AllBooksResponse!
  }
  type Mutation {
    addBook(book: AddBookInput!): book
    editAuthor(author: EditAuthorInput!): author
    createUser(username: String! favoriteGenre: String): User
    login(username: String! password: String!): Token
  }
  input AddBookInput {
    title: String!
    published: Int
    author: String!
    genres: [String!]!
  }
  input EditAuthorInput {
    name: String!
    born: Int
  }
`;

const resolvers = {
  Query: {
    me: (root, args, context) => {
      return context.currentUser
    },
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allAuthors: async () => {
      const authors = await Author.find({});
      return authors;
    },
    allBooks: async (root, args) => {
      let books = await Book.find({}).populate(
        'author',
      );
      const genres = [...new Set(books.flatMap(({genres}) => genres))];

      if (args.author) {
        books = books.filter(book => book.author.name === args.author);
      }
      if (args.genre) {
        books = books.filter(book => book.genres.includes(args.genre));
      }
      return {books, genres};
    },
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre
      });

      return user.save()
        .catch(error => {
          throw new GraphQLError('Creating the user failed', {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args.username,
              error
            }
          })
        });
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'test' ) {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }
      try {
        const book = new Book({...args.book});

        let author = await Author.findOne({name: args.book.author});
console.log(book);
        if (!author) {
          author = new Author({
            name: args.book.author,
            booksCount: 1
          });
        } else {
          author.booksCount += 1;
        }
        author.save();

        book.author = author._id;
        await book.save();

        return book.populate('author');
      } catch (error) {
        console.log(error);
        throw new GraphQLError('Adding book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.book,
            error,
          }
        });
      }
    },
    editAuthor: async (_, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('wrong credentials', {
          extensions: { code: 'BAD_USER_INPUT' }
        })
      }

      try {
        const updatedAuthor = await Author.findOneAndUpdate(
          {name: args.author.name},
          {$set: {born: args.author.born}},
          {new: true}
        );
        return updatedAuthor;
      } catch (error) {
      console.log(error);
      throw new GraphQLError('edit author failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: args.author.born,
          error,
        }
      });
    }

    },
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: {port: 4000},
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), process.env.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id);

      return {currentUser}
    }
  },
}).then(({url}) => {
  console.log(`Server ready at ${url}`)
});
