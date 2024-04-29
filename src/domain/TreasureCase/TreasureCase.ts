export class TreasureCase {
  public coordinates: number[];
  public numberOfLeftTreasure: number;

  constructor(coordinates: number[], totalTreasureNumber: number) {
    this.coordinates = coordinates;
    this.numberOfLeftTreasure = totalTreasureNumber;
  }

  public decreaseNumberOfTreasure() {
    this.numberOfLeftTreasure--;
  }
}
