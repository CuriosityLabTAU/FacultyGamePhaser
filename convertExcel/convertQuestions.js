//imports
const fsLibrary= require("fs");
const { stringify } = require("querystring");
const xlsx= require("xlsx");

function LoadExcel(filename){
    var workbook= xlsx.readFile(filename);
    var worksheet= workbook.Sheets["questions"];
    var data= xlsx.utils.sheet_to_json(worksheet); //sheet_to_json parses the data for us 
    return data
};

// load the file and save the data 
var data= LoadExcel("questions.xlsx");
var output= {};
data.map(function(record){
    output[record.fact]= {
        question: record.question,
        audio: record.audio,
        answers: {
            a: record.a,
            b: record.b,
            c: record.c,
            d: record.d
        },
        correctAnswer: record.correctAnswer
    };
});
// write the variable in the js file 
fsLibrary.writeFile('../questions.js', "var allQuestions="+JSON.stringify(output), (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("file written successfully"); // make sure the file was written
    }
});

