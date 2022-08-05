import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  UseGuards,
  Res, HttpStatus, HttpCode,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { sendSuccessResponse } from '../../core/responses/success.responses';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Messages } from '../../core/responses/message.responses';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { GoogleOauthGuard } from './guards/google-auth.guard';
import JwtRefreshGuard from './guards/jwt-refresh-auth.guard';
import { DoesUserExist } from '../../core/guards/doesUserExist.guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(DoesUserExist)
  @Post('signup')
  async register(@Body() createUserDto: CreateUserDto) {
    const result = await this.authService.register(createUserDto);
    return sendSuccessResponse(Messages.USER_REGISTERED, result);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async loginWithEmail(@Request() req) {
    const result = await this.authService.login(req.user);
    return sendSuccessResponse(Messages.USER_AUTHENTICATED, result);
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google')
  async googleAuth(@Request() req) {
    console.log('Getting Google Oauth');
  }

  @UseGuards(GoogleOauthGuard)
  @Get('google/redirect')
  async googleAuthRedirect(@Request() req, @Res() res) {
    const result = await this.authService.googleLogin(req);
    if (result) res.redirect(`${process.env.FRONTEND_URL}/dashboard`);
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(@Request() req) {
    const accessTokenCookie = await this.authService.generateToken(req.user);

    req.setHeader('Set-Cookie', accessTokenCookie);
    return req.user;
  }
}
