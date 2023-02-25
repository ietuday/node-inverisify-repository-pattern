import { injectable } from 'inversify';
import { Collection, FilterQuery, FindOneOptions, ObjectID } from 'mongodb';
import db from '../database';
import Repository, { IRepository } from './repository';


export type MongoQuerySpec = { query: FilterQuery<any>, options?: FindOneOptions }
/**
 * The schema definition. In other word,
 * A Document of the user collection contains following fields.
 */
export interface TaskDocument {
  _id: ObjectID;
  title: string;
  description: string;
  deletedAt?: Date;
  createdAt?: Date;
  _isDeleted?:boolean;
  isActive?:boolean
}

/**
 * Repository interface.
 */
export interface ITaskRepository extends IRepository<TaskDocument> {
  allTask(query:MongoQuerySpec)
}

/**
 * User repository. In the constructor we pass the collection name to the
 * parent constructor.
 *
 */
@injectable()
export default class TaskRepository extends Repository<TaskDocument> implements ITaskRepository {
  private  container: Collection;
  constructor() {
    
    super('tasks'); // Passing collection name
    this.container = db.getCollection('tasks');
  }

  public async allTask(query){
    console.log("query",query.query)
    console.log("query",{...query.options})
     return await this.container.find(query.query,query.options).toArray();
        

  }
}
