import {PrismaClient} from "@prisma/client";
import {CreateAnnotationDto, CreateFaultDto, CreateMatchDto, FaultType} from "../../../src/models/dtos";

export const getCreateMatchInput = async (prisma: PrismaClient): Promise<CreateMatchDto> => {
    const teams = await prisma.team.findMany()
    return {
        localTeamId: teams[0].id,
        visitorTeamId: teams[1].id,
        startDate: getStartDate(),
        location: "Test Location"
    }
}

export const getCreateFaultInput = async (prisma: PrismaClient): Promise<CreateFaultDto> => {
    const matchInput = await getCreateMatchInput(prisma)
    const match = await prisma.match.create({data: matchInput})
    const player = await prisma.player.findFirst()
    return {
        matchId: match.id,
        playerId: player.id,
        type: FaultType.YELLOW_CARD
    }
}

export const getCreateAnnotationInput = async (prisma: PrismaClient, points?: number): Promise<CreateAnnotationDto> => {
    const matchInput = await getCreateMatchInput(prisma)
    const match = await prisma.match.create({data: matchInput})
    const player = await prisma.player.findFirst()
    return {
        matchId: match.id,
        playerId: player.id,
        points: points ?? 3
    }
}

export const getStartDate = (): Date => {
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() + 1);
    return startDate;
}