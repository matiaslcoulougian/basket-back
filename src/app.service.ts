import { HttpException, Injectable } from '@nestjs/common';
import { IAppRepository } from "./app.repository";
import { Fault, Anotation } from '@prisma/client';
import { CreateAnnotationDto, CreateFaultDto, CreateMatchDto } from "./models/dtos";
import { Match } from "./models/entities/match.entity";

@Injectable()
export class AppService {

  constructor(
    private readonly appRepository: IAppRepository
  ) {}

  async getAllMatches(): Promise<Match[]> {
    const matches = await this.appRepository.getAllMatches();
    for (const match of matches) this.addScores(match);
    return matches;
  }

  private addScores(match: Match) {
    match.localTeamScore = 0;
    match.visitorTeamScore = 0;
    const localTeamPlayerIds = match.localTeam.players.map(player => player.id)
    const visitorTeamPlayerIds = match.visitorTeam.players.map(player => player.id)
    for (const anotation of match.anotation) {
      if (localTeamPlayerIds.includes(anotation.playerId)) match.localTeamScore += anotation.points;
      else if (visitorTeamPlayerIds.includes(anotation.playerId)) match.visitorTeamScore += anotation.points
    }
  }

  async createMatch(body: CreateMatchDto): Promise<Match> {
    console.log(new Date(body.startDate))
    console.log(new Date())
    if(new Date(body.startDate) < (new Date())) throw new HttpException('Start date has already passed', 400);

    const localTeam = await this.appRepository.getTeam(body.localTeamId)
    const visitantTeam = await this.appRepository.getTeam(body.localTeamId)
    if(!localTeam || !visitantTeam) throw new HttpException('team not found', 404)

    const match = await this.appRepository.createMatch(body);
    return {...match, localTeamScore: 0, visitorTeamScore:  0};
  }

  async getMatch(matchId: string): Promise<Match> {
    const match = await this.appRepository.getMatch(matchId);
    if (!match) throw new HttpException('match not found', 404);
    this.addScores(match);
    return match;
  }

  async createFault(createFaultDto: CreateFaultDto): Promise<Fault> {
    const player = await this.appRepository.getPlayer(createFaultDto.playerId)
    if(!player) throw new HttpException('player not found', 404);

    const match = await this.appRepository.getMatchById(createFaultDto.matchId)
    if(!match) throw new HttpException('match not found', 404)

    return await this.appRepository.createFault(createFaultDto);
  }

  async createAnnotation(body: CreateAnnotationDto): Promise<Anotation> {
    const player = await this.appRepository.getPlayer(body.playerId)
    if(!player) throw new HttpException('player not found', 404);

    const match = await this.appRepository.getMatchById(body.matchId)
    if(!match) throw new HttpException('match not found', 404)

    if (![match.localTeamId, match.visitorTeamId].includes(player.teamId)) throw new HttpException('player is not part of a team playing the match', 400);

    return await this.appRepository.createAnnotation(body);
  }

  async getPlayerStats(playerId: string): Promise<any> {
    const player = await this.appRepository.getPlayer(playerId)
    if(!player) throw new HttpException('player not found', 404);

    const matchesCount = await this.appRepository.countPlayerMatches(playerId)
    const annotations = await this.appRepository.getPlayerAnnotations(playerId)
    const faultsCount = await this.appRepository.countPlayerFaults(playerId)

    return {
      matchesPlayed: matchesCount,
      totalScoring: this.calculateTotalScoring(annotations),
      faultsCommited: faultsCount,
      name: player.name,
      teamName: player.team.name
    }
  }

  calculateTotalScoring(annotations: Anotation[]): number {
    return annotations.reduce((acc, next) => {
      return acc + next.points
    }, 0)
  }

  async getAllPlayerStats(): Promise<any[]> {
    const players = await this.appRepository.getAllPlayers()

    return await Promise.all(
      players.map(async player => {
        const matchesCount = await this.appRepository.countPlayerMatches(player.id)
        const annotations = await this.appRepository.getPlayerAnnotations(player.id)
        const faultsCount = await this.appRepository.countPlayerFaults(player.id)

        return {
          id: player.id,
          name: player.name,
          teamName: player.team.name,
          matchesPlayed: matchesCount,
          totalScoring: this.calculateTotalScoring(annotations),
          faultsCommited: faultsCount
        }
      })
    )
  }
}
