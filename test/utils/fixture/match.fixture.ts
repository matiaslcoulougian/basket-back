import {PrismaClient} from "@prisma/client";
import {CreateMatchDto} from "../../../src/models/dtos";

export const getCreateMatchInput = async (prisma: PrismaClient): Promise<CreateMatchDto> => {
    const teams = await prisma.team.findMany()
    const startDate = new Date()
    startDate.setFullYear(startDate.getFullYear() + 1);
    return {
        localTeamId: teams[0].id,
        visitorTeamId: teams[1].id,
        startDate: startDate,
        location: "Test Location"
    }
}