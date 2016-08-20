"use strict";

let formMaker = function(tempStr, exampleArr){
    let tilda = /~/;
    exampleArr.forEach((example) => {
        tempStr = tempStr.replace(tilda, `<input class='form' placeholder=${example}/>`);
        });
    return tempStr;
};

module.exports = formMaker;
