import {Anotation} from "@prisma/client";
import {Team} from "./team.entity";

export type Match = {
    id: string
    startDate: Date
    location: string
    localTeamId: string
    visitorTeamId: string
    createdAt: Date
    updatedAt: Date | null
    localTeamScore?: number, // virtual field
    visitorTeamScore?: number, // virtual field
    anotation?: Anotation[]
    localTeam?: Team,
    visitorTeam?: Team,
}