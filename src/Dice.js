class Dice {
    constructor(sides = 6) {
        if (sides < 1) {
            throw new Error('Dice must have at least one side');
        }
        this.sides = sides;
    }

    roll() {
        return Math.floor(Math.random() * this.sides) + 1;
    }
}
module.exports={Dice}