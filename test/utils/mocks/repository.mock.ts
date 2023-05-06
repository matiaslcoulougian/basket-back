import {Match} from "@prisma/client";
import { randomUUID } from "crypto";

export const mockRepository = {
    getAllMatches: jest.fn(),
    getAllPlayers: jest.fn(),
    createMatch: jest.fn(),
    getMatch: jest.fn(),
    createFault: jest.fn(),
    getPlayer: jest.fn(),
    getMatchById: jest.fn(),
    getTeam: jest.fn(),
    createAnnotation: jest.fn(),
    countPlayerMatches: jest.fn(),
    getPlayerAnnotations: jest.fn(),
    countPlayerFaults: jest.fn(),
    getAllTeams: jest.fn()
}

export const getTeamMock = (name: string) => {
    return {
        id: randomUUID(),
        name,
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

export const getMatchMock = (startDate: Date, localTeamId: string, visitorTeamId: string) => {
    return {
        id: randomUUID(),
        startDate,
        location: "Miami Beach, FL",
        localTeamId,
        visitorTeamId,
        createdAt: new Date(),
        updatedAt: new Date(),
        localTeamScore: 0,
        visitorTeamScore: 0,
    }
}

export const getPlayerMock = (name: string, teamId: string, teamName: string) => {
    return {
        id: randomUUID(),
        name,
        teamId,
        createdAt: new Date(),
        updatedAt: new Date(),
        team: {
            name: teamName
        }
    }
}

export const getFaultMock = (faultType: string, playerId: string, matchId: string) => {
    return {
        id: randomUUID(),
        faultType,
        playerId,
        matchId,
        createdAt: new Date(),
        updatedAt: new Date()
    }
}

export const getAnnotationMock = (points: number, playerId: string, matchId: string) => {
    return {
        id: randomUUID(),
        points,
        playerId,
        matchId,
        createdAt: new Date(),
        updatedAt: new Date()
    }
}