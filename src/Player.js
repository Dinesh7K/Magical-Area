class Player {
    constructor(name, health, strength, attack) {
        if (health <= 0 || strength <= 0 || attack <= 0) {
            throw new Error('All attributes must be positive');
        }
        this.name = name;
        this.health = health;
        this.strength = strength;
        this.attack = attack;
    }

    isAlive() {
        return this.health > 0;
    }

    reduceHealth(damage) {
        this.health = Math.max(0, this.health - damage);
    }

    toString() {
        return `${this.name} (Health: ${this.health}, Strength: ${this.strength}, Attack: ${this.attack})`;
    }
}
module.exports={Player}