import levels from './levels';
import row from './row';
import square from './square';

export default class minefield {
    constructor(levelName, level) {
        this.levelName = levelName;
        this.level = level;
        this.rows = [];
        this.squares = [];
        this.squaresWithBombs = [];
        this.isFinished = false;
        this.hasStarted = false;
    }

    static createMinefield(levelName) {
        const level = levels[levelName.toLowerCase()];

        const mf = new minefield(levelName, level);

        for (let i = 0; i < mf.level.rows; i++) {
            const row = mf._createRow(i);

            for (let j = 0; j < mf.level.columns; j++) {
                mf._createSquare(row);
            }
        }

        mf._distributeBombs();

        return mf;
    }

    shouldPaintAsEven(square) {
        const isEven = square.isEven();
        const isNumberOfColumnsEven = this.level.columns % 2 === 0;

        if (isNumberOfColumnsEven && !square.row.isEven()) {
            return !isEven;
        }

        return isEven;
    }

    show(square) {
        this.hasStarted = true;
        square.show();

        if (square.hasBomb) {
            this.isFinished = true;
        }
    }

    _distributeBombs() {
        let currNumberOfBombs = 0;

        while (currNumberOfBombs < this.level.bombs) {
            const randomNumber = Math.floor(Math.random() * this.squares.length);

            const square = this.squares[randomNumber];

            if (!square.hasBomb) {
                square.putBomb();
                this.squaresWithBombs.push(square);

                currNumberOfBombs++;
            }
        }
    }

    _createRow(rowIndex) {
        const r = new row(this, rowIndex);

        this.rows.push(r);

        return r;
    }

    _createSquare(row) {
        const s = new square(row);

        row.addSquare(s, this.squares.length);

        this.squares.push(s);

        return s;
    }

};