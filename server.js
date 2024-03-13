const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');

// Modelo de dados para usuários
const users = [];

// Definição do tipo de dados
const schema = buildSchema(`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  input UserInput {
    name: String!
    email: String!
  }

  type Query {
    getUser(id: ID!): User
    getUsers: [User]
    hello: String
  }

  type Mutation {
    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User
  }
  
  type Mensagem {
    hello: String
  }
`);

// Funções resolver para cada operação CRUD
const root = {
    hello: () => {
      return "Crud GraQL"
    },
    getUser: ({ id }) => {
      return users.find(user => user.id === id);
    },
    getUsers: () => {
      return users;
    },
    createUser: ({ input }) => {
      const newUser = { id: String(users.length + 1), ...input };
      users.push(newUser);
      return newUser;
    },
    updateUser: ({ id, input }) => {
      const index = users.findIndex(user => user.id === id);
      if (index === -1) return null;
      users[index] = { ...users[index], ...input };
      return users[index];
    },
    deleteUser: ({ id }) => {
      const index = users.findIndex(user => user.id === id);
      if (index === -1) return null;
      const deletedUser = users.splice(index, 1)[0];
      return deletedUser;
    },
  };

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, // Ativa o GraphiQL: uma IDE interativa no navegador
}));

app.listen(4000, () => console.log('Servidor executando em http://localhost:4000/graphql'))
