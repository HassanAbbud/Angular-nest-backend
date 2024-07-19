import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';
import { LogInDto } from './dto/login.dto';

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) 
    private userModel: Model<User>
  ){}

  async create(createUserDto: CreateUserDto): Promise<User>{
    
    try {
      
      const {password, ...userData} = createUserDto;

      const newUser = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData
      });

      await newUser.save();
      //Return without password
      const {password:_, ...user } = newUser.toJSON();
      return user;

    } catch (error){
      if( error.code === 11000 ) {
        throw new BadRequestException(`${ createUserDto.email } already exists!`)
      }
      throw new InternalServerErrorException('Something terribe happen!!!');
    }
    // Encrypt password
    // Save user
    // Generate JWT
  }

  async login( loginDto: LogInDto){
    const {email, password} = loginDto;

    const user = await this.userModel.findOne({email});

    if (!user) {
      // Handle case where user with the provided email does not exist
      throw new UnauthorizedException("Invalid credentials - email");
    }

    if(!bcryptjs.compareSync(password, user.password)) {
      throw new UnauthorizedException("Invalid credentials - password")
    };

    const {password:_, ...userInfo } = user
    return{
      ...userInfo,
      token: "ABC"
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
