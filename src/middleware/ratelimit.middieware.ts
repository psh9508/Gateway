import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { randomUUID } from 'crypto';

@Injectable()
export class RatelimitMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const requestId = randomUUID();
        res.setHeader('X-Request-Id', requestId)
        console.log(`[${req.method}] ${req.originalUrl} | requestId: ${requestId}`);
        next();
    }
}