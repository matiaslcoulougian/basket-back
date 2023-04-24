import {Team} from "@prisma/client";

export type Player = {
    id: string
    name: string
    teamId: string
    createdAt: Date
    updatedAt: Date | null
    team: Team
}
