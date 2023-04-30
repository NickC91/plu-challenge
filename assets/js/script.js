// Gestione tasti numerici
const chiave = document.querySelectorAll('.key')
const start = document.getElementById('start')
const reset = document.getElementById('reset')
const enter = document.getElementById('enter')
const canc = document.getElementById('canc')

// I risultati si resettano ad ogni reload page
let results = []
let seconds = 0;
let minutes = 0;
let timerInterval;

// Data.json e avvio logica
fetch('./assets/json/data.json')
  .then(response => response.json())
  .then(data => {
    const pluData = data.bread
    // Tasto inizio
    start.addEventListener('click', () => {
      return startChallenge(pluData)
    })
    // Tasto reset gioco
    reset.addEventListener('click', () => {
      return window.location.reload()
    })
  });

// Start iniziale
function startChallenge(data) {
  let counter = 0
  timerChallenge('start')
  gamingQuiz(data, counter)
}

// Logica del gioco a ripetizione
function gamingQuiz(data, counter) {
  let question = generateQuestion(data)
  let counterQuestion = checkQuestionCounter(counter)

  // Gestione Tasto Invio
  const clickHandler = () => {
    let answer = document.getElementById('codice-plu').innerHTML
    checkSingleResult(data, question, answer, counterQuestion)
    document.getElementById('codice-plu').innerHTML = ''
    enter.removeEventListener('click', clickHandler);
  }
  enter.addEventListener('click', clickHandler);
}

// Input Valore tastierino
for (let i = 0; i < chiave.length; i++) {
  chiave[i].addEventListener('click', () => {
    return value(i)
  })
}

// Gestione valore inviato
function value(valore) {
  let risultato = document.getElementById('codice-plu').innerHTML
  if (risultato === '0') {
    return document.getElementById('codice-plu').innerHTML = String(valore)
  } else {
    risultato = risultato + String(valore)
    return document.getElementById('codice-plu').innerHTML = risultato
  }
}

// Genera numero causale
function generateRandomNumber(data) {
  let numberRnm = Math.floor(Math.random() * data.length)
  return numberRnm
}

// Genera valore causale
function generateQuestion(data) {
  let numberRnm = generateRandomNumber(data)
  let setName = document.getElementById('titleBread')
  let setImage = document.getElementById('imgBread')
  setImage.src = data[numberRnm].img
  setName.innerHTML = data[numberRnm].name
  return data[numberRnm]
}

// Verifica singolo risultato
function checkSingleResult(data, question, answer, counterQuestion) {
  if (answer == question.ean || answer == question.plu) {
    results.push({
      question: question.name,
      userAnswer: answer,
      correctAnswer: question.plu || question.ean,
      isCorrect: true
    });
    return gamingQuiz(data, counterQuestion)
  } else {
    results.push({
      question: question.name,
      userAnswer: answer,
      correctAnswer: question.plu || question.ean,
      isCorrect: false
    });
    return gamingQuiz(data, counterQuestion)
  }
}

// Controllo contatore delle domande da 1 a 10
function checkQuestionCounter(counter) {
  counter++
  if (counter == 11) {
    timerChallenge('stop')
    return showResults()
  }
  let setCounter = document.getElementById('counter')
  setCounter.innerHTML = `${counter}/10`
  return counter
}

// Risultato finale
function showResults() {
  const resultsContainer = document.getElementById('resultsContainer')
  let resultsHTML = ''
  for (const result of results) {
    let resultHTML = ''
    if (result.isCorrect == true) {
      resultHTML = `<span class="text-success">Corretto - ${result.userAnswer}</span>`
    } else if (result.isCorrect == false) {
      resultHTML = `<span class="text-danger">Sbagliato - ${result.correctAnswer}</span>`
    }
    resultsHTML += `<div><strong>${result.question}</strong>: ${resultHTML}</div>`
  }
  resultsContainer.innerHTML = resultsHTML
  const finalTime = document.getElementById("finalTimer");
  const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  finalTime.textContent = `${minutes}:${secs}`;
  const exampleModal = new bootstrap.Modal(document.getElementById('exampleModal'))
  exampleModal.show()
}

// Tasto Cancella
canc.addEventListener('click', () => {
  return document.getElementById('codice-plu').innerHTML = ''
})

// Timer di partenza
function startTimer() {
  seconds++;
  if (seconds > 59) {
    seconds = 0;
    minutes++;
  }
  document.getElementById("seconds").textContent = seconds < 10 ? "0" + seconds : seconds;
  document.getElementById("minutes").textContent = minutes < 10 ? "0" + minutes : minutes;
}

// Azione allo start / stop del timer
function timerChallenge(action) {
  if (action === "start") {
    timerInterval = setInterval(startTimer, 1000);
  } else if (action === "stop") {
    clearInterval(timerInterval);
  }
}