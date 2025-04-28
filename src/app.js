// app.js

let room = {
    players: [],
    topic: '',
    questions: [],
    currentQuestion: 0,
    timer: 5,
    correctAnswer: '',
    answersReceived: {},
    points: {}
  };
  
  let playerName = 'Player_' + Math.floor(Math.random() * 1000);
  
  function createRoom() {
    const topicInput = document.getElementById('topic').value;
    const countInput = parseInt(document.getElementById('questionCount').value);
    const timerInput = parseInt(document.getElementById('timer').value) || 5;
    
    if (!topicInput || !countInput) {
      alert('Please fill all fields');
      return;
    }
  
    room.topic = topicInput;
    room.timer = timerInput;
  
    Puter.ai.generate(`${countInput} questions about ${room.topic}`).then(res => {
      room.questions = res.split('\n').filter(q => q.trim() !== '');
      document.getElementById('gameTopic').innerText = `Topic: ${room.topic}`;
      startGame();
    });
  
    const link = window.location.href + '?room=' + Math.random().toString(36).substr(2, 9);
    document.getElementById('roomLink').innerHTML = `Share this link: <br><a href="${link}">${link}</a>`;
  }
  
  function startGame() {
    switchScreen('game');
    showQuestion();
  }
  
  function showQuestion() {
    if (room.currentQuestion >= room.questions.length) {
      return endGame();
    }
  
    document.getElementById('questionArea').innerHTML = `<h3>${room.questions[room.currentQuestion]}</h3>`;
    document.getElementById('answerInput').value = '';
    room.correctAnswer = room.questions[room.currentQuestion].split(':')[1]?.trim().toLowerCase() || '';
  
    setTimeout(() => {
      checkAnswers();
    }, room.timer * 1000);
  }
  
  function submitAnswer() {
    const answer = document.getElementById('answerInput').value.trim().toLowerCase();
    if (!room.answersReceived[playerName]) {
      room.answersReceived[playerName] = answer;
    }
  }
  
  function checkAnswers() {
    const players = Object.keys(room.answersReceived);
    players.forEach(player => {
      const answer = room.answersReceived[player];
      if (answer === room.correctAnswer) {
        const pointsEarned = 10 - players.indexOf(player);
        room.points[player] = (room.points[player] || 0) + pointsEarned;
      }
    });
  
    room.currentQuestion++;
    room.answersReceived = {};
    updatePlayerList();
    showQuestion();
  }
  
  function updatePlayerList() {
    const playersList = document.getElementById('players');
    playersList.innerHTML = '';
    for (let player in room.points) {
      playersList.innerHTML += `<div>${player} - ${room.points[player]} pts</div>`;
    }
  }
  
  function endGame() {
    switchScreen('result');
    const ranking = Object.entries(room.points).sort((a, b) => b[1] - a[1]);
    const finalRanking = document.getElementById('finalRanking');
    finalRanking.innerHTML = '';
    ranking.forEach(([name, score], index) => {
      if (index === 0) {
        finalRanking.innerHTML += `<div class="winner">🏆 ${name}: ${score} points - Quiz Overlord! 👑</div>`;
      } else {
        finalRanking.innerHTML += `<div>${index + 1}. ${name}: ${score} points</div>`;
      }
    });
  }
  
  function restartGame() {
    window.location.reload();
  }
  
  function switchScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
      screen.classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
    document.getElementById(screenId).classList.add('active');
  }
  