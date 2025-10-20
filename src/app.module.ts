import { Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { HealthCheckModule } from './health-check/health-check.module';

@Module({
  imports: [HealthCheckModule],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
