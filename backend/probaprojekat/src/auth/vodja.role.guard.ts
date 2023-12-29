import { ExecutionContext, Injectable, Inject } from '@nestjs/common';
import { Observable } from 'rxjs';
import { RolesGuard } from './role.guard';
import { IgracResolver } from 'src/player/player.resolver';

@Injectable()
export class VodjaGuard extends RolesGuard {
  @Inject(IgracResolver)
  igracService: IgracResolver;
  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    return this.igracService.getOnePlayer(user.username).then((user) => {
      return user?.vodjaTima;
    });
  }
}
