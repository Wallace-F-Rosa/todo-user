import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '@/user/dto/create-user.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthService } from '@/auth/auth.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authService: AuthService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    authService = moduleFixture.get<AuthService>(AuthService);
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterEach(async () => {
    await prisma.user.deleteMany({});
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

    describe('/user (GET)', () => {
      it('list users', async () => {
        const createdUsers = [];
        for (let i = 0; i < 5; i++) {
          const user = {
            username: faker.internet.userName(),
            passwordHash: bcrypt.hashSync(faker.internet.password(), 10),
          };
          createdUsers.push(await prisma.user.create({ data: user }));
        }
        const authPayload = await authService.getAuthToken(createdUsers[0]);
        const res = await request(app.getHttpServer())
          .get('/user')
          .set('Authorization', `Bearer ${authPayload.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).toEqual(createdUsers.length);
      });

      it('get info from current user', async () => {
        const createdUser = await prisma.user.create({
          data: {
            username: faker.internet.userName(),
            passwordHash: bcrypt.hashSync(faker.internet.password(), 10),
          },
        });

        const authPayload = await authService.getAuthToken(createdUser);

        const res = await request(app.getHttpServer())
          .get(`/user/me`)
          .set('Authorization', `Bearer ${authPayload.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(createdUser);
      });
    });

    describe('/user (PUT)', () => {
      it('update current user', async () => {
        const createdUser = await prisma.user.create({
          data: {
            username: faker.internet.userName(),
            passwordHash: bcrypt.hashSync(faker.internet.password(), 10),
          },
        });

        const updateData = {
          username: 'updatedUserUsername',
          passwordHash: bcrypt.hashSync(faker.internet.password(), 10),
        };

        const authPayload = await authService.getAuthToken(createdUser);

        const res = await request(app.getHttpServer())
          .put(`/user/me`)
          .set('Authorization', `Bearer ${authPayload.token}`)
          .send(updateData);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(updateData);
      });
    });

    describe('/user (DELETE)', () => {
      it('delete current user', async () => {
        const createdUser = await prisma.user.create({
          data: {
            username: faker.internet.userName(),
            passwordHash: bcrypt.hashSync(faker.internet.password(), 10),
          },
        });

        const authPayload = await authService.getAuthToken(createdUser);

        const res = await request(app.getHttpServer())
          .delete(`/user/me`)
          .set('Authorization', `Bearer ${authPayload.token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toMatchObject(createdUser);
      });
    });
  });

  describe('auth', () => {
    it('login user', async () => {
      const user = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
      };

      await prisma.user.create({
        data: {
          username: user.username,
          passwordHash: bcrypt.hashSync(user.password, 10),
        },
      });
      const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(user);
      expect(res.statusCode).toEqual(200);
      expect(res.body.token).toBeDefined();
    });
  });
});
