import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import * as auth from './models/auth';
import { config } from '../../config/config.loader';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() request: auth.LoginReq) {
    if(!request.login_id || !request.password) {
      throw new BadRequestException('Login ID and password are required');
    }

    const authEndpoint = config.get('server_endpoints').auth;
    const url = `http://${authEndpoint}/user/login`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseData = await response.json();
    return responseData;
  }
}
