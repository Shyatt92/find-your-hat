const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const field = [[pathCharacter, fieldCharacter, fieldCharacter, hole, fieldCharacter, fieldCharacter, hole, fieldCharacter],[fieldCharacter, fieldCharacter, hole, hole, fieldCharacter, hole, hole, fieldCharacter],[fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter], [hole, fieldCharacter, hole, hole, hole, hole, hole, hole], [fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, hole, fieldCharacter, fieldCharacter, fieldCharacter], [fieldCharacter, fieldCharacter, hole, fieldCharacter, hole, hat, hole, fieldCharacter], [hole, hole, hole, fieldCharacter, fieldCharacter, hole, hole, fieldCharacter], [fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter, hole, fieldCharacter, fieldCharacter],[fieldCharacter, fieldCharacter, fieldCharacter, hole, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter], [fieldCharacter, fieldCharacter, fieldCharacter, hole, fieldCharacter, fieldCharacter, fieldCharacter, fieldCharacter]];


class Field {
    constructor(field) {
        this._field = field;
        this._startCell = [];
        this._currentCell = [];
        this._playing = true;
        this._lost = false;
    }

    get field() {
        return this._field;
    }

    set field(fieldArray) {
        this._field = fieldArray;
    }

    get startCell() {
        return this._startCell;
    }

    set startCell(array) {
        this._startCell = array;
    }

    get currentCell() {
        return this._currentCell;
    }

    set currentCell(indexArray) {
        let temp = this._currentCell;
        this._currentCell = temp.map((num, index) => {return num + indexArray[index]});
    }

    get playing() {
        return this._playing;
    }

    set playing(bool) {
        this._playing = bool;
    }

    get lost() {
        return this._lost;
    }

    set lost(bool) {
        this._lost = bool;
    }

    defineStartCell() {
        let cellIndex = [];
        for (let i=0; i < this.field.length; i++) {
            if (this.field[i].includes(pathCharacter)) {
                cellIndex.push(i);
                cellIndex.push(this.field[i].indexOf(pathCharacter));
            }
        }
        this.startCell = cellIndex;
    }

    generateRandomField(height, width, holes) {
        let fieldArray = [];
        let numberOfHoles = ((height * width)/100) * holes;
        for (let i = 0; i < height; i++) {
            fieldArray.push([]);
        }
        for (let i = 0; i < fieldArray.length; i++) {
            for (let j = 0; j < width; j++) {
                fieldArray[i].push(fieldCharacter)
            }
        }
        this.field = fieldArray;
        let holesCount = 0;
        while (holesCount < numberOfHoles) {
            let randomLayer = Math.floor(Math.random()* this.field.length);
            let randomCell = Math.floor(Math.random() * this.field[randomLayer].length);
            fieldArray[randomLayer][randomCell] = hole;
            holesCount++
        }
        this.field = fieldArray;
    } 

    placeStartAndHat() {
        let getRandomCell = () => {
            let randomCellIndex = [];
            let randomLayer = Math.floor(Math.random()* this.field.length);
            randomCellIndex.push(randomLayer);
            let randomCell = Math.floor(Math.random() * this.field[randomLayer].length);
            randomCellIndex.push(randomCell)
            return randomCellIndex;
        }
        let randomCellIndex = getRandomCell();
        this.field[randomCellIndex[0]][randomCellIndex[1]] = pathCharacter;
        while (this.field[randomCellIndex[0]][randomCellIndex[1]] === pathCharacter) {
            randomCellIndex = getRandomCell();
        }
        this.field[randomCellIndex[0]][randomCellIndex[1]] = hat;
    }

    print() {
        this.field.forEach(layer => {
            console.log(layer.join(''));
        })
    }

    up() {
        const indexChange = [-1, 0]
        if(this.currentCell[0] === 0){
            console.log('You can\'t move that way! Choose another direction.');
        } else if (this.field[this.currentCell[0] -1][this.currentCell[1]] === hole) {
            this.playing = false;
            this.lost = true;
        } else if (this.field[this.currentCell[0] -1][this.currentCell[1]] === hat) {
            this.playing = false;
        } else {
            this.currentCell = indexChange;
            this.field[this.currentCell[0]][this.currentCell[1]] = pathCharacter;
        }
    }

    right() {
        const indexChange = [0, 1]
        if(this.currentCell[1] === (this.field[0].length - 1)) {
            console.log('You can\'t move that way! Choose another direction.');
        } else if(this.field[this.currentCell[0]][this.currentCell[1] +1] === hole) {
            this.playing = false;
            this.lost = true;
        } else if (this.field[this.currentCell[0]][this.currentCell[1] +1] === hat) {
            this.playing = false;
        } else {
            this.currentCell = indexChange;
            this.field[this.currentCell[0]][this.currentCell[1]] = pathCharacter;
        }
    }

    down() {
        const indexChange = [1, 0]
        if(this.currentCell[0] === (this.field.length - 1)) {
            console.log('You can\'t move that way! Choose another direction.');
        } else if(this.field[(this.currentCell[0] + 1)][this.currentCell[1]] === hole) {
            this.playing = false;
            this.lost = true;
        } else if (this.field[this.currentCell[0] +1][this.currentCell[1]] === hat) {
            this.playing = false;
        } else {
            this.currentCell = indexChange;
            this.field[this.currentCell[0]][this.currentCell[1]] = pathCharacter;
        }
    }

    left() {
        const indexChange = [0, -1]
        if(this.currentCell[1] === 0) {
            console.log('You can\'t move that way! Choose another direction.');
        } else if(this.field[this.currentCell[0]][this.currentCell[1] -1] === hole) {
            this.playing = false;
            this.lost = true;
        } else if (this.field[this.currentCell[0]][this.currentCell[1] -1] === hat) {
            this.playing = false;
        } else {
            this.currentCell = indexChange;
            this.field[this.currentCell[0]][this.currentCell[1]] = pathCharacter;
        }
    }

    gameOver() {
        console.log('Game Over!\nYou have fallen down a hole!\nWould you like to play again? (y/n)');
        const answer = prompt('>');
        if(answer === 'n') {
            console.log('Thanks for playing!');
            return;
        } else {
            this.playGame();
        }
    }

    playGame() {
        console.log('Welcome to Find Your Hat!\n How many tiles wide would you like your maze?');
        let width = prompt('>');
        console.log('And how many tiles high would you like your field?');
        let height = prompt('>');
        console.log('And what percentage of tiles would you like to be holes?');
        let percentage = prompt('>'); 
        this.generateRandomField(height, width, percentage);
        this.placeStartAndHat();
        this.defineStartCell();
        this._currentCell = this.startCell;
        this.playing = true;
        this.lost = false;
        while(this.playing) {
            this.print();
            const move = () => {
                console.log('Which direction would you like to go?');
                return prompt('>');
            }
            const choice = move();
            switch(choice) {
                case 'u':
                    this.up();
                    break;
                case 'r':
                    this.right();
                    break;
                case 'd':
                    this.down();
                    break;
                case 'l':
                    this.left();
                    break;
                default:
                    console.log('Please enter valid direction ("u", "d", "l", "r").');
                    break;
            }
        }
        if(this.lost) {
            this.gameOver();
            return;
        }
        console.log('Congratulations!\nYou found your hat!\nWould you like to play again?(y/n)')
        const answer = prompt('>');
        if(answer === 'n') {
            console.log('Thanks for playing!');
            return;
        } else {
            this.playGame();
            return;
        }
    }
}

const myField = new Field(field);
myField.playGame();