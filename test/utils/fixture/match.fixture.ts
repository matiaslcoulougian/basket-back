import {PrismaClient} from "@prisma/client";
import {CreateMatchDto} from "../../../src/models/dtos";

export const getCreateMatchInput = async (prisma: PrismaClient): Promise<CreateMatchDto> => {
    const teams = await prisma.team.findMany()
    return {
        localTeamId: teams[0].id,
        visitorTeamId: teams[1].id,
        startDate: getStartDate(),
        location: "Test Location"
    }
}

export const getStartDate = (): Date => {
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() + 1);
    return startDate;
}