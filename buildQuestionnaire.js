      function buildQuiz(){
        const output = [];
        // array.forEach(function(currentValue, index))
        myQuestions.forEach(
          (currentQuestion, questionNumber) => {
            // collect answer options and save as radio buttons (for this specific question)
            const answers = [];
            for(letter in currentQuestion["answers"]){
              answers.push(
                `<label>
                  <input type="radio" name="question${questionNumber}" value="${letter}" required>
                  ${currentQuestion["answers"][letter]}
                </label><br>`
              );
            }
            // add all questions to output in html format. save radio buttons in container, class "answers", to extract later.
            output.push(
              `<div class="slide">
                  <div class="question"> ${currentQuestion["question"]} </div><br>
                  <div class="answers"> ${answers.join("")} </div>
              </div>`
            );
          }
        );
        // create quiz in quizContainer
        quizContainer.innerHTML = output.join('');
      };

      var answerLog= {};
      function saveAnswers(){
        // gather answer containers from quiz
        const answerContainers = quizContainer.querySelectorAll('.answers');
        myQuestions.forEach( (currentQuestion, questionNumber) => {

          // find selected answer
          const answerContainer = answerContainers[questionNumber];
          const selector = `input[name=question${questionNumber}]:checked`;
          const userAnswer = (answerContainer.querySelector(selector) || {}).value; // leaves the option that a question is unanswered. remove if answer is required

          // log the answers
          answerLog[questionNumber]= {
            question: currentQuestion["question"],
            correctAnswer: currentQuestion["correctAnswer"],
            submittedAnswer: userAnswer
          };
        });
        // add answers to existing log
        game_sequence["answerLog"]= answerLog;
        console.log(game_sequence)
        if (language=="english"){
          window.open('end.html', '_self');
        };
        if (language=="hebrew"){
          window.open('endHebrew.html', '_self');
        }
      };
      // function to jump between slides
      function showSlide(n) {
        slides[currentSlide].classList.remove('active-slide');
        slides[n].classList.add('active-slide');
        currentSlide = n;
        if(currentSlide === slides.length-1){
          // if were on the last question don't display "next question" button
          nextButton.style.display = 'none';
          submitButton.style.display = 'inline-block';
        }
        else{
          // if we're not on the last slide- don't display the submit button
          nextButton.style.display = 'inline-block';
          submitButton.style.display = 'none';
        }
      };

      // callback function for "next question" button
      function showNextSlide() {
        showSlide(currentSlide + 1);
      };

      var quizContainer = document.getElementById('quiz');
      var resultsContainer = document.getElementById('results');
      var submitButton = document.getElementById('submit');
      buildQuiz();

      const nextButton = document.getElementById("next");
      const slides = document.querySelectorAll(".slide");
      let currentSlide= 0;

      // Present the first question
      showSlide(currentSlide);

      // Log answer when submitted
      submitButton.addEventListener('click', saveAnswers);
      nextButton.addEventListener("click", showNextSlide);