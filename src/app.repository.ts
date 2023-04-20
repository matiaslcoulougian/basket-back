import {Injectable} from "@nestjs/common";
import {Match, PrismaClient} from "@prisma/client";
import {CreateMatchDTO} from "./models/dtos/create.match.dto";


const prisma = new PrismaClient()

@Injectable()
export class AppRepository {
    async getAllMatches(): Promise<Match[]> {
        return prisma.match.findMany();
    }

    async createMatch(body: CreateMatchDTO): Promise<Match> {
        return prisma.match.create({
            data: {
                ...body,
                startDate: new Date(body.startDate)
            }
        });
    }
}