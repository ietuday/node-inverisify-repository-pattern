import { injectable, inject } from 'inversify';
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import isEmail from 'validator/lib/isEmail';
import isLength from 'validator/lib/isLength';
import { BadRequestError, MissingFieldError } from '../errors/app.errors';
import StaticStringKeys from '../constants';
import { UserGetDTO as UserGetDto, UserCreateDTO, UserUpdatePasswordDTO, UserUpdateEmailDTO, LoginDto, ValidateOtpDto } from '../dto/user.dto';
import { IUserService } from '../services/user.service';
import { getValidObjectId, response } from '../utils/utils';
import { IUserRepository, UserDocument } from '../repositories/user.repository';
import { TYPES } from '../types';
import { FilterQuery } from 'mongodb';

export enum UserRoles {
  ADMIN = 1,
  MODERATOR = 2,
  VISITOR = 3,
}

@injectable()
export default class UserController {
  @inject(TYPES.UserRepository) private userRepository: IUserRepository;

  @inject(TYPES.UserService) private userService: IUserService;

  private limit: number;

  constructor() {
    this.limit = 20;
  }

  public async find(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : this.limit;
    const pageNumber = req.query.page ? parseInt(req.query.page as string) : 1;

    const getUserDto: UserGetDto = {
      pageNumber,
      limit,
      filter: req.query.filter as FilterQuery<Partial<UserDocument>>,
      path: req.path,
    };

    const response = await this.userService.getAllUsers(getUserDto);
    res.send(response);
  }

  public async get(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    const user = await this.userRepository.get(getValidObjectId(req.params.id), { "username": 1, "email": 1, "isActive": 1 });
    res.send(user);
  }

  /**
   * Create user
   *
   * @requires username An unique user name
   * @requires password A valid password
   * @requires email A valid email
   **/
  public async create(req: ExpressRequest, res: ExpressResponse) {

    if (!req.body.email) {
      throw new MissingFieldError('email');
    }

    if (!req.body.username) {
      throw new MissingFieldError('username');
    }

    if (!req.body.password) {
      throw new MissingFieldError('password');
    }

    if (!isEmail(req.body.email)) {
      throw new BadRequestError(StaticStringKeys.INVALID_EMAIL);
    }

    if (!isLength(req.body.password.trim(), { min: 4, max: 20 })) {
      throw new BadRequestError(StaticStringKeys.INVALID_PASSWORD);
    }

    const createUserDto: UserCreateDTO = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    };

    const result = await this.userService.createUser(createUserDto);
    delete result["password"];
    res.status(201).send(response(null, result, 'user created successfully'));
  }

  /**
   * Update email
   */
  public async updateEmail(req: ExpressRequest, res: ExpressResponse) {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    if (!req.body.email) {
      throw new MissingFieldError('email');
    }

    if (!isEmail(req.body.email)) {
      throw new BadRequestError(StaticStringKeys.INVALID_EMAIL);
    }

    const updateUserDto: UserUpdateEmailDTO = {
      id: getValidObjectId(req.params.id),
      newEmail: req.body.email,
    };

    await this.userService.updateEmail(updateUserDto);

    res.sendStatus(204);
  }

  /**
   * Update password
   */
  public async updatePassword(req: ExpressRequest, res: ExpressResponse) {
    if (!req.params.id) {
      throw new MissingFieldError('id');
    }

    if (!req.body.password) {
      throw new MissingFieldError('password');
    }

    const updatePasswordDto: UserUpdatePasswordDTO = {
      id: getValidObjectId(req.params.id),
      password: req.body.password,
    };

    await this.userService.updatePassword(updatePasswordDto);

    res.sendStatus(204);
  }

  public async update(_req: ExpressRequest, _res: ExpressResponse): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async delete(_req: ExpressRequest, _res: ExpressResponse): Promise<void> {
    throw new Error('Method not implemented.');
  }

  public async login(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.body.email) {
      throw new MissingFieldError('email');
    }

    if (!req.body.password) {
      throw new MissingFieldError('password');
    }

    const loginDto: LoginDto = {
      email: req.body.email,
      password: req.body.password,
    };
    const user = await this.userService.login(loginDto);
    res.send(user);
  }

  public async logout(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    const token =
      req.body.token || req.query.token || req.headers["x-access-token"];
    if (!token) {
      throw new MissingFieldError('token');
    }
    res.send(await this.userService.logout(token));
  }

  public async sendOtp(req: ExpressRequest, res: ExpressResponse): Promise<void> {
    if (!req.body.email) {
      throw new MissingFieldError('email');
    }
    const otpDto: ValidateOtpDto = {
      email: req.body.email,
    };
    await this.userService.sendOtp(otpDto);
    res.status(200).send(response(null, null, 'otp send successfully'));
  }

  public async validateOtp(req: ExpressRequest, res: ExpressResponse): Promise<void> {

    if (!req.body.email) {
      throw new MissingFieldError('email');
    }
    const otpDto: ValidateOtpDto = {
      email: req.body.email,
      otp: req.body.otp,
    };
    const user = await this.userService.validateOtp(otpDto);
    res.send(user);
  }

}


