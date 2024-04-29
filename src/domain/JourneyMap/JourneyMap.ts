import { Coordinates } from '../Common';
import { TreasureCase } from '../TreasureCase/TreasureCase';

export class JourneyMap {
  public size: number[];
  public mountainsCoordinates: number[][];
  public treasuresInformation: TreasureCase[];

  constructor(
    size: number[],
    mountainsCoordinates: number[][],
    treasureInformation: TreasureCase[]
  ) {
    this.size = size;
    this.mountainsCoordinates = mountainsCoordinates;
    this.treasuresInformation = treasureInformation;
  }

  public decreaseTreasure(x: number, y: number) {
    const selectedTreasureCase = this.treasuresInformation.find(
      (treasureCase) =>
        treasureCase.coordinates[Coordinates.X] === x &&
        treasureCase.coordinates[Coordinates.Y] === y &&
        treasureCase.numberOfLeftTreasure > 0
    );

    if (selectedTreasureCase) {
      selectedTreasureCase.decreaseNumberOfTreasure();
    }
  }
}
