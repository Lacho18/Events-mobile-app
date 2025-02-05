//function that formats string from a field structure to separate words
String.prototype.formatFields = function () {
    //Formats the word. It becomes like object of letters
    let currentWord = Object.keys(this).map(key => this[key]).join('');
    let separateWords = [];
    let word = "";

    //Fills the array with every word
    for (const char of currentWord) {
        //Checks is there is upper case letter. This separates the words
        if (char === char.toUpperCase()) {
            separateWords.push(word);
            word = "" + char;
        }
        else {
            word += char;
        }
    }

    //Adds the final word
    separateWords.push(word);

    //Sets the letter of the first word to upper case
    if (separateWords.length > 0) {
        separateWords[0] = separateWords[0].firstLetterFormat();

        return separateWords.join(" ");
    }

    return "";
}

//Function that sets the fist letter of a given word to upper case
String.prototype.firstLetterFormat = function () {
    let word = Object.keys(this).map(key => this[key]).join('').toLowerCase();

    return word.charAt(0).toLocaleUpperCase() + word.slice(1, word.length);
}