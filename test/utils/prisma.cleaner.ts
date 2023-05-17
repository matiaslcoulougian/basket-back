import {PrismaClient} from "@prisma/client";

export class PrismaCleaner {

    static async clean(prisma: PrismaClient) {
        const modelNames = ['Fault', 'Anotation', 'Match']
        for (const modelName of modelNames) {
            await prisma[modelName].deleteMany()
        }
    }
}