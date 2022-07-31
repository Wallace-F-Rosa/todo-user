import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @Inject('TASK_SERVICE') private readonly taskClient: ClientProxy,
  ) {}
  create(createTaskDto: CreateTaskDto): Observable<Task | Error> {
    return this.taskClient.send<Task>('createTask', createTaskDto);
  }

  async findAll(where: { name?: string; description?: string }) {
    return this.taskClient.send<Task>('findAllTask', where);
  }

  async findOne(id: number) {
    return this.taskClient.send('findOneTask', { id });
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    return this.taskClient.send('updateTask', { id, updateTaskDto });
  }

  async remove(id: number) {
    return this.taskClient.send<Task>('removeTask', id);
  }
}
