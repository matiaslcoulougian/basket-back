import { Test, TestingModule } from '@nestjs/testing';
import {AppRepository} from "../../../src/app.repository";
import {CreateMatchDto} from "../../../src/models/dtos";
import {PrismaClient} from "@prisma/client";
import {PrismaCleaner} from "../../utils/prisma.cleaner";
import { getCreateMatchInput } from "../../utils/fixture/match.fixture";

describe('AppRepository', () => {
    let appRepository: AppRepository;
    let prisma: PrismaClient;

    beforeAll(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppRepository]
        }).compile();

        appRepository = app.get<AppRepository>(AppRepository);

        prisma = new PrismaClient();
    });

    beforeEach(async () => {
        await PrismaCleaner.clean(prisma);
    });

    it('Create match with all params required should write to DB a new match', async () => {
        const createMatchInput: CreateMatchDto = await getCreateMatchInput(prisma)
        const match = await appRepository.createMatch(createMatchInput);
        expect(match).toEqual({
            id: expect.any(String),
            localTeamId: createMatchInput.localTeamId,
            visitorTeamId: createMatchInput.visitorTeamId,
            startDate: createMatchInput.startDate,
            location: createMatchInput.location,
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
        });
    });
});