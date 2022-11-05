import { Injectable, Inject, HttpException, HttpStatus, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token } from './token.entity';
import { UserService } from 'src/user/user.service'  
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class TokenService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private tokenRepository: Repository<Token>,
    private userService: UserService,
    @Inject(forwardRef(()=>AuthService))
    private authService: AuthService
  ) {}

 
  async saveToken(token:string,username:string) {
    let objToken = await this.tokenRepository.findOne({
      where: { 
        username: username 
      } 
    })
    if(objToken){
      this.tokenRepository.update(objToken.id,{
        hash:token
      })
    }else{
      this.tokenRepository.insert({
        hash:token,
        username:username
      })
    }
  }
  async refreshToken(token:string){
    let objToken = await this.tokenRepository.findOne({
      where: { 
        hash: token 
      } 
    })  
    if(objToken){
      let user = await this.userService.findOne(objToken.username)
      return this.authService.login(user)
    }else{
        return new HttpException({
          errorMessage:'Token invalido'
        },HttpStatus.UNAUTHORIZED)
    }
  }
}