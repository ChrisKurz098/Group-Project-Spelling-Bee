

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
        .catch(function (error) { console.log("!UNABLE TO CONNECT!", error); });
}
fetchWord();
//---------------------------------------------------END FETCH CODE-----------------------------------------//

