export default class UI {
    private gameField: HTMLDivElement;
    private canSelection: boolean;

    public constructor(data: { gameField: string|HTMLDivElement; processTileFunc: Function }) {
        this.canSelection = false;
        this.gameField = typeof data.gameField == 'string' ? document.getElementById(data.gameField) as HTMLDivElement : data.gameField;
        this.gameField.addEventListener('click', this.selectTile.bind(this, data.processTileFunc));
    }
    public setSelection(isSelection: boolean): UI {
        this.canSelection = isSelection;
        return this;
    }

    private selectTile(processFunc, event): void {
        if (!this.canSelection) return;

        const target: HTMLElement = event.target;
        console.log([target, this.isTile(target)]);
        if (!this.isTile(target)) return;
        this.canSelection = false;

        const { row, column, type } = target.dataset;
        const tileData = {
            row: +row,
            column: +column,
            type: +type
        };
        processFunc(tileData);
    }
    private isTile(element: HTMLElement): boolean {
        const data = element.dataset;
        return data.hasOwnProperty('type') && data.hasOwnProperty('column') && data.hasOwnProperty('row');
    }
}