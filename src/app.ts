import 'reflect-metadata';
import express, { Application } from 'express';
import { config } from 'dotenv';
import cors from 'cors';
import { errorHandler } from './middlewares/error';
import passport from 'passport';
import { jwtStrategy } from './config/passport';
import { sequelize, initDb } from './config/configs';
import { graphqlHTTP } from 'express-graphql';
import UserModel from './models/user.model';
import ListModel from './models/list.model';
import TaskModel from './models/task.model';
import graphqlSchema from './graphql/schema';
import { authMiddleware } from './middlewares/validate';

config();

const app: Application = express();
const port = 3500;

// initialize db to create table
initDb();
// MySQL Database
sequelize
  .authenticate()
  .then(() => {
    UserModel.sync({ alter: true });
    ListModel.sync({ alter: true });
    TaskModel.sync({ alter: true });
    sequelize.sync();
    console.log('Connection has been established successfully.');
  })
  .catch((error) => console.error('Unable to connect to the database:', error));

// app.use(authMiddleware);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

app.use('/graphql', graphqlHTTP(graphqlSchema));

// handle error
app.use(errorHandler);

export default app;

app.listen(process.env.PORT || port, () => {
  console.log(`App listening on port ${port}`);
});
