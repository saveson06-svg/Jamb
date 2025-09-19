// Store questions in localStorage (shared between admin and student)
let questions = JSON.parse(localStorage.getItem("questions")) || [];

// ----------------- ADMIN PANEL -----------------
if (document.getElementById("addQ")) {
  const qText = document.getElementById("qText");
  const optA = document.getElementById("optA");
  const optB = document.getElementById("optB");
  const optC = document.getElementById("optC");
  const optD = document.getElementById("optD");
  const correct = document.getElementById("correct");
  const addQ = document.getElementById("addQ");
  const questionList = document.getElementById("questionList");

  function renderQuestions() {
    questionList.innerHTML = "";
    questions.forEach((q, i) => {
      let li = document.createElement("li");
      li.innerText = `${i+1}. ${q.text} (Ans: ${q.answer})`;
      questionList.appendChild(li);
    });
  }

  addQ.addEventListener("click", () => {
    const newQ = {
      text: qText.value,
      options: {
        A: optA.value,
        B: optB.value,
        C: optC.value,
        D: optD.value
      },
      answer: correct.value
    };
    questions.push(newQ);
    localStorage.setItem("questions", JSON.stringify(questions));
    renderQuestions();

    // Clear inputs
    qText.value = optA.value = optB.value = optC.value = optD.value = "";
  });

  // Bulk Upload CSV
  if (document.getElementById("uploadCSV")) {
    document.getElementById("uploadCSV").addEventListener("click", () => {
      const fileInput = document.getElementById("csvFile");
      if (fileInput.files.length === 0) return alert("Choose a CSV file");

      const reader = new FileReader();
      reader.onload = function (e) {
        const lines = e.target.result.split("\n").slice(1); // skip header
        lines.forEach(line => {
          const parts = line.split(",");
          if (parts.length === 6) {
            let newQ = {
              text: parts[0],
              options: { A: parts[1], B: parts[2], C: parts[3], D: parts[4] },
              answer: parts[5].trim()
            };
            questions.push(newQ);
          }
        });
        localStorage.setItem("questions", JSON.stringify(questions));
        renderQuestions();
        alert("Bulk upload complete!");
      };
      reader.readAsText(fileInput.files[0]);
    });
  }

  renderQuestions();
}

// ----------------- STUDENT PANEL -----------------
if (document.getElementById("startExamBtn")) {
  const startBtn = document.getElementById("startExamBtn");
  const examArea = document.getElementById("examArea");
  const loginArea = document.getElementById("loginArea");
  const questionBox = document.getElementById("questionBox");
  const nextBtn = document.getElementById("nextBtn");
  const submitBtn = document.getElementById("submitBtn");
  const resultArea = document.getElementById("resultArea");
  const scoreBox = document.getElementById("score");
  const timerDisplay = document.getElementById("time");

  let index = 0;
  let score = 0;
  let timeLeft = 300; // 5 minutes

  function startTimer() {
    let timer = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(timer);
        endExam();
      } else {
        timeLeft--;
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        timerDisplay.innerText = `${m}:${s < 10 ? "0"+s : s}`;
      }
    }, 1000);
  }

  function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  function showQuestion() {
    if (index < questions.length) {
      let q = questions[index];
      questionBox.innerHTML = `
        <h3>${index+1}. ${q.text}</h3>
        <label><input type="radio" name="ans" value="A"> ${q.options.A}</label><br>
        <label><input type="radio" name="ans" value="B"> ${q.options.B}</label><br>
        <label><input type="radio" name="ans" value="C"> ${q.options.C}</label><br>
        <label><input type="radio" name="ans" value="D"> ${q.options.D}</label><br>
      `;
      if (index === questions.length - 1) {
        nextBtn.style.display = "none";
        submitBtn.style.display = "inline-block";
      }
    }
  }

  function checkAnswer() {
    let selected = document.querySelector("input[name='ans']:checked");
    if (selected && selected.value === questions[index].answer) {
      score++;
    }
  }

  function endExam() {
    examArea.style.display = "none";
    resultArea.style.display = "block";
    scoreBox.innerText = `You scored ${score} out of ${questions.length}`;
  }

  startBtn.addEventListener("click", () => {
    if (questions.length === 0) {
      alert("No questions available. Please ask admin to add.");
      return;
    }
    shuffleArray(questions); // randomize
    loginArea.style.display = "none";
    examArea.style.display = "block";
    startTimer();
    showQuestion();
  });

  nextBtn.addEventListener("click", () => {
    checkAnswer();
    index++;
    showQuestion();
  });

  submitBtn.addEventListener("click", () => {
    checkAnswer();
    endExam();
  });
}