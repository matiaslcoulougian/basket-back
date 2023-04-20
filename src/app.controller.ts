import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Fault, Match } from "@prisma/client";
import { CreateFaultDto, CreateMatchDto } from "./models/dtos";

@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('match/all')
  async getAllMatches(): Promise<Match[]> {
    return await this.appService.getAllMatches();
  }

  @Post('match')
  async createMatch(@Body() body: CreateMatchDto): Promise<Match> {
    return await this.appService.createMatch(body);
  }

  @Get('match/:matchId')
  async getMatch(@Param('matchId', ParseUUIDPipe) matchId): Promise<Match> {
    return await this.appService.getMatch(matchId);
  }

  @Post('match/fault')
  async createFault(@Body() body: CreateFaultDto): Promise<Fault> {
    return await this.appService.createFault(body);
  }
}
