"use strict";

let formMaker = function(tempStr, exampleArr){
    let tilda = /~/;
    exampleArr.forEach((example) => {
        tempStr = tempStr.replace(tilda, `<input class='form' id="blank" placeholder="${example}"/>`);
        });
    return tempStr;
};

module.exports = formMaker;
