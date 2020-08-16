export interface GameConfig {
    requiredScores: number;
    moves: number;
    maxMixCount: number;
    tileSettings: ConfigTileSettings;
    renderSettings: ConfigRenderSettings;
}
export interface ConfigTileSettings {
    rows: number;
    columns: number;
    types: number;
}
export interface ConfigRenderSettings {
    field: string|HTMLDivElement;
    movesCountBox: string|HTMLDivElement;
    scoresCountBox: string|HTMLDivElement;
    progressLineEl: string|HTMLDivElement;
    offsetX: number;
    offsetY: number;
}
export interface TileData {
    row: number;
    column: number;
    type: number;
}