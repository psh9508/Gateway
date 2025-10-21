import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { HealthCheckModule } from './health-check/health-check.module';
import { RatelimitMiddleware } from './middleware/ratelimit.middieware';

@Module({
  imports: [HealthCheckModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RatelimitMiddleware)
      .forRoutes('*');
  }
}
