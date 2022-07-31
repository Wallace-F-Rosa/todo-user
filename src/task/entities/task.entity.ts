import { isNotEmpty, isUUID } from 'class-validator';

export class Task {
  @isNotEmpty()
  name: string;

  @isNotEmpty()
  description: string;

  @isUUID()
  userId: string;
}
