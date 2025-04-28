// Example Room data structure
let roomData = {
  roomName: '',
  topic: '',
  questionsCount: 0,
  timer: 5,
  players: [],
  currentQuestion: 0,
  answers: [],
};

// Creating a new room
function createRoom() {
  const roomName = document.getElementById('roomName').value;
  const topic = document.getElementById('topic').value;
  const questionsCount = parseInt(document.getElementById('questionsCount').value);
  const timer = parseInt(document.getElementById('timer').value);

  roomData.roomName = roomName;
  roomData.topic = topic;
  roomData.questionsCount = questionsCount;
  roomData.timer = timer || 5;

  // Generate room link (mock for now)
  const roomLink = `https://quizrush.app/room/${roomName}`;
  document.getElementById('roomLink').innerHTML = `Share this link to join: <a href="${roomLink}" target="_blank">${roomLink}</a>`;
  document.getElementById('roomLink').classList.remove('hidden');

  // Switch to game screen
  document.getElementById('startScreen').classList.remove('active');
  document.getElementById('gameScreen').classList.add('active');
  
  // Initialize players array
  roomData.players.push({ name: 'Player1', points: 0 });
  
  // Start the game (AI will generate questions)
  generateQuestions();
}

// Simulate AI question generation using Puter.js
function generateQuestions() {
  const topic = roomData.topic;

  // Call Puter.js (mock here)
  puter.ask(`Generate ${roomData.questionsCount} questions about ${topic}`, function(response) {
    roomData.questions = response.split('\n').slice(0, roomData.questionsCount); 
    askNextQuestion();
  });
}

// Ask the next question
function askNextQuestion() {
  if (roomData.currentQuestion < roomData.questionsCount) {
    const question = roomData.questions[roomData.currentQuestion];
    document.getElementById('currentQuestion').textContent = question;

    // Start timer for answering
    startTimer();
  } else {
    endGame();
  }
}

// Timer for each question
function startTimer() {
  let timeLeft = roomData.timer;
  const timerElement = document.getElementById('timer');
  const timerInterval = setInterval(function() {
    timerElement.textContent = `Time left: ${timeLeft}s`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      checkAnswer('');
    }
  }, 1000);
}

// Submit answer
function submitAnswer() {
  const answer = document.getElementById('answerInput').value;
  checkAnswer(answer);
}

// Check answer and award points
function checkAnswer(answer) {
  const correctAnswer = roomData.questions[roomData.currentQuestion];
  
  if (answer.toLowerCase() === correctAnswer.toLowerCase()) {
    roomData.players[0].points += 10; // First player gets 10 points
  }
  roomData.currentQuestion++;
  askNextQuestion();
}

// End the game and show rankings
function endGame() {
  const winner = roomData.players[0]; // Simplified; real logic needed for ranking
  document.getElementById('finalRanking').innerHTML = `${winner.name} scored ${winner.points} points`;
  document.getElementById('winnerMessage').textContent = `Quiz Overlord! 👑 Scored ${winner.points} points!`;
  document.getElementById('gameScreen').classList.remove('active');
  document.getElementById('finalScreen').classList.add('active');
}
