import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { my_dto } from './dto/my_dto.dto';

let User=[];
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('allusers')
  getUsers() {
    return User;
  }


  @Post('addUsers')
  addUser(@Body() create:my_dto ){
    User.push(create);
    return 'user added';
  }
  @Get('user/:name')
  getuser(@Param('name')name:string)
  {
    return User.find((User)=>User.name===name);
  }

  @Get('userid/:id')
  getid(@Param('id') id: number) {
    if(User.find((User) => User.id == id)){
      return User.find((User) => User.id == id);
    }else{
      return "User Not Found";
    }
}

@Post('userdelete/:id')
deleteUser(@Param('id') id: number) {
  User = User.filter((user) => user.id !== id);
  return 'User deleted';
}


}
