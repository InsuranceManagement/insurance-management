import { CreateUserDto } from '@/modules/user/dto/create-user.dto'
import { ListUsersDto } from '@/modules/user/dto/list-users.dto'
import { LoginDto } from '@/modules/user/dto/login.dto'
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto'
import { UserService } from '@/modules/user/services/user.service'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() input: CreateUserDto) {
    return this.userService.create(input)
  }

  @Post('login')
  login(@Body() input: LoginDto) {
    return this.userService.login(input)
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.userService.getById(id)
  }

  @Get()
  list(@Query() query: ListUsersDto) {
    return this.userService.list(query)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateUserDto) {
    return this.userService.update(id, input)
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.delete(id)
  }
}
