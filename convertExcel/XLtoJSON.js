
//imports
const fs= require("fs");
const { stringify } = require("querystring");
const xlsx= require("xlsx");

function LoadExcel(filename){
    var workbook= xlsx.readFile(filename);
    var worksheet= workbook.Sheets["english"];
    var data= xlsx.utils.sheet_to_json(worksheet); //sheet_to_json parses the data for us 
    return data
};

// load the file and save the data 
var data= LoadExcel("funfacts.xlsx");

// create "items" variable for the js file
var items= {
    "study": "english",
    "list": {}
};

// positions from GlobalVariables file
var pos_x = [0.1, 0.1, 0.35, 0.65, 0.35, 0.65, 0.9, 0.9, 0.5];
var pos_y = [0.6, 0.2, 0.2, 0.2, 0.6, 0.6, 0.6, 0.2, 0.4];
var k= 0;

data.map(function(record){
    console.log(record);
    var category= record.category;
    var position= {"x": pos_x[k], "y": pos_y[k]};
    items["list"][category]= {
        "label": category,
        "pos": position,
        "img": {"1":"dino_1.png"}, // the img obj can be replaced in both files and contain only img1
        "text": {}
    };
    k=k+1;

    for(let i=1; i<16; i++){
        num= i.toString()
        if (record[num]!=undefined){
            fact= record[num].replaceAll('\\n','\n');
        };
        items["list"][category]["text"][num] = {
            'text': fact,
            'audio': category+num+".wav"
        }
        items["list"][category]["text"][num]={}
        items["list"][category]["text"][num]["text"]= fact;
        items["list"][category]["text"][num]["audio"]= category+num+".wav"
    }
});

// write the variable in the js file
fs.writeFile("../english.js","var items="+JSON.stringify(items), err=>{
    if(err){
        console.log(err); 
    }
    else{
        console.log("file written successfully"); // make sure the file was written
    } 
});





