import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('todo', () => {
    describe('/tasks (POST)', () => {
      it('valid task', async () => {
        const task = {
          name: 'Test task',
          description: 'Test description'
        };
        const res = await request(app.getHttpServer()).post('/tasks').send(task);
        expect(res.status).toEqual(201);
        expect(res.body).toMatchObject(task);
      });
    });
  });
});
