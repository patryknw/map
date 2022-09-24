/* TODO
 * drawing of forest happens on another layer
 * village prosperity
 * different house variants based on "richness" of the village (eg. white houses from Zalipie)
 * zoom mechanic
 * land fertility mechanic
 * forest generation fully based on perlin
 */

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

const TILE_SIZE = 20;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var day = 1;
var month = 1;
var year = 1619;
var weekday_number = 2;

var day_name = days[1];
var month_name = months[0];

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function offsetColor(color, offset){
    return getRandomInt(color - offset, color + offset);
}

class Tile{
    constructor(x, y, type, height, forestDensity, feature){
        this.x = x;
        this.y = y;
        this.type = type;
        this.height = height;
        this.forestDensity = forestDensity;
        this.feature = feature;
    }
    setHeight(x, y){
        this.height = Math.floor(Math.abs(noise.perlin2(x / 50, y / 50)) * 256)  // 50 being scale for perlin noise
    }
    setForestDensity(x, y){
        this.forestDensity = Math.floor(Math.abs(noise.perlin2(x / 50, y / 50)) * 256)  // 50 being scale for perlin noise
    }
    drawPerlinDebug(){
        ctx.fillStyle = `rgb(${this.height}, ${this.height}, ${this.height})`;
        ctx.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
    setTypeTopography(){
        switch(true){
            case this.height <= 10:
                this.type = "water";
                break;
            case this.height > 10:
                this.type = "plains";
                break;
            default:
                this.type = null;
        }
    }
    setTypeForest(){
        if(this.type == "water"){ return };
        switch(true){
            case this.forestDensity <= 40:
                    break;
            case this.forestDensity > 40 && this.forestDensity <= 80:
                this.type = "forest_edge";
                break;
            case this.forestDensity > 80:
                this.type = "forest";
                break;
            default:
                this.type = null;
        }
    }
    drawTile(){
        switch(this.type){
            case "plains":
                // ctx.fillStyle = "#348c31";
                ctx.fillStyle = `rgb(52, ${137 + Math.floor(Math.random() * 6)}, 49)`;
                break;
            case "forest_edge":
                // ctx.fillStyle = "#2E832B";
                ctx.fillStyle = `rgb(46, ${127 + Math.floor(Math.random() * 8)}, 43)`;
                break;
            case "forest":
                // ctx.fillStyle = "#267524";
                ctx.fillStyle = `rgb(38, ${112 + Math.floor(Math.random() * 10)}, 36)`;
                break;
            case "water":
                ctx.fillStyle = "#4495cf";
                break;
        }
        ctx.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
    drawShading(){
        switch(this.type){
            case "plains":
                //ctx.globalCompositeOperation = "lighter";
                //ctx.fillStyle = `rgb(${(this.height - 40) / 4}, ${(this.height - 40) / 6}, ${(this.height - 40) / 6})`;
                break;
            case "forest_edge":
                break;
            case "forest":
                break;
            case "water":
                ctx.globalCompositeOperation = "lighter";
                ctx.fillStyle = `rgb(${this.height}, ${this.height}, ${this.height})`;
                break;
        }
        ctx.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.globalCompositeOperation = "source-over";
    }
    drawTree(type){
        this.feature = "tree";
        // var offsetX = Math.floor(Math.random() * ((TILE_SIZE / 5) * 2) + 1) - (TILE_SIZE / 5);
        // var offsetY = Math.floor(Math.random() * (TILE_SIZE / 5) * -2);
        var offsetX = 0;
        var offsetY = 0;
        switch(type){
            case "deciduous":
                ctx.fillStyle = "#503d28";
                ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 4) + (TILE_SIZE / 8) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY, TILE_SIZE / 4, TILE_SIZE / 2);
                // ctx.fillStyle = "#31691f";
                ctx.fillStyle = `rgb(${43 + Math.floor(Math.random() * 6)}, ${87 + Math.floor(Math.random() * 26)}, 31)`;
                ctx.beginPath();
                ctx.arc(((this.x * TILE_SIZE) + (TILE_SIZE / 2)) + offsetX, (this.y * TILE_SIZE) + offsetY, TILE_SIZE / 2, 0, 2 * Math.PI);
                ctx.fill();
                break;
            case "conifer":
                ctx.fillStyle = "#403121";
                ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 4) + (TILE_SIZE / 8) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY, TILE_SIZE / 4, TILE_SIZE / 2);
                // ctx.fillStyle = "#102e0e";
                ctx.fillStyle = `rgb(16, ${46 + Math.floor(Math.random() * 6)}, ${14 + Math.floor(Math.random() * 12)})`;
                ctx.beginPath();
                ctx.moveTo((this.x * TILE_SIZE) + offsetX, (this.y * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 4) + offsetY);
                ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) + offsetY);
                ctx.lineTo((this.x * TILE_SIZE) + TILE_SIZE + offsetX, (this.y * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 4) + offsetY);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo((this.x * TILE_SIZE) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2.25) + offsetY);
                ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) - (TILE_SIZE / 4) + offsetY);
                ctx.lineTo((this.x * TILE_SIZE) + TILE_SIZE + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2.25) + offsetY);
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo((this.x * TILE_SIZE) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 8) + offsetY);
                ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) - (TILE_SIZE / 2) + offsetY);
                ctx.lineTo((this.x * TILE_SIZE) + TILE_SIZE + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 8) + offsetY);
                ctx.fill();
                break;
            }
        }
    drawHouse(type){
        this.feature = "house";
        switch(type){
            case "thatch":
                break;
            case "wooden":
                // House Body
                let mainColor = ctx.fillStyle = `rgb(${offsetColor(92, 4)}, ${offsetColor(74, 4)}, ${offsetColor(48, 4)})`;
                ctx.fillRect(this.x * TILE_SIZE, (this.y * TILE_SIZE) + (TILE_SIZE / 2), TILE_SIZE, TILE_SIZE / 2);

                // House Roof
                ctx.fillStyle = `rgb(${offsetColor(77, 4)}, ${offsetColor(61, 4)}, ${offsetColor(39, 4)})`;
                ctx.beginPath();
                ctx.moveTo((this.x * TILE_SIZE) - (TILE_SIZE / 4), (this.y * TILE_SIZE) + (TILE_SIZE / 2));
                ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 2), this.y * TILE_SIZE);
                ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 4) + TILE_SIZE, (this.y * TILE_SIZE) + (TILE_SIZE / 2));
                ctx.fill();

                // House Gable
                ctx.fillStyle = mainColor;
                ctx.beginPath();
                ctx.moveTo((this.x * TILE_SIZE), (this.y * TILE_SIZE) + (TILE_SIZE / 2));
                ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 2), (this.y * TILE_SIZE) + (TILE_SIZE / 6));
                ctx.lineTo((this.x * TILE_SIZE) + TILE_SIZE, (this.y * TILE_SIZE) + (TILE_SIZE / 2));
                ctx.fill();

                // Doors and Windows
                ctx.fillStyle = "#493a26";
                switch(getRandomInt(0, 2)){
                    case 0:
                        ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 2.75), (this.y * TILE_SIZE) + (TILE_SIZE / 1.5) - (TILE_SIZE / 8), TILE_SIZE / 4, (TILE_SIZE / 3) + (TILE_SIZE / 8));  // door in the middle
                        break;
                    case 1:
                        ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 4), (this.y * TILE_SIZE) + (TILE_SIZE / 1.5) - (TILE_SIZE / 8), TILE_SIZE / 4, (TILE_SIZE / 3) + (TILE_SIZE / 8));  // door on the right
                        ctx.fillStyle = "#443623";
                        ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 1.55), (this.y * TILE_SIZE) + (TILE_SIZE / 1.66), TILE_SIZE / 5, TILE_SIZE / 5);
                        break;
                    case 2:
                        ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 2), (this.y * TILE_SIZE) + (TILE_SIZE / 1.5) - (TILE_SIZE / 8), TILE_SIZE / 4, (TILE_SIZE / 3) + (TILE_SIZE / 8));  // door on the left
                        ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 6.5), (this.y * TILE_SIZE) + (TILE_SIZE / 1.66), TILE_SIZE / 5, TILE_SIZE / 5);
                        break;
                }
                break;
            case "painted":
                break;
            default:
                break;
        }
    }
    generateForest(){
        if(this.feature == null){
            switch(this.type){
                case "plains":
                    if(Math.floor(Math.random() * 50) == 0){
                        switch(Math.floor(Math.random() * 2)){
                            case 0:
                                this.drawTree("deciduous");
                                break;
                            case 1:
                                this.drawTree("conifer");
                                break;
                        }
                    }
                    break;
                case "forest_edge":
                    if(Math.floor(Math.random() * 3) == 0){
                        switch(Math.floor(Math.random() * 2)){
                            case 0:
                                this.drawTree("deciduous");
                                break;
                            case 1:
                                this.drawTree("conifer");
                                break;
                        }
                    }
                    break;
                case "forest":
                    if(Math.floor(Math.random() * 5) != 0){
                        switch(Math.floor(Math.random() * 2)){
                            case 0:
                                this.drawTree("deciduous");
                                break;
                            case 1:
                                this.drawTree("conifer");
                                break;
                        }
                    }
                    break;
                default:
                    break;
            }
        }
    }
    generateStandaloneHouse(){
        if(this.feature != null){ return };
        switch(this.type){
            case "plains":
                if(Math.floor(Math.random() * 5000) == 0){
                    this.drawHouse("wooden");
                }
                break;
            case "forest_edge":
                if(Math.floor(Math.random() * 2500) == 0){
                    this.drawHouse("wooden");
                }
                break;
            case "forest":
                if(Math.floor(Math.random() * 500) == 0){
                    this.drawHouse("wooden");
                }
                break;
            default:
                break;
        }
    }
}

var mapTiles = Array.from({length: HEIGHT / TILE_SIZE});
for(var i = 0; i < mapTiles.length; i++){
    mapTiles[i] = Array.from({length: WIDTH / TILE_SIZE});
}

function getCursorLocation(event){
    if(event.clientX > WIDTH || event.clientY > HEIGHT) { return };
    var mouseX = Math.floor(((event.clientX / TILE_SIZE) * TILE_SIZE) / TILE_SIZE);
    var mouseY = Math.floor(((event.clientY / TILE_SIZE) * TILE_SIZE) / TILE_SIZE);
    console.log(mapTiles[mouseY][mouseX]);
}
window.addEventListener("click", getCursorLocation);

function createMapTemplate(){
    noise.seed(Math.random());
    for(var j = 0; j < mapTiles.length; j++){
        for(var i = 0; i < mapTiles[j].length; i++){
            mapTiles[j][i] = new Tile(i, j, null, null, null, null);
            mapTiles[j][i].setHeight(j, i);
            mapTiles[j][i].setTypeTopography();
        }
    }
}

createMapTemplate();

function createForestTemplate(){
    noise.seed(Math.random());
    for(var j = 0; j < mapTiles.length; j++){
        for(var i = 0; i < mapTiles[j].length; i++){
            mapTiles[j][i].setForestDensity(j, i);
            mapTiles[j][i].setTypeForest();
            mapTiles[j][i].drawTile();
            mapTiles[j][i].drawShading();
        }
    }
}

createForestTemplate();

function drawFeatures(){
    for(var j = 0; j < mapTiles.length; j++){
        for(var i = 0; i < mapTiles[j].length; i++){
            mapTiles[j][i].generateForest();
            mapTiles[j][i].generateStandaloneHouse();
        }
    }
}

function drawVillage(){
    const VILLAGE_RADIUS = getRandomInt(3, 5);

    var village_x = Math.floor(getRandomInt((TILE_SIZE * VILLAGE_RADIUS), WIDTH - (TILE_SIZE * VILLAGE_RADIUS)) / TILE_SIZE);
    var village_y = Math.floor(getRandomInt((TILE_SIZE * VILLAGE_RADIUS), HEIGHT - (TILE_SIZE * VILLAGE_RADIUS)) / TILE_SIZE);

    for(var j = 0; j < mapTiles.length; j++){
        for(var i = 0; i < mapTiles[j].length; i++){
            /*if(j == village_y && i == village_x){  // Center of village
                mapTiles[j][i].drawPerlinDebug();
            }*/
            if(j > village_y - VILLAGE_RADIUS && j < village_y + VILLAGE_RADIUS && i > village_x - VILLAGE_RADIUS && i < village_x + VILLAGE_RADIUS){
                if(Math.floor(Math.random() * 5) == 0){
                    if(mapTiles[j][i].type != "water" && mapTiles[j][i].feature == null){
                        mapTiles[j][i].drawHouse("wooden");
                    }
                }
            }
        }
    }
}

drawVillage();
drawFeatures();

function nextDay(){
    day++;
    weekday_number++;
    if(weekday_number == 8){ weekday_number = 1; }
    day_name = days[weekday_number - 1];

    if(day == 31 + 1){
        if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12){
            day = 1;
            if(month != 12){
                month++;
            } else{
                year++;
                month = 1;
            }
        }
    } else if(day == 30 + 1){
        if(month == 4 || month == 6 || month == 9 || month == 11){
            day = 1;
            month++;
        }
    } else if(month == 2){
        if((year % 4 == 0) && (year % 100 != 0) || (year % 400 == 0)){
            if(day == 29 + 1){
                day = 1;
                month++;
            }
        } else{
            if(day == 28 + 1){
                day = 1;
                month++;
            }
        }
    }
    month_name = months[month - 1];
}

function displayDate(){
    console.log(`${day}.${month}.${year}\n${day_name}, ${day} ${month_name} ${year}`);
}

document.addEventListener("keydown", function(event){
    if(event.key === " "){
        nextDay();
        displayDate();
    }
});

function callNextDay(){
    nextDay();
    displayDate();
}

displayDate();
//setInterval(callNextDay, 1000);