import app from '../src/app';
import request from 'supertest';
import { AuthService } from '../src/services/auth.service';
import UserModel from '../src/models/user.model';

const adminAccessToken = AuthService.generateToken(
  UserModel.build({
    username: 'Admin',
    email: 'admin@mail.com',
    password: '123@abc',
    status: true,
  }),
  process.env.JWT_SECRET
);

describe('User routes', () => {
  describe('GET /v1/users', () => {
    test('should return 200 and apply the default query options', async () => {
      const res = await request(app)
        .get('/v1/user')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send()
        .expect(200);

      expect(res.body).toEqual(expect.any(Array));
    });
  });

  describe('POST /v1/users', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        username: 'User 1',
        email: 'user1@mail.com',
        password: 'user1',
      };
    });

    test('create new user should return 200 and new user data', async () => {
      const res = await request(app)
        .post('/v1/user')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(200);

      expect(res.body).toEqual({
        _id: expect.anything(),
        username: newUser.username,
        email: newUser.email,
        password: expect.anything(),
        status: true,
        createdBy: 'default',
        createdDate: expect.anything(),
        updatedBy: 'default',
        updatedDate: expect.anything(),
      });
    });

    test('create new user with existed email and return 401', async () => {
      const res = await request(app)
        .post('/v1/user')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(newUser)
        .expect(400);
    });
  });
});
