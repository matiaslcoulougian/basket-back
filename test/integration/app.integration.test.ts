import { Test, TestingModule } from '@nestjs/testing';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import {PrismaClient} from "@prisma/client";
import {PrismaCleaner} from "../utils/prisma.cleaner";
import {
  getCreateAnnotationInput,
  getCreateFaultInput,
  getCreateMatchInput
} from "../utils/fixture/match.fixture";
import BallDontLieIntegration from "../../src/integration/ball.dont.lie.integration";
import {basketApiMock} from "../utils/mocks/basket.api.mock";
import {randomUUID} from "crypto";

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

  it('/match/all (GET) - no existing matches returns empty array', async () => {
    await request(app.getHttpServer())
      .get('/api/match/all')
      .expect(200)
      .expect([]);
  });

  it('/match/all (GET) - only one existing match returns an array with one match', async () => {
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

  it('/match (POST) - create match without body throws required fields error', async () => {
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

  it('/match/:id (GET) - get a match with an id that does not exist throws not found error.', async () => {
    const response = await request(app.getHttpServer())
        .get(`/api/match/${randomUUID()}`)

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      statusCode: 404,
      message: "match not found"
    });
  });

  it('/match/:id (GET) - get a match with an id that exists returns match data.', async () => {
    const matchInput = await getCreateMatchInput(prisma);
    const match = await prisma.match.create({data: matchInput});
    const response = await request(app.getHttpServer())
        .get(`/api/match/${match.id}`)

    expect(response.status).toBe(200);
    expect(response.body.id).toEqual(match.id);
    expect(response.body.localTeamId).toEqual(match.localTeamId);
    expect(response.body.visitorTeamId).toEqual(match.visitorTeamId);
    expect(new Date(response.body.startDate)).toEqual(match.startDate);
    expect(response.body.localTeam.players.length).toBeGreaterThan(0)
    expect(response.body.visitorTeam.players.length).toBeGreaterThan(0)
    expect(response.body.localTeamScore).toBe(0);
    expect(response.body.localTeamScore).toBe(0);
  });



    it('/match/previous-season (GET) - get previous season matches returns matches successfully', async () => {
      const previousSeasonMatches = await basketApiMock.getPreviousSeasonMatches();
      jest.spyOn(BallDontLieIntegration.prototype, 'getPreviousSeasonMatches').mockResolvedValue(previousSeasonMatches);

      const response = await request(app.getHttpServer())
          .get('/api/match/previous-season')

      expect(response.status).toBe(200);
      expect(response.body).toEqual(previousSeasonMatches);
    });

  it('/match/fault (POST) - create fault with valid data returns created fault', async () => {
    // Arrange
    const createFaultInput = await getCreateFaultInput(prisma);
    // Act
    const response = await request(app.getHttpServer())
        .post('/api/match/fault')
        .send(createFaultInput)
    // Assert
    expect(response.body).toMatchObject(
        {
            id: expect.any(String),
            createdAt: expect.any(String),
            matchId: createFaultInput.matchId,
            playerId: createFaultInput.playerId,
            faultType: createFaultInput.type,
        }
    );
  });

  it('/match/fault (POST) - create fault with invalid player id returns 404 error', async () => {
    // Arrange
    const createFaultInput = await getCreateFaultInput(prisma);
    // Act
    const response = await request(app.getHttpServer())
        .post('/api/match/fault')
        .send({...createFaultInput, playerId: randomUUID()})
    // Assert
    expect(response.body.message).toBe('player not found');
    expect(response.status).toBe(404);
  });

  it('/match/fault (POST) - create fault with invalid match id returns 404 error', async () => {
    // Arrange
    const createFaultInput = await getCreateFaultInput(prisma);
    // Act
    const response = await request(app.getHttpServer())
        .post('/api/match/fault')
        .send({...createFaultInput, matchId: randomUUID()})
    // Assert
    expect(response.body.message).toBe('match not found');
    expect(response.status).toBe(404);
  });

  it('/match/annotation (POST) - create annotation with valid data returns created annotation', async () => {
    // Arrange
    const createAnnotationInput = await getCreateAnnotationInput(prisma);
    // Act
    const response = await request(app.getHttpServer())
        .post('/api/match/annotation')
        .send(createAnnotationInput)
    // Assert
    expect(response.body).toMatchObject(
        {
          ...createAnnotationInput,
          id: expect.any(String),
          createdAt: expect.any(String),
        }
    );
  });

  it('/match/annotation (POST) - create annotation with invalid player id returns 404 error', async () => {
    // Arrange
    const createAnnotationInput = await getCreateAnnotationInput(prisma);
    // Act
    const response = await request(app.getHttpServer())
        .post('/api/match/annotation')
        .send({...createAnnotationInput, playerId: randomUUID()})
    // Assert
    expect(response.body.message).toBe('player not found');
    expect(response.status).toBe(404);
  });

  it('/match/annotation (POST) - create annotation with invalid match id returns 404 error', async () => {
    // Arrange
    const createAnnotationInput = await getCreateAnnotationInput(prisma);
    // Act
    const response = await request(app.getHttpServer())
        .post('/api/match/annotation')
        .send({...createAnnotationInput, matchId: randomUUID()})
    // Assert
    expect(response.body.message).toBe('match not found');
    expect(response.status).toBe(404);
  });

    it('/match/annotation (POST) - getting a match after registering an annotation returns the total score updated', async () => {
      // Arrange
      const createAnnotationInput = await getCreateAnnotationInput(prisma, 3);
      const match = (await request(app.getHttpServer()).get(`/api/match/${createAnnotationInput.matchId}`)).body;
      expect(match.localTeamScore).toBe(0);
      expect(match.visitorTeamScore).toBe(0);

      // Act
      const response = await request(app.getHttpServer())
          .post('/api/match/annotation')
          .send(createAnnotationInput)

      // Assert
      const updatedMatch = (await request(app.getHttpServer()).get(`/api/match/${createAnnotationInput.matchId}`)).body;
      if (match.localTeam.players.some(player => player.id === createAnnotationInput.playerId)) {
        expect(updatedMatch.localTeamScore).toBe(3);
        expect(updatedMatch.visitorTeamScore).toBe(0);
      }
      else {
        expect(updatedMatch.localTeamScore).toBe(0);
        expect(updatedMatch.visitorTeamScore).toBe(3);
      }
    });
});
