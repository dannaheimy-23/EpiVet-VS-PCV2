// ==========================================
// EpiVet VS PCV2
// Simulador epidemiológico veterinario
// Versión final dificultad ajustada
// ==========================================


// ===============================
// ELEMENTOS
// ===============================

const menu = document.getElementById("menu");
const reportScreen = document.getElementById("reportScreen");
const helpScreen = document.getElementById("helpScreen");
const gameScreen = document.getElementById("gameScreen");
const endScreen = document.getElementById("endScreen");


const startBtn = document.getElementById("startBtn");
const helpBtn = document.getElementById("helpBtn");
const backBtn = document.getElementById("backBtn");
const beginBtn = document.getElementById("beginBtn");


const vaccineBtn = document.getElementById("vaccineBtn");
const bioBtn = document.getElementById("bioBtn");
const nextBtn = document.getElementById("nextBtn");


const map = document.getElementById("map");
const roads = document.getElementById("roads");


const levelText = document.getElementById("level");
const timerText = document.getElementById("timer");
const vaccinesText = document.getElementById("vaccines");
const bioText = document.getElementById("bio");
const scoreText = document.getElementById("score");
const infectedCount = document.getElementById("infectedCount");


const farmTitle = document.getElementById("farmTitle");
const farmStatus = document.getElementById("farmStatus");


const endTitle = document.getElementById("endTitle");
const endMessage = document.getElementById("endMessage");
const endScore = document.getElementById("endScore");





// ===============================
// VARIABLES
// ===============================


let currentLevel = 1;


let farms = [];
let farmState = [];


let connections = {};


let selectedFarm = null;


let vaccines = 0;
let biosecurity = 0;


let score = 0;


let time = 0;


let timerInterval;
let virusInterval;


let gameFinished = false;







// ===============================
// CONFIGURACIÓN DE NIVELES
// ===============================


const levels = {


1:{

    farms:8,

    infected:1,

    vaccines:3,

    bio:2,

    time:60,

    speed:12000

},



2:{


    farms:16,

    infected:2,

    vaccines:5,

    bio:4,

    time:60,

    speed:11000


},



3:{


    farms:21,

    infected:3,

    vaccines:8,

    bio:5,

    time:65,

    speed:10000


}


};









// ===============================
// MENU
// ===============================


startBtn.onclick = ()=>{


menu.classList.add("hidden");

reportScreen.classList.remove("hidden");


};




helpBtn.onclick = ()=>{


menu.classList.add("hidden");

helpScreen.classList.remove("hidden");


};




backBtn.onclick = ()=>{


helpScreen.classList.add("hidden");

menu.classList.remove("hidden");


};





beginBtn.onclick = ()=>{


reportScreen.classList.add("hidden");

gameScreen.classList.remove("hidden");


startLevel();


};










// ===============================
// INICIAR NIVEL
// ===============================


function startLevel(){


clearInterval(timerInterval);

clearInterval(virusInterval);



let config = levels[currentLevel];



vaccines = config.vaccines;

biosecurity = config.bio;



time = config.time;



score = 0;



selectedFarm = null;



gameFinished = false;



createMap(config.farms);



createConnections(config.farms);



createInitialInfection(config.infected);




updateUI();



startTimer();




virusInterval=setInterval(

spreadVirus,

config.speed

);



}
// ===============================
// CREAR GRANJAS
// ===============================


function createMap(number){


map.innerHTML="";


farms=[];

farmState=[];



let positions;



if(number===8){


positions=[

[12,15],
[35,12],
[58,18],
[18,42],
[45,38],
[70,42],
[25,70],
[55,72]

];


}



else if(number===16){


positions=[

[8,12],[28,10],[48,12],[68,12],

[18,32],[38,30],[58,32],[78,30],

[10,55],[30,52],[50,55],[70,52],

[18,75],[40,72],[60,76],[80,70]

];


}



else{


positions=[

[8,10],[25,8],[42,10],[59,8],[76,12],

[15,28],[32,26],[50,30],[68,27],

[10,48],[28,45],[46,50],[64,46],[82,50],

[18,68],[36,65],[54,70],[72,66],

[30,85],[50,82],[70,86]

];


}





for(let i=0;i<number;i++){


let farm=document.createElement("div");


farm.className="farm";


farm.textContent="🐷";



farm.style.left=positions[i][0]+"%";


farm.style.top=positions[i][1]+"%";



map.appendChild(farm);



farms.push(farm);



farmState.push({

status:"healthy"

});




farm.onclick=()=>{


selectedFarm=i;


farmTitle.textContent="Granja "+(i+1);



farmStatus.textContent=

"Estado: "+farmState[i].status;



};



}



}











// ===============================
// CREAR CONEXIONES ENTRE GRANJAS
// DIFICULTAD MÁS EQUILIBRADA
// ===============================


function createConnections(number){


connections={};



for(let i=0;i<number;i++){

connections[i]=[];

}





// NIVEL 1
// Fácil: pocas rutas y control sencillo

if(number===8){


let links=[


[0,1],
[1,2],
[2,3],

[1,4],
[4,5],

[5,6],
[6,7],


[3,5]


];


links.forEach(l=>addConnection(l[0],l[1]));


}






// NIVEL 2
// Intermedio pero ganable

else if(number===16){


let links=[



[0,1],
[1,2],
[2,3],


[4,5],
[5,6],
[6,7],


[8,9],
[9,10],
[10,11],


[12,13],
[13,14],
[14,15],




[0,4],

[1,5],

[2,6],



[5,9],


[6,10],



[9,13],



[10,14]



];



links.forEach(l=>addConnection(l[0],l[1]));



}







// NIVEL 3
// Más granjas pero con rutas controlables

else{



let links=[



[0,1],
[1,2],
[2,3],
[3,4],



[5,6],
[6,7],
[7,8],



[9,10],
[10,11],
[11,12],
[12,13],



[14,15],
[15,16],
[16,17],



[18,19],
[19,20],





[0,5],

[2,7],

[3,8],



[5,10],

[7,12],



[10,15],


[12,17],


[15,19],


[17,20]



];



links.forEach(l=>addConnection(l[0],l[1]));



}




drawRoads();



}





function addConnection(a,b){



if(!connections[a].includes(b)){


connections[a].push(b);


}



if(!connections[b].includes(a)){


connections[b].push(a);


}


}







// ===============================
// DIBUJAR CARRETERAS
// ===============================


function drawRoads(){


roads.innerHTML="";



for(let i=0;i<farms.length;i++){



connections[i].forEach(j=>{



if(j>i){



let line=document.createElementNS(

"http://www.w3.org/2000/svg",

"line"

);




let x1=farms[i].offsetLeft+35;

let y1=farms[i].offsetTop+35;



let x2=farms[j].offsetLeft+35;

let y2=farms[j].offsetTop+35;



line.setAttribute("x1",x1);

line.setAttribute("y1",y1);

line.setAttribute("x2",x2);

line.setAttribute("y2",y2);



roads.appendChild(line);



}



});



}


}
// ===============================
// INFECCIÓN INICIAL
// ===============================


function createInitialInfection(amount){


let infected=0;



while(infected<amount){



let random=Math.floor(

Math.random()*farmState.length

);



if(farmState[random].status==="healthy"){



infectFarm(random);


infected++;


}



}



}









// ===============================
// INFECTAR GRANJA
// ===============================


function infectFarm(index){



farmState[index].status="infected";



farms[index].classList.remove(

"vaccinated",

"protected"

);



farms[index].classList.add(

"infected"

);



score-=25;



updateUI();



}











// ===============================
// VACUNACIÓN
// ===============================


vaccineBtn.onclick=()=>{


if(selectedFarm===null)return;



if(vaccines<=0){

alert("No quedan vacunas");

return;

}



if(farmState[selectedFarm].status!=="healthy"){

alert("Esta granja ya tiene una condición");

return;

}



farmState[selectedFarm].status="vaccinated";



farms[selectedFarm].classList.add(

"vaccinated"

);



vaccines--;


score+=50;



updateUI();



checkContainment();


checkEndByResources();



};











// ===============================
// BIOSEGURIDAD
// ===============================


bioBtn.onclick=()=>{


if(selectedFarm===null)return;



if(biosecurity<=0){

alert("No quedan medidas de bioseguridad");

return;

}



if(farmState[selectedFarm].status!=="healthy"){

alert("Esta granja ya tiene una condición");

return;

}



farmState[selectedFarm].status="protected";



farms[selectedFarm].classList.add(

"protected"

);



biosecurity--;


score+=40;



updateUI();



checkContainment();


checkEndByResources();



};












// ===============================
// PROPAGACIÓN DEL VIRUS
// ===============================


function spreadVirus(){


if(gameFinished)return;



let possible=[];



farmState.forEach((farm,index)=>{



if(farm.status==="infected"){



connections[index].forEach(neighbor=>{



if(farmState[neighbor].status==="healthy"){


possible.push(neighbor);


}



});



}



});






if(possible.length>0){



let target=

possible[

Math.floor(Math.random()*possible.length)

];



infectFarm(target);



}



checkContainment();



}











// ===============================
// CONTROL DEL BROTE
// ===============================


function checkContainment(){



if(gameFinished)return;



let infected=[];



farmState.forEach((farm,index)=>{



if(farm.status==="infected"){


infected.push(index);


}



});






if(infected.length===0){


finishGame(true);


return;


}







let canSpread=false;



infected.forEach(index=>{



connections[index].forEach(neighbor=>{



if(farmState[neighbor].status==="healthy"){


canSpread=true;


}



});



});






if(!canSpread){



let percentage=

infected.length / farmState.length;



if(percentage<=0.15){



finishGame(true);



}



}



}











// ===============================
// FINALIZAR AL TERMINAR RECURSOS
// ===============================


function checkEndByResources(){



if(gameFinished)return;



if(vaccines>0 || biosecurity>0){


return;


}




let infected=0;



farmState.forEach(f=>{


if(f.status==="infected"){


infected++;


}



});






if(infected===0){



finishGame(true);



}

else{



finishGame(false);



}



}











// ===============================
// ACTUALIZAR INTERFAZ
// ===============================


function updateUI(){



levelText.textContent=

"Nivel "+currentLevel;



vaccinesText.textContent=

"💉 Vacunas: "+vaccines;



bioText.textContent=

"🛡️ Bioseguridad: "+biosecurity;



scoreText.textContent=

"⭐ Puntaje: "+score;



let infected=0;



farmState.forEach(f=>{


if(f.status==="infected"){


infected++;


}


});



infectedCount.textContent=

"🦠 Infectadas: "+infected+" / "+farmState.length;



}









// ===============================
// CRONÓMETRO
// ===============================


function startTimer(){



timerInterval=setInterval(()=>{



if(gameFinished)return;



time--;



let min=Math.floor(time/60);


let sec=time%60;




timerText.textContent=

"🕒 "+

String(min).padStart(2,"0")

+

":"

+

String(sec).padStart(2,"0");





if(time<=0){



finishGame(false);



}



},1000);



}




// ===============================
// FINAL DEL NIVEL
// ===============================


function finishGame(win){



if(gameFinished)return;



gameFinished=true;



clearInterval(timerInterval);

clearInterval(virusInterval);




gameScreen.classList.add("hidden");


endScreen.classList.remove("hidden");






if(win){



endTitle.textContent=

"🏆 Brote controlado";



endMessage.textContent=

"El PCV2 fue contenido correctamente.";



nextBtn.textContent=

currentLevel<3 ?

"➡ Siguiente nivel"

:

"🏆 Finalizar juego";



}



else{



endTitle.textContent=

"💀 No se controló el brote";



endMessage.textContent=

"La infección no pudo ser contenida. Debes repetir el nivel.";



nextBtn.textContent=

"🔄 Reiniciar nivel";



}




endScore.textContent=

"⭐ Puntaje final: "+score;



}












// ===============================
// BOTÓN FINAL
// ===============================


nextBtn.onclick=()=>{



endScreen.classList.add("hidden");





if(nextBtn.textContent==="🔄 Reiniciar nivel"){



gameScreen.classList.remove("hidden");



startLevel();



return;



}







if(currentLevel<3){



currentLevel++;



reportScreen.classList.remove("hidden");



document.getElementById("reportLevel").innerHTML=

"<strong>Nivel:</strong> "+currentLevel;



}



else{



alert(

"🎉 Has completado EpiVet VS PCV2"

);



location.reload();



}



};