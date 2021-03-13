
//imports
const fs= require("fs");
const { stringify } = require("querystring");
const xlsx= require("xlsx");

function LoadExcel(filename){
    var workbook= xlsx.readFile(filename);
    var worksheet= workbook.Sheets["hebrew"];
    var data= xlsx.utils.sheet_to_json(worksheet); //sheet_to_json parses the data for us 
    return data
};

// load the file and save the data 
var data= LoadExcel("funfacts.xlsx");

// create "items" variable for the js file
var items= {
    "study": "hebrew",
    "list": {}
};

// positions from GlobalVariables file
var pos_x = [0.1, 0.1, 0.35, 0.65, 0.35, 0.65, 0.9, 0.9, 0.5];
var pos_y = [0.6, 0.2, 0.2, 0.2, 0.6, 0.6, 0.6, 0.2, 0.4];
var k= 0;

// functions to fix hebrew writing. 
function reverseString(str) {
    return str.split("").reverse().join("");
};
function reverseSentence(sentence){
    words= sentence.split(" ");
    for (i=0; i<words.length; i++){
        words[i]= reverseString(words[i])
    };
    return words.reverse().join(" ");
}

data.map(function(record){
    var category= record.categoryE;
    var hebrewName= record.categoryH; // if necessary write: reverseString(record.categoryH)
    var position= {"x": pos_x[k], "y": pos_y[k]};
    items["list"][category]= {
        "label": hebrewName, //current label is hebrew name. if necessary switch to "category" (the name in english)
        "pos": position,
        "img": {"1":record.categoryE+"_1.png"},
        "text": {}
    };
    k=k+1;

    for(let i=1; i<14; i++){
        num= i.toString();
        if (record[num]!=undefined){
            fact= record[num].replaceAll('\\n','\n');
        };
        fact= record[num]; // if necessary write: reverseSentence(record[num])
        items["list"][category]["text"][num] = {
            'text': fact,
            'audio': category+num+".wav"
        }
        items["list"][category]["text"][num]={}
        items["list"][category]["text"][num]["text"]= fact;
        items["list"][category]["text"][num]["audio"]= category+num+".wav"
    }
});
console.log(items);
 // write the variable in the js file
fs.writeFile("../hebrew.js","var items="+ JSON.stringify(items), err=>{
    if(err){
        console.log(err); 
    }
    else{
        console.log("file written successfully"); // make sure the file was written
    } 
}); 





