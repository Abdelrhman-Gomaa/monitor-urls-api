import { Body, Controller, Get, Post, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './services/user.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from './models/user.model';
import { CurrentUser } from 'src/auth/auth-user.decorator';
import { CreateUserInput } from './input/create.user.input';
import { LoginUserInput } from './input/login.user.input';
import { VerifyUserByEmailInput } from './input/verify-user-by-email.input';;

@Controller()
export class UserController {
    constructor(
        private readonly userService: UserService,

    ) { }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Find All User" })
    @Get()
    async findAllUser(): Promise<User[]> {
        return await this.userService.findAll();
    }

    @UseGuards(AuthGuard)
    @ApiOperation({ summary: "Find Current User Data" })
    @Get('/me')
    async me(@CurrentUser() currentUser: string): Promise<User> {
        return await this.userService.me(currentUser);
    }

    @ApiOperation({ summary: "Create A new User / Registration" })
    @Post('/registerAsUser')
    async register(@Body(ValidationPipe) input: CreateUserInput) {
        return await this.userService.register(input);
    }

    @ApiOperation({ summary: "Login with Email to App" })
    @Post('/emailAndPasswordLogin')
    async emailAndPasswordLogin(@Body(ValidationPipe) input: LoginUserInput) {
        return await this.userService.signIn(input);
    }

    @ApiOperation({ summary: "Login with Email to App" })
    @Post('/verifyUserByEmail')
    async verifyUserByEmail(@Body(ValidationPipe) input: VerifyUserByEmailInput) {
        return await this.userService.verifyUserByEmail(input);
    }
}