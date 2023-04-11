let xp = 0; 
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ['stick'];

const btn1 = document.querySelector('#button1');
const btn2 = document.querySelector('#button2');
const btn3 = document.querySelector('#button3');
const text = document.querySelector('#text');
const xpText = document.querySelector('#xpText');
const healthText = document.querySelector('#healthText');
const goldText = document.querySelector('#goldText');
const monsterStats = document.querySelector('#monsterStats');
const monsterNameText = document.querySelector('#monsterName');
const monsterHealthText = document.querySelector('#monsterHealth');

const weapons = [
  {
    name: 'stick',
    power: 5
  },
  {
    name: 'dagger',
    power: 30
  },
  {
    name: 'claw hammer',
    power: 50
  },
  {
    name: 'sword',
    power: 100
  },
];

const locations = [
  {
    name: "town square",
    "button text": ['Go to store', 'Go to cave', 'Fight dragon'],
    "button functions": [goStore, goCave, fightDragon],
    text: 'You are in the townsquare. You see a sign that says "store"'
  },
  {
    name: "store",
    "button text": ['Buy 10 health (10 gold)', 'Buy weapon (30 gold)', 'Go to Town Square'],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: 'You enter the store'
  },
  {
    name: "cave",
    "button text": ['Fight slime', 'Fight fanged beast', 'Go to Town Square'],
    "button functions": [fightSlime, fightBeast, goTown],
    text: 'You enter the cave. You see some monsters'
  },
  {
    name: "fight",
    "button text": ['Attack', 'Dodge', 'Run'],
    "button functions": [attack, dodge, goTown],
    text: 'You are fighting a monster'
  },
  {
    name: "kill monster",
    "button text": ['Go to Town Square', 'Go to Town Square', 'Go to Town Square'],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "ARHG!" as it dies. You gain experience points and find gold.'
  },
  {
    name: "lose",
    "button text": ['REPLAY?', 'REPLAY?', 'REPLAY?'],
    "button functions": [restart, restart, restart],
    text: 'You came, you saw, you died.'
  },
  {
    name: "win",
    "button text": ['REPLAY?', 'REPLAY?', 'REPLAY?'],
    "button functions": [restart, restart, restart],
    text: 'Congrats! You defeated the dragon.'
  },
  {
    name: "easter egg",
    "button text": ['2', '8', 'Go to Town Square'],
    "button functions": [pickTwo, pickEight, goTown],
    text: 'You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!'
  }
];

const monsters = [
	{
		name: 'slime',
		level: 2,
		health: 15
	},
	{
		name: 'fanged beast',
		level: 8,
		health: 60
	},
	{
		name: 'dragon',
		level: 20,
		health: 300
	},
];

// initalize buttons

btn1.onclick = goStore;
btn2.onclick = goCave;
btn3.onclick = fightDragon;

function update(location) {
	monsterStats.style.display = 'none';
  btn1.innerText = location["button text"][0];
  btn2.innerText = location["button text"][1];
  btn3.innerText = location["button text"][2];
  btn1.onclick = location["button functions"][0];
  btn2.onclick = location["button functions"][1];
  btn3.onclick = location["button functions"][2];
  text.innerText = location.text;
}

function goTown () {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goCave() {
  update(locations[2]);
}

function buyHealth() {
  if (health < 100) {
      if (gold >= 10) {
        gold -= 10;
        health += 10;
        goldText.innerText = gold;
        healthText.innerText = health;
      } else {
        text.innerText = 'You don\'t have enough gold for that.';
    }
  } else {
    text.innerText = 'Your health is full.';
  }
}

function buyWeapon() {
	if (currentWeapon < weapons.length - 1) {
		  if (gold >= 30) {
				gold -= 30;
				goldText.innerText = gold;
				currentWeapon++;
				let newWeapon = weapons[currentWeapon].name;
				text.innerText = 'You bought a ' + newWeapon + '.';
				inventory.push(newWeapon);
				text.innerText += ' In your inventory, you have: ' + inventory;
	  	} else {
				text.innerText = 'You don\'t have enough gold for that.';
		}
	} else {
		text.innerText = 'You have the most powerful weapon';
		btn2.innerText = 'Sell weapon for 15 gold';
		btn2.onclick = sellWeapon;
	}
}

function sellWeapon() {
	if (inventory.length > 1) {
		gold += 15
		goldText.innerText = gold;
		let currentWeapon = inventory.shift();
		text.innerText = 'You sold a ' + currentWeapon + '.';
		text.innerText += '\n In your inventory, you have: ' + inventory;
	} else {
		text.innerText = 'Don\'t sell your only weapon!';
	}
}

// Monster Fights
function fightSlime() {
  fighting = 0;
	goFight();
}

function fightBeast() {
  fighting = 1;
	goFight();
}

function fightDragon() {
  fighting = 2;
	goFight();
}

function goFight() {
	update(locations[3]);
	monsterHealth = monsters[fighting].health;
	monsterStats.style.display = 'block';
	monsterNameText.innerText = monsters[fighting].name;
	monsterHealthText.innerText = monsters[fighting].health;
}

function attack() {
	text.innerText = "The " + monsters[fighting].name + " attacks. ";
	text.innerText += "\n You attack with your " + weapons[currentWeapon].name + '.';
	
	if (isMonsterHit()) {
		health -= getMonsterAttackValue(monsters[fighting].level);
	} else {
		text.innerText += '\n You miss.';
	}
	
	monsterHealth -= weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
	healthText.innerText = health;
	monsterHealthText.innerText = monsterHealth;
	if (health <= 0) {
		lose();
	} else if (monsterHealth <= 0) {
		fighting === 2 ? winGame() : defeatMonster();
	}

	if (Math.random() <= .1 && inventory.length !== 1) {
		text.innerText += '\n Your ' + inventory.pop() + ' breaks.';
		currentWeapon--;
	}
}

function getMonsterAttackValue(level) {
	let hit = (level * 5) - (Math.floor(Math.random() * xp));
	console.log(hit);
	return hit;
}

function isMonsterHit() {
	return Math.random() > .2 || health < 20;
}

function dodge() {
	text.innerText = "You dodge the attack from the " + monsters[fighting].name + '.';
}

function lose() {
	update(locations[5]);
}

function defeatMonster() {
	gold += Math.floor(monsters[fighting].level * 6.7);
	xp += monsters[fighting].level
	goldText.innerText = gold;
	xpText.innerText = xp;
	update(locations[4])
}

function restart() {
	xp = 0; 
	health = 100;
	gold = 50;
	currentWeapon = 0;
	inventory = ['stick'];
	goldText.innerText = gold;
	healthText.innerText = health;
	xpText.innerText = xp;
	goTown();
}

function winGame() {
	update(locations[6]);
}

function easterEgg () {
	update(locations[7]);
}

function pickTwo() {
	pick(2);
}

function pickEight() {
	pick(8);
}

function pick(guess) {
	let numbers = [];
	while (numbers.length < 10) {
		numbers.push(Math.floor(Math.random() * 11));
	}

	text.innerText = 'You picked ' + guess + '. Here are the random numbers:\n';

	for (let i = 0; i < 10; i++) {
		text.innerText += numbers[i] + "\n";
	}

	if (numbers.indexOf(guess) !== -1) {
		text.innerText += "Right! You win 20 gold!"
		gold += 20;
		goldText.innerText = gold; 
	} else {
		text.innerText += "Wrong! You lose 10 health!"
		health -= 10;
		healthText.innerText = health;
		if (health <= 0) {
			lose();
		}
	}
}