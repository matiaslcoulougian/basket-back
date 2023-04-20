import {Body, Controller, Get, Post} from '@nestjs/common';
import { AppService } from './app.service';
import { Match } from "@prisma/client";
import { CreateMatchDTO } from "./models/dtos";

@Controller("api")
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("match/all")
  async getAllMatches(): Promise<Match[]> {
    return await this.appService.getAllMatches();
  }

  @Post("match")
  async createMatch(@Body() body: CreateMatchDTO): Promise<Match> {
    return await this.appService.createMatch(body);
  }
}
