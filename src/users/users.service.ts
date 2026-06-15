import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  private readonly repository: UsersRepository;

  constructor(prisma: PrismaService) {
    this.repository = new UsersRepository(prisma);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(id: number) {
    return this.repository.findById(id);
  }

  create(dto: CreateUserDto) {
    return this.repository.create(dto);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  remove(id: number) {
    return this.repository.delete(id);
  }
}
