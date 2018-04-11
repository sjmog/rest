const QUESTION_COMPONENTS = {
  state: $('.question__state'),
  route: $('.question__route')
};

const ANSWER_COMPONENTS = {
  form:     $('.answer__form'),
  resource: $('.answer__resource'),
  state:    $('.answer__state'),
  status:   $('.answer__status'),
  actions:  $('.answer__actions')
};

const RESOURCES = [
  "user", "post", "bookmark", "comment", "tag", "session"
];

const ROUTE_TEMPLATES = [
  {
    route: "GET /resources/",
    stateChange: 0
  },
  {
    route: "GET /resources/id",
    stateChange: 0
  },
  {
    route: "POST /resources",
    stateChange: 1
  },
  {
    route: "DELETE /resources/id",
    stateChange: -1
  },
  {
    route: "PUT /resources/id",
    stateChange: 0
  }
];

const STATE_TEMPLATE = "The application has <b>randomnumber</b> resources.";

let CURRENT_QUESTION;

const shuffle = (a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const buildQuestion = () => {
  const resource = RESOURCES[Math.floor(Math.random() * RESOURCES.length)];
  const routeTemplate = ROUTE_TEMPLATES[Math.floor(Math.random() * ROUTE_TEMPLATES.length)];

  const startNumber = Math.floor(Math.random() * 100);
  const endNumber = startNumber + routeTemplate.stateChange;

  const route = routeTemplate.route.replace("resource", resource).replace("id", Math.floor(Math.random() * startNumber) + 1);

  const startState = STATE_TEMPLATE.replace("resource", resource).replace("randomnumber", startNumber);
  const endState   = STATE_TEMPLATE.replace("resource", resource).replace("randomnumber", endNumber);

  const choices = shuffle([
    endState,
    STATE_TEMPLATE.replace("resource", resource).replace("randomnumber", endNumber + 1),
    STATE_TEMPLATE.replace("resource", resource).replace("randomnumber", endNumber - 1)
  ]);

  return {
    question: {
      state: startState,
      route: route,
      choices: choices
    },

    answer: {
      resource: resource,
      state: endState
    }
  }
};

const renderState = (question) => {
  QUESTION_COMPONENTS.state.html(question.state);
};

const renderRoute = (question) => {
  QUESTION_COMPONENTS.route.text(question.route);
};

const renderMultipleChoice = (question) => {
  const choices = question.choices;

  const multipleChoice = choices.reduce((htmlString, choice, choiceNumber) => {
    const input = `<label for="choice${choiceNumber}"><input type="radio" id="choice${choiceNumber}" name="state" value="${choice}" />${choice}</label>`;

    return htmlString + input;
  }, "");

  ANSWER_COMPONENTS.state.html(multipleChoice);
};

const renderQuestion = () => {
  CURRENT_QUESTION = buildQuestion();

  renderState(CURRENT_QUESTION.question);
  renderRoute(CURRENT_QUESTION.question);
  renderMultipleChoice(CURRENT_QUESTION.question);
};

const isEquivalent = (userAnswer, correctAnswer) => {
  const userAnswerProps    = Object.getOwnPropertyNames(userAnswer);
  const correctAnswerProps = Object.getOwnPropertyNames(correctAnswer);

  if (userAnswerProps.length != correctAnswerProps.length) return false;

  for (let i = 0; i < userAnswerProps.length; i++) {
    const answerComponent = userAnswerProps[i];
    if (userAnswer[answerComponent] !== correctAnswer[answerComponent]) return false;
  }

  return true;
};

const renderNextButton = () => {
  const button = `<button class="button--next">Next</button>`;
  ANSWER_COMPONENTS.actions.html(button);

  $('.button--next').on('click', () => {
    resetAnswerForm();
    renderQuestion();
  });
};

const resetAnswerForm = () => {
  ANSWER_COMPONENTS.resource.find('input').val("");
  ANSWER_COMPONENTS.state.find('input').prop('checked', false);
  ANSWER_COMPONENTS.status.text("");
  $('.button--next').remove();
  $('.button--retry').remove();
};

const renderRetryButton = () => {
  const button = `<button class="button--retry">Retry</button>`;
  ANSWER_COMPONENTS.actions.html(button);
  $('.button--retry').on('click', resetAnswerForm);
};

const flashScreen = (color) => {
  $('body').addClass(`flash--${color}`);
  window.setTimeout(() => {
    $('body').removeClass(`flash--${color}`);
  }, 200);
};

const handleAnswer = (isAnswerCorrect) => {
  if(isAnswerCorrect) {
    flashScreen("green");
    ANSWER_COMPONENTS.status.html("<p>Correct!</p>");
    renderNextButton();
  } else {
    flashScreen("red");
    ANSWER_COMPONENTS.status.html("<p>Nope!</p>");
    renderRetryButton();
  };
};

const handleSubmit = (e) => {
  e.preventDefault();
  
  const userAnswer = {
    resource: ANSWER_COMPONENTS.resource.find('input').val(),
    state:    ANSWER_COMPONENTS.state.find('input:checked').val()
  };

  handleAnswer(isEquivalent(userAnswer, CURRENT_QUESTION.answer))
};

renderQuestion();
ANSWER_COMPONENTS.form.on('submit', handleSubmit)