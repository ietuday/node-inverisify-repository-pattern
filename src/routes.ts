/* eslint-disable import/no-extraneous-dependencies */
import { Application } from 'express';
import asyncWrap from './utils/asyncWrapper';
import UserController from './controllers/user.controller';
import TaskController from './controllers/task.controller';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import * as YAML from 'yamljs';
const swaggerDocument = YAML.load(path.join(__dirname + '/../../swaggerdoc.yaml'));

import container from './inversify';

/**
 * Configure all the services with the express application
 */
export default function (app: Application) {
  // Iterate over all our controllers and register our routes
  const UserControllerInstance = container.get<UserController>(UserController);
  const TaskControllerInstance = container.get<TaskController>(TaskController);
  /**
   * Configure swagger
   */
  app.use('/api-docs', swaggerUi.serve,   swaggerUi.setup(swaggerDocument));


  app.get('/users', asyncWrap(UserControllerInstance.find.bind(UserControllerInstance)));
  app.get('/users/:id', asyncWrap(UserControllerInstance.get.bind(UserControllerInstance)));
  app.post('/user', asyncWrap(UserControllerInstance.create.bind(UserControllerInstance)));
  app.post('/login', asyncWrap(UserControllerInstance.login.bind(UserControllerInstance)));
  app.post('/sendotp', asyncWrap(UserControllerInstance.sendOtp.bind(UserControllerInstance)));
  app.post('/validateotp', asyncWrap(UserControllerInstance.validateOtp.bind(UserControllerInstance)));
  app.get('/logout', asyncWrap(UserControllerInstance.logout.bind(UserControllerInstance)));


  app.post('/task', asyncWrap(TaskControllerInstance.create.bind(TaskControllerInstance)));
  app.delete('/task/:id', asyncWrap(TaskControllerInstance.delete.bind(TaskControllerInstance)));
  app.post('/tasks', asyncWrap(TaskControllerInstance.find.bind(TaskControllerInstance)));
  app.get('/task/:id', asyncWrap(TaskControllerInstance.get.bind(TaskControllerInstance)));
  app.put('/task', asyncWrap(TaskControllerInstance.update.bind(TaskControllerInstance)));
}
