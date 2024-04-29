import { FileService } from '../../service/FileService';
import { Adventurer, Orientation, TurnDirection } from '../Adventurer/Adventurer';
import { Coordinates } from '../Common';
import { JourneyMap } from '../JourneyMap/JourneyMap';
import { TreasureCase } from '../TreasureCase/TreasureCase';

export class Orchestrator {
  public adventurers: Adventurer[];
  private fileService: FileService;
  private adventurersLeft!: Adventurer[];
  private journeyMap!: JourneyMap;

  constructor(fileService: FileService) {
    this.fileService = fileService;
    this.adventurers = [];
  }

  public initialise(fileUri: string) {
    const file = this.fileService.readFile(fileUri);
    const elements = file.split('\n');
    const distinctElements = elements.map((element) => element.split(' - '));

    const journeyMapSize: number[] = [];
    const mountains: number[][] = [];
    const treasures: TreasureCase[] = [];

    distinctElements.forEach((item) => {
      const [type, ...rest] = item;
      switch (type) {
        case 'C': {
          const [x, y] = rest;
          journeyMapSize.push(Number.parseInt(x), Number.parseInt(y));
          break;
        }
        case 'M': {
          const [x, y] = rest;
          mountains.push([Number.parseInt(x), Number.parseInt(y)]);
          break;
        }
        case 'T': {
          const [x, y, numberOfTreasures] = rest;
          treasures.push(
            new TreasureCase(
              [Number.parseInt(x), Number.parseInt(y)],
              Number.parseInt(numberOfTreasures)
            )
          );
          break;
        }
        case 'A': {
          const [name, x, y, orientation, instructionPath] = rest;
          const xCoordinates = Number.parseInt(x);
          const yCoordinates = Number.parseInt(y);
          if (
            xCoordinates >= 0 &&
            xCoordinates < journeyMapSize[0] &&
            yCoordinates >= 0 &&
            yCoordinates < journeyMapSize[1]
          )
            this.adventurers.push(
              new Adventurer(
                name,
                [xCoordinates, yCoordinates],
                orientation as Orientation,
                instructionPath
              )
            );
          else {
            throw new Error(
              `Adventurer ${name} has invalid initial coordinates incompatible with your map size. Please retry with valid coordinates`
            );
          }
          break;
        }

        default:
          break;
      }
    });

    this.journeyMap = new JourneyMap(journeyMapSize, mountains, treasures);
    this.adventurersLeft = [...this.adventurers];
  }
  public run() {
    while (this.adventurersLeft.length > 0) {
      this.nextTurn();
    }
  }

  public nextTurn() {
    this.adventurersLeft.forEach((adventurer: Adventurer, index: number) => {
      const nextInstruction = adventurer.getCurrentInstructions();
      if (nextInstruction) {
        if (this.isTurnDirectionInstructions(nextInstruction)) {
          adventurer.turn(nextInstruction as TurnDirection);
        } else {
          const [x, y] = adventurer.nextPotentialCoordinates();
          if (
            !this.isOutsideJourneyMap(x, y) &&
            !this.hasMontain(x, y) &&
            !this.hasAdventurer(x, y, adventurer.name)
          ) {
            adventurer.moveForward();
            const validTreasureCase = this.getTreasureCase(x, y);
            if (validTreasureCase) {
              adventurer.discoverTreasure();
              validTreasureCase.decreaseNumberOfTreasure();
            }
          }
        }
        adventurer.nextStep();
      } else {
        this.adventurersLeft.splice(index, 1);
      }
    });
  }

  public generateOutput() {
    let rawData = '';
    rawData += this.buildJourneyMapOutput(this.journeyMap.size);
    rawData += this.buildMountainsOutput(this.journeyMap.mountainsCoordinates);
    rawData += this.buildTreasuresOutput(this.journeyMap.treasuresInformation);
    rawData += this.buildAventurerOutput(this.adventurers);

    this.fileService.writeFile(rawData);
  }

  private isTurnDirectionInstructions(instruction: string) {
    return instruction === TurnDirection.LEFT || instruction === TurnDirection.RIGHT;
  }

  private isOutsideJourneyMap(x: number, y: number) {
    const [maxSizeX, maxSizeY] = this.journeyMap.size;
    return x < 0 || y < 0 || x >= maxSizeX || y >= maxSizeY;
  }

  private hasMontain(x: number, y: number) {
    const mountainsCoordinates = this.journeyMap.mountainsCoordinates;

    return (
      mountainsCoordinates.findIndex(
        (mountainCoordinates) =>
          mountainCoordinates[Coordinates.X] === x && mountainCoordinates[Coordinates.Y] === y
      ) !== -1
    );
  }

  private getTreasureCase(x: number, y: number) {
    const treasuresInformation = this.journeyMap.treasuresInformation;
    return treasuresInformation.find(
      (treasure) =>
        treasure.coordinates[Coordinates.X] === x &&
        treasure.coordinates[Coordinates.Y] === y &&
        treasure.numberOfLeftTreasure > 0
    );
  }

  private hasAdventurer(x: number, y: number, currentAdventurerName: string) {
    return (
      this.adventurers.findIndex(
        (adventurer) =>
          adventurer.currentCoordinates[Coordinates.X] === x &&
          adventurer.currentCoordinates[Coordinates.Y] === y &&
          adventurer.name !== currentAdventurerName
      ) !== -1
    );
  }

  private buildJourneyMapOutput(journeyMapSize: number[]) {
    return 'C - ' + journeyMapSize.join(' - ') + '\n';
  }

  private buildMountainsOutput(mountains: number[][]) {
    let output = '';

    mountains.forEach((mountain) => {
      output += 'M - ' + mountain.join(' - ') + '\n';
    });

    return output;
  }
  private buildTreasuresOutput(treasures: TreasureCase[]) {
    let output = '';

    treasures.forEach((treasure) => {
      if (treasure.numberOfLeftTreasure > 0) {
        output +=
          'T - ' + treasure.coordinates.join(' - ') + ' - ' + treasure.numberOfLeftTreasure + '\n';
      }
    });

    return output;
  }

  private buildAventurerOutput(adventurers: Adventurer[]) {
    let output = '';
    adventurers.forEach((adventurer) => {
      output +=
        'A - ' +
        adventurer.name +
        ' - ' +
        adventurer.currentCoordinates.join(' - ') +
        ' - ' +
        adventurer.currentOrientation +
        ' - ' +
        adventurer.numberOfDiscoveredTreasure;
    });

    return output;
  }
}
