export class ActionPoints {
    current: number;
    tentative: number; // would be removed from current if card is played
    total: number;
    private span: HTMLSpanElement;
    constructor() {
        this.span = document.getElementById("actionPointsSpan");
        this.current = 1;
        this.total = 1;
        this.tentative = 0;
    }

    startTurn() {
        if (this.total !== 10) {
            this.total++;
        }
        this.current = this.total;
        this.render();
    }

    tentativeSpend(num: number) {
        this.tentative = num;
        this.render();
    }

    spend() {
        this.current -= this.tentative;
        this.tentative = 0;
        this.render();
    }

    clearSpend() {
        this.tentative = 0;
        this.render();
    }

    render() {
        let text = "";
        text += "🟩".repeat(this.current - this.tentative);
        text += "🟨".repeat(this.tentative);
        text += "🟥".repeat(this.total - this.current);

        this.span.textContent = text;
    }
}