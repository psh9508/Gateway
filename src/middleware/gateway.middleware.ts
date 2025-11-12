import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

@Injectable()
export class GatewayMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const requestId = randomUUID();
    res.setHeader('X-Request-Id', requestId);

    const start = Date.now();
    console.log(`[${req.method}] ${req.originalUrl} | requestId: ${requestId}`);

    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(
        `[${req.method}] ${req.originalUrl} ${res.statusCode} - ${duration}ms | requestId: ${requestId}`,
      );
    });

    next();
  }
}
