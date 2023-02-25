import { injectable, inject } from 'inversify';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import { MissingFieldError } from '../errors/app.errors';
import {MongoQuerySpec} from '../repositories/repository'
import { ITaskService } from '../services/task.service';
import { getValidObjectId, response } from '../utils/utils';
import { ITaskRepository} from '../repositories/task.repository';
import { TYPES } from '../types';
import { validatePayload } from '../utils/validators';
import { TaskCreateSchema, TaskUpdateSchema } from '../dto/model/task.model';

@injectable()
export default class TaskController {
  @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository;

  @inject(TYPES.TaskService) private taskService: ITaskService;

  private limit: number;

  constructor() {
    this.limit = 20;
  }

  public async find(req: ExpressRequest, res: ExpressResponse): Promise<void> {

    const {limit , pageNumber} = req.body
    console.log("limit"+limit+"pagenumber"+pageNumber)
    // const limit = req.query.limit ? parseInt(req.query.limit as string) : this.limit;
    // const pageNumber = req.query.page ? parseInt(req.query.page as string) : 1;

    const query: MongoQuerySpec = {
      query: {status:"Pending"},
      options:{
        limit: limit || this.limit,
        //sort: {DocumentCreatedOn: -1},
        projection: {title:1,description:1,status:1},
        skip: (pageNumber  > 0) ? limit * (pageNumber - 1) : 0        
      },
      pageNumber:pageNumber,
      path: req.path
    }   
    console.log("queryquery",query)
    const result = await this.taskService.getAllTasks(query);
    res.status(200).send(response(null,result,'data fetch successfully'));
  }

  public async get(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const task = await this.taskRepository.get(getValidObjectId(req.params.id));
    res.send(task);
  }

  /**
   * Create user
   *
   * @requires title A valid title
   * @requires description A valid description
   **/
  public async create(req: ExpressRequest, res: ExpressResponse) {
    const validate:any = await validatePayload(TaskCreateSchema, req.body);
    if (validate && validate.isValid && validate.statusCode == 200) {
       const result = await this.taskService.createTask(req.body);
       res.status(201).send(response(null,result,'task created'));
    }
    else res.status(validate.statusCode).send(response(validate.error,null,null));
   }

  public async update(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    
    const validate:any = await validatePayload(TaskUpdateSchema, req.body);
    if (validate && validate.isValid && validate.statusCode == 200) {
      req.body.taskid = getValidObjectId(req.body.taskid)
      const result = await this.taskService.updateTask(req.body)
      console.log("resultt",result)
      res.status(204).send(response(null,null,'task created'))
    }else res.status(validate.statusCode).send(response(validate.error,null,null));
    
   // res.send(await this.taskService.updateTask(getValidObjectId(req.params.id), updateTaskDto));


  }

  public async delete (req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.params.id) {
        throw new MissingFieldError('id');
      }
  
      res.send(await this.taskService.deleteTask(getValidObjectId(req.params.id)));
  }

}
