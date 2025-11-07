import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  HttpException,
} from '@nestjs/common';
import * as auth from './models/auth';
import { config } from '../../config/config.loader';

@Controller('auth')
export class AuthController {
  private readonly authEndpoint = config.get('server_endpoints').auth;

  @Get('healthcheck')
  async healthcheck(): Promise<boolean> {
    const url = `http://${this.authEndpoint}/healthcheck`;
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  }

  @Post('login')
  async login(@Body() request: auth.LoginReq) {
    if (!request.login_id || !request.password) {
      throw new BadRequestException('Login ID and password are required');
    }
    const url = `http://${this.authEndpoint}/user/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new HttpException(
        errorData || `Authentication failed`,
        response.status,
      );
    }

    const responseData = await response.json();
    return responseData;
  }
}
