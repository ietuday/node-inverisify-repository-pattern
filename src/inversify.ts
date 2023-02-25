import { Container } from 'inversify';
import { TYPES } from './types';
import UserRepository, { IUserRepository } from './repositories/user.repository';
import UserService, { IUserService } from './services/user.service';
import UserController from './controllers/user.controller';

import TaskRepository, { ITaskRepository } from './repositories/task.repository';
import TaskService, { ITaskService } from './services/task.service';
import TaskController from './controllers/task.controller';

const container = new Container({ defaultScope: 'Singleton' });
container.bind(UserController).to(UserController);
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IUserService>(TYPES.UserService).to(UserService);

container.bind(TaskController).to(TaskController);
container.bind<ITaskRepository>(TYPES.TaskRepository).to(TaskRepository);
container.bind<ITaskService>(TYPES.TaskService).to(TaskService);

export default container;
