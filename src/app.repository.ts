import {Injectable} from "@nestjs/common";
import {PrismaClient, User} from "@prisma/client";


const prisma = new PrismaClient()

@Injectable()
export class AppRepository {
    async getUsers(): Promise<User[]> {
        return prisma.user.findMany();
    }
}