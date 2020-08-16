import { ConfigRenderSettings, TileData } from './interfaces';
import { sleep } from './index';

export default class Render {
    private tiles: HTMLDivElement[][];
    private gameField: HTMLDivElement;
    private movesCountBox: HTMLDivElement;
    private scoresCountBox: HTMLDivElement;
    private progressLine: HTMLDivElement;

    // coordinates settings
    private readonly offsetX: number;
    private readonly offsetY: number;

    public constructor(data: ConfigRenderSettings) {
        const { field, offsetX, offsetY, movesCountBox, scoresCountBox, progressLineEl } = data;

        this.offsetX = offsetX;
        this.offsetY = offsetY;

        this.gameField = typeof field == 'string' ? document.getElementById(field) as HTMLDivElement : field;
        this.movesCountBox = typeof movesCountBox == 'string' ? document.getElementById(movesCountBox) as HTMLDivElement : movesCountBox;
        this.scoresCountBox = typeof scoresCountBox == 'string' ? document.getElementById(scoresCountBox) as HTMLDivElement : scoresCountBox;
        this.progressLine = typeof progressLineEl == 'string' ? document.getElementById(progressLineEl) as HTMLDivElement : progressLineEl;
    }
    public async renderTiles(tiles: TileData[][]): Promise<Render> {
        this.tiles = [];
        const tileBoxes: HTMLDivElement[] = [];
        const gameFieldHeight = this.gameField.getBoundingClientRect().height;

        tiles.forEach((row, rowId) => {
            this.tiles[rowId] = [];
            const coordY = rowId * this.offsetY;
            row.forEach(tile => {
                const { row, column, type } = tile;
                const coordX = column * this.offsetX;

                const tileBox = document.createElement('div');
                tileBox.className = `block type_${type}`;
                tileBox.style.top = (coordY - gameFieldHeight) + 'px';
                tileBox.style.left = coordX + 'px';
                Object.assign(tileBox.dataset, { row, column, type });

                this.tiles[rowId][column] = tileBox;
                tileBoxes.push(tileBox);
            });
        });

        this.gameField.innerHTML = '';
        this.gameField.append(...tileBoxes);
        await sleep(0.1);
        await this.fallTiles();

        return this;
    }
    public renderMoves(moves: number): Render {
        this.movesCountBox.innerText = moves.toString();
        return this;
    }
    public renderScores(scores: number, requiredScores: number): Render {
        this.scoresCountBox.innerText = scores.toString();
        this.progressLine.style.width = (Math.min((scores / requiredScores), 1) * 463) + 'px';
        return this;
    }
    public async blastTiles(blastedTiles: TileData[]): Promise<Render> {
        let duration = 0;
        blastedTiles.forEach(tile => {
            const { row, column } = tile;
            const tileEl = this.tiles[row][column];

            tileEl.classList.add('fadeout');
            duration = parseFloat(getComputedStyle(tileEl).animationDuration);

            sleep(duration).then(() => {
                this.tiles[row][column] = null;
                tileEl.remove();
            });
        });

        await sleep(duration);
        return this;
    }
    public moveTile(oldrowId: number, oldcolumnId: number, newrowId: number, newcolumnId: number): Render {
        this.tiles[newrowId][newcolumnId] = this.tiles[oldrowId][oldcolumnId];
        this.tiles[oldrowId][oldcolumnId] = null;
        if (this.tiles[newrowId][newcolumnId]) {
            Object.assign(this.tiles[newrowId][newcolumnId].dataset, { row: newrowId, column: newcolumnId });
        }
        return this;
    }
    public addTile(rowId: number, columnId: number, type: number, emptyTileCount: number): Render {
        const tileBox = document.createElement('div');
        const gameFieldHeight = this.gameField.getBoundingClientRect().height;

        tileBox.className = `block type_${type}`;
        tileBox.style.top = ((rowId * this.offsetY) - (gameFieldHeight * (emptyTileCount + 1) / 9)) + 'px';
        tileBox.style.left = (columnId * this.offsetX) + 'px';
        Object.assign(tileBox.dataset, { row: rowId, column: columnId, type });

        this.tiles[rowId][columnId] = tileBox;
        this.gameField.append(tileBox);
        return this;
    }
    public async fallTiles(): Promise<void> {
        let transitionTime = 0;
        for (let i = (this.tiles.length - 1); i >= 0; i--) {
            const coordY = i * this.offsetY;
            this.tiles[i].forEach((tile) => {
                tile.style.top = coordY + 'px';
                transitionTime = parseFloat(getComputedStyle(tile).transitionDuration);
            });
        }
        await sleep(transitionTime);
    }
}