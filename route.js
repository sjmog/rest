const QUESTION_COMPONENTS = {
  state:        $('.question__state'),
  transition:   $('.question__state-transition'),
  desiredState: $('.question__desired-state')
};

const ANSWER_COMPONENTS = {
  form:     $('.answer__form'),
  path:     $('.answer__path'),
  verb:     $('.answer__verb'),
  status:   $('.answer__status'),
  actions:  $('.answer__actions'),
  advanced: $('.answer__advanced')
};

const TOGGLES = {
  basic:    $('.toggle__basic'),
  advanced: $('.toggle__advanced')
};


// global state //
let CURRENT_QUESTION, IS_ADVANCED;

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
      name: "url",
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
      name: "userReference",
      values: USER_REFERENCES
    }]
  }
];

const ROUTE_TEMPLATES = [
  {
    verb: "POST",
    path: "/resources",
    stateChange: 1,
    transitionTemplate: 'Create a new resource with a property of "value".',
    params: true
  },
  {
    verb: "GET",
    path: "/resources",
    stateChange: 0,
    transitionTemplate: 'Take a look at all the resources.',
    params: false
  },
  {
    verb: "GET",
    path: "/resources/id",
    stateChange: 0,
    transitionTemplate: 'Take a look at the resource with an ID of id.',
    params: false
  },
  {
    verb: "PUT",
    path: "/resources/id",
    stateChange: 0,
    transitionTemplate: 'Change the property of the resource with an ID of id to "value".',
    params: true
  },
  {
    verb: "DELETE",
    path: "/resources/id",
    stateChange: -1,
    transitionTemplate: 'Delete the resource with an ID of id.',
    params: false
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

  let params = {};

  if(routeTemplate.params) {
    params = JSON.parse(`{"${property}":"${value}"}`);
  };

  const path = routeTemplate.path.replace("resource", resource.name).replace("id", id);

  const startState = STATE_TEMPLATE.replace("resource", resource.name).replace("randomnumber", startNumber);
  const endState   = STATE_TEMPLATE.replace("resource", resource.name).replace("randomnumber", endNumber);

  const transitionText = routeTemplate.transitionTemplate.replace("resource", resource.name).replace("id", id).replace("property", property).replace("value", value)

  let question = {
    question: {
      startState: startState,
      transition: transitionText,
      endState: endState,
    },
    answer: {
      verb: routeTemplate.verb,
      path: path
    },
    advanced: {
      params: params
    }
  }

  if(IS_ADVANCED) {
    question.answer = { ...question.answer, params: params }
  };

  return question;
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
  ANSWER_COMPONENTS.advanced.find('input').val("");
};

const renderNextButton = () => {
  const button = `<button class="button--next">Next</button>`;
  ANSWER_COMPONENTS.actions.html(button);

  $('.button--next').on('click', () => {
    resetAnswerForm();
    renderQuestion();
  });
};

const renderResetButton = () => {
  const button = `<button class="button--retry">Reset</button>`;
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
    renderResetButton();
  };
};

const isEquivalent = (userAnswer, correctAnswer) => {
  const userAnswerProps    = Object.getOwnPropertyNames(userAnswer);
  const correctAnswerProps = Object.getOwnPropertyNames(correctAnswer);

  if (userAnswerProps.length != correctAnswerProps.length) return false;

  for (let i = 0; i < userAnswerProps.length; i++) {
    const answerComponent = userAnswerProps[i];
    if(answerComponent === 'params') { return isEquivalent(userAnswer[answerComponent], correctAnswer[answerComponent]) };
    if (userAnswer[answerComponent] !== correctAnswer[answerComponent]) return false;
  }

  return true;
};

const handleSubmit = (e) => {
  e.preventDefault();
  
  let userAnswer = {
    verb: ANSWER_COMPONENTS.verb.find('select').val(),
    path: ANSWER_COMPONENTS.path.find('input').val().replace(/\s/g,'')
  };

  if(IS_ADVANCED) {
    let params = ANSWER_COMPONENTS.advanced.find('input').val();

    if(params === "") { params = "{}" };

    let parsedParams;

    try {
      // JSON5 is relaxed JSON to be less harsh on the studes
      parsedParams = JSON5.parse(params);
    } catch {
      // they gave some really invalid JSON
      return handleAnswer(false);
    };

    userAnswer = { ...userAnswer, params: parsedParams }
  };

  handleAnswer(isEquivalent(userAnswer, CURRENT_QUESTION.answer))
};

const addAdvancedElements = () => {
  const input = `<label for="params">Params</label><input type="text" name="params" placeholder="e.g. { name: 'awesome' }" />`;
  ANSWER_COMPONENTS.advanced.html(input);
};

const removeAdvancedElements = () => {
  ANSWER_COMPONENTS.advanced.html("");
};

const enableAdvancedAnswer = () => {
  const advancedAnswer = { ...CURRENT_QUESTION.answer, params: CURRENT_QUESTION.advanced.params };
  CURRENT_QUESTION.answer = advancedAnswer;
};

const disableAdvancedAnswer = () => {
  const { params, ...basicAnswer } = CURRENT_QUESTION.answer;
  CURRENT_QUESTION.answer = basicAnswer;
};

const setAdvanced = (isAdvanced) => {
  IS_ADVANCED = isAdvanced;
  const SELECTED_CLASS = 'toggle--selected';
  if(isAdvanced) {
    TOGGLES.basic.removeClass(SELECTED_CLASS);
    TOGGLES.advanced.addClass(SELECTED_CLASS);
    addAdvancedElements();
    enableAdvancedAnswer();
  } else {
    TOGGLES.basic.addClass(SELECTED_CLASS);
    TOGGLES.advanced.removeClass(SELECTED_CLASS);
    removeAdvancedElements();
    disableAdvancedAnswer();
  }
};

renderQuestion();
setAdvanced(false);
ANSWER_COMPONENTS.form.on('submit', handleSubmit);
TOGGLES.basic.on('click', () => { setAdvanced(false) });
TOGGLES.advanced.on('click', () => { setAdvanced(true) });