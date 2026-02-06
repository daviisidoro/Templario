// --- INTERFACE E NAVEGAÇÃO ---

// Menu Mobile
const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
        
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });
}
navSlide();

function switchTab(tabName) {
    const historySection = document.getElementById('history-content');
    const gamesSection = document.getElementById('games-content');
    const nav = document.querySelector('.nav-links');

    if (tabName === 'history') {
        historySection.style.display = 'block';
        gamesSection.style.display = 'none';
        stopAllGames();
    } else {
        historySection.style.display = 'block'; // Necessário para garantir renderização correta
        historySection.style.display = 'none';
        gamesSection.style.display = 'block';
        gamesSection.classList.remove('hidden');
    }

    if (nav.classList.contains('nav-active')) {
        nav.classList.remove('nav-active');
        document.querySelector('.burger').classList.remove('toggle');
    }
}

// Acordeão
const acc = document.getElementsByClassName("accordion-header");
for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const panel = this.nextElementSibling;
        if (panel.style.maxHeight) panel.style.maxHeight = null;
        else panel.style.maxHeight = panel.scrollHeight + "px";
    });
}

// Scroll Reveal
window.addEventListener('scroll', () => {
    const reveals = document.querySelectorAll('.scroll-reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            reveals[i].classList.add('visible');
        }
    }
});

// --- ENGINE DE JOGOS ---

const stage = document.getElementById('game-stage');
let gameLoop;
let gameState = {};

function stopAllGames() {
    clearInterval(gameLoop);
    gameState = {};
    stage.innerHTML = '<p style="color:#666">SELECIONE UM DESAFIO ACIMA</p>';
}

function startGame(gameName) {
    stopAllGames();
    if (gameName === 'defesa') initDefesa();
    if (gameName === 'quiz') initQuiz();
    if (gameName === 'codigo') initCodigo();
    if (gameName === 'reflexo') initReflexo();
    if (gameName === 'calice') initCalice();
}

// JOGO 1: DEFESA (Formas Geométricas Caindo)
function initDefesa() {
    stage.innerHTML = `
        <div style="position:absolute; top:10px; left:10px; color:white;">INIMIGOS: <span id="score">0</span></div>
        <button class="game-btn" onclick="startDefesaLoop()">INICIAR DEFESA</button>
    `;
}

function startDefesaLoop() {
    stage.innerHTML = `<div style="position:absolute; top:10px; left:10px; color:white;">INIMIGOS: <span id="score">0</span></div>`;
    let score = 0;
    let lives = 3;
    let speed = 25;
    
    gameLoop = setInterval(() => {
        const enemy = document.createElement('div');
        enemy.classList.add('enemy-shape'); // CSS define a forma
        enemy.style.left = Math.random() * (stage.offsetWidth - 40) + 'px';
        enemy.style.top = '-40px';
        stage.appendChild(enemy);

        let pos = -40;
        let fall = setInterval(() => {
            if(!document.contains(enemy)) { clearInterval(fall); return; }
            pos += 3;
            enemy.style.top = pos + 'px';

            if (pos > stage.offsetHeight) {
                clearInterval(fall);
                enemy.remove();
                lives--;
                if (lives <= 0) {
                    clearInterval(gameLoop);
                    stage.innerHTML = `<h2 style="color:var(--blood-primary)">A MURALHA CAIU</h2><p>Abates: ${score}</p><button class="game-btn" onclick="initDefesa()">Tentar Novamente</button>`;
                }
            }
        }, speed);

        enemy.onclick = () => {
            score++;
            document.getElementById('score').innerText = score;
            enemy.remove();
            clearInterval(fall);
        };

    }, 800);
}

// JOGO 2: QUIZ
const questions = [
    { q: "Qual o ano da Batalha de Montgisard?", a: ["1099", "1177", "1291"], c: 1 },
    { q: "Quem foi o último Grão-Mestre?", a: ["Jacques de Molay", "Hugues de Payens", "Ricardo"], c: 0 },
    { q: "Doença de Balduíno IV?", a: ["Peste", "Lepra", "Gota"], c: 1 }
];

function initQuiz() {
    gameState.qIndex = 0;
    gameState.score = 0;
    renderQuiz();
}

function renderQuiz() {
    if (gameState.qIndex >= questions.length) {
        stage.innerHTML = `<h2>Fim do Interrogatório</h2><p>Acertos: ${gameState.score}/${questions.length}</p>`;
        return;
    }
    const q = questions[gameState.qIndex];
    let html = `<h3 style="color:#ddd; margin-bottom:20px;">${q.q}</h3>`;
    q.a.forEach((ans, idx) => {
        html += `<button class="game-btn" onclick="checkQuiz(${idx})">${ans}</button>`;
    });
    stage.innerHTML = html;
}

function checkQuiz(idx) {
    if (idx === questions[gameState.qIndex].c) gameState.score++;
    gameState.qIndex++;
    renderQuiz();
}

// JOGO 3: CÓDIGO
function initCodigo() {
    stage.innerHTML = `
        <h3 style="color:#ccc">Decifre a Palavra</h3>
        <p style="font-size:2rem; letter-spacing:5px; color:#c2b280;">D F V T</p>
        <p>(Volte uma letra no alfabeto)</p>
        <input type="text" id="code-in" style="padding:10px; font-size:1.2rem; text-transform:uppercase;">
        <button class="game-btn" onclick="checkCode()">Verificar</button>
    `;
}

window.checkCode = function() {
    const val = document.getElementById('code-in').value.toUpperCase();
    if (val === "DEUS") {
        stage.innerHTML = `<h2 style="color:var(--gold)">DEUS VULT!</h2>`;
    } else {
        alert("Senha incorreta.");
    }
}

// JOGO 4: REFLEXO
function initReflexo() {
    stage.innerHTML = `
        <h3>Saque Rápido</h3>
        <div id="target" style="width:80px; height:80px; background:#333; border-radius:50%; margin:20px;"></div>
        <p id="msg">Aguarde o sinal VERMELHO...</p>
        <button class="game-btn" onclick="startReflexoRound()">Começar</button>
    `;
}

window.startReflexoRound = function() {
    const target = document.getElementById('target');
    const msg = document.getElementById('msg');
    target.style.background = "#333";
    msg.innerText = "Aguarde...";
    
    target.replaceWith(target.cloneNode(true));
    const newTarget = document.getElementById('target');

    let timeout = setTimeout(() => {
        newTarget.style.background = "var(--blood-primary)";
        let start = Date.now();
        newTarget.onclick = () => {
            let time = Date.now() - start;
            msg.innerText = `Tempo: ${time}ms. ` + (time < 350 ? "MORTAL!" : "Lento...");
            newTarget.onclick = null;
        };
    }, 2000 + Math.random() * 3000);
}

// JOGO 5: CÁLICE (Sem Emojis, usando DIVs estilizadas)
function initCalice() {
    stage.innerHTML = `
        <h3>Escolha o Cálice</h3>
        <div style="display:flex; gap:20px; justify-content:center; margin-top:30px; flex-wrap:wrap;">
            <div class="chalice-shape" onclick="pickCup(1)"><span>I</span></div>
            <div class="chalice-shape" onclick="pickCup(2)"><span>II</span></div>
            <div class="chalice-shape" onclick="pickCup(3)"><span>III</span></div>
        </div>
        <p id="res" style="margin-top:20px; min-height:30px;"></p>
    `;
}

window.pickCup = function(id) {
    const win = Math.floor(Math.random() * 3) + 1;
    const res = document.getElementById('res');
    if (id === win) res.innerHTML = `<span style="color:var(--gold)">A escolha certa. Vida.</span>`;
    else res.innerHTML = `<span style="color:var(--blood-primary)">Escolha errada. Morte.</span>`;
}