const { Arena } = require('../src/arena');
const { Player } = require('../src/player');
const { Dice } = require('../src/dice');

describe('Player', () => {
    test('should create player with valid attributes', () => {
        const player = new Player('Warrior', 50, 5, 10);
        
        expect(player.name).toBe('Warrior');
        expect(player.health).toBe(50);
        expect(player.strength).toBe(5);
        expect(player.attack).toBe(10);
    });

    test('should throw error for invalid attributes', () => {
        expect(() => new Player('Invalid', 0, 5, 10)).toThrow('All attributes must be positive');
        expect(() => new Player('Invalid', 50, -5, 10)).toThrow('All attributes must be positive');
        expect(() => new Player('Invalid', 50, 5, 0)).toThrow('All attributes must be positive');
    });

    test('should reduce health correctly', () => {
        const player = new Player('Warrior', 50, 5, 10);
        
        player.reduceHealth(20);
        expect(player.health).toBe(30);
        
        player.reduceHealth(40);
        expect(player.health).toBe(0);
    });

    test('should check if player is alive', () => {
        const player = new Player('Warrior', 50, 5, 10);
        
        expect(player.isAlive()).toBe(true);
        
        player.reduceHealth(50);
        expect(player.isAlive()).toBe(false);
    });
});

describe('Dice', () => {
    test('should create dice with default 6 sides', () => {
        const dice = new Dice();
        expect(dice.sides).toBe(6);
    });

    test('should create dice with custom number of sides', () => {
        const dice = new Dice(10);
        expect(dice.sides).toBe(10);
    });

    test('should throw error for invalid number of sides', () => {
        expect(() => new Dice(0)).toThrow('Dice must have at least one side');
        expect(() => new Dice(-1)).toThrow('Dice must have at least one side');
    });

    test('should roll within bounds', () => {
        const dice = new Dice(6);
        
        for (let i = 0; i < 100; i++) {
            const roll = dice.roll();
            expect(roll).toBeGreaterThanOrEqual(1);
            expect(roll).toBeLessThanOrEqual(6);
        }
    });
});

describe('Arena', () => {
    let mockDice;
    let arena;

    beforeEach(() => {
        // Create a mock dice with predefined rolls
        mockDice = {
            roll: jest.fn()
        };
        
        arena = new Arena(mockDice);
    });

    test('should calculate damage correctly', () => {
        const attacker = new Player('Attacker', 50, 5, 10);
        const defender = new Player('Defender', 100, 10, 5);

        // Attack roll: 5, Defend roll: 2
        const damage = arena.calculateDamage(attacker, defender, 5, 2);
        
        // Expected calculation: (10 * 5) - (10 * 2) = 50 - 20 = 30
        expect(damage).toBe(30);
    });

    test('should execute battle turn correctly', () => {
        const attacker = new Player('Attacker', 50, 5, 10);
        const defender = new Player('Defender', 100, 10, 5);

        // Set up mock dice rolls
        mockDice.roll
            .mockReturnValueOnce(5)  // attack roll
            .mockReturnValueOnce(2); // defense roll

        // Execute turn
        const turnResult = arena.executeTurn(attacker, defender);

        // Verify turn result
        expect(turnResult.damage).toBe(30);
        expect(turnResult.defenderRemainingHealth).toBe(70);
        expect(turnResult.attackRoll).toBe(5);
        expect(turnResult.defendRoll).toBe(2);
    });

    test('should conduct full battle with correct winner', () => {
        const player1 = new Player('Player1', 50, 5, 10);
        const player2 = new Player('Player2', 100, 10, 5);

        // Set up mock dice rolls for multiple turns
        mockDice.roll
            .mockReturnValueOnce(5).mockReturnValueOnce(2)  // Turn 1
            .mockReturnValueOnce(4).mockReturnValueOnce(3)  // Turn 2
            .mockReturnValueOnce(6).mockReturnValueOnce(1); // Turn 3

        // Simulate the battle
        const result = arena.fight(player1, player2);

        // Verify battle result
        expect(result.winner).toBeDefined();
        expect(result.battleLog).toBeInstanceOf(Array);
        expect(result.battleLog.length).toBeGreaterThan(0);
    });
});