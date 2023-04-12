import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import {User} from "@prisma/client";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("users")
  getUsers(): Promise<User[]> {
    return this.appService.getUsers();
  }
}
