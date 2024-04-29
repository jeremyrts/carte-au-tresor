import { Adventurer, Orientation, TurnDirection } from './Adventurer';

describe('Adventurer', () => {
  it('should have its initial position', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.SOUTH, 'AADADA');

    expect(adventurerOne.currentCoordinates).toEqual([1, 1]);
  });

  it('should move down when he is facing South', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.SOUTH, 'AADADA');

    adventurerOne.moveForward();

    expect(adventurerOne.currentCoordinates).toEqual([1, 2]);
  });

  it('should move up when he is facing north', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.NORTH, 'AADADA');

    adventurerOne.moveForward();

    expect(adventurerOne.currentCoordinates).toEqual([1, 0]);
  });

  it('should move right when he is facing East', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.EAST, 'AADADA');

    adventurerOne.moveForward();

    expect(adventurerOne.currentCoordinates).toEqual([2, 1]);
  });

  it('should move left when he is facing West', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.WEST, 'AADADA');

    adventurerOne.moveForward();

    expect(adventurerOne.currentCoordinates).toEqual([0, 1]);
  });

  it('should change orientation from North to West when turning left', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.NORTH, 'AADADA');

    adventurerOne.turn(TurnDirection.LEFT);

    expect(adventurerOne.currentOrientation).toEqual(Orientation.WEST);
  });
  it('should change orientation from South to East when turning left', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.SOUTH, 'AADADA');

    adventurerOne.turn(TurnDirection.LEFT);

    expect(adventurerOne.currentOrientation).toEqual(Orientation.EAST);
  });
  it('should change orientation from East to North when turning left', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.EAST, 'AADADA');

    adventurerOne.turn(TurnDirection.LEFT);

    expect(adventurerOne.currentOrientation).toEqual(Orientation.NORTH);
  });
  it('should change orientation from West to South when turning left', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.WEST, 'AADADA');

    adventurerOne.turn(TurnDirection.LEFT);

    expect(adventurerOne.currentOrientation).toEqual(Orientation.SOUTH);
  });

  it('should change orientation from South to West when turning right', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.SOUTH, 'AADADA');

    adventurerOne.turn(TurnDirection.RIGHT);

    expect(adventurerOne.currentOrientation).toEqual(Orientation.WEST);
  });

  it('should change orientation from East to South when turning right', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.EAST, 'AADADA');

    adventurerOne.turn(TurnDirection.RIGHT);

    expect(adventurerOne.currentOrientation).toEqual(Orientation.SOUTH);
  });

  it('should change orientation from North to East when turning right', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.NORTH, 'AADADA');

    adventurerOne.turn(TurnDirection.RIGHT);

    expect(adventurerOne.currentOrientation).toEqual(Orientation.EAST);
  });

  it('should change orientation from West to North when turning right', () => {
    const adventurerOne = new Adventurer('Indiana', [1, 1], Orientation.WEST, 'AADADA');

    adventurerOne.turn(TurnDirection.RIGHT);

    expect(adventurerOne.currentOrientation).toEqual(Orientation.NORTH);
  });

  it('should return the next potential coordinates', () => {
    const adventurerOne = new Adventurer('Indiana', [3, 6], Orientation.EAST, 'A');

    const nextPotentialCoordinates = adventurerOne.nextPotentialCoordinates();

    expect(nextPotentialCoordinates).toEqual([4, 6]);

    const adventurerTwo = new Adventurer('Indiana', [1, 2], Orientation.SOUTH, 'A');

    const nextPotentialCoordinatesTwo = adventurerTwo.nextPotentialCoordinates();

    expect(nextPotentialCoordinatesTwo).toEqual([1, 3]);
  });

  it('should increase the number of discovered treasure', () => {
    const adventurerOne = new Adventurer('Indiana', [3, 6], Orientation.EAST, 'A');

    adventurerOne.discoverTreasure();

    expect(adventurerOne.numberOfDiscoveredTreasure).toEqual(1);
  });
});
