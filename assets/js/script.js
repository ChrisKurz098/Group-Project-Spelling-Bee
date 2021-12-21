//-------get screen ready--------//
//very first thing, before any user interaction, is to hide all divs except for start screen
document.getElementById("game-screen").style.display = "none";
document.getElementById("end-screen").style.display = "none";
//THEN POPULATE TOP SCORES
//this checks for if there isnt a high score key saved in local storage and makes one with default values
initTopScore();
//this is here just to log what is saved in localStorage to the console
console.log("Top Score Array: ", loadTopScores());

//submit answer button
var submitBtnEl = document.querySelector("#submit-answer-btn");
// users form input element
var answerInputEl = document.querySelector("#answer-input");
let wordData = {};
var gameWords = [];
var userAnswers = [];
var correctAnswers = 0;
var wrongAnswers = 0;
var x = 0;
//set variables for each screen div
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endScreen = document.getElementById("end-screen");

//-------------------------------MAIN CODE---------------------------------------//
function main() {
    
    //hide all but except gameScreen
    startScreen.style.display = "none";
    gameScreen.style.display ="block"; //this may have to change to flex depending on tailwind
    endScreen.style.display = "none";
    //etch the array of word data
    wordData = fetchWord();
    /*wordData contains: 
    - wordData.name
    - wordData.example
    - wordData.definition*/

//playVoice(text) //run this function and pass the text for the api to speak
}

//---------------------------END MAIN CODE-----------------------------------//


///INIT TOP SCORE DATA IN localStorage///
function initTopScore(){
    checkIfHighScore = localStorage.getItem("topScores")
    //if there isnt a high score key saved in local storage, make one
    if (!checkIfHighScore) {
        let defaultScore = [{
            name: "Fred",
            score: 80
        },
        {
            name: "Sally",
            score: 60
        },
        {
            name: "Bill",
            score: 40
        },
        {
            name: "Ted",
            score: 20
        },
        {
            name: "Greg",
            score: 10
        }];
        //save default top scores from above to localStorage
        saveTopScores(defaultScore);
        
    };

    return;
}

/////////////////LOAD SCORES FUNCTION/////////////////////////////
//this returns the top scores saved in localStorage
function loadTopScores() {
    let currentTopScores = localStorage.getItem("topScores");
    currentTopScores = JSON.parse(currentTopScores);
    return currentTopScores;
}
/////////////////SAVE SCORES FUNCTION/////////////////////////////
//send the updated array of top scores here to be saved
function saveTopScores(newTopScores) {
    localStorage.setItem("topScores", JSON.stringify(newTopScores));
    return;
}


//-----------------------------BEGIN FETCH CODE-----------------------------//
function fetchWord() {
    const wordUrl = "https://random-word-api.herokuapp.com/word?number=1&swear=0";
    let word = "none"
    fetch(wordUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                word = data[0];
                console.log("word:", word);
                //once we get a word, use that word to fecth an example and def
                fetchExample(word);
            });
        } else { console.log("Random Word: NO RESPONSE ... retying fetch"); fetchWord(); }
    })
        .catch(function (error) {
            console.log("UNABLE TO CONNECT", error);
        });
}

function fetchExample(word) {
    let exampleUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;
    //we will pass wordData to the main code. 
    //It is an object containing "word", "example" and "definition"
    
    fetch(exampleUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log("data: ", data);
                //if there is an example, continue. if not repeat
                if (data[0].meanings[0].definitions[0].example) {
                    //check if random word is dictionary word
                    wordData = {
                        word: data[0].word,
                        example: data[0].meanings[0].definitions[0].example,
                        definition: data[0].meanings[0].definitions[0].definition
                    };
                    console.log("Word info: ", wordData);
                    //retunr data
                    return wordData;
                }
                else {
                    console.log("Non valid word. Running fetch again");
                    fetchWord();
                }
            })
        }
        else {
            console.log("Word Example: Error Durring Fetch");
            console.log("Word May Not Exsist in Database ... Retry Fetch");
            fetchWord();
        }

    })
        .catch(function (error) { console.log("UNABLE TO CONNECT", error); });
}

//----------------------------------END FETCH CODE-----------------------------------------//

//---------------------------------Play Sound Function------------------------------------//
function playVoice(text) {
let player = document.getElementById("audioPlayer");
//no need to fetch api url. Just put the url into the sorce for the audip player to play
let audio = "http://api.voicerss.org/?key=b56a5fc94a814d1b9edc00c045483548&hl=en-us&src=" + text;
player.src = audio;
player.play();
}
 
var userAnswerHandler = function (event){
    event.preventDefault();
    //page elements
    var rightWrongDisplay = document.querySelector("#right-wrong-display");
    var correctAnswersTally = document.querySelector("#current-correct-answers-container");
    //get data from fetch api
    var word = wordData.word;
    //Recieve the users input
    var userAnswer = answerInputEl.value;
    userAnswer = userAnswer.trim().toLowerCase();

    //collect the word user got
    gameWords[x] = word;
    //collect the users answer
    userAnswers[x] = userAnswer;
    //for next round
    x++;

    //compare users input to word
    if (userAnswer === word) {
        rightWrongDisplay.innerHTML = "CORRECT";
        //add tally
        correctAnswers++;
        correctAnswersTally.innerHTML = correctAnswers;
    }
    else{
        wrongAnswers++;
        rightWrongDisplay.innerHTML = "INCORRECT";
        //after three strikes
        if (wrongAnswers===3){
            loadEndScreen();
            gameScreen.style.display ="none"; //this may have to change to flex depending on tailwind
            endScreen.style.display = "block";
            return;
        }
    }

    //reset form for next input
    answerInputEl.value = "";
    // call another word
    fetchWord();
}

var loadEndScreen = function(){
    //page elements
    var finalScore = document.querySelector("#final-score");
    var gameWordsEl = document.querySelector("#words-list");
    var userAnswersEl = document.querySelector("#answers-list");
    //display your score of correct answers
    finalScore.innerHTML = "Correct Answers: " + correctAnswers;
    //display game words and users answers for comparison
    for (let i = 0; i < x; i++) {
        // create list item
        var wordEl = document.createElement("li");
        // give it a value
        wordEl.innerHTML = gameWords[i]
        // append it to ordered list
        gameWordsEl.appendChild(wordEl);

        // create list item
        var userAnswerEl = document.createElement("li");
        // give it a value
        userAnswerEl.innerHTML = userAnswers[i];
        // append it to ordered list
        userAnswersEl.appendChild(userAnswerEl);
    }
}

submitBtnEl.addEventListener("click", userAnswerHandler);