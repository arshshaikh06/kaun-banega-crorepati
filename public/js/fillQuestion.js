// TODO Get the questions per slot

const container = {
    question: document.getElementById('question'),
    option1: document.getElementById('option1'),
    option2: document.getElementById('option2'),
    option3: document.getElementById('option3'),
    option4: document.getElementById('option4')
};

const flipMessage = document.getElementById('flip-the-question-message');

let questionId = 0,
    option1 = '',
    option2 = '',
    option3 = '',
    option4 = '',
    slot = 0,
    isFlip = false;

// TODO Get the slot
slot = 640000;

const lock = document.getElementById('lock-button');
console.log(lock);

function getQuestion(slot) {
    lock.disabled = false;

    const questionRequest = new XMLHttpRequest();

    questionRequest.onload = () => {
        let responseObject = null;

        try {
            responseObject = JSON.parse(questionRequest.responseText);
        } catch (err) {
            console.log('Could not parse JSON!');
        }

        if (responseObject) {
            console.log(responseObject);
            console.log(questionRequest.status);
            if (questionRequest.status == 200) {
                questionId = responseObject[0]._id;
                console.log(`questionid: ${questionId}`);
                console.log(`id: ${responseObject[0]._id}`);

                option1 = responseObject[0].option1;
                option2 = responseObject[0].option2;
                option3 = responseObject[0].option3;
                option4 = responseObject[0].option4;
                container.question.innerHTML = responseObject[0].question;
                setTimeout(() => {
                    container.option1.innerHTML = `<input type="radio" name="answer" id="1" value="1" /><span class="option-color" id="option-color1">A:&nbsp;</span> ${option1} <span class="checked"></span>`;
                    container.option2.innerHTML = `<input type="radio" name="answer" id="2" value="2" /><span class="option-color" id="option-color2">B:&nbsp;</span> ${option2} <span class="checked"></span>`;
                    container.option3.innerHTML = `<input type="radio" name="answer" id="3" value="3" /><span class="option-color" id="option-color3">C:&nbsp;</span> ${option3} <span class="checked"></span>`;
                    container.option4.innerHTML = `<input type="radio" name="answer" id="4" value="4" /><span class="option-color" id="option-color4">D:&nbsp;</span> ${option4} <span class="checked"></span>`;
                }, 5000);
            } else {
                // TODO Error if network issue
                console.log('Error');
            }
        }
    };

    if (isFlip) {
        console.log('Entered else');
        questionRequest.open(
            'get',
            `http://localhost:3000/api/lifelines/flipthequestion/${questionId}/${slot}`,
            true
        );
    } else {
        console.log('Entered if');
        questionRequest.open(
            'get',
            `http://localhost:3000/api/question/${slot}`,
            true
        );
    }
    questionRequest.send();
}

// Get the Question
getQuestion(slot);

lock.addEventListener('click', () => {
    // Gets the selected input radio button
    const selectedAnswer = Array.from(
        document.getElementsByName('answer')
    ).filter(element => element.checked == true);
    console.log(selectedAnswer);

    // Gets the parent of input button -> Label
    const answerLabel = selectedAnswer[0].parentNode;

    // Gets the last child of Label -> Span and hides it after it has been clicked
    const spans = document.querySelectorAll('.checked');
    spans.forEach(span => {
        span.style.visibility = 'hidden';
    });

    // Gets the corrected answer option color and makes it white
    const optionColorSpan = document.getElementById(
        `option-color${selectedAnswer[0].value}`
    );
    optionColorSpan.style.color = '#ececec';

    // Sets the color of label to yellow
    answerLabel.style.background =
        'linear-gradient(90deg, rgba(240,176,0,1) 0%, rgba(224,209,70,1) 50%, rgba(240,176,0,1) 100%)';
    answerLabel.style.color = '#2a2a2a';
    console.log(selectedAnswer[0].parentNode);
    console.log(selectedAnswer[0].value);

    checkAnswer(selectedAnswer[0].value, isFlip);

    lock.disabled = true;
});

function checkAnswer(selectedAnswer, isFlip) {
    const checkRequest = new XMLHttpRequest();

    checkRequest.onload = () => {
        let responseObject = null;
        try {
            responseObject = JSON.parse(checkRequest.responseText);
        } catch (err) {
            console.log('Could not parse JSON!');
        }

        if (responseObject) {
            if (checkRequest.status == 200) {
                const selectedAnswerLabel = document.getElementById(
                    `option${selectedAnswer}`
                );
                setTimeout(() => {
                    if (responseObject.answer == selectedAnswer) {
                        console.log('Correct answer!');
                        selectedAnswerLabel.style.background =
                            'linear-gradient(90deg, rgba(47,132,4,1) 0%, rgba(87,212,8,1) 50%, rgba(47,132,4,1) 100%)';
                        selectedAnswerLabel.style.color = '#ffffff';

                        const optionColorSpan = document.getElementById(
                            `option-color${selectedAnswer}`
                        );
                        optionColorSpan.style.color = '#f0d245';
                        defaultColor(
                            selectedAnswerLabel,
                            optionColorSpan,
                            null
                        );
                    } else {
                        console.log('Incorrect answer!');
                        selectedAnswerLabel.style.background =
                            'linear-gradient(90deg, rgba(240,176,0,1) 0%, rgba(224,209,70,1) 50%, rgba(240,176,0,1) 100%)';
                        const correctAnswerLabel = document.getElementById(
                            `option${responseObject.answer}`
                        );
                        correctAnswerLabel.style.background =
                            'linear-gradient(90deg, rgba(47,132,4,1) 0%, rgba(87,212,8,1) 50%, rgba(47,132,4,1) 100%)';
                        correctAnswerLabel.style.color = '#ffffff';
                        // defaultColor(
                        //     selectedAnswerLabel,
                        //     document.getElementById(
                        //         `option-color${selectedAnswer}`
                        //     ),
                        //     correctAnswerLabel
                        // );
                    }
                }, 2000);
            } else {
                console.log('Error: ' + responseObject.error);
            }
        }
    };

    checkRequest.open(
        'get',
        `http://localhost:3000/api/checkanswer/${questionId}`,
        true
    );
    checkRequest.send();
}

function defaultColor(
    selectedAnswerLabel,
    selectedAnswerSpan,
    correctAnswerLabel
) {
    setTimeout(() => {
        selectedAnswerLabel.style.background = '#390f4e';
        if (selectedAnswerSpan) selectedAnswerSpan.style.color = '#f0d245';
        if (correctAnswerLabel) correctAnswerLabel.style.background = '#390f4e';

        if (isFlip) flipTheQuestionMethod();
    }, 3000);
}

// Lifelines
const audiencePoll = document.getElementById('audience-poll');
const fiftyFifty = document.getElementById('50-50');
const flipTheQuestion = document.getElementById('flip-the-question');
const askTheExpert = document.getElementById('ask-the-expert');

audiencePoll.addEventListener('click', () => {
    console.log(questionId);

    const div = document.getElementById('audience-poll-div');
    if (div.classList.contains('unused')) {
        // Use the lifeline
        const dialog = document.getElementById('audience-poll-dialog');

        const audiencePollRequest = new XMLHttpRequest();
        audiencePollRequest.onload = () => {
            let responseObject = null;

            try {
                responseObject = JSON.parse(audiencePollRequest.responseText);
            } catch (err) {
                console.log('Could not parse JSON!');
            }

            if (responseObject) {
                if (audiencePollRequest.status == 200) {
                    createChart(
                        responseObject.option1,
                        responseObject.option2,
                        responseObject.option3,
                        responseObject.option4
                    );
                    div.classList.remove('unused');
                } else {
                    console.log('Error');
                }
            }
        };
        audiencePollRequest.open(
            'get',
            `http://localhost:3000/api/lifelines/audiencepoll/${questionId}`,
            true
        );
        audiencePollRequest.send();

        const btnClose = document.getElementById('audience-poll-close');
        btnClose.addEventListener('click', () => {
            const dialog = document.getElementById('audience-poll-dialog');
            dialog.style.display = 'none';
        });

        dialog.style.display = 'block';
    } else {
        console.log('Already used');
    }
});

function createChart(option1, option2, option3, option4) {
    Chart.defaults.global.defaultFontFamily = 'Poppins';
    Chart.defaults.global.defaultFontSize = 14;
    Chart.defaults.global.defaultFontColor = '#fff';

    const ctx = document.getElementById('chart').getContext('2d');
    ctx.fillStyle = 'white';
    var gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(240,176,0,1)');
    gradient.addColorStop(0.5, 'rgba(224,209,70,1)');
    gradient.addColorStop(1, 'rgba(240,176,0,1)');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['A', 'B', 'C', 'D'],
            datasets: [
                {
                    label: 'Percentage',
                    data: [option1, option2, option3, option4],
                    backgroundColor: gradient
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Audience Poll',
                fontSize: 18
            },
            legend: {
                display: false
            },
            gridLines: {
                color: '#fff'
            },
            scales: {
                yAxes: [
                    {
                        gridLines: {
                            display: false
                        },
                        ticks: {
                            min: 0,
                            max: 100,
                            stepSize: 20
                        }
                    }
                ],
                xAxes: [
                    {
                        categorySpacing: 0.5,
                        barPercentage: 0.5,
                        gridLines: {
                            display: false
                        }
                    }
                ]
            }
        }
    });
}

fiftyFifty.addEventListener('click', () => {
    const div = document.getElementById('50-50-div');
    if (div.classList.contains('unused')) {
        // Use the lifeline
        const fiftyFiftyRequest = new XMLHttpRequest();
        fiftyFiftyRequest.onload = () => {
            let responseObject = null;

            try {
                responseObject = JSON.parse(fiftyFiftyRequest.responseText);
            } catch (err) {
                console.log('Could not parse JSON!');
            }

            if (responseObject) {
                if (fiftyFiftyRequest.status == 200) {
                    console.log(responseObject);
                    // Remove two incorrect answers
                    const incorrectAnswer1 = document.getElementById(
                        `option${responseObject.remove1}`
                    );
                    incorrectAnswer1.innerHTML = '&nbsp;';
                    const incorrectAnswer2 = document.getElementById(
                        `option${responseObject.remove2}`
                    );
                    incorrectAnswer2.innerHTML = '&nbsp;';
                    div.classList.remove('unused');
                } else {
                    console.log('Error');
                }
            }
        };
        fiftyFiftyRequest.open(
            'get',
            `http://localhost:3000/api/lifelines/fiftyfifty/${questionId}`,
            true
        );
        fiftyFiftyRequest.send();
    } else {
        console.log('Already used');
    }
});

flipTheQuestion.addEventListener('click', () => {
    const div = document.getElementById('flip-the-question-div');
    if (div.classList.contains('unused')) {
        // Use the lifeline
        flipMessage.style.display = 'block';
        isFlip = true;
        div.classList.remove('unused');
    } else {
        console.log('Already used');
    }
});

function flipTheQuestionMethod() {
    const answerContainer = document.getElementById('answer-container')
        .childNodes;
    answerContainer.forEach(label => {
        label.innerHTML = '&nbsp;';
    });
    isFlip = false;
    flipMessage.style.display = 'none';
    setTimeout(() => getQuestion(slot), 1000);
}

// Ask the expert
askTheExpert.addEventListener('click', () => {
    const div = document.getElementById('ask-the-expert-div');
    if (div.classList.contains('unused')) {
        // Use the lifeline
        const dialog = document.getElementById('ask-the-expert-dialog');

        const askTheExpertRequest = new XMLHttpRequest();
        askTheExpertRequest.onload = () => {
            let responseObject = null;

            try {
                responseObject = JSON.parse(askTheExpertRequest.responseText);
            } catch (err) {
                console.log('Could not parse JSON!');
            }

            if (responseObject) {
                if (askTheExpertRequest.status == 200) {
                    console.log(responseObject);
                    const text = document.getElementById('ask-the-expert-p');
                    const answerLabelText = document.getElementById(
                        `option${responseObject.answer}`
                    ).textContent;
                    text.innerHTML = `Expert thinks the answer is ${answerLabelText}`;
                    div.classList.remove('unused');
                } else {
                    console.log('Error');
                }
            }
        };
        askTheExpertRequest.open(
            'get',
            `http://localhost:3000/api/lifelines/asktheexpert/${questionId}`,
            true
        );
        askTheExpertRequest.send();

        const btnClose = document.getElementById('ask-the-expert-close');
        btnClose.addEventListener('click', () => {
            const dialog = document.getElementById('ask-the-expert-dialog');
            dialog.style.display = 'none';
        });

        dialog.style.display = 'block';
    } else {
        console.log('Already used');
    }
});
