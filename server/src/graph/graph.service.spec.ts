import { Test, TestingModule } from '@nestjs/testing';
import { GraphService } from './graph.service';
import { ConfigService } from '@nestjs/config';
import { Driver, Session } from 'neo4j-driver';

describe('GraphService', () => {
  let service: GraphService;
  let sessionMock: Partial<Session>;
  let driverMock: Partial<Driver>;

  beforeEach(async () => {
    sessionMock = {
      run: jest.fn().mockResolvedValue({
        records: [
          {
            get: jest.fn().mockReturnValue({
              properties: {
                title: 'The Matrix',
                rating: 8.4,
                voteCount: { toNumber: () => 5 },
              },
            }),
          },
        ],
      }),
      close: jest.fn(),
    };

    driverMock = {
      session: jest.fn(() => sessionMock as Session),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GraphService,
        { provide: 'NEO4J_DRIVER', useValue: driverMock },
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<GraphService>(GraphService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should vote for a movie and return updated data', async () => {
    const result = await service.voteForMovie('The Matrix', 9);
    expect(result.title).toBe('The Matrix');
    expect(result.rating).toBe(8.4);
    expect(result.voteCount).toBe(5);
  });

  it('should search movies by title', async () => {
    const result = await service.searchGraph('matrix');
    expect(result).toBeInstanceOf(Array);
    expect(result[0].title).toBe('The Matrix');
  });
});
