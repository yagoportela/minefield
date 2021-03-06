import levels from './levels';
import row from './row';
import square from './square';

export default class minefield {
    constructor(level) {
        this.level = level;
        this.rows = [];
        this.squares = [];
        this.squaresWithBombs = [];
        this.isFinished = false;
        this.lose = false;
        this.win = false;
        this.hasStarted = false;
        this.qtyFlagsMissing = level.bombs;
        this.qtyFieldsToExplore = 0;
    }

    static createMinefield(levelName) {
        const level = levels[levelName.toLowerCase()];

        const mf = new minefield(level);

        for (let i = 0; i < mf.level.rows; i++) {
            const row = mf._createRow(i);

            for (let j = 0; j < mf.level.columns; j++) {
                mf._createSquare(row);
            }
        }

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

    explodeSquaresAround(square) {
        const neighbors = square.getNeighbors();

        neighbors.forEach(neighbor => {
            this.show(neighbor);
        });
    }

    show(square) {
        if (!this.isFinished && !square.hasFlag && !square.showingResult) {
            if (!this.hasStarted) {
                this._distributeBombs(square);
                this.hasStarted = true;
            }

            square.show();

            if (square.hasBomb) {
                this.isFinished = true;
                this.lose = true;
            } else {
                this.qtyFieldsToExplore--;

                if (this.qtyFieldsToExplore === 0) {
                    this.isFinished = true;
                    this.win = true;
                }
            }

            if (square.getNumberOfNeighborsWithBombs() === 0) {
                this.explodeSquaresAround(square);
            }
        }
    }

    toggleFlag(square) {
        if (!square.showingResult && !this.isFinished) {
            square.toggleFlag();

            if (square.hasFlag) {
                this.qtyFlagsMissing--;
            } else {
                this.qtyFlagsMissing++;
            }
        }
    }

    _distributeBombs(chosenSquare) {
        let currNumberOfBombs = 0;

        while (currNumberOfBombs < this.level.bombs) {
            const randomNumber = Math.floor(Math.random() * this.squares.length);
            const candidateSquare = this.squares[randomNumber];
            
            if (this.level.bisque && this._isNeighborOrSelf(candidateSquare, chosenSquare)) {
                continue;
            }
            
            if (!candidateSquare.hasBomb) {
                candidateSquare.putBomb();
                this.squaresWithBombs.push(candidateSquare);
                currNumberOfBombs++;
                this.qtyFieldsToExplore--;
            }
        }
    }

    _isNeighborOrSelf(currentSquare, chosenSquare) {
        if (!chosenSquare) {
            return false;
        }

        if (currentSquare === chosenSquare) {
            return true;
        }

        const neighbors = chosenSquare.getNeighbors();

        for (let i = 0; i < neighbors.length; i++) {
            if (currentSquare === neighbors[i]) {
                return true;
            }
        }

        return false;
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
        this.qtyFieldsToExplore++;

        return s;
    }
};