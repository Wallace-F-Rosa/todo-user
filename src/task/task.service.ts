import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  async create(createTaskDto: CreateTaskDto): Promise<Task | Error> {
    return createTaskDto;
  }

  async findAll() {
    return [];
  }

  async findOne(id: number) {
    return {};
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return {};
  }

  async remove(id: number) {
    return {};
  }
}
