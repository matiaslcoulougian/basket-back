import { Injectable } from '@nestjs/common';
import { Fault, Match, Player, Team, PrismaClient, Anotation } from "@prisma/client";
import { CreateAnnotationDto, CreateFaultDto, CreateMatchDto } from "./models/dtos";

const prisma = new PrismaClient();

export abstract class IAppRepository {
  abstract getAllMatches(): Promise<Match[]>
  abstract getAllPlayers(): Promise<Player[]>
  abstract createMatch(body: CreateMatchDto): Promise<Match>
  abstract getMatch(matchId: string): Promise<Match>
  abstract createFault(createFaultDto: CreateFaultDto): Promise<Fault>
  abstract getPlayer(id: string): Promise<Player>
  abstract getMatchById(id: string): Promise<Match>
  abstract getTeam(id: string): Promise<Team>
  abstract createAnnotation(body: CreateAnnotationDto): Promise<Anotation>
  abstract countPlayerMatches(playerId: string): Promise<number>
  abstract getPlayerAnnotations(playerId: string): Promise<Anotation[]>
  abstract countPlayerFaults(playerId: string): Promise<number>
}


@Injectable()
export class AppRepository implements IAppRepository {
  async getAllMatches(): Promise<Match[]> {
    return prisma.match.findMany({
      include: {
        localTeam: {
          include: { players: true }
        },
        visitorTeam: {
          include: { players: true }
        },
        faults: true,
        anotation: true
      }
    });
  }

  async getAllPlayers(): Promise<Player[]> {
    return prisma.player.findMany()
  }

  async createMatch(body: CreateMatchDto): Promise<Match> {
    return prisma.match.create({
      data: {
        ...body,
        startDate: new Date(body.startDate),
      },
    });
  }

  async getMatch(matchId: string): Promise<Match> {
    return prisma.match.findFirst({
      where: { id: matchId },
      include: {
        localTeam: {
          include: { players: true }
        },
        visitorTeam: {
          include: { players: true }
        },
        faults: true,
        anotation: true
      }
    });
  }

  async createFault(createFaultDto: CreateFaultDto): Promise<Fault> {
    return prisma.fault.create({
      data: {
        matchId: createFaultDto.matchId,
        playerId: createFaultDto.playerId,
        faultType: createFaultDto.type
      }
    });
  }

  async getPlayer(id: string): Promise<Player> {
    return prisma.player.findFirst({ where: { id: id } })
  }

  async getMatchById(id: string): Promise<Match> {
    return prisma.match.findFirst({ where: { id: id } })
  }

  async getTeam(id: string): Promise<Team> {
    return prisma.team.findFirst({ where: { id: id } })
  }

  async createAnnotation(body: CreateAnnotationDto): Promise<Anotation> {
    return prisma.anotation.create({
      data: {
        matchId: body.matchId,
        playerId: body.playerId,
        points: body.points
      }
    });
  }

  async countPlayerMatches(playerId: string): Promise<number> {
    return Promise.resolve(0)
  }

  async getPlayerAnnotations(playerId: string): Promise<Anotation[]> {
    return Promise.resolve([])
  }

  async countPlayerFaults(playerId: string): Promise<number> {
    return Promise.resolve(0)
  }
}
