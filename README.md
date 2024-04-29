# Carte au tresor

This is a project used as a technical exercice

## How to use

### Installation
Run `npm install` to install all the dependencies

### Setup
Prepare your input text file following the following format: 

```
# {C comme Carte} - {Nb. de case en largeur} - {Nb. de case en hauteur}
C​ - 3 - 4
# {M comme Montagne} - {Axe horizontal} - {Axe vertical}
M​ - 1 - 1
...
# {T comme Trésor} - {Axe horizontal} - {Axe vertical} - {Nb. de trésors}
T​ - 0 - 3 - 2
...
# {A comme Aventurier} - {Nom de l’aventurier} - {Axe horizontal} - {Axe vertical} - {Orientation} - {Séquence de mouvement}
A​ - Indiana - 1 - 1 - S - AADADA
```
An `input.txt` example exists in the `src/assets` folder

### Run the program
Run `npm run start <path/to/your/inputFile.txt>` to launch the program.

Your result output will be available in the  folder.

The `result.txt` corresponding to the `input.txt` example already exists in the `/output` folder
