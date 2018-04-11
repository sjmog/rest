const QUESTION_COMPONENTS = {
  state:        $('.question__state'),
  transition:   $('.question__state-transition'),
  desiredState: $('.question__desired-state')
};

const ANSWER_COMPONENTS = {
  form:    $('.answer__form'),
  path:    $('.answer__path'),
  verb:    $('.answer__verb'),
  status:  $('.answer__status'),
  actions: $('.answer__actions')
};

let CURRENT_QUESTION;

const USERNAMES = ["mountain", "thePerson", "geekG1rl", "michaelangelo"];
const EMAILS    = ["postmaster@mac.com", "welcome@makersacademy.com", "masterofthings123@hotmail.com", "stephanie.lawyer@me.com"];
const TITLES    = ["My new car", "Makers Week 4", "Pairing tips", "How to install Ubuntu"];
const URLS      = ["http://google.com", "http://twitter.com", "http://makersacademy.com", "http://facebook.com"];
const CONTENTS  = ["This is a great post!", "You're doing a great job!", "Why do you even write this?", "What's the big idea?"];
const NAMES     = ["awesome", "rails", "ruby", "beginner-friendly"];
const USER_REFERENCES = ["0c 48 60 5c f6 81 d9 df 85 1e", "5a 24 d1 b8 0e 45 57 30 7e 1e", "25 46 af aa 58 37 e7 4d a3 3b"];

const RESOURCES = [
  { 
    name: "user",
    properties: [{
      name: "username",
      values: USERNAMES
    }, {
      name: "login",
      values: EMAILS
    }]
  }, 
  { 
    name: "post",
    properties: [{
      name: "title",
      values: TITLES
    }]
  }, 
  { 
    name: "bookmark",
    properties: [{
      name: "URL",
      values: URLS
    }]
  }, 
  { 
    name: "comment",
    properties: [{
      name: "content",
      values: CONTENTS
    }]
  }, 
  { 
    name: "tag",
    properties: [{
      name: "name",
      values: NAMES
    }]
  }, 
  { 
    name: "session",
    properties: [{
      name: "<code>userReference</code>",
      values: USER_REFERENCES
    }]
  }
];

const ROUTE_TEMPLATES = [
  {
    verb: "POST",
    path: "/resources",
    stateChange: 1,
    transitionTemplate: 'Create a new resource with a property of "value".'
  },
  {
    verb: "GET",
    path: "/resources",
    stateChange: 0,
    transitionTemplate: 'Take a look at all the resources.'
  },
  {
    verb: "GET",
    path: "/resources/id",
    stateChange: 0,
    transitionTemplate: 'Take a look at the resource with an ID of id.'
  },
  {
    verb: "PUT",
    path: "/resources/id",
    stateChange: 0,
    transitionTemplate: 'Change the property of the resource with an ID of id to "value".'
  },
  {
    verb: "DELETE",
    path: "/resources/id",
    stateChange: -1,
    transitionTemplate: 'Delete the resource with an ID of id.'
  }
];

const STATE_TEMPLATE = "The application has <b>randomnumber</b> resources.";

const buildQuestion = () => {
  const resource = RESOURCES[Math.floor(Math.random() * RESOURCES.length)];
  
  const routeTemplate = ROUTE_TEMPLATES[Math.floor(Math.random() * ROUTE_TEMPLATES.length)];

  const startNumber = Math.floor(Math.random() * 100) + 5;
  const endNumber = startNumber + routeTemplate.stateChange;

  const id = Math.floor(Math.random() * startNumber) + 1;
  const property = resource.properties[Math.floor(Math.random() * resource.properties.length)].name;
  const values = resource.properties.find(search => search.name === property).values;
  const value = values[Math.floor(Math.random() * resource.properties.length)];

  const path = routeTemplate.path.replace("resource", resource.name).replace("id", id);

  const startState = STATE_TEMPLATE.replace("resource", resource.name).replace("randomnumber", startNumber);
  const endState   = STATE_TEMPLATE.replace("resource", resource.name).replace("randomnumber", endNumber);

  const transitionText = routeTemplate.transitionTemplate.replace("resource", resource.name).replace("id", id).replace("property", property).replace("value", value)

  return {
    question: {
      startState: startState,
      transition: transitionText,
      endState: endState,
    },
    answer: {
      verb: routeTemplate.verb,
      path: path
    }
  }
};

const renderStates = (question) => {
  QUESTION_COMPONENTS.state.html(question.startState);
  QUESTION_COMPONENTS.transition.html(question.transition);
  QUESTION_COMPONENTS.desiredState.html(question.endState);
};

const resetAnswerForm = () => {
  ANSWER_COMPONENTS.verb.find('select').prop("selectedIndex", 0);
  ANSWER_COMPONENTS.path.find('input').val("");
  ANSWER_COMPONENTS.status.text("");
  $('.button--next').remove();
  $('.button--retry').remove();
};

const renderNextButton = () => {
  const button = `<button class="button--next">Next</button>`;
  ANSWER_COMPONENTS.actions.html(button);

  $('.button--next').on('click', () => {
    resetAnswerForm();
    renderQuestion();
  });
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

const renderQuestion = () => {
  CURRENT_QUESTION = buildQuestion();

  renderStates(CURRENT_QUESTION.question);
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

const handleSubmit = (e) => {
  e.preventDefault();
  
  const userAnswer = {
    verb: ANSWER_COMPONENTS.verb.find('select').val(),
    path: ANSWER_COMPONENTS.path.find('input').val()
  };

  console.log(userAnswer);
  console.log(CURRENT_QUESTION.answer)

  handleAnswer(isEquivalent(userAnswer, CURRENT_QUESTION.answer))
};

renderQuestion();
ANSWER_COMPONENTS.form.on('submit', handleSubmit);