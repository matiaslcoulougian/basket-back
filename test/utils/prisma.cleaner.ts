import {PrismaClient} from "@prisma/client";

export class PrismaCleaner {

    static async clean(prisma: PrismaClient) {
        const modelNames = ['Match', 'Fault', 'Anotation']
        return Promise.all(
            modelNames.map((modelName) => prisma[modelName].deleteMany())
        )
    }
}