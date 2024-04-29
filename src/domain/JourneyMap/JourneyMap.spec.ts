import { TreasureCase } from '../TreasureCase/TreasureCase';
import { JourneyMap } from './JourneyMap';

describe('JourneyMap', () => {
  it('should decrease the number of treasure on a given treasure case', () => {
    const treasureCaseOne = new TreasureCase([2, 2], 2);
    const treasureCaseTwo = new TreasureCase([2, 3], 2);
    const journeyMap = new JourneyMap(
      [4, 4],
      [
        [1, 2],
        [3, 1]
      ],
      [treasureCaseOne, treasureCaseTwo]
    );

    journeyMap.decreaseTreasure(2, 2);
    expect(treasureCaseOne.numberOfLeftTreasure).toEqual(1);
  });
});
