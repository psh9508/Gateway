import { Controller, Get } from '@nestjs/common';
import { HealthCheckService } from './health-check.service';

@Controller(['healthcheck'])
export class HealthCheckController {
  constructor(private readonly healthCheckService: HealthCheckService) {}

  @Get()
  public healthCheck(): string {
    return this.healthCheckService.healthCheck();
  }
}
