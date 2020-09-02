const gameElement = document.getElementById('game');
const wordElement = document.getElementById('word-element');
const keyboard = document.getElementById('keyboard');
const hangmanParts = document.querySelectorAll('.hangman__part');
const popUp = document.getElementById('pop-up');
const popUpText = document.getElementById('pop-up-text');
const popUpButton = document.getElementById('pop-up-button');
const scoreRecord = document.getElementById('score-record');
const scorePoints = document.getElementById('score-points');
const scoreLosses = document.getElementById('score-losses');
const scoreWins = document.getElementById('score-wins');
let buttonHelp = document.getElementById('button-help');

const ls = localStorage;
let canHelp = true;
let canWrite = true;
let usedLetters = '';

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

let gameMemoryCard = {};

const firstRenderPoints = () => {
  if (ls.getItem('totalScore')) {
    gameMemoryCard = JSON.parse(ls.getItem('totalScore'));
    scoreRecord.textContent = `Record: ${gameMemoryCard.record}`;
    scorePoints.textContent = 'Score: 0';
    scoreLosses.textContent = `L: ${gameMemoryCard.losses}`;
    scoreWins.textContent = `W: ${gameMemoryCard.wins}`;
  } else {
    ls.setItem(
      'totalScore',
      JSON.stringify({ wins: 0, losses: 0, points: 0, record: 0 })
    );
    scoreRecord.textContent = 'Record: 0';
    scorePoints.textContent = 'Score: 0';
    scoreLosses.textContent = 'L: 0';
    scoreWins.textContent = 'W: 0';
    gameMemoryCard = { wins: 0, losses: 0, points: 0, record: 0 };
  }
};

const setRecord = () => {
  if (totalPoints > gameMemoryCard.record) {
    return totalPoints;
  }

  return gameMemoryCard.record;
};

const updateLocalStorage = (points = 0) => {
  totalPoints += points;
  if (ls.getItem('totalScore')) {
    const gameStatus = {
      wins: gameMemoryCard.wins,
      losses: gameMemoryCard.losses,
      points: totalPoints,
      record: setRecord()
    };

    gameMemoryCard = gameStatus;

    ls.setItem('totalScore', JSON.stringify(gameStatus));
    scoreRecord.textContent = `Record: ${gameStatus.record}`;
    scorePoints.textContent = `Score: ${totalPoints} `;
    scoreLosses.textContent = `L: ${gameMemoryCard.losses}`;
    scoreWins.textContent = `W: ${gameMemoryCard.wins}`;
  }
};

const getRandomWord = () =>
  words[Math.floor(Math.random() * words.length)].toUpperCase();

let selectedWord = getRandomWord();
let helpWord = selectedWord;

const showPopUp = win => {
  popUp.classList.add('pop-up--show');
  popUpText.textContent = win ? 'HAS GANADO' : 'HAS PERDIDO';
  popUpButton.textContent = 'JUGAR OTRA VEZ';
  win ? (gameMemoryCard.wins += 1) : (gameMemoryCard.losses += 1);
  updateLocalStorage();
  canWrite = false;
};

const resetGame = () => {
  correctLetters = [];
  selectedWord = getRandomWord();
  helpWord = selectedWord;
  writeWord();
  removeUsedLetters();
  popUp.classList.remove('pop-up--show');
  popUpText.textContent = '';
  popUpButton.textContent = '';
  if (!canHelp) {
    const button = document.createElement('BUTTON');
    button.id = 'button-help';
    button.classList.add('button-help');
    button.textContent = 'HELP!!';
    gameElement.appendChild(button);
    buttonHelp = document.getElementById('button-help');
  }
  canWrite = true;
  usedLetters = '';
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

const findHelpLetter = () => {
  const randomLetter = helpWord.charAt(
    Math.round(Math.random() * helpWord.length)
  );

  buttonHelp.remove();
  checkLetter(randomLetter);
  canHelp = false;
};

const updateHelpLetter = letter => {
  helpWord = helpWord.replaceAll(letter, '');
};

const checkLetter = letter => {
  if (selectedWord.includes(letter)) {
    if (!correctLetters.includes(letter)) {
      correctLetters.push(letter);
      writeWord();
      canHelp ? updateLocalStorage() : updateLocalStorage(10);
      updateHelpLetter(letter);
    }
  } else {
    updateWrongAttempts();
    updateLocalStorage(-5);
  }
};

const markUsedLetters = letter => {
  document
    .querySelector(`[data-letter=${letter.toUpperCase()}]`)
    .classList.add('keyboard__key--used');

  usedLetters += letter.toUpperCase();
};

const removeUsedLetters = () => {
  const allKeys = [...document.querySelectorAll('.keyboard__key')];

  allKeys.forEach(key => key.classList.remove('keyboard__key--used'));
};

window.addEventListener('keyup', e => {
  console.log(e.key);
  if (
    canWrite &&
    /[a-z]|[A-Z]/.test(e.key) &&
    e.key !== 'Backspace' &&
    usedLetters.search(e.key) == -1
  ) {
    checkLetter(e.key.toUpperCase());
    markUsedLetters(e.key);
  }
});

keyboard.addEventListener('click', e => {
  if (canWrite) {
    if (e.target.classList.contains('keyboard__key')) {
      checkLetter(e.target.textContent);
      markUsedLetters(e.target.textContent);
    }
  }
});

popUpButton.addEventListener('click', () => {
  hangmanParts.forEach(part => part.classList.add('hangman__part'));
  resetGame();
});

gameElement.addEventListener('click', e => {
  if (e.target.classList.contains('button-help')) {
    findHelpLetter();
  }
});

writeWord();
writeKeyboard();
firstRenderPoints();
