import {
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { GithubService } from './github/github.service';
import { GoogleService } from './google/google.service';
import { UsersService } from '../users/users.service';
import { UserInfoDto } from '../users/dto/userInfo.dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private githubService: GithubService,
    private googleService: GoogleService,
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Get('github')
  async githubProxy(@Res() res: Response, @Req() req: Request) {
    req.session['returnTo'] = req.headers.referer || '/';
    const redirectUrl = await this.githubService.authProxy();
    return res.redirect(redirectUrl);
  }

  @Get('github-callback')
  async githubCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Query('code') code: string,
  ) {
    const accessToken = await this.githubService.getGithubAccessToken(code);
    const user = await this.githubService.getUserInfo(accessToken);

    // find User
    let findUser = await this.userService.findUser(user);
    if (findUser === null) {
      // 없으면 add
      await this.userService.addUser(user, 'github');
      findUser = await this.userService.findUser(user);
    }

    if (findUser.oauth !== 'github') {
      return { message: '다른 서비스로 가입한 내역이 있습니다.' }; // TODO: set StatusCode
    }

    // 로그인 jwt 발급;
    const loginUser = new UserInfoDto();
    loginUser.id = findUser.id;
    loginUser.name = findUser.name;

    await this.authService.login(loginUser, res);

    const returnTo = req.session['returnTo'];
    delete req.session['returnTo'];

    res.redirect(returnTo);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Res() res: Response, @Req() req: Request) {
    console.log(req.user);
    return res.redirect(req.headers.referer || '/');
  }

  @Post('logout')
  logout(@Res() res: Response, @Req() req: Request) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.authService.logout(req.user);
    return res.json({ message: 'Logout successful' });
  }
}
