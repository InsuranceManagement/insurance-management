import { IS_PUBLIC } from '@/common/auth/auth.decorators'
import { UserController } from '@/modules/user/user.controller'
import { CreateUserDto } from '@/modules/user/dto/create-user.dto'
import { UserService } from '@/modules/user/services/user.service'
import { validate } from 'class-validator'
import { BadRequestException } from '@nestjs/common'

describe('User creation', () => {
  const input = { name: 'Maria', email: 'maria@example.com', password: 'Password1!' }
  const user = {
    id: '1',
    name: input.name,
    email: input.email,
    password: 'hash',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const repository = { create: jest.fn() }
  const passwords = { hash: jest.fn() }
  const service = new UserService(
    repository as never,
    passwords as never,
    {} as never,
    {} as never,
    {} as never,
  )

  beforeEach(() => {
    jest.resetAllMocks()
    passwords.hash.mockResolvedValue('hash')
    repository.create.mockResolvedValue(user)
  })

  it('requires the global authentication guard', () => {
    expect(
      Reflect.getMetadata(
        IS_PUBLIC,
        Object.getOwnPropertyDescriptor(UserController.prototype, 'create')!.value as object,
      ),
    ).not.toBe(true)
    expect(Reflect.getMetadata(IS_PUBLIC, UserController)).not.toBe(true)
  })

  it('hashes the password and returns only public user fields', async () => {
    const result = await service.create(input)
    expect(passwords.hash).toHaveBeenCalledWith(input.password)
    expect(repository.create).toHaveBeenCalledWith({ ...input, password: 'hash' })
    expect(result).toEqual({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    expect(result).not.toHaveProperty('password')
  })

  it('reports duplicate email including a database uniqueness race', async () => {
    repository.create.mockRejectedValue({ code: 'P2002' })
    await expect(service.create(input)).rejects.toBeInstanceOf(BadRequestException)
  })

  it('rejects invalid data', async () => {
    const dto = Object.assign(new CreateUserDto(), {
      name: ' ',
      email: 'invalid',
      password: 'weak',
    })
    const errors = await validate(dto)
    expect(errors.map((error) => error.property)).toEqual(
      expect.arrayContaining(['name', 'email', 'password']),
    )
  })
})
