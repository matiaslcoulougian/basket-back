import { HttpException, Injectable } from '@nestjs/common';
import { AppRepository } from './app.repository';
import { Match, Fault } from '@prisma/client';
import { CreateFaultDto, CreateMatchDto } from "./models/dtos";

@Injectable()
export class AppService {
  constructor(private readonly appRepository: AppRepository) {}
  async getAllMatches(): Promise<Match[]> {
    return await this.appRepository.getAllMatches();
  }

  async createMatch(body: CreateMatchDto): Promise<Match> {
    if(body.startDate < (new Date())) throw new HttpException('Start date has already passed', 409);

    const localTeam = await this.appRepository.getTeam(body.localTeamId)
    const visitantTeam = await this.appRepository.getTeam(body.localTeamId)
    if(!localTeam || !visitantTeam) throw new HttpException('team not found', 404)

    return await this.appRepository.createMatch(body);
  }

  async getMatch(matchId: string): Promise<Match> {
    const match = await this.appRepository.getMatch(matchId);
    if (!match) throw new HttpException('match not found', 404);
    return match;
  }

  async createFault(createFaultDto: CreateFaultDto): Promise<Fault> {
    const player = await this.appRepository.getPlayer(createFaultDto.playerId)
    if(!player) throw new HttpException('player not found', 404);

    const match = await this.appRepository.getMatchById(createFaultDto.matchId)
    if(!match) throw new HttpException('match not found', 404)

    return await this.appRepository.createFault(createFaultDto);
  }

}
