class Arena {
    constructor(dice = new Dice(6)) {
        this.dice = dice;
    }

    calculateDamage(attacker, defender, attackRoll, defendRoll) {
        const attackDamage = attacker.attack * attackRoll;
        const defenseStrength = defender.strength * defendRoll;
        return Math.max(0, attackDamage - defenseStrength);
    }

    executeTurn(attacker, defender) {
        const attackRoll = this.dice.roll();
        const defendRoll = this.dice.roll();
        const damage = this.calculateDamage(attacker, defender, attackRoll, defendRoll);
        
        defender.reduceHealth(damage);

        return {
            attackRoll,
            defendRoll,
            damage,
            attackerName: attacker.name,
            defenderName: defender.name,
            defenderRemainingHealth: defender.health
        };
    }

    fight(player1, player2) {
        const battleLog = [];
        let [attacker, defender] = player1.health <= player2.health ? 
            [player1, player2] : [player2, player1];

        while (attacker.isAlive() && defender.isAlive()) {
            const turnResult = this.executeTurn(attacker, defender);
            battleLog.push(turnResult);

         
            [attacker, defender] = [defender, attacker];
        }

        const winner = player1.isAlive() ? player1 : player2;
        return {
            winner,
            battleLog
        };
    }
}
module.exports={Arena}