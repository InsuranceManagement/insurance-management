import { Public } from '@/common/auth/auth.decorators'
import { DeleteManyDto } from '@/common/dto/delete-many.dto'
import { CreateUserDto } from '@/modules/user/dto/create-user.dto'
import { LoginDto } from '@/modules/user/dto/login.dto'
import { UpdateUserDto } from '@/modules/user/dto/update-user.dto'
import { UserService } from '@/modules/user/services/user.service'
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'
import { minutes, Throttle } from '@nestjs/throttler'
import { ForgotPasswordDto } from './dto/forgot-password.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'

const AUTH_RATE_LIMIT_WINDOW = minutes(1)

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Throttle({ default: { limit: 5, ttl: AUTH_RATE_LIMIT_WINDOW } })
  @Post()
  create(@Body() input: CreateUserDto) {
    return this.userService.create(input)
  }

  @Public()
  @Throttle({ default: { limit: 5, ttl: AUTH_RATE_LIMIT_WINDOW } })
  @Post('login')
  login(@Body() input: LoginDto) {
    return this.userService.login(input)
  }

  @Public()
  @Throttle({ default: { limit: 3, ttl: AUTH_RATE_LIMIT_WINDOW } })
  @Post('forgot-password')
  forgotPassword(@Body() input: ForgotPasswordDto) {
    return this.userService.requestPasswordReset(input)
  }

  @Public()
  @Throttle({ default: { limit: 4, ttl: AUTH_RATE_LIMIT_WINDOW } })
  @Post('reset-password')
  resetPassword(@Body() input: ResetPasswordDto) {
    return this.userService.resetPassword(input)
  }

  @Get(':id')
  @ApiBearerAuth()
  getById(@Param('id') id: string) {
    return this.userService.getById(id)
  }

  @Get()
  @ApiBearerAuth()
  list() {
    return this.userService.list()
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() input: UpdateUserDto) {
    return this.userService.update(id, input)
  }

  @Delete()
  @ApiBearerAuth()
  delete(@Body() input: DeleteManyDto) {
    return this.userService.delete(input.ids)
  }
}
