import { Body, Controller, Post } from '@nestjs/common';
import * as auth from './models/auth';

@Controller('auth')
export class AuthController {
    @Post('login')
    async login(@Body() request: auth.LoginReq) {
        if(!request.login_id || !request.password) {
            return
        }

        const url = 'http://localhost:8000/user/login'
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
