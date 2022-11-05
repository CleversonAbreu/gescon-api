import { Injectable, Inject } from '@nestjs/common';
import { ResponseDto } from 'src/dto/response.dto';
import { Repository } from 'typeorm';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async add(data:UserCreateDto): Promise<ResponseDto>{
    let user = new User()
    user.email = data.email;
    user.password = bcrypt.hashSync(data.password,8);
    return this.userRepository.save(user)
    .then((res)=>{
      return <ResponseDto>{
        msg:'Usuario cadastrado com sucesso'
      }
    })
    .catch((error)=>{
      return <ResponseDto>{
        msg: 'Erro ao cadastrar usuario'
      }
    })
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { 
        email: email 
      } 
    });
  }
}