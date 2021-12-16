//--------------------------------------------------Begin Fetch Code-----------------------------------------//
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
        } else { console.log("Random Word: NO RESPONSE"); }
    })
        .catch(function (error) {
            console.log("Catch Error");
        });
}

//---------------------------------------------------END FETCH CODE-----------------------------------------//
fetchWord();