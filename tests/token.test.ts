import moment from 'moment';
import { UserInterface } from '../src/interfaces/user.interface';
import { AuthService } from '../src/services/auth.service';

describe('token generate', () => {
  test('', () => {
    const user: UserInterface = {
      username: 'admin',
      password: '123',
      email: 'admin@mail.com',
      status: true,
      createdBy: 'default',
      createdDate: new Date(),
      updatedBy: 'default',
      updatedDate: new Date(),
    };
    expect(AuthService.generateToken(user, process.env.JWT_SECRET)).toEqual(
      expect.any(String)
    );
  });
});
