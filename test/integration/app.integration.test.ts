import { Test, TestingModule } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {PrismaClient} from "@prisma/client";
import {PrismaCleaner} from "../utils/prisma.cleaner";
import {getCreateMatchInput} from "../utils/fixture/match.fixture";
import BallDontLieIntegration from "../../src/integration/ball.dont.lie.integration";
import {basketApiMock} from "../utils/mocks/basket.api.mock";

describe('API e2e test suite', () => {
  let app: INestApplication;
  let prisma: PrismaClient;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
    prisma = new PrismaClient();
  });

  beforeEach(async () => {
    await PrismaCleaner.clean(prisma);
  });

  it('/match/all (GET) - no matches returns empty array', async () => {
    await request(app.getHttpServer())
      .get('/api/match/all')
      .expect(200)
      .expect([]);
  });

  it('/match/all (GET) - one match returns array with one match', async () => {
    const matchInput = await getCreateMatchInput(prisma);
    await prisma.match.create({data: matchInput});

    const response = await request(app.getHttpServer())
        .get('/api/match/all')

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].visitorTeamId).toBe(matchInput.visitorTeamId);
    expect(response.body[0].localTeamId).toBe(matchInput.localTeamId);
    expect(new Date(response.body[0].startDate)).toEqual(matchInput.startDate);
  });

  it('/match (POST) - create match without body throws error', async () => {
    await request(app.getHttpServer())
        .post('/api/match')
        .send({})
        .expect(400)
        .expect({
          statusCode: 400,
          message: [
            "startDate must be a valid ISO 8601 date string",
            "startDate should not be empty",
            "location must be a string",
            "location should not be empty",
            "localTeamId must be a string",
            "localTeamId should not be empty",
            "visitorTeamId must be a string",
            "visitorTeamId should not be empty"
          ],
          error: "Bad Request"
        });
  });

  it('/match (POST) - create match with past date returns a bad request error', async () => {
    const matchInput = await getCreateMatchInput(prisma);
    matchInput.startDate = new Date(2020, 1, 1);

    await request(app.getHttpServer())
        .post('/api/match')
        .send(matchInput)
        .expect(400)
        .expect({
          statusCode: 400,
          message: "Start date has already passed"
        });
  });

  it('/match (POST) - create match with required body fields and correct types saves match successfully', async () => {
    const matchInput = await getCreateMatchInput(prisma);

    const response = await request(app.getHttpServer())
        .post('/api/match')
        .send(matchInput)

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      ...matchInput,
      id: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      startDate: matchInput.startDate.toISOString(),
      localTeamScore: 0,
      visitorTeamScore: 0
    });
  });

    it('/match/previous-season (GET) - get previous season matches returns matches successfully', async () => {
      const previousSeasonMatches = await basketApiMock.getPreviousSeasonMatches();
      jest.spyOn(BallDontLieIntegration.prototype, 'getPreviousSeasonMatches').mockResolvedValue(previousSeasonMatches);

      const response = await request(app.getHttpServer())
          .get('/api/match/previous-season')
          .send()

      expect(response.status).toBe(200);
      expect(response.body).toEqual(previousSeasonMatches);
    });
});
