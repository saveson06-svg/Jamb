// A single CBT question represented as a JS object

const question = {
  id: 1,
  text: "What is the capital of France?",
  options: [
    "Berlin",
    "London",
    "Paris",
    "Madrid"
  ],
  correctAnswer: 2, // index of "Paris" in the options array
  explanation: "Paris is the capital city of France."
};

// How to use
console.log("Question:", question.text);
question.options.forEach((option, i) => {
  console.log(`${i + 1}: ${option}`);
});
