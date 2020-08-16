import { sleep } from './index';
import { GameConfig, TileData } from './interfaces';
import UI from './UI';
import Render from './Render';

export default class Game {
    private readonly config: GameConfig;
    private tiles: TileData[][];
    private blastedTiles: TileData[];
    private scores: number;
    private moves: number;

    private readonly ui: UI;
    private readonly render: Render;
    private readonly requiredScores: number;

    public constructor(config: GameConfig) {
        this.config = config;
        this.scores = 0;
        this.requiredScores = config.requiredScores;
        this.moves = config.moves;
        this.ui = new UI({
            gameField: config.renderSettings.field,
            processTileFunc: this.processTile.bind(this)
        });
        this.render = new Render(config.renderSettings);
        this.start();
    }

    private initTiles(): Game {
        const { rows, columns, types } = this.config.tileSettings;

        this.tiles = [];
        for (let i = 0; i < rows; i++) {
            this.tiles[i] = [];
            for (let j = 0; j < columns; j++) {
                let randomValue = Math.floor(Math.random() * types) + 1;
                this.tiles[i][j] = {
                    row: i,
                    column: j,
                    type: randomValue
                }
            }
        }

        return this;
    }
    private start(): Game {
        do {
            this.initTiles();
        } while (!this.checkBlastChances());

        this.render.renderMoves(this.moves);
        this.render.renderScores(this.scores, this.requiredScores);
        this.render.renderTiles(this.tiles).then(() => {
            this.ui.setSelection(true);
        });

        return this;
    }
    private restart(): Game {
        this.scores = 0;
        this.moves = this.config.moves;
        this.start();
        return this;
    }
    private gameOver(result: 'win'|'fail'): Game {
        let msg;
        if (result == 'win') msg = 'Поздравляю! Вы победили.\nЖелаете ли сыграть еще раз?';
        else msg = 'К сожалению Вы проиграли.\nЖелаете ли отыграться?';

        if (window.confirm(msg)) this.restart();
        return this;
    }
    private async processTile(tileData: TileData): Promise<void> {
        this.blastedTiles = [];
        this.blastedTiles.push(tileData);

        this.findConnectedTiles(tileData.row, tileData.column, tileData.type);
        if (this.blastedTiles.length > 1) {
            await this.render.blastTiles(this.blastedTiles);

            this.setScores(this.blastedTiles.length);
            this.decreasedMoves();

            const emptyTiles = this.removeConnectedTiles();
            do {
                this.fillEmptyTiles(emptyTiles);
            } while (!this.checkBlastChances());
            await this.render.fallTiles();

            await sleep(0.3);
        }

        if (this.scores >= this.requiredScores) this.gameOver('win');
        else if (!this.moves) this.gameOver('fail');
        else this.ui.setSelection(true);
    }
    private findConnectedTiles(rowId: number, columnId: number, typeId: number): void {
        this.findConnectedTile(rowId + 1, columnId, typeId);
        this.findConnectedTile(rowId - 1, columnId, typeId);
        this.findConnectedTile(rowId, columnId + 1, typeId);
        this.findConnectedTile(rowId, columnId - 1, typeId);
    }
    private findConnectedTile(rowId: number, columnId: number, typeId: number): void {
        if (this.isValidTile(rowId, columnId) && this.tiles[rowId][columnId].type === typeId && !this.isAlreadyBlasted(rowId, columnId)) {
            this.blastedTiles.push(this.tiles[rowId][columnId]);
            this.findConnectedTiles(rowId, columnId, typeId);
        }
    }
    private removeConnectedTiles(): Map<number, number> {
        const emptyTiles: Map<number, number> = new Map();

        this.blastedTiles.sort((a, b) => a.row - b.row).forEach(tile => {
            const { row, column } = tile;
            this.tiles[row][column].type = 0;

            for (let i = row; i > 0; i--) {
                const prevRow = i - 1;
                this.tiles[i][column].type = this.tiles[prevRow][column].type;
                this.tiles[prevRow][column].type = 0;
                this.render.moveTile(prevRow, column, i, column);
            }

            emptyTiles.set(column, emptyTiles.has(column) ? emptyTiles.get(column) + 1 : 0);
        });

        return emptyTiles;
    }
    private fillEmptyTiles(emptyTiles: Map<number, number>): Game {
        emptyTiles.forEach((rows, column) => {
            for (let i = rows; i >= 0; i--) {
                let randomValue = Math.floor(Math.random() * this.config.tileSettings.types) + 1;
                this.tiles[i][column].type = randomValue;
                this.render.addTile(i, column, randomValue, rows);
            }
        });
        return this;
    }
    private isAlreadyBlasted(rowId: number, columnId: number): boolean {
        return this.blastedTiles.some(tile => tile.row === rowId && tile.column === columnId);
    }
    private isValidTile(rowId: number, columnId: number): boolean {
        return !!this.tiles[rowId] && !!this.tiles[rowId][columnId];
    }
    private setScores(tilesCount: number): Game {
        this.scores += 10 * tilesCount;
        this.render.renderScores(this.scores, this.requiredScores);
        return this;
    }
    private decreasedMoves(): Game {
        this.render.renderMoves(--this.moves);
        return this;
    }
    private checkBlastChances(): boolean {
        const rows = this.tiles.length;
        for (let i = 0; i < rows; i++) {
            const columns = this.tiles[i].length;
            for (let j = 0; j < columns; j++) {
                this.blastedTiles = [];
                this.findConnectedTiles(i, j, this.tiles[i][j].type);
                if (this.blastedTiles.length) return true;
            }
        }
        return false;
    }
}