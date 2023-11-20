import { sleep } from '@app/utils/helpers';

export const authLogin = (email, password) => {
  return new Promise((res, rej) => {
    sleep(500);
    if (email === 'admin@example.com' && password === 'admin') {
      localStorage.setItem(
        'authentication',
        JSON.stringify({ profile: { email: 'admin@example.com' } })
      );
      return res({ profile: { email: 'admin@example.com' } });
    }
    return rej({ message: 'Credentials are wrong!' });
  });
};

export const getAuthStatus = () => {
  return new Promise((res, rej) => {
    sleep(500);
    try {
      let authentication = localStorage.getItem('authentication');
      if (authentication) {
        authentication = JSON.parse(authentication);
        return res(authentication);
      }
      return res(undefined);
    } catch (error) {
      console.error(rej);
      return res(undefined);
    }
  });
};
