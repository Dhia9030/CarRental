import { createParamDecorator, ExecutionContext } from '@nestjs/common';


export const Agency = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Only return the agency data if it exists
    if (request.user && request.user.agencyEmail) {
      return {
        agencyId: request.user.agencyId,
        agencyEmail: request.user.agencyEmail
      };
    }
    
    return null;
  },
);


export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    
    // Only return the user data if it exists
    if (request.user && request.user.email) {
      return {
        userId: request.user.userId,
        email: request.user.email,
        role : request.user.role
      };
    }
    
    return null;
  },
);
