import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@/user/dto/create-user.dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  describe('users', () => {
    describe('/user (POST)', () => {
      it('create user if data is valid', async () => {
        const user: CreateUserDto = {
          username: faker.internet.userName(),
          passwordHash: await bcrypt.hash(faker.internet.password(20), 10),
        };

        const res = await request(app.getHttpServer()).post('/user').send(user);
        expect(res.statusCode).toEqual(201);
        expect(res.body).toMatchObject(user);
      });

      it('return error 400 on invalid data', async () => {
        const invalidUser = {
          username: 1,
          passwordHash: { this: 'is wrong' },
        };

        const res = await request(app.getHttpServer())
          .post('/user')
          .send(invalidUser);
        expect(res.statusCode).toEqual(400);
        expect(res.body.message.length).toEqual(
          Object.keys(invalidUser).length,
        );
        expect(res.body.error).toEqual('Bad Request');
      });
    });
  });
});
