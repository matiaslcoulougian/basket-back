import { CreateAnnotationDto, CreateFaultDto, CreateMatchDto, FaultType } from "../../../src/models/dtos";
import { AppService } from "../../../src/app.service";
import { Match } from "@prisma/client";
import { HttpException } from "@nestjs/common";


const mockRepository = {
  getAllMatches: jest.fn(),
  getAllPlayers: jest.fn(),
  createMatch: jest.fn(),
  getMatch: jest.fn(),
  createFault: jest.fn(),
  getPlayer: jest.fn(),
  getMatchById: jest.fn(),
  getTeam: jest.fn(),
  createAnnotation: jest.fn(),
  countPlayerMatches: jest.fn(),
  getPlayerAnnotations: jest.fn(),
  countPlayerFaults: jest.fn(),
  getAllTeams: jest.fn(),
}

const appService = new AppService(mockRepository)

describe('Create match', () => {

  it('Create match should return new match', async () => {
    const team1 = {
      id: "some id 1",
      name: "1",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const team2 = {
      id: "some id 2",
      name: "2",
      createdAt: new Date(),
      updatedAt: new Date()
    }
    const body: CreateMatchDto = {
      startDate: new Date(),
      location: "miami",
      localTeamId: "some id 1",
      visitorTeamId: "some id 2",
    }
    const match: Match = {
      id: "match id",
      startDate: body.startDate,
      location: "miami",
      localTeamId: "some id 1",
      visitorTeamId: "some id 2",
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    mockRepository.getTeam.mockImplementation((id: string) => {
      if (id === "some id 1") return Promise.resolve(team1)
      else Promise.resolve(team2)
    })
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

  afterEach(() => {
    mockRepository.createFault.mockClear()
  })

  const createFaultDto: CreateFaultDto = {
    playerId: 'player1',
    matchId: 'match1',
    type: FaultType.YELLOW_CARD,
  };

  it('should create a fault and return it', async () => {
    const mockFault = { id: 'fault1', ...createFaultDto };
    const mockPlayer = { id: 'player1', name: 'player1', team: "some team" };
    const mockMatch = {
      id: "match id",
      startDate: new Date(),
      location: "miami",
      localTeamId: "some id 1",
      visitorTeamId: "some id 2",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

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

  afterEach(() => {
    mockRepository.createAnnotation.mockClear()
  })

  const createAnnotationDto: CreateAnnotationDto = {
    playerId: 'player1',
    matchId: 'match1',
    points: 10,
  };

  it('should create an annotation and return it', async () => {
    const mockAnnotation = { id: 'annotation1', ...createAnnotationDto };
    const mockPlayer = { id: 'player1', name: 'player1', team: "some team" };
    const mockMatch = {
      id: "match id",
      startDate: new Date(),
      location: "miami",
      localTeamId: "some id 1",
      visitorTeamId: "some id 2",
      createdAt: new Date(),
      updatedAt: new Date(),
    }

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

  it('should return 0 if no annotations are provided', () => {
    const annotations = [];
    const result = appService.calculateTotalScoring(annotations);
    expect(result).toEqual(0);
  });

  it('should return the total scoring based on the annotations provided', () => {
    const annotations = [
      { id: 'annotation1', playerId: 'player1', matchId: 'match1', points: 2, createdAt: new Date(), updatedAt: new Date() },
      { id: 'annotation2', playerId: 'player1', matchId: 'match2', points: 1, createdAt: new Date(), updatedAt: new Date()  },
      { id: 'annotation3', playerId: 'player1', matchId: 'match3', points: 3, createdAt: new Date(), updatedAt: new Date() },
    ];

    const result = appService.calculateTotalScoring(annotations);

    expect(result).toEqual(6);
  });
});

describe('getPlayerStats', () => {
  const playerId = 'player1';
  const playerAnnotations = [
    { id: 'annotation1', playerId: playerId, matchId: 'match1', points: 2, createdAt: new Date(), updatedAt: new Date() },
    { id: 'annotation2', playerId: playerId, matchId: 'match2', points: 1, createdAt: new Date(), updatedAt: new Date()  },
    { id: 'annotation3', playerId: playerId, matchId: 'match3', points: 3, createdAt: new Date(), updatedAt: new Date() },
  ];
  const playerMatchesCount = 5;
  const playerFaultsCount = 2;
  const mockPlayer = { id: playerId, team: "some team" };

  beforeEach(() => {
    mockRepository.getPlayer.mockResolvedValue(mockPlayer);
    mockRepository.countPlayerMatches.mockResolvedValue(playerMatchesCount);
    mockRepository.countPlayerFaults.mockResolvedValue(playerFaultsCount);
    mockRepository.getPlayerAnnotations.mockResolvedValue(playerAnnotations);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return player stats', async () => {
    const result = await appService.getPlayerStats(playerId);

    expect(mockRepository.getPlayer).toHaveBeenCalledWith(playerId);
    expect(mockRepository.countPlayerMatches).toHaveBeenCalledWith(playerId);
    expect(mockRepository.getPlayerAnnotations).toHaveBeenCalledWith(playerId);
    expect(mockRepository.countPlayerFaults).toHaveBeenCalledWith(playerId);

    expect(result).toEqual({
      matchesPlayed: playerMatchesCount,
      totalScoring: 6,
      faultsCommited: playerFaultsCount,
    });
  });

  it('should throw HttpException if player is not found', async () => {
    jest.spyOn(mockRepository, 'getPlayer').mockResolvedValue(undefined);

    await expect(appService.getPlayerStats(playerId)).rejects.toThrowError(
      new HttpException('player not found', 404),
    );

    expect(mockRepository.countPlayerMatches).not.toHaveBeenCalled();
    expect(mockRepository.getPlayerAnnotations).not.toHaveBeenCalled();
    expect(mockRepository.countPlayerFaults).not.toHaveBeenCalled();
  });
});

describe('getAllPlayerStats', () => {
  const playerIds = ['player1', 'player2'];
  const playersAnnotations = [    { id: 'annotation1', playerId: 'player1', matchId: 'match1', points: 2, createdAt: new Date(), updatedAt: new Date() },    { id: 'annotation2', playerId: 'player1', matchId: 'match2', points: 1, createdAt: new Date(), updatedAt: new Date()  },    { id: 'annotation3', playerId: 'player2', matchId: 'match3', points: 3, createdAt: new Date(), updatedAt: new Date() },  ];
  const playersMatchesCount = [5, 3];
  const playersFaultsCount = [2, 1];
  const mockPlayers = [    { id: 'player1', name: 'Player 1', team: "some team" },    { id: 'player2', name: 'Player 2', team: "some team" },  ];

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return empty list if no players found', async () => {
    mockRepository.getAllPlayers.mockResolvedValue(Promise.resolve([]))
    const result = await appService.getAllPlayerStats();
    expect(result).toEqual([]);
  });

  it('should return all players stats', async () => {
    mockRepository.getAllPlayers.mockResolvedValue(Promise.resolve(mockPlayers))
    mockRepository.countPlayerMatches.mockImplementation((id: string) => {
      if(id === playerIds[0]) return Promise.resolve(playersMatchesCount[0])
      else return Promise.resolve(playersMatchesCount[1])
    });
    mockRepository.countPlayerFaults.mockImplementation((id: string) => {
      if(id === playerIds[0]) return Promise.resolve(playersFaultsCount[0])
      else return Promise.resolve(playersFaultsCount[1])
    });
    mockRepository.getPlayerAnnotations.mockImplementation((id: string) => {
      return Promise.resolve(playersAnnotations.filter(annotation => annotation.playerId === id))
    })

    const result = await appService.getAllPlayerStats();

    expect(result).toEqual([
      {
        id: 'player1',
        name: 'Player 1',
        matchesPlayed: playersMatchesCount[0],
        totalScoring: 3,
        faultsCommited: playersFaultsCount[0],
      },
      {
        id: 'player2',
        name: 'Player 2',
        matchesPlayed: playersMatchesCount[1],
        totalScoring: 3,
        faultsCommited: playersFaultsCount[1],
      }
    ]);
  });
});

