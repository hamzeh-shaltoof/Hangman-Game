let words = await myFetch();
let hangman = ["base", "stand", "hang", "rope", "head", "body", "hand", "legs"];

let selectedWord = words[Math.floor(Math.random() * hangman.length)];
let remainingWord = selectedWord;

let countErrors = 0;

buildGame();

function buildGame() {
  let hangmanDiv = createDiv("hangman");
  let progressDiv = createDiv("progress");

  hangmanDiv.append(progressDiv);

  let charactersDiv = createCharacters(hangmanDiv);

  let wordDiv = createWordSlots(hangmanDiv);

  document.body.append(hangmanDiv);

  Array.from(charactersDiv.children).forEach((element) => {
    element.addEventListener("click", (event) =>
      checkLetter(event, remainingWord.toUpperCase(), hangmanDiv, wordDiv),
    );
  });
}

// Create letter spans from A to Z
function createCharacters(hangmanDiv) {
  let charactersDiv = createDiv("characters");

  for (let i = 65; i <= 90; i++) {
    let span = document.createElement("span");
    span.textContent = String.fromCharCode(i);
    charactersDiv.appendChild(span);
  }
  hangmanDiv.appendChild(charactersDiv);

  return charactersDiv;
}

// Create Slots Based On The Randomly Selected Word
function createWordSlots(hangmanDiv) {
  let indexLetterOfRandom = Math.floor(Math.random() * remainingWord.length);

  let wordDiv = createDiv("word");

  for (let i = 0; i < remainingWord.length; i++) {
    let slotDiv = createDiv("char");
    wordDiv.append(slotDiv);
  }
  wordDiv.children[indexLetterOfRandom].textContent =
    remainingWord[indexLetterOfRandom];

  // Mark Guessed Letter To Prevent check Ggain
  remainingWord =
    remainingWord.slice(0, indexLetterOfRandom) +
    "*" +
    remainingWord.slice(indexLetterOfRandom + 1);

  console.log(remainingWord);

  hangmanDiv.append(wordDiv);

  return wordDiv;
}

// Check Selected Letter And Handle Correct Or Wrong Guesses
function checkLetter(event, word, hangmanDiv, wordDiv) {
  if (countErrors >= 8) return;
  let letter = event.target.textContent;

  let index = word.indexOf(letter);

  if (index < 0) {
    drawHangman(hangmanDiv, wordDiv);
    event.target.style.backgroundColor = "#b5b5b5";
    event.target.style.pointerEvents = "none";
    return;
  }

  wordDiv.children[index].textContent = letter;

  // Mark Guessed Letter To Prevent check Ggain
  remainingWord =
    remainingWord.slice(0, index) + "*" + remainingWord.slice(index + 1);

  if (remainingWord == "*".repeat(remainingWord.length)) {
    colorizeWordCells(wordDiv);
    openPopup(true, hangmanDiv);
  } else playSound("sounds/right.mp3");

  console.log(remainingWord);
}

function drawHangman(hangmanDiv, wordDiv) {
  countErrors++;

  let progressDiv = document.querySelector(".progress");

  let div = createDiv(hangman[countErrors - 1]);

  if (countErrors <= 4) {
    playSound("sounds/wrong.mp3");
    progressDiv.append(div);
    return;
  } else if (countErrors === 5) {
    playSound("sounds/wrong.mp3");
    let manDiv = createDiv("man");
    manDiv.append(div);
    progressDiv.append(manDiv);
    return;
  }

  let manDiv = document.querySelector(".man");
  manDiv.append(div);

  if (countErrors == 8) {
    colorizeWordCells(wordDiv);
    openPopup(false, hangmanDiv);
  } else playSound("sounds/wrong.mp3");
}

function openPopup(isWon, hangmanDiv) {
  hangmanDiv.style.opacity = 0.4;
  hangmanDiv.style.pointerEvents = "none";

  if (isWon) {
  playSound("sounds/win.mp3");

    createPopup(
      "Congratulations",
      "You Win",
      "images/applause.png",
     100 - (countErrors * 7) 
    );
    return;
  }
  playSound("sounds/lose.mp3",1);
  createPopup("Game Over", "You Lose", "images/sad.png", 100 - (countErrors * 7) );

}

function playSound(soundPath , currentTime = 0) {
  let sound = new Audio(soundPath);
  sound.currentTime = currentTime;
  sound.play();
}

function createDiv(className) {
  let div = document.createElement("div");
  div.classList.add(className);
  return div;
}

function colorizeWordCells(wordDiv) {
  Array.from(wordDiv.children).forEach((element) => {
    element.style.color = "white";
    if (element.textContent == "") element.style.backgroundColor = "#f44336";
    else element.style.backgroundColor = "#22c55e";
  });
}

function createPopup(title, subTitle, imagePath, score) {
  let createPopupDiv = createDiv("popup");
  let createH2 = document.createElement("h2");
  let createPInsideH2 = document.createElement("p");
  let createImage = document.createElement("img");
  let createP1 = document.createElement("p");
  let createP2 = document.createElement("p");
  let createP3 = document.createElement("p");
  let createSpan1 = document.createElement("span");
  let createSpan2 = document.createElement("span");
  let createSpan3 = document.createElement("span");
  let createButton = document.createElement("button");

  createH2.textContent = title;
  createPInsideH2.textContent = subTitle;
  createImage.src = imagePath;
  createP1.textContent = "Your Score : ";
  createSpan1.textContent = score > 50 ? score : 0;
  createP2.textContent = "Classification : ";
  createP3.textContent = "Correct Word : ";
  createP3.style.color = "red";
  createSpan2.textContent = classifyResult(score);
  createButton.textContent = "Play Again";
  createSpan3.textContent = selectedWord;
   
  createPopupDiv.append(createH2);
  createH2.append(createPInsideH2);
  createPInsideH2.append(createImage);
  createPopupDiv.append(createP1);
  createP1.append(createSpan1);
  createPopupDiv.append(createP2);
  createP2.append(createSpan2);
  createPopupDiv.append(createP3);
  createP3.append(createSpan3);
  createPopupDiv.append(createButton);

  document.body.append(createPopupDiv);
  createPopupDiv.classList.add("open")

  createButton.addEventListener("click" , () => replayGame(createPopupDiv))

}
function classifyResult(score){
  switch(Math.floor(score/10)){
    case 10 :
    case 9 :
      return "Excellent";
    case 8 :
      return "Very Good";
    case 7 :
      return "Good";
    case 6 :
      return "Acceptable";
    default : 
          return "Failed";
  }

}
function replayGame(createPopupDiv){
  let hangmanDiv = document.querySelector(".hangman");
  hangmanDiv.remove();
  createPopupDiv.remove();
 selectedWord = words[Math.floor(Math.random() * words.length)];
 remainingWord = selectedWord;
 countErrors = 0;
 buildGame();
}
async function myFetch(){
return await fetch("https://random-word-api.herokuapp.com/all")
            .then(response => response.json())
            .then(data => data)


}