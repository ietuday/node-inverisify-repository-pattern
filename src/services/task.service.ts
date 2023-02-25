import { injectable, inject } from 'inversify';
import paginate, { Pagination } from '../utils/pagination';
import {TaskCreateDTO, TaskUpdateDTO} from '../dto/task.dto';
import { ITaskRepository, TaskDocument } from '../repositories/task.repository';
import {MongoQuerySpec} from '../repositories/repository';
import { TYPES } from '../types';
import { ObjectId } from 'mongodb';


/**
 * User without sensitive fields.
 * This is useful when returning data to client.
 */
export type NormalizedTaskDocument = Pick<TaskDocument, '_id' | 'title' | 'description'>;

/**
 * Interface for UserService
 */
export interface ITaskService {
  createTask(data: TaskCreateDTO): Promise<void>;
  getAllTasks(query: MongoQuerySpec): Promise<Pagination<TaskDocument>>;
  updateTask(data: TaskCreateDTO): Promise<TaskCreateDTO>;
  deleteTask(id: ObjectId): Promise<any>;
  normalizeContent(data: string): string;
}

/**
 * The actual class that contains all the business logic related to users.
 * Controller sanitize/validate(basic) and sends data to this class methods.
 */
@injectable()
export default class TaskService implements ITaskService {

  @inject(TYPES.TaskRepository) private taskRepository: ITaskRepository;

  public async createTask(data: TaskCreateDTO): Promise<any> {


     return await this.taskRepository.create(data);
  }

  public async getAllTasks(query: MongoQuerySpec): Promise<any> {
    let documents: TaskDocument[]; 
    documents = await this.taskRepository.allTask(query);
    console.log("documents",documents)
   const data =  paginate(documents, query.options.limit, query.pageNumber, query.path);
   console.log("data",data)
   return data;
     //return paginate(documents, getUserDto.limit, getUserDto.pageNumber);
  }

  public async updateTask(data: TaskUpdateDTO): Promise<any> {
   const  {taskid,...payload} = data;
   console.log("taskid",taskid)
   console.log("payload",payload)
    await this.taskRepository.update({_id: data.taskid }, payload); 
   
  }

  public async deleteTask(taskid: string): Promise<any> {    
    await this.taskRepository.update({_id: taskid }, {_isDeleted:true,isActive:true}); 
  }
  

  public normalizeContent(data: string): string {
    return data.toLowerCase();
  }

}
