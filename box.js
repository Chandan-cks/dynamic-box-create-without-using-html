
       
// (function(){
//     var newelement = document.createElement("div");
// // var newtext = document.createTextNode("box");
// // document.getElementById("main").appendChild(newtext);
// newelement.style.width="200px";
// newelement.style.height="200px";
// newelement.style.background="black";
// newelement.style.color="white";
// newelement.style.opacity= "0.1";

// // newelement.appendChild(newtext); 
// document.body.appendChild(newelement);
// })();

// no function use display block and all,
var newelement = document.createElement("div");
var title1=document.createElement("div");
// var title2 = document.createTextNode("title bar");
var title2 = document.createElement("text");
var my_text = document.createTextNode('Hello! title');
title1.appendChild(my_text);

newelement.id="myPopup"

title2.style.cssText='color:red; margin:0px 0px 0px 0px; padding: 0px; align-items:center;';
newelement.style.cssText='margin:0px 0px 0px 117px; padding:10px; width:200px; height:200px; background:black; color:white; opacity:1; position:absolute;';
title1.style.cssText=' margin: 0px 0px 0px 0px; padding:0px; width: 200px; height: 33px; background-color: white; text-align: center; color: red; line-height: 35px;';
newelement.appendChild(title2);
newelement.appendChild(title1);
newelement.style.Left= (createbox.offsetLeft + createbox.offsetWidth + 10) + "px";
newelement.style.Top= ((createbox.offsetTop + createbox.offsetHeight )/2) + "px";


// btn part
// var btntype = document.createElement("div");

var btn1 = document.createElement("BUTTON");
var next = document.createTextNode('next');
// btn1.appendChild(next);
btn1.appendChild(next);
newelement.appendChild(btn1);

var btn2 = document.createElement("BUTTON");
var privious = document.createTextNode('privious');
btn2.appendChild(privious);
newelement.appendChild(btn2);` `


// btntype.style.cssText='display:flex;';

// btntype.style.cssText='display: grid; grid-template-columns: repeat(auto-fill, 200px);';
btn1.style.cssText='margin:128px 0px 0px 6px;color:blue, width:100%, height:20px';
btn2.style.cssText='margin:0px 0px 0px 90px; color:blue, width:100%, height:20px';

document.body.appendChild(newelement);  

console.log(newelement.offsetTop);

// var x=document.getElementById('myPopup'); 
// x.style.position="absolute";
// x.style.Left= (createbox.offsetLeft + createbox.offsetWidth + 10) + "px";
// x.style.Top= ((createbox.offsetTop + createbox.offsetHeight )/2) + "px";