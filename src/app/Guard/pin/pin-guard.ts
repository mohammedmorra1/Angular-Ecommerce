import { CanActivateFn } from '@angular/router';

export const pinGuard: CanActivateFn = (route, state) => {
  return true;
};
