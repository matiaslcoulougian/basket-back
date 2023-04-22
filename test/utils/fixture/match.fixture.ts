import {PrismaClient} from "@prisma/client";
import {CreateMatchDto} from "../../../src/models/dtos";

export const getCreateMatchInput = async (prisma: PrismaClient): Promise<CreateMatchDto> => {
    const teams = await prisma.team.findMany()
    return {
        localTeamId: teams[0].id,
        visitorTeamId: teams[1].id,
        startDate: new Date(2025, 2, 2),
        location: "Test Location"
    }
}