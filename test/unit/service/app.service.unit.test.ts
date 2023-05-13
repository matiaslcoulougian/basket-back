import { CreateAnnotationDto, CreateFaultDto, CreateMatchDto, FaultType } from "../../../src/models/dtos";
import { AppService } from "../../../src/app.service";
import { Match } from "@prisma/client";
import { HttpException } from "@nestjs/common";
import {
  getAnnotationMock,
  getFaultMock,
  getMatchMock,
  getPlayerMock,
  getTeamMock,
  mockRepository,

} from "../../utils/mocks/repository.mock";
import {getStartDate} from "../../utils/fixture/match.fixture";
import {basketApiMock} from "../../utils/mocks/basket.api.mock";

describe('Create match', () => {
  let appService: AppService;

  beforeAll(() => {
    appService = new AppService(mockRepository, basketApiMock);
  });

  it('Create match should return new match', async () => {
    const body: CreateMatchDto = {
      startDate: getStartDate(),
      location: "Miami Beach, FL",
      localTeamId: "id1",
      visitorTeamId: "id2",
    }
    mockRepository.getTeam.mockImplementation((id: string) => {
      return Promise.resolve(getTeamMock(`Team ${id}`));
    })
    const match: Match = getMatchMock(body.startDate, body.localTeamId, body.visitorTeamId);
    mockRepository.createMatch.mockImplementation(() => Promise.resolve(match));
    const output = await appService.createMatch(body)
    expect(output).toEqual(match)
  });

  it('should throw an HttpException when start date has already passed', async () => {
    const createMatchDto = {
      startDate: new Date('2022-01-01'),
      location: 'Test location',
      localTeamId: '123',
      visitorTeamId: '456',
    };

    await expect(appService.createMatch(createMatchDto)).rejects.toThrowError(
      new HttpException('Start date has already passed', 400),
    );
  });

  it('should throw an HttpException when team not found', async () => {
    const createMatchDto = {
      startDate: new Date('2023-01-01'),
      location: 'Test location',
      localTeamId: '123',
      visitorTeamId: '456',
    };
    const currentDate = new Date('2023-01-01');
    jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);
    mockRepository.getTeam.mockResolvedValueOnce(undefined);

    await expect(appService.createMatch(createMatchDto)).rejects.toThrowError(
      new HttpException('team not found', 404),
    );
  });

  it('should throw an HttpException when non team found', async () => {
    const createMatchDto = {
      startDate: new Date('2023-01-01'),
      location: 'Test location',
      localTeamId: '123',
      visitorTeamId: '456',
    };
    const currentDate = new Date('2023-01-01');
    jest.spyOn(global, 'Date').mockImplementation(() => currentDate as any);
    mockRepository.getTeam.mockImplementation(undefined);

    await expect(appService.createMatch(createMatchDto)).rejects.toThrowError(
      new HttpException('team not found', 404),
    );
  });
});


describe('createFault', () => {
  let appService: AppService;

  beforeAll(() => {
    appService = new AppService(mockRepository,basketApiMock);
  });

  afterEach(() => {
    mockRepository.createFault.mockClear()
  })

  const createFaultDto: CreateFaultDto = {
    playerId: 'player1',
    matchId: 'match1',
    type: FaultType.YELLOW_CARD,
  };

  it('should create a fault and return it', async () => {
    const mockFault = getFaultMock("player1", "match1", FaultType.YELLOW_CARD);
    const mockPlayer = getPlayerMock("player1", "team1", "Team 1");
    const mockMatch = getMatchMock(new Date(), "team1", "team2");

    mockRepository.createFault.mockResolvedValue(mockFault);
    mockRepository.getPlayer.mockResolvedValue(mockPlayer);
    mockRepository.getMatchById.mockResolvedValue(mockMatch);

    const result = await appService.createFault(createFaultDto);

    expect(mockRepository.createFault).toHaveBeenCalledWith(createFaultDto);
    expect(result).toEqual(mockFault);
  });

  it('should throw HttpException if player is not found', async () => {
    mockRepository.getPlayer.mockResolvedValue(undefined);

    await expect(appService.createFault(createFaultDto)).rejects.toThrowError(
      new HttpException('player not found', 404),
    );
    expect(mockRepository.createFault).not.toHaveBeenCalled();
  });

  it('should throw HttpException if match is not found', async () => {
    const mockPlayer = { id: 'player1', name: 'player1', team: "some team" };

    mockRepository.getPlayer.mockResolvedValue(mockPlayer);
    mockRepository.getMatchById.mockResolvedValue(undefined);

    await expect(appService.createFault(createFaultDto)).rejects.toThrowError(
      new HttpException('match not found', 404),
    );
    expect(mockRepository.createFault).not.toHaveBeenCalled();
  });
});

describe('createAnnotation', () => {

  let appService: AppService;

  beforeAll(() => {
    appService = new AppService(mockRepository, basketApiMock);
  });

  afterEach(() => {
    mockRepository.createAnnotation.mockClear()
  })

  const createAnnotationDto: CreateAnnotationDto = {
    playerId: 'player1',
    matchId: 'match1',
    points: 10,
  };

  it('should create an annotation and return it', async () => {
    const mockAnnotation = getAnnotationMock(3, "player1", "match1");
    const mockPlayer = getPlayerMock("player1", "team1", "Team 1");
    const mockMatch = getMatchMock(new Date(), "team1", "team2" )

    mockRepository.createAnnotation.mockResolvedValue(mockAnnotation);
    mockRepository.getPlayer.mockResolvedValue(mockPlayer);
    mockRepository.getMatchById.mockResolvedValue(mockMatch);

    const result = await appService.createAnnotation(createAnnotationDto);

    expect(mockRepository.createAnnotation).toHaveBeenCalledWith(createAnnotationDto);
    expect(result).toEqual(mockAnnotation);
  });

  it('should throw HttpException if player is not found', async () => {
    mockRepository.getPlayer.mockResolvedValue(undefined);

    await expect(appService.createAnnotation(createAnnotationDto)).rejects.toThrowError(
      new HttpException('player not found', 404),
    );
    expect(mockRepository.createAnnotation).not.toHaveBeenCalled();
  });

  it('should throw HttpException if match is not found', async () => {
    const mockPlayer = { id: 'player1', name: 'player1', team: "some team" };

    mockRepository.getPlayer.mockResolvedValue(mockPlayer);
    mockRepository.getMatchById.mockResolvedValue(undefined);

    await expect(appService.createAnnotation(createAnnotationDto)).rejects.toThrowError(
      new HttpException('match not found', 404),
    );
    expect(mockRepository.createAnnotation).not.toHaveBeenCalled();
  });
});

describe('calculateTotalScoring', () => {

  let appService: AppService;

  beforeAll(() => {
    appService = new AppService(mockRepository, basketApiMock);
  });

  it('should return 0 if no annotations are provided', () => {
    const annotations = [];
    const result = appService.calculateTotalScoring(annotations);
    expect(result).toEqual(0);
  });

  it('should return the total scoring based on the annotations provided', () => {
    const playerId = 'player1';
    const annotations = [
     getAnnotationMock(2, playerId, "match1"),
      getAnnotationMock(2, playerId, "match2"),
      getAnnotationMock(3, playerId, "match3"),
    ];
    const totalScore = annotations.reduce((acc, annotation) => acc + annotation.points, 0)

    const result = appService.calculateTotalScoring(annotations);

    expect(result).toEqual(totalScore);
  });
});

describe('getPlayerStats', () => {
  let appService: AppService;

  beforeAll(() => {
    appService = new AppService(mockRepository, basketApiMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return player stats', async () => {
    const playerId = 'player1';
    const playerAnnotations = [
      getAnnotationMock(3, playerId, "match1"),
      getAnnotationMock(3, playerId, "match2"),
      getAnnotationMock(3, playerId, "match3"),
    ];
    const totalScoring = playerAnnotations.reduce((acc, annotation) => acc + annotation.points, 0)
    const playerMatchesCount = 5;
    const playerFaultsCount = 2;
    const mockPlayer = getPlayerMock( 'Player 1', "team1", "some team")

    mockRepository.getPlayer.mockResolvedValue(mockPlayer);
    mockRepository.countPlayerMatches.mockResolvedValue(playerMatchesCount);
    mockRepository.countPlayerFaults.mockResolvedValue(playerFaultsCount);
    mockRepository.getPlayerAnnotations.mockResolvedValue(playerAnnotations);

    const result = await appService.getPlayerStats(playerId);

    expect(mockRepository.countPlayerMatches).toHaveBeenCalled();
    expect(mockRepository.getPlayerAnnotations).toHaveBeenCalled();
    expect(mockRepository.countPlayerFaults).toHaveBeenCalled();

    expect(result).toEqual({
      matchesPlayed: playerMatchesCount,
      totalScoring: totalScoring,
      faultsCommited: playerFaultsCount,
      name: mockPlayer.name,
      teamName: mockPlayer.team.name,
    });
  });

  it('should throw HttpException if player is not found', async () => {
    jest.spyOn(mockRepository, 'getPlayer').mockResolvedValue(undefined);

    await expect(appService.getPlayerStats("testId")).rejects.toThrowError(
      new HttpException('player not found', 404),
    );

    expect(mockRepository.countPlayerMatches).not.toHaveBeenCalled();
    expect(mockRepository.getPlayerAnnotations).not.toHaveBeenCalled();
    expect(mockRepository.countPlayerFaults).not.toHaveBeenCalled();
  });
});

describe('getAllPlayerStats', () => {
  let appService: AppService;

  beforeAll(() => {
    appService = new AppService(mockRepository, basketApiMock);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return empty list if no players found', async () => {
    mockRepository.getAllPlayers.mockResolvedValue(Promise.resolve([]))
    const result = await appService.getAllPlayerStats();
    expect(result).toEqual([]);
  });

  it('should return all players stats', async () => {
    const players = [getPlayerMock("Player 1", "team1", "Team 1"), getPlayerMock("Player 2", "team2", "Team 2")];
    const playersAnnotations = [
        getAnnotationMock(3, players[0].id, "match1"),
     getAnnotationMock(3, players[0].id, "match2"),
      getAnnotationMock(3, players[1].id, "match2"),
    ];
    const playersMatchesCount = [5, 3];
    const playersFaultsCount = [2, 1];

    mockRepository.getAllPlayers.mockResolvedValue(Promise.resolve(players))
    mockRepository.countPlayerMatches.mockImplementation((id: string) => {
      if(id === players[0].id) return Promise.resolve(playersMatchesCount[0])
      else return Promise.resolve(playersMatchesCount[1])
    });
    mockRepository.countPlayerFaults.mockImplementation((id: string) => {
      if(id === players[0].id) return Promise.resolve(playersFaultsCount[0])
      else return Promise.resolve(playersFaultsCount[1])
    });
    mockRepository.getPlayerAnnotations.mockImplementation((id: string) => {
      return Promise.resolve(playersAnnotations.filter(annotation => annotation.playerId === id))
    })

    const result = await appService.getAllPlayerStats();

    expect(result).toEqual([
      {
        id: players[0].id,
        name: players[0].name,
        matchesPlayed: playersMatchesCount[0],
        totalScoring: 6,
        teamName: players[0].team.name,
        faultsCommited: playersFaultsCount[0],
      },
      {
        id: players[1].id,
        name: players[1].name,
        teamName: players[1].team.name,
        matchesPlayed: playersMatchesCount[1],
        totalScoring: 3,
        faultsCommited: playersFaultsCount[1],
      }
    ]);
  });
});

