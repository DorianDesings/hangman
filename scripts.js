const wordElement = document.getElementById('word-element');
const keyboard = document.getElementById('keyboard');
const hangmanParts = document.querySelectorAll('.hangman__part');
const popUp = document.getElementById('pop-up');
const popUpText = document.getElementById('pop-up-text');
const popUpButton = document.getElementById('pop-up-button');

const scoreText = document.getElementById('score-text');
const scoreLosse = document.getElementById('score-losses');
const scoreWins = document.getElementById('score-wins');

const ls = localStorage;

const games = {
  wins: 0,
  losses: 0
};

const words = ['ordenador', 'javascript'];
const letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

let correctLetters = [];
const maxAttempts = 5;
let attempts = 0;
let totalPoints = 0;

const writeInLocalStorage = (wins = 0, looses = 0) => {
  if (localStorage.getItem('totalScore')) {
    const totalScoreLS = JSON.parse(localStorage.getItem('totalScore'));
    games.wins = totalScoreLS.wins;
    games.losses = totalScoreLS.losses;
  } else {
    localStorage.setItem('totalScore', JSON.stringify(games));
  }
};

//TODO terminar función para el localstorage

const getRandomWord = () =>
  words[Math.floor(Math.random() * words.length)].toUpperCase();

let selectedWord = getRandomWord();

const showPopUp = win => {
  popUp.classList.add('pop-up--show');
  popUpText.textContent = win ? 'HAS GANADO' : 'HAS PERDIDO';
  popUpButton.textContent = 'JUGAR OTRA VEZ';
};

const scoreMaster = points => {
  totalPoints += points;
  scoreText.textContent = `Score: ${totalPoints}`;
};

const resetGame = () => {
  correctLetters = [];
  selectedWord = getRandomWord();
  writeWord();
  removeUsedLetters();
  popUp.classList.remove('pop-up--show');
  popUpText.textContent = '';
  popUpButton.textContent = '';
};

const writeWord = () => {
  const wordToWrite = selectedWord
    .split('')
    .map(
      letter => `
    <span class="letter">
      ${correctLetters.includes(letter) ? letter : ''}
    </span>
  `
    )
    .join('');

  wordElement.innerHTML = wordToWrite;

  const wordIngame = wordElement.textContent.replace(/\s+/g, '').trim();

  if (wordIngame === selectedWord) {
    showPopUp(true);
  }
};

const writeKeyboard = () => {
  const fragment = document.createDocumentFragment();
  letters.map(letter => {
    const span = document.createElement('SPAN');
    span.setAttribute('data-letter', letter);
    span.classList.add('keyboard__key');
    span.textContent = letter;
    fragment.appendChild(span);
  });

  keyboard.appendChild(fragment);
};

const updateWrongAttempts = () => {
  hangmanParts[attempts].classList.remove('hangman__part');
  if (attempts < maxAttempts) {
    attempts += 1;
  } else {
    showPopUp(false);
    attempts = 0;
  }
};

const checkLetter = letter => {
  if (selectedWord.includes(letter)) {
    if (!correctLetters.includes(letter)) {
      correctLetters.push(letter);
      writeWord();
      scoreMaster(10);
    }
  } else {
    updateWrongAttempts();
    scoreMaster(-5);
  }
};

const markUsedLetters = letter => {
  document
    .querySelector(`[data-letter=${letter.toUpperCase()}]`)
    .classList.add('keyboard__key--used');
};

const removeUsedLetters = () => {
  const allKeys = [...document.querySelectorAll('.keyboard__key')];

  allKeys.forEach(key => key.classList.remove('keyboard__key--used'));
};

window.addEventListener('keyup', e => {
  checkLetter(e.key.toUpperCase());
  markUsedLetters(e.key);
});

keyboard.addEventListener('click', e => {
  if (e.target.classList.contains('keyboard__key')) {
    checkLetter(e.target.textContent);
    markUsedLetters(e.target.textContent);
  }
});

popUpButton.addEventListener('click', () => {
  hangmanParts.forEach(part => part.classList.add('hangman__part'));
  resetGame();
});

writeWord();
writeKeyboard();
scoreMaster(0);
