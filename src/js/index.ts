import '../scss/main.scss';
import Game from './Game';

export function sleep(seconds: number): Promise<void> {
    return new Promise(res => setTimeout(res, seconds * 1000));
}
window.addEventListener('load', () => {
    new Game({
        requiredScores: 500,
        moves: 15,
        tileSettings: {
            rows: 9,
            columns: 9,
            types: 5
        },
        renderSettings: {
            field: 'gameField',
            movesCountBox: 'movesCount',
            scoresCountBox: 'scoresCount',
            progressLineEl: 'progressLine',
            offsetX: 67,
            offsetY: 73
        }
    });
});

