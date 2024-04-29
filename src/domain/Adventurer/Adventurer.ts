export const MOVE = 'A';

export enum Orientation {
  NORTH = 'N',
  SOUTH = 'S',
  EAST = 'E',
  WEST = 'O'
}

export enum TurnDirection {
  RIGHT = 'D',
  LEFT = 'G'
}

export class Adventurer {
  public name: string;
  public path: string[];
  public currentOrientation: Orientation;
  public numberOfDiscoveredTreasure: number;
  public currentCoordinates: number[];
  public currentStep: number;

  constructor(
    name: string,
    initialCoordinates: number[],
    initialOrientation: Orientation,
    path: string
  ) {
    this.name = name;
    this.currentCoordinates = initialCoordinates;
    this.currentOrientation = initialOrientation;
    this.path = path.split('');
    this.currentStep = 0;
    this.numberOfDiscoveredTreasure = 0;
  }

  public getCurrentInstructions(): string | undefined {
    return this.path[this.currentStep];
  }

  public nextPotentialCoordinates() {
    const [x, y] = this.currentCoordinates;

    switch (this.currentOrientation) {
      case Orientation.NORTH:
        return [x, y - 1];
      case Orientation.SOUTH:
        return [x, y + 1];
      case Orientation.EAST:
        return [x + 1, y];
      default:
        return [x - 1, y];
    }
  }

  public nextStep() {
    this.currentStep++;
  }

  public moveForward() {
    this.currentCoordinates = this.nextPotentialCoordinates();
  }

  public turn(direction: TurnDirection) {
    if (direction === TurnDirection.LEFT) {
      switch (this.currentOrientation) {
        case Orientation.NORTH:
          this.currentOrientation = Orientation.WEST;
          break;
        case Orientation.SOUTH:
          this.currentOrientation = Orientation.EAST;
          break;
        case Orientation.EAST:
          this.currentOrientation = Orientation.NORTH;
          break;
        default:
          this.currentOrientation = Orientation.SOUTH;
          break;
      }
    } else {
      switch (this.currentOrientation) {
        case Orientation.NORTH:
          this.currentOrientation = Orientation.EAST;
          break;
        case Orientation.SOUTH:
          this.currentOrientation = Orientation.WEST;
          break;
        case Orientation.EAST:
          this.currentOrientation = Orientation.SOUTH;
          break;
        default:
          this.currentOrientation = Orientation.NORTH;
          break;
      }
    }
  }

  public discoverTreasure() {
    this.numberOfDiscoveredTreasure++;
  }
}
