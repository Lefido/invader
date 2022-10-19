const game = document.querySelector("#game");

const gameWidth = game.offsetWidth;
const gameHeight = game.offsetHeight;
const score = document.querySelector('#score');

const keys = {};
const tabMissile = [];
const explosions = [];
const tabEnemy = [];

class NewPlayer {
    constructor() {
        let player = document.createElement("div");
        player.setAttribute("id", "player");
        player.style.width = "5vw";
        player.style.height = "10vh";
        // player.style.backgroundColor = "red";
        player.style.position = "absolute";
        player.style.left = "50%";
        player.style.bottom = "0.5%";
        game.appendChild(player);
        this.objet = player;
        this.x = player.offsetLeft
        this.y = player.offsetTop;
        this.velocity = 10;
    }

    left() {
        if (this.x > 0) {
            this.x -= this.velocity;
        }
        this.draw();
    }

    right() {
        if (this.x < gameWidth - this.objet.offsetWidth) {
            this.x += this.velocity;
        }

        this.draw();
    }

    draw() {
        this.objet.style.left = this.x + "px";
    }

    missile() {
        let missile = new Missile(this.x + this.objet.offsetWidth / 2, this.y);
        tabMissile.push(missile);
    }
}

class Missile {
    constructor(x, y) {
        let missile = document.createElement("div");
        missile.classList.add("missile");
        missile.style.width = "0.2vw";
        missile.style.height = "2vh";
        missile.style.backgroundColor = "orange";
        missile.style.position = "absolute";
        // missile.style.zIndex = -100;
        missile.style.top = y + "px";
        missile.style.left = x - 2 + "px";

        game.appendChild(missile);
        this.objet = missile;
        this.x = missile.offsetLeft;
        this.y = missile.offsetTop;
        this.velocity = 10;
        this.veloMult = 0.01;
        this.sound = new Audio('../assets/laser.mp3');
        this.sound.play();
    }

    move() {
        // this.veloMult++;
        this.y -= this.velocity + this.veloMult;
        this.draw();
    }

    draw() {
        this.objet.style.top = this.y + "px";

    }
}

class Enemy {
    constructor() {
        let enemy = document.createElement("div");
        enemy.classList.add("enemy");
        enemy.style.width = "3vw";
        enemy.style.height = "6vh";
        // enemy.style.backgroundColor = "green";
        let rndEnemy = rnd(7);
        // console.log(rndEnemy)
        enemy.style.backgroundImage = `url("./assets/enemy${rndEnemy}.png")`;
        enemy.style.position = "absolute";
        enemy.style.zIndex = "-100";
        enemy.style.top = rnd(gameHeight / 1.5) + "px";
        // enemy.style.left = 0 + rnd(gameWidth / 2) + "px";
        enemy.style.left = gameWidth / 2 + "px";

        game.appendChild(enemy);
        this.objet = enemy;
        this.x = enemy.offsetLeft;
        this.y = enemy.offsetTop;
        this.velocity = 1 + rnd(5);
        this.cos = rnd(360);
        this.sin = rnd(360);
        this.vx = rnd(10) / 100;
        this.vy = rnd(10) / 100;
        this.dx = 50 + rnd(50);
        this.dy = 50 + rnd(80);
        this.sound = new Audio('../assets/explosion.mp3');
        this.points = rndEnemy

    }

    boom() {
        this.sound.play();
    }


    move() {
        this.x = this.x + this.velocity;
        if (this.x > gameWidth - this.objet.offsetWidth || this.x < 0) {
            this.velocity = -this.velocity
        }
        this.draw();
        this.cos = this.cos + this.vx;
        if (this.cos > 360) {
            this.cos = 0
        }

        this.sin = this.sin + this.vy;
        if (this.sin > 360) {
            this.sin = 0
        }
    }

    draw() {
        this.objet.style.left = this.x + this.dx * Math.cos(this.cos) + "px";
        this.objet.style.top = this.y + this.dy * Math.sin(this.sin) + "px";
    }
}

class Explosion {
    constructor(x, y) {
        this.objet = explosion;

        this.objet.width = "4vw";
        this.objet.height = "4vw";
        this.objet.backgroundColor = "red";
        // this.objet.style.backgroundImage = `url("./assets/explode-boom.gif")`;
        game.appendChild(this.objet);
        console.log("New explosion !");
        console.log(this.objet);
        console.log(this.objet.style.backgroundImage);

    }
}

const player = new NewPlayer();

setInterval(running, 1000 / 60);
setInterval(timerEnemy, 5000);

function running() {

    pressKey();
    collision_Miss_Enemy()
    moveMissile();
    moveEnemy();
    explodeEnemy();

}

function timerEnemy() {

    console.log(tabEnemy.length, tabEnemy)
    if (tabEnemy.length === 0) {
        newEnemy(1 + rnd(9))
    }

}

function newEnemy(nb) {
    for (i = 0; i < nb; i++) {
        let enemy = new Enemy()
        tabEnemy.push(enemy);
    }
}

function rnd(rand) {
    return 1 + Math.floor(Math.random() * rand);
}

function pressKey() {
    document.onkeydown = function (e) {

        console.log(e.code);
        if (e.code === "KeyI") {

        }

        if (e.code === "KeyS") {
            tabEnemy.pop();
            let enemy = document.querySelector('.enemy');
            game.removeChild(enemy);
        }

        if (e.code === "Space") {
            player.missile();
        }

        if (e.code === "KeyE") {
            newEnemy(1);

        }

    };

    onkeydown = onkeyup = function (e) {
        keys[e.code] = e.type === "keydown";
    };

    if (keys["ArrowLeft"]) {
        player.left();
    }

    if (keys["ArrowRight"]) {
        player.right();
    }
}

function moveMissile() {
    tabMissile.forEach(function (missile, idx) {
        missile.move();
        if (missile.y < -10) {

            // delete tabMissile[idx];
            tabMissile.splice(idx, 1)
            missile.objet.remove();
        }
    });
}

function moveEnemy() {
    tabEnemy.forEach(function (enemy, idx) {
        enemy.move();
    });
}

function collision_Miss_Enemy() {

    tabMissile.forEach((missile, idx1) => {
        let ob1x = missile.x;
        let ob1y = missile.y;

        tabEnemy.forEach((enemy, idx2) => {
            let ob2x = enemy.x;
            let ob2y = enemy.y;
            let ob2w = enemy.x + enemy.objet.offsetWidth;
            let ob2h = enemy.y + enemy.objet.offsetHeight;

            if (ob1x >= ob2x && ob1x <= ob2w && ob1y >= ob2y && ob1y <= ob2h) {
                enemy.boom();
                tabMissile.splice(idx1, 1)
                missile.objet.remove();

                let point = parseInt(score.innerHTML);
                point += enemy.points;
                score.innerHTML = point;

                tabEnemy.splice(idx2, 1)
                enemy.objet.remove();

            }

        })
    })

}

function explodeEnemy() {

}



