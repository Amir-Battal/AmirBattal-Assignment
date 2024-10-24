import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/user/decorator/roles.decorator';
import { Role } from 'src/user/enum/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {

  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext): boolean {
      const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
        context.getHandler(), 
        context.getClass()
      ]);
      const user = context.switchToHttp().getRequest().user;
      const hasRequiredRole = requiredRoles.some((role) => user.role === role);

      return hasRequiredRole;
  }
}
