export class ScoreData {
    label: string;
    maturity: number;
    priority: number;

    constructor(label: string, maturity: number, priority: number) {
        this.label = label;
        this.maturity = maturity;
        this.priority = priority;
    }

}
