import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return false;
  }

  getUserRole(context: ExecutionContext): string {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    return user.role as string;
  }
}
