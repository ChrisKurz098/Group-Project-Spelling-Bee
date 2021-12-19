//-------get screen ready--------//
//very first thing, before any user interaction, is to hide all divs except for start screen
document.getElementById("game-screen").style.display = "none";
document.getElementById("end-screen").style.display = "none";
//THEN POPULATE LEADER BOARD



//-------------------------------MAIN CODE---------------------------------------//
function main() {
    //set variables for each screen div
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");
    const endScreen = document.getElementById("end-screen");
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
    let wordData = {};
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
                    //pass data to main code
                    //UNCOMMENT CODE BELOW AND UPDATE WITH MAIN FUNCTIONS NAME WHEN READY
                    //main(wordData);
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
