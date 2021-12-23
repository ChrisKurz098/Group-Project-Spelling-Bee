//-------get screen ready--------//
//very first thing, before any user interaction, is to hide all divs except for start screen
document.getElementById("game-screen").style.display = "none";
document.getElementById("end-screen").style.display = "none";
// top score table body element
var scoreTableEl = document.getElementById("score-table");
//THEN POPULATE TOP SCORES
//this checks for if there isn't a high score key saved in local storage and makes one with default values
initTopScore();
//populates top score table
displayTopScores();

let playerRank = null;

//submit answer button
var submitBtnEl = document.querySelector("#submit-answer-btn");
//play word button
var playWordBtnEl = document.querySelector("#play-word-btn");
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
    gameScreen.style.display = "block"; //this may have to change to flex depending on tailwind
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
function initTopScore() {
    checkIfHighScore = localStorage.getItem("topScores")
    //if there isn't a high score key saved in local storage, make one
    if (!checkIfHighScore) {
        let defaultScore = [{
            name: "Fred",
            score: 8
        },
        {
            name: "Sally",
            score: 6
        },
        {
            name: "Bill",
            score: 4
        },
        {
            name: "Ted",
            score: 2
        },
        {
            name: "Greg",
            score: 1
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

//----------------------DISPLAY TOP SCORES FUNCTION--------------------------//
function displayTopScores() {
    //retrieves locally stored scores
    var scoreArray = loadTopScores();
    for (i = 0; i<scoreArray.length; i++) {
        //inserts new row element to table body
        var scoreRowEl = scoreTableEl.insertRow(i);
        //inserts new cells for name and score to row element
        var nameItemEl = scoreRowEl.insertCell(0);
        nameItemEl.textContent = scoreArray[i].name;
        var scoreItemEl = scoreRowEl.insertCell(1);
        scoreItemEl.textContent = scoreArray[i].score;
    }
}

//-----------------------------BEGIN FETCH CODE-----------------------------//
function fetchWord() {
    let defEl = document.getElementById("def");
    defEl.textContent = "Please Wait While We Grab a New Word...";
    defEl.style.animation = "loading 3s infinite alternate";
    const wordUrl = "https://random-word-api.herokuapp.com/word?number=1&swear=0";
    let word = "none"
    fetch(wordUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                word = data[0];
                console.log("word:", word);
                //once we get a word, use that word to fetch an example and def
                fetchExample(word,defEl);
            });
        } else { console.log("Random Word: NO RESPONSE ... retying fetch"); fetchWord(); }
    })
        .catch(function (error) {
            console.log("UNABLE TO CONNECT", error);
        });
}

function fetchExample(word,defEl) {
    let exampleUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word;
    //we will pass wordData to the main code. 
    //It is an object containing "word", "example" and "definition"

    fetch(exampleUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log("data: ", data);
                //if there is an example, continue. if not repeat
                if (data[0].meanings[0].definitions[0].example && !data[0].meanings[0].definitions[0].definition.includes(data[0].word)) {
                    //check if random word is dictionary word
                    wordData = {
                        word: data[0].word,
                        example: data[0].meanings[0].definitions[0].example,
                        definition: data[0].meanings[0].definitions[0].definition
                    };
                    console.log("Word info: ", wordData);
                    //End animation and say ready
                    defEl.textContent = (wordData.definition.charAt(0).toUpperCase() + wordData.definition.slice(1));
                    defEl.style.animation = "none";
                    //enable play-word btn
                    playWordBtnEl.disabled = false;
                    //return data
                    generateVoiceText();
                    return wordData;
                }
                else {
                    if (data[0].meanings[0].definitions[0].definition.includes(data[0].word)){console.log("!Word is in definition!");}
                    console.log("Non valid word. Running fetch again");
                    fetchWord();
                }
            })
        }
        else {
            console.log("Word Example: Error During Fetch");
            console.log("Word May Not Exist in Database ... Retry Fetch");
            fetchWord();
        }

    })
        .catch(function (error) { console.log("UNABLE TO CONNECT", error); });
}

//----------------------------------END FETCH CODE-----------------------------------------//

//---------------------------------Play Sound Function------------------------------------//

function playVoice(text) {
    console.log(text);
    let player = document.getElementById("audioPlayer");
    //no need to fetch api url. Just put the url into the source for the audio player to play
    
    let audio = "http://api.voicerss.org/?key=b56a5fc94a814d1b9edc00c045483548&hl=en-us&c=MP3&f=16khz_16bit_stereo&src=" + text;
    player.src = audio;
    player.play();
}
//--------------------------------Generate Voice Text Function-----------------------------//
function generateVoiceText() {
    let word = wordData.word;
    console.log(wordData);
    console.log(word);
    let sentenceExample = wordData.example;
    //Added " . " to the string to create a pause between the word and example statement when the text is spoken
    var voiceText = "Spell the word:"+[word]+" . "+ "As in:"+[sentenceExample];
    playVoice(voiceText);
}

var userAnswerHandler = function (event) {
    event.preventDefault();
    //page elements
    var rightWrongDisplay = document.querySelector("#right-wrong-display");
    var correctAnswersTally = document.querySelector("#current-correct-answers-container");
    //get data from fetch api
    var word = wordData.word;
    //Receive the users input
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
    else {
        wrongAnswers++;
        rightWrongDisplay.innerHTML = "INCORRECT";
        //after three strikes
        if (wrongAnswers === 3) {
            loadEndScreen();
            gameScreen.style.display = "none"; //this may have to change to flex depending on tailwind
            endScreen.style.display = "block";
            return;
        }
    }

    //reset form for next input
    answerInputEl.value = "";
    // call another word
    fetchWord();
}

var loadEndScreen = function () {
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
        // change font color of word. Red for wrong/green for right.
        if (userAnswers[i] === gameWords[i]) { 
            userAnswerEl.classList.add('correct');
     
        }   else {
            userAnswerEl.classList.add('incorrect');
        }
        // append it to ordered list
        userAnswersEl.appendChild(userAnswerEl);
    }
    playerRank =  checkHighScore();
    if (playerRank == 10){
        document.getElementById("new-hs-container").style.display="none";
    }
}


//set variables
////gets intials input
const intialsInput = document.getElementById('initials-input');
///////////gets the submit button 
const sumbitNameBtn = document.getElementById('sumbit-name-btn');


////////////////////////////////////////////////////////////pull score from the end screen

////getting top score to sort
const topScores = localStorage.getItem('topScores');
///////allows us to acceses the local storage to pull scores

console.log(JSON.parse(localStorage.getItem("highScores")));

///////////////////Variable to set max\\\
const MAX_HIGH_SCORES = 5;

////////reacts to changes to intial input feild
intialsInput.addEventListener('keyup', () => {
    console.log(intialsInput.value);
    ////////////////keeps button disabled untill text is typed in true = false 
    sumbitNameBtn.disabled = !intialsInput.value;
    
});

saveHighScore = (e) => {
    highScores = loadTopScores();
//////button becomes available it allows the user to click by removing default disabled
console.log("clicked save button")
e.preventDefault();
let newName = document.getElementById("initials-input").value;
    let scoreList = loadTopScores();
    /*Represents how many array items we need to change based off what rank the player got. in short: how many times the for loop loops */
    let numChange = (scoreList.length - 1) - playerRank;
    /*there are array indexes 0-4. we want to put [3] into [4], then [2] into [3] and so on.
    We need to start on the second to last index (3) */
    let numStart = 3;

    /*This is my code for adding an array object to a spot in the array,
    pushing all the array elements down one by changing their values to the values of the object above them
    until we reach the index of the players score position*/
    for (i = 0; i < numChange; i++) {
        //get the values of the array we want to move down
        let oldName = scoreList[numStart].name;
        let oldScore = scoreList[numStart].score;
        //make new variable (ii) = the next score
        let ii = numStart + 1;
        //store the values of the above score to the score below
        scoreList[ii].name = oldName;
        scoreList[ii].score = oldScore;
        //make numStart = the next highest score then repeat
        numStart--;
    }


    newName = newName.slice(0, 9);
    // save score and anme to array
    scoreList[playerRank].name = newName;
    scoreList[playerRank].score = correctAnswers;


saveTopScores(scoreList);
/////////////////////sends the page to go to the start
location.reload();
};

function checkHighScore() {
    topScoreArray = loadTopScores();
    //check each score in the array from top to bottom
    for (i = 0; i < topScoreArray.length; i++) {

        if (correctAnswers > topScoreArray[i].score) {
            return i; //return where the player score should go in the array
        }
    }
    //if the player didnt beat a score return null
    return 10;
}

submitBtnEl.addEventListener("click", userAnswerHandler);
//event listener for Play Word button
playWordBtnEl.addEventListener("click", generateVoiceText);
