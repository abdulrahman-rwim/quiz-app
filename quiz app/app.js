const quizContainer = document.querySelector(".quiz__app--info");
const quizQuestion = document.querySelector(".quiz__app--question");
const quizCounter = document.querySelector(".counter");
const quizCount = document.querySelector(".count");
const quizBtn = document.querySelector(".next");
const resualtContainer = document.querySelector(".resualt");
let currentIndex = 0;
let correctAnswer = 0;
let countDownInterval;
const setTimer = (duration, count) => {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(function () {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);
      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;
      document.querySelector(
        ".count-down-timer"
      ).innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        quizBtn.click();
      }
    }, 1000);
  }
};
const quizQuestionData = (object, count) => {
  if (currentIndex < count) {
    quizQuestion.innerHTML = object.question;
    quizCount.innerHTML = `of ${count}`;
    quizCounter.innerHTML = currentIndex + 1;

    for (let i = 1; i <= Object.keys(object.answers).length; i++) {
      quizContainer.insertAdjacentHTML(
        "afterbegin",
        `<div class="quiz__app--answer"><input class="check" type="radio" name="check" id="answer_${i}" data-answer="${
          object[`answers`][`answer_${i}`]
        }"><label for="answer_${i}">${
          object[`answers`][`answer_${i}`]
        }</label></div>`
      );
      if (i === 3) {
        document.querySelector(".check").checked = true;
      }
    }
  }
};
const checkAnswer = (rightAnswer) => {
  let choosenAnswer;
  const radioButtons = document.getElementsByName("check");
  for (let i = 0; i < radioButtons.length; i++) {
    if (radioButtons[i].checked) {
      choosenAnswer = radioButtons[i].dataset.answer;
    }
  }
  if (choosenAnswer === rightAnswer) {
    correctAnswer++;
  }
};
const showResaults = (count) => {
  let resualt;
  if (currentIndex == count) {
    console.log("finished");
    document.querySelector(".quiz__app--description").remove();
    quizContainer.remove();
    quizBtn.remove();
    if (correctAnswer > count / 2 && correctAnswer < count) {
      resualt = `<h3>resualt:</h3><p class="correct-answer">${correctAnswer} of <span class="count">${count}</span></p>
      <p class="good-answers">well done! you have a good amount of answers</p>
      <button class="btn try">Try Again</button>
      `;
    } else if (correctAnswer === count) {
      resualt = `<h3>resualt:</h3><p class="correct-answer">${correctAnswer} of <span class="count">${count}</span></p>
      <p class="perfect-answers">You can be proud of yourself!</p>
      <button class="btn try">Try Again</button>
      `;
    } else {
      resualt = `<h3>resualt:</h3><p class="correct-answer">${correctAnswer} of <span class="count">${count}</span></p>
      <p class="bad-answers">you have a lot of studying to do!</p>
      <button class="btn try">Try Again</button>
      `;
    }
    resualtContainer.style.display = "block";
    resualtContainer.innerHTML = resualt;
    document.querySelector(".count-down-timer").innerHTML = "";
    document.querySelector(".try").onclick = function () {
      window.location.reload();
    };
  }
};
const getQuestion = () => {
  fetch("data.json")
    .then((response) => response.json())
    .then((data) => {
      const questionCount = data.length;
      setTimer(60, questionCount);
      quizQuestionData(data[currentIndex], questionCount);

      quizBtn.onclick = () => {
        const rightAnswer = data[currentIndex].correct_answer;

        currentIndex++;
        checkAnswer(rightAnswer, questionCount);
        quizQuestion.innerHTML = "";
        quizContainer.innerHTML = "";
        quizQuestionData(data[currentIndex], questionCount);
        clearInterval(countDownInterval);
        setTimer(60, questionCount);
        showResaults(questionCount);
      };
    });
};

getQuestion();
fetch(
  "https://opentdb.com/api.php?amount=25&category=18&difficulty=medium&type=multiple"
)
  .then((response) => response.json())
  .then((data) => console.log(data));
