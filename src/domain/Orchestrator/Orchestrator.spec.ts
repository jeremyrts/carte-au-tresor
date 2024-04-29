import { MOVE, TurnDirection } from '../Adventurer/Adventurer';
import { Orchestrator } from './Orchestrator';
import { FileService } from '../../service/FileService';

const mockReadFile = jest.fn();
const mockWriteFile = jest.fn();
jest.mock('../../service/FileService', () => {
  return {
    FileService: jest.fn().mockImplementation(() => {
      return {
        readFile: mockReadFile,
        writeFile: mockWriteFile
      };
    })
  };
});

const mockNextStep = jest.fn();
const mockGetCurrentInstructions = jest.fn();
const mockNextPotentialCoordinates = jest.fn();
const mockCurrentCoordinates = jest.fn();
const mockName = jest.fn();
const mockNumberOfDiscoveredTreasure = jest.fn();
const mockCurrentOrientation = jest.fn();
const mockDiscoverTreasure = jest.fn();
const mockTurn = jest.fn();
const mockMoveForward = jest.fn();
const adventurersLeftStub = jest.fn();
jest.mock('../Adventurer/Adventurer', () => {
  return {
    ...jest.requireActual('../Adventurer/Adventurer'),
    Adventurer: jest.fn().mockImplementation(() => {
      return {
        name: mockName(),
        currentCoordinates: mockCurrentCoordinates(),
        numberOfDiscoveredTreasure: mockNumberOfDiscoveredTreasure(),
        currentOrientation: mockCurrentOrientation(),
        turn: mockTurn,
        moveForward: mockMoveForward,
        getCurrentInstructions: mockGetCurrentInstructions,
        nextStep: mockNextStep,
        nextPotentialCoordinates: mockNextPotentialCoordinates,
        discoverTreasure: mockDiscoverTreasure
      };
    })
  };
});

describe('Orchestrator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should have its initial caracteristics', () => {
    mockReadFile.mockReturnValue(`C - 3 - 4
M - 1 - 2
M - 3 - 1
T - 2 - 2 - 2
# Commentary
A - Indiana - 1 - 1 - S - AA
A - Jack - 1 - 1 - S - AA`);

    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    orchestrator.initialise('input.test');
    expect(orchestrator.adventurers.length).toEqual(2);
  });

  it('should throw an error if the adventurer coordinates are not compatible with the map size', () => {
    mockReadFile.mockReturnValue(`C - 3 - 4
M - 1 - 2
M - 3 - 1
T - 2 - 2 - 2
A - Jack - 5 - 2 - S - AA`);
    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    expect(() => orchestrator.initialise('input.test')).toThrow();
  });

  it('should run a turn and run aventures next step', () => {
    mockReadFile.mockReturnValue(`C - 3 - 4
M - 1 - 2
M - 3 - 1
T - 2 - 2 - 2
A - Indiana - 1 - 1 - S - LA
A - Jack - 1 - 1 - S - LA`);
    mockGetCurrentInstructions.mockReturnValue(undefined).mockReturnValueOnce(TurnDirection.LEFT);
    adventurersLeftStub.mockReturnValue([0, 1]);

    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    orchestrator.initialise('input.test');
    orchestrator.run();
    expect(mockNextStep).toHaveBeenCalled();
  });

  it('should prevent the adventurer from moving when next move is leaving the journeyMap', () => {
    mockReadFile.mockReturnValue(`C - 3 - 4
M - 1 - 2
M - 2 - 1
T - 2 - 2 - 2
A - Indiana - 1 - 0 - N - A`);
    mockGetCurrentInstructions.mockReturnValue(undefined).mockReturnValueOnce(MOVE);
    mockNextPotentialCoordinates.mockReturnValue([1, -1]);

    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    orchestrator.initialise('input.test');
    orchestrator.run();
    expect(mockMoveForward).not.toHaveBeenCalled();
  });

  it('should prevent the adventurer from moving when next move is going on a mountain', () => {
    mockReadFile.mockReturnValue(`C - 3 - 4
M - 1 - 2
M - 2 - 1
T - 2 - 2 - 2
A - Indiana - 1 - 1 - S - A`);
    mockGetCurrentInstructions.mockReturnValue(undefined).mockReturnValueOnce(MOVE);
    mockNextPotentialCoordinates.mockReturnValue([1, 2]);

    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    orchestrator.initialise('input.test');
    orchestrator.run();
    expect(mockMoveForward).not.toHaveBeenCalled();
  });

  it('should prevent the adventurer from moving when next move is going on a case already used by an adventurer', () => {
    mockReadFile.mockReturnValue(`C - 3 - 4
M - 1 - 2
M - 3 - 1
T - 2 - 2 - 2
A - Indiana - 0 - 1 - E - A
A - Jack - 1 - 0 - S - A`);
    mockGetCurrentInstructions.mockReturnValue(undefined).mockReturnValueOnce(MOVE);
    mockCurrentCoordinates.mockReturnValue([1, 1]).mockReturnValueOnce([0, 1]);
    mockNextPotentialCoordinates.mockReturnValue([1, 1]);

    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    orchestrator.initialise('input.test');
    orchestrator.run();
    expect(mockMoveForward).not.toHaveBeenCalledTimes(2);
  });

  it('should increase the number of discovered treasure when the adventurer reach one', () => {
    mockReadFile.mockReturnValue(`C - 4 - 4
M - 1 - 2
M - 3 - 1
T - 2 - 2 - 2
T - 2 - 3 - 2
A - Indiana - 2 - 1 - S - AA`);
    mockGetCurrentInstructions
      .mockReturnValue(undefined)
      .mockReturnValueOnce(MOVE)
      .mockReturnValueOnce(MOVE);
    mockCurrentCoordinates.mockReturnValue([2, 4]).mockReturnValueOnce([2, 2]);
    mockNextPotentialCoordinates.mockReturnValue([2, 3]).mockReturnValueOnce([2, 2]);

    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    orchestrator.initialise('input.test');
    orchestrator.run();
    // expect(mockDiscoverTreasure).toHaveBeenCalledTimes(1);

    // orchestrator.nextTurn();
    expect(mockDiscoverTreasure).toHaveBeenCalledTimes(2);
  });

  it('should not increase the number of discovered treasure when the adventurer reach a treasure case without treasure', () => {
    mockReadFile.mockReturnValue(`C - 4 - 4
M - 1 - 2
M - 3 - 1
T - 2 - 2 - 0
A - Indiana - 2 - 1 - S - A`);
    mockGetCurrentInstructions.mockReturnValue(undefined).mockReturnValueOnce(MOVE);
    mockCurrentCoordinates.mockReturnValue([2, 1]);
    mockNextPotentialCoordinates.mockReturnValue([2, 2]);

    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    orchestrator.initialise('input.test');
    orchestrator.run();
    expect(mockDiscoverTreasure).not.toHaveBeenCalled();
  });

  it('should generate correct output', () => {
    mockReadFile.mockReturnValue(`C - 4 - 4
M - 1 - 2
M - 3 - 1
T - 1 - 1 - 1
T - 2 - 2 - 1
A - Lara - 0 - 1 - S - A`);
    mockGetCurrentInstructions.mockReturnValue(undefined).mockReturnValueOnce(MOVE);
    mockCurrentCoordinates.mockReturnValue([1, 1]);
    mockNextPotentialCoordinates.mockReturnValue([1, 1]);
    mockName.mockReturnValue('Lara');
    mockNumberOfDiscoveredTreasure.mockReturnValue(1);
    mockCurrentOrientation.mockReturnValue('S');

    const fileService = new FileService();
    const orchestrator = new Orchestrator(fileService);
    orchestrator.initialise('input.test');
    orchestrator.run();
    orchestrator.generateOutput();

    const expectedRawData = `C - 4 - 4
M - 1 - 2
M - 3 - 1
T - 2 - 2 - 1
A - Lara - 1 - 1 - S - 1`;
    expect(mockWriteFile).toHaveBeenCalledWith(expectedRawData);
  });
});
