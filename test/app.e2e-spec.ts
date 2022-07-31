import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('todo', () => {
    describe('/tasks (POST)', () => {
      it('valid task', async () => {
        const task = {
          name: 'Test task',
          description: 'Test description',
          userId: '3f7e42bf-604c-4bc2-82fd-a3d3c7111510',
        };
        const res = await request(app.getHttpServer())
          .post('/tasks')
          .send(task);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject(task);
      });

      it('invalid task', async () => {
        const task = {
          name: 1,
          description: '',
          userId: '3',
        };
        const res = await request(app.getHttpServer())
          .post('/tasks')
          .send(task);
        expect(res.status).toEqual(400);
        expect(res.body.message.length).toEqual(Object.keys(task).length);
        expect(res.body.error).toEqual('Bad Request');
      });
    });
  });
});
