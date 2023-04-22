import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';
import { Anotation, Fault, Match, Player } from "@prisma/client";
import { CreateAnnotationDto, CreateFaultDto, CreateMatchDto } from "./models/dtos";

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

  @Post('match/annotation')
  async createAnnotation(@Body() body: CreateAnnotationDto): Promise<Anotation> {
    return await this.appService.createAnnotation(body);
  }

  @Get('stats/all')
  async getAllPlayerStats(): Promise<any[]> {
    return await this.appService.getAllPlayerStats()
  }


  @Get('stats/:playerId')
  async getPlayerStats(@Param('playerId', ParseUUIDPipe) playerId): Promise<any> {
    return await this.appService.getPlayerStats(playerId)
  }
}
