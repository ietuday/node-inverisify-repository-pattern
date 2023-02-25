import { ObjectID, FilterQuery } from 'mongodb';
import { UserDocument } from '../repositories/user.repository';

export interface UserGetDTO {
  limit: number;
  pageNumber: number;
  filter: FilterQuery<Partial<UserDocument>>;
  path: string;
}

export interface UserCreateDTO {
  username: string;
  email: string;
  password: string;
  isActive?: boolean;
  otp?: number;

}

export interface UserUpdatePasswordDTO {
  id: ObjectID;
  password: string;
}

export interface UserUpdateEmailDTO {
  id: ObjectID;
  newEmail: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface ValidateOtpDto {
  email: string;
  otp?: string;
}
