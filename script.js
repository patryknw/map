/* TODO
 * village prosperity
 * different house variants based on the village's wealth (eg. white houses from Zalipie village)
 * zoom mechanic
 * land fertility mechanic
 * forest generation fully based on perlin
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const TILE_SIZE = 20;
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const seasons = {spring: "Spring", summer: "Summer", autumn: "Autumn", winter: "Winter"};

const startDate = {
    day: 1,
    month: 7,
    year: 1569,
    weekdayNumber: 5,
    season: "summer",
    isGregorian: false
};

let day = startDate.day;
let month = startDate.month;
let year = startDate.year;
let weekdayNumber = startDate.weekdayNumber;
let season = startDate.season;
let isGregorian = startDate.isGregorian;

let dayName = days[weekdayNumber - 1];
let monthName = months[month - 1];
let seasonName = seasons[startDate.season];

let springStart = 20;
let summerStart = 21;
let autumnStart = 23;
let winterStart = 21;

function getRandomInt(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function offsetNumber(color, offset){
    return getRandomInt(color - offset, color + offset);
}

function getRGBArray(color){
    return color.substring(4, color.length - 1).replace(/ /g, "").split(",");
}

function shiftChannel(tile, amount, channel, isTree){
    switch(channel){
        case "r":
            if(!isTree){
                var currentValue = parseInt(getRGBArray(tile.color)[0]);
                var startingValue = parseInt(getRGBArray(tile.startingColor)[0]);
                var targetValue = parseInt(getRGBArray(tile.targetColor)[0]);
            } else{
                var currentValue = parseInt(getRGBArray(tile.tree.leavesColor)[0]);
                var startingValue = parseInt(getRGBArray(tile.tree.leavesStartingColor)[0]);
                var targetValue = parseInt(getRGBArray(tile.tree.leavesTargetColor)[0]);
            }
            break;
        case "g":
            if(!isTree){
                var currentValue = parseInt(getRGBArray(tile.color)[1]);
                var startingValue = parseInt(getRGBArray(tile.startingColor)[1]);
                var targetValue = parseInt(getRGBArray(tile.targetColor)[1]);
            } else{
                var currentValue = parseInt(getRGBArray(tile.tree.leavesColor)[1]);
                var startingValue = parseInt(getRGBArray(tile.tree.leavesStartingColor)[1]);
                var targetValue = parseInt(getRGBArray(tile.tree.leavesTargetColor)[1]);
            }
            break;
        case "b":
            if(!isTree){
                var currentValue = parseInt(getRGBArray(tile.color)[2]);
                var startingValue = parseInt(getRGBArray(tile.startingColor)[2]);
                var targetValue = parseInt(getRGBArray(tile.targetColor)[2]);
            } else{
                var currentValue = parseInt(getRGBArray(tile.tree.leavesColor)[2]);
                var startingValue = parseInt(getRGBArray(tile.tree.leavesStartingColor)[2]);
                var targetValue = parseInt(getRGBArray(tile.tree.leavesTargetColor)[2]);
            }
            break;
        default:
            console.log("No channel given @ shiftChannel(tile, amount, channel)");
    }
    
    if(startingValue < targetValue){
        if(currentValue < targetValue){
            currentValue += amount;
        } else{
            currentValue = targetValue;
        }
    } else if(startingValue > targetValue){
        if(currentValue > targetValue){
            currentValue -= amount;
        } else{
            currentValue = targetValue;
        }
    }

    switch(channel){
        case "r":
            if(!isTree){
                tile.color = `rgb(${currentValue}, ${getRGBArray(tile.color)[1]}, ${getRGBArray(tile.color)[2]})`;
            } else{
                tile.tree.leavesColor = `rgb(${currentValue}, ${getRGBArray(tile.tree.leavesColor)[1]}, ${getRGBArray(tile.tree.leavesColor)[2]})`;
            }
            break;
        case "g":
            if(!isTree){
                tile.color = `rgb(${getRGBArray(tile.color)[0]}, ${currentValue}, ${getRGBArray(tile.color)[2]})`;
            } else{
                tile.tree.leavesColor = `rgb(${getRGBArray(tile.tree.leavesColor)[0]}, ${currentValue}, ${getRGBArray(tile.tree.leavesColor)[2]})`;
            }
            break;
        case "b":
            if(!isTree){
                tile.color = `rgb(${getRGBArray(tile.color)[0]}, ${getRGBArray(tile.color)[1]}, ${currentValue})`;
            } else{
                tile.tree.leavesColor = `rgb(${getRGBArray(tile.tree.leavesColor)[0]}, ${getRGBArray(tile.tree.leavesColor)[1]}, ${currentValue})`;
            }
            break;
        default:
            console.log("No channel given @ shiftChannel(tile, amount, channel)");
    }
}

function shiftTileColor(){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            if(mapTiles[j][i].type != "water"){
                shiftChannel(mapTiles[j][i], 2, "r", false);
                shiftChannel(mapTiles[j][i], 2, "g", false);
                shiftChannel(mapTiles[j][i], 2, "b", false);
            }
        }
    }
}

function shiftLeavesColor(){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            if(mapTiles[j][i].feature == "tree"){
                shiftChannel(mapTiles[j][i], 4, "r", true);
                shiftChannel(mapTiles[j][i], 4, "g", true);
                shiftChannel(mapTiles[j][i], 4, "b", true);
            }
        }
    }
}

function shiftColor(){
    shiftTileColor();
    shiftLeavesColor();
}

function assignStartingAndTargetColors(season){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            mapTiles[j][i].assignStartingColor(season);
            mapTiles[j][i].assignTargetColor(season);
            if(mapTiles[j][i].feature == "tree"){
                mapTiles[j][i].tree.assignLeavesStartingColor(season);
                mapTiles[j][i].tree.assignLeavesTargetColor(season);
            }
        }
    }
}

let randomTilesData = {checkedTiles: [], index: 0};
let randomTilesLeavesData = {checkedTiles: [], index: 0};

function getRandomTile(xMin, xMax, yMin, yMax, checkedTiles, index, updateLeaves){
    do{
        var randomX = getRandomInt(xMin, xMax);
        var randomY = getRandomInt(yMin, yMax);
    } while(checkedTiles.includes(mapTiles[randomY][randomX]));
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            if(j == randomY && i == randomX){
                checkedTiles[index] = mapTiles[j][i];
                index++;
                if(!updateLeaves){
                    randomTilesData.checkedTiles = checkedTiles;
                    randomTilesData.index = index;
                } else{
                    randomTilesLeavesData.checkedTiles = checkedTiles;
                    randomTilesLeavesData.index = index;
                }
                return mapTiles[j][i];
            }
        }
    }
}

function assignColorToRandomTiles(amount, season){
    for(let i = 0; i < amount; i++){
        if(randomTilesData.checkedTiles.length < ((WIDTH / TILE_SIZE) * (HEIGHT / TILE_SIZE))){
            let selectedTile = getRandomTile(0, (WIDTH / TILE_SIZE) - 1, 0, (HEIGHT / TILE_SIZE) - 1, randomTilesData.checkedTiles, randomTilesData.index, false);
            if(selectedTile.type != "water"){
                selectedTile.assignTargetColor(season);
                selectedTile.assignColor();
            }
        }
    }
}

function assignColorToRandomTrees(amount, season){
    for(let i = 0; i < amount; i++){
        if(randomTilesLeavesData.checkedTiles.length < ((WIDTH / TILE_SIZE) * (HEIGHT / TILE_SIZE))){
            let selectedTile = getRandomTile(0, (WIDTH / TILE_SIZE) - 1, 0, (HEIGHT / TILE_SIZE) - 1, randomTilesLeavesData.checkedTiles, randomTilesLeavesData.index, true);
            if(selectedTile.feature == "tree"){
                selectedTile.tree.assignLeavesTargetColor(season);
                selectedTile.tree.assignLeavesColor();
            }
        }
    }
}

function assignColorToWater(season){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            if(mapTiles[j][i].type == "water"){
                mapTiles[j][i].assignTargetColor(season);
                mapTiles[j][i].assignColor();
            }
        }
    }
}

// Creating empty map array
var mapTiles = Array.from({length: HEIGHT / TILE_SIZE});
for(let i = 0; i < mapTiles.length; i++){
    mapTiles[i] = Array.from({length: WIDTH / TILE_SIZE});
}

class Tree{
    constructor(type, leavesColor, leavesStartingColor, leavesTargetColor, trunkColor, hasLeaves){
        this.type = type;
        this.leavesColor = leavesColor;
        this.leavesStartingColor = leavesStartingColor;
        this.leavesTargetColor = leavesTargetColor;
        this.trunkColor = trunkColor;
        this.hasLeaves = hasLeaves;
    }
    assignType(){
        switch(getRandomInt(0, 1)){
            case 0:
                this.type = "deciduous";
                break;
            case 1:
                this.type = "conifer";
                break;
        }
    }
    assignLeavesColor(){
        this.leavesColor = this.leavesTargetColor;
    }
    assignLeavesStartingColor(){
        this.leavesStartingColor = this.leavesColor;
    }
    assignLeavesTargetColor(season){
        switch(season){
            case "spring":
                switch(this.type){
                    case "deciduous":
                        this.hasLeaves = true;
                        this.leavesTargetColor = `rgb(${offsetNumber(42, 6)}, ${offsetNumber(109, 6)}, 33)`;
                        break;
                    case "conifer":
                        this.leavesTargetColor = `rgb(${offsetNumber(16, 5)}, 49, ${offsetNumber(20, 6)})`;
                        break;
                }
                break;
            case "summer":
                switch(this.type){
                    case "deciduous":
                        this.hasLeaves = true;
                        this.leavesTargetColor = `rgb(${offsetNumber(54, 3)}, ${offsetNumber(104, 12)}, 31)`;
                        break;
                    case "conifer":
                        this.leavesTargetColor = `rgb(${offsetNumber(19, 8)}, 53, ${offsetNumber(18, 5)})`;
                        break;
                }
                break;
            case "autumn":
                switch(this.type){
                    case "deciduous":
                        this.hasLeaves = true;
                        switch(getRandomInt(0, 4)){
                            case 0:
                                this.leavesTargetColor = `rgb(${offsetNumber(155, 8)}, ${offsetNumber(149, 8)}, ${offsetNumber(34, 8)})`;
                                break;
                            case 1:
                                this.leavesTargetColor = `rgb(${offsetNumber(211, 2)}, ${offsetNumber(150, 2)}, ${offsetNumber(39, 2)})`;
                                break;
                            case 2:
                                this.leavesTargetColor = `rgb(${offsetNumber(198, 8)}, ${offsetNumber(118, 8)}, ${offsetNumber(14, 8)})`;
                                break;
                            case 3:
                                this.leavesTargetColor = `rgb(${offsetNumber(190, 8)}, ${offsetNumber(62, 8)}, ${offsetNumber(24, 8)})`;
                                break;
                            case 4:
                                this.leavesTargetColor = `rgb(${offsetNumber(164, 8)}, ${offsetNumber(37, 8)}, ${offsetNumber(22, 8)})`;
                                break;
                        }
                        break;
                    case "conifer":
                        this.leavesTargetColor = `rgb(${offsetNumber(25, 8)}, 50, ${offsetNumber(10, 5)})`;
                        break;
                }
                break;
            case "winter":
                switch(this.type){
                    case "deciduous":
                        this.hasLeaves = false;
                        break;
                    case "conifer":
                        this.leavesTargetColor = `rgb(${offsetNumber(21, 5)}, 49, ${offsetNumber(28, 6)})`;
                        break;
                }
                break;
        }
    }
    assignTrunkColor(){
        switch(this.type){
            case "deciduous":
                this.trunkColor = `rgb(${offsetNumber(80, 5)}, ${offsetNumber(61, 5)}, ${offsetNumber(40, 5)})`;
                break;
            case "conifer":
                this.trunkColor = `rgb(${offsetNumber(64, 5)}, ${offsetNumber(49, 5)}, ${offsetNumber(33, 5)})`;
                break;
        }
    }
}

class House{
    constructor(type, houseColor, roofColor, variant, inhabitants){
        this.type = type;
        this.houseColor = houseColor;
        this.roofColor = roofColor;
        this.variant = variant;
        this.inhabitants = inhabitants;
    }
    assignType(){
        this.type = "wooden";
    }
    assignColor(){
        this.houseColor = `rgb(${offsetNumber(92, 4)}, ${offsetNumber(74, 4)}, ${offsetNumber(48, 4)})`;
        this.roofColor = `rgb(${offsetNumber(77, 4)}, ${offsetNumber(61, 4)}, ${offsetNumber(39, 4)})`;
    }
    assignVariant(){
        switch(getRandomInt(0, 2)){
            case 0:
                this.variant = 0;
                break;
            case 1:
                this.variant = 1;
                break;
            case 2:
                this.variant = 2;
                break;
        }
    }
    setInhabitants(){
        this.inhabitants = getRandomInt(1, 7);
    }
}

class Village{
    constructor(name, prosperity, numberOfHouses, population, hasChurch, religion){
        this.name = name;
        this.prosperity = prosperity;
        this.numberOfHouses = numberOfHouses;
        this.population = population;
        this.hasChurch = hasChurch;
        this.religion = religion;
    }
    setName(){
        switch(getRandomInt(0, 3)){
            case 0:
                this.name = "Lindenvale";
                break;
            case 1:
                this.name = "Upper Heather";
                break;
            case 2:
                this.name = "Applebough";
                break;
            case 3:
                this.name = "Claywich";
                break;
        }
    }
    setProsperity(){
        this.prosperity = getRandomInt(1, 10);
    }
    setNumberOfHouses(){
        this.numberOfHouses = getRandomInt(4, 20);
    }
    setChurch(){
        getRandomInt(0, 1) ? this.hasChurch = true : this.hasChurch = false;
    }
    setReligion(){
        getRandomInt(0, 1) ? this.religion = "catholicism" : this.religion = "orthodoxy";
    }
}

class Tile{
    constructor(x, y, type, height, forestDensity, color, startingColor, targetColor, feature, tree, house){
        this.x = x;
        this.y = y;
        this.type = type;
        this.height = height;
        this.forestDensity = forestDensity;
        this.color = color;
        this.startingColor = startingColor;
        this.targetColor = targetColor;
        this.feature = feature;
        this.tree = tree;
        this.house = house;
    }
    setHeight(x, y){
        this.height = Math.floor(Math.abs(noise.perlin2(x / 50, y / 50)) * 256)  // 50 being scale for perlin noise
    }
    setForestDensity(x, y){
        this.forestDensity = Math.floor(Math.abs(noise.perlin2(x / 50, y / 50)) * 256)  // 50 being scale for perlin noise
    }
    drawDebug(color){
        ctx.fillStyle = color;
        ctx.fillRect(this.x * TILE_SIZE, this.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
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
        if(this.type == "water") return;
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
    assignColor(){
        this.color = this.targetColor;
    }
    assignStartingColor(){
        this.startingColor = this.color;
    }
    assignTargetColor(season){
        switch(season){
            case "spring":
                switch(this.type){
                    case "plains":
                        this.targetColor = `rgb(52, ${offsetNumber(140, 3)}, 49)`;
                        break;
                    case "forest_edge":
                        this.targetColor = `rgb(47, ${offsetNumber(131, 4)}, 43)`;
                        break;
                    case "forest":
                        this.targetColor = `rgb(42, ${offsetNumber(124, 5)}, 39)`;
                        break;
                    case "water":
                        this.targetColor = "#4495cf";
                        break;
                }
                break;
            case "summer":
                switch(this.type){
                    case "plains":
                        this.targetColor = `rgb(67, ${offsetNumber(140, 3)}, 49)`;
                        break;
                    case "forest_edge":
                        this.targetColor = `rgb(61, ${offsetNumber(131, 4)}, 43)`;
                        break;
                    case "forest":
                        this.targetColor = `rgb(56, ${offsetNumber(123, 5)}, 38)`;
                        break;
                    case "water":
                        this.targetColor = "#4495cf";
                        break;
                }
                break;
            case "autumn":
                switch(this.type){
                    case "plains":
                        this.targetColor = `rgb(104, ${offsetNumber(131, 3)}, 38)`;
                        break;
                    case "forest_edge":
                        this.targetColor = `rgb(${offsetNumber(99, 3)}, ${offsetNumber(122, 3)}, ${offsetNumber(32, 3)})`;
                        break;
                    case "forest":
                        this.targetColor = `rgb(${offsetNumber(97, 5)}, ${offsetNumber(117, 5)}, ${offsetNumber(24, 5)})`;
                        break;
                    case "water":
                        this.targetColor = "#4495cf";
                        break;
                }
                break;
            case "winter":
                switch(this.type){
                    case "plains":
                        var snowColor = offsetNumber(242, 2);
                        this.targetColor = `rgb(${snowColor}, ${snowColor}, ${snowColor})`;
                        break;
                    case "forest_edge":
                        var snowColor = offsetNumber(239, 2);
                        this.targetColor = `rgb(${snowColor}, ${snowColor}, ${snowColor})`;
                        break;
                    case "forest":
                        var snowColor = offsetNumber(235, 3);
                        this.targetColor = `rgb(${snowColor}, ${snowColor}, ${snowColor})`;
                        break;
                    case "water":
                        this.targetColor = `rgb(${offsetNumber(219, 2)}, ${offsetNumber(241, 2)}, ${offsetNumber(253, 2)})`;
                        break;
                }
                break;
            default:
                console.log("No season found @ assignTargetColor(season)!");
                break;
        }
    }
    drawTile(){
        ctx.fillStyle = this.color;
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
    drawTree(treeType, leavesColor, trunkColor, hasLeaves){
        this.feature = "tree";
        // let offsetX = Math.floor(Math.random() * ((TILE_SIZE / 5) * 2) + 1) - (TILE_SIZE / 5);
        // let offsetY = Math.floor(Math.random() * (TILE_SIZE / 5) * -2);
        let offsetX = 0;
        let offsetY = 0;
        switch(treeType){
            case "deciduous":
                // Trunk
                ctx.fillStyle = trunkColor;
                ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 4) + (TILE_SIZE / 8) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 8) + offsetY, TILE_SIZE / 4, (TILE_SIZE / 2) + (TILE_SIZE / 8));

                // Leaves
                if(hasLeaves){
                    ctx.fillStyle = leavesColor;
                    ctx.beginPath();
                    ctx.arc(((this.x * TILE_SIZE) + (TILE_SIZE / 2)) + offsetX, (this.y * TILE_SIZE) + offsetY, TILE_SIZE / 2, 0, 2 * Math.PI);
                    ctx.fill();
                } else{
                    ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 4) + (TILE_SIZE / 16) + (TILE_SIZE / 8) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 2) + offsetY, (TILE_SIZE / 4) - (TILE_SIZE / 8), (TILE_SIZE / 2) + (TILE_SIZE / 2));
                    ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 8) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 6) + offsetY, TILE_SIZE - (TILE_SIZE / 8) - (TILE_SIZE / 8), (TILE_SIZE / 8));
                    ctx.strokeStyle = trunkColor;
                    ctx.lineWidth = Math.floor(TILE_SIZE / 10);
                    ctx.beginPath();
                    ctx.moveTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY);
                    ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 6) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 5) + offsetY);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY);
                    ctx.lineTo((this.x * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 6) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 5) + offsetY);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY);
                    ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 6) + (TILE_SIZE / 8) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 18) + offsetY);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY);
                    ctx.lineTo((this.x * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 6) - (TILE_SIZE / 8) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 18) + offsetY);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 8) + offsetY);
                    ctx.lineTo((this.x * TILE_SIZE) + (TILE_SIZE / 5) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + (TILE_SIZE / 12) + offsetY);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo((this.x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 8) + offsetY);
                    ctx.lineTo((this.x * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 5) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + (TILE_SIZE / 12) + offsetY);
                    ctx.stroke();
                }
                break;
            case "conifer":
                // Trunk
                ctx.fillStyle = trunkColor;
                ctx.fillRect((this.x * TILE_SIZE) + (TILE_SIZE / 4) + (TILE_SIZE / 8) + offsetX, (this.y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY, TILE_SIZE / 4, TILE_SIZE / 2);

                // Needles
                ctx.fillStyle = leavesColor;
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
    drawHouse(houseType, houseColor, roofColor, houseVariant){
        this.feature = "house";
        switch(houseType){
            case "thatch":
                break;
            case "wooden":
                // House Body
                let mainColor = houseColor;
                ctx.fillStyle = mainColor;
                ctx.fillRect(this.x * TILE_SIZE, (this.y * TILE_SIZE) + (TILE_SIZE / 2), TILE_SIZE, TILE_SIZE / 2);

                // House Roof
                ctx.fillStyle = roofColor;
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
                switch(houseVariant){
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
                        ctx.fillStyle = "#443623";
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
}

function getCursorLocation(event){
    if(event.clientX > WIDTH || event.clientY > HEIGHT) return;
    let mouseX = Math.floor(((event.clientX / TILE_SIZE) * TILE_SIZE) / TILE_SIZE);
    let mouseY = Math.floor(((event.clientY / TILE_SIZE) * TILE_SIZE) / TILE_SIZE);
    console.log(mapTiles[mouseY][mouseX]);
}
window.addEventListener("click", getCursorLocation);

function createMapTemplate(){
    noise.seed(Math.random());
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            mapTiles[j][i] = new Tile(i, j, null, null, null, null, null, null, null, null, null);
            mapTiles[j][i].setHeight(j, i);
            mapTiles[j][i].setTypeTopography();
        }
    }
}

function createForestTemplate(){
    noise.seed(Math.random());
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            mapTiles[j][i].setForestDensity(j, i);
            mapTiles[j][i].setTypeForest();
            mapTiles[j][i].assignTargetColor(season);
            mapTiles[j][i].assignColor();
        }
    }
}

function drawFinalTile(){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            mapTiles[j][i].drawTile();
            mapTiles[j][i].drawShading();
        }
    }
}

function handleAutumnWinterColors(){
    switch(month){
        case 10:
            if(day == 21) randomTilesLeavesData = {checkedTiles: [], index: 0};  // reseting random leaves data
            if(day > 21) assignColorToRandomTrees(140, "winter");  // start of leaves falling
            break;
        case 11:
            if(day < 21) assignColorToRandomTrees(140, "winter");  // end of leaves falling

            if(day == 18) randomTilesData = {checkedTiles: [], index: 0};  // reseting random tiles data
            else if(day > 18) assignColorToRandomTiles(180, "winter");  // start of snowfall
            break;
        case 12:
            if(day == 3) assignColorToWater("winter");  // water freezes

            if(day < 18) assignColorToRandomTiles(180, "winter");  // end of snowfall
            break;
    }
}

function handleWinterSpringColors(){
    switch(month){
        case 3:
            if(day == 14) randomTilesData = {checkedTiles: [], index: 0};  // reseting random tiles data
            if(day > 14) assignColorToRandomTiles(180, "spring");  // start of snow melting

            if(day == 18) assignColorToWater("spring");  // water unfreezes

            if(day == 24) randomTilesLeavesData = {checkedTiles: [], index: 0};  // reseting random leaves data
            if(day > 24) assignColorToRandomTrees(140, "spring");  // start of leaves growing
            break;
        case 4:
            if(day < 7) assignColorToRandomTiles(180, "spring");  // snow melts completely
            if(day < 21) assignColorToRandomTrees(140, "spring");  // end of leaves growing
            break;
    }
}

function handleSpringSummerColors(){
    switch(month){
        case 6:
            if(day == 21) assignStartingAndTargetColors("summer");  // assigning season colors
            if(day > 21) shiftColor();  // start of summer color change
            break;
        case 7:
            if(year != startDate.year){  // start date related (temporary)
                if(day < 21) shiftColor();  // end of summer color change
            }
            break;
    }
}

function handleSummerAutumnColors(){
    switch(month){
        case 9:
            if(day == 7) assignStartingAndTargetColors("autumn");  // assigning season colors
            if(day > 7) shiftColor();  // start of autumn color change
            break;
        case 10:
            if(day < 21) shiftColor();  // end of autumn color change
            break;
    }
}

function updateSeasonColor(){
    handleAutumnWinterColors();
    handleWinterSpringColors();
    handleSpringSummerColors();
    handleSummerAutumnColors();
}

function generateForest(){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            if(mapTiles[j][i].feature == null){
                switch(mapTiles[j][i].type){
                    case "plains":
                        if(getRandomInt(0, 50) == 0){
                            mapTiles[j][i].feature = "tree";
                            mapTiles[j][i].tree = new Tree(null, null, null);
                            mapTiles[j][i].tree.assignType();
                            mapTiles[j][i].tree.assignLeavesTargetColor(season);
                            mapTiles[j][i].tree.assignLeavesColor();
                            mapTiles[j][i].tree.assignTrunkColor();
                        }
                        break;
                    case "forest_edge":
                        if(getRandomInt(0, 2) == 0){
                            mapTiles[j][i].feature = "tree";
                            mapTiles[j][i].tree = new Tree(null, null, null);
                            mapTiles[j][i].tree.assignType();
                            mapTiles[j][i].tree.assignLeavesTargetColor(season);
                            mapTiles[j][i].tree.assignLeavesColor();
                            mapTiles[j][i].tree.assignTrunkColor();
                        }
                        break;
                    case "forest":
                        if(getRandomInt(0, 4) != 0){
                            mapTiles[j][i].feature = "tree";
                            mapTiles[j][i].tree = new Tree(null, null, null);
                            mapTiles[j][i].tree.assignType();
                            mapTiles[j][i].tree.assignLeavesTargetColor(season);
                            mapTiles[j][i].tree.assignLeavesColor();
                            mapTiles[j][i].tree.assignTrunkColor();
                        }
                        break;
                    case "water":
                        break;
                    default:
                        console.log("No biome given @ generateForest()");
                        break;
                }
            }
        }
    }
}

function drawForest(){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            if(mapTiles[j][i].feature == "tree"){
                switch(getRandomInt(0, 1)){
                    case 0:
                        mapTiles[j][i].drawTree(mapTiles[j][i].tree.type, mapTiles[j][i].tree.leavesColor, mapTiles[j][i].tree.trunkColor, mapTiles[j][i].tree.hasLeaves);
                        break;
                    case 1:
                        mapTiles[j][i].drawTree(mapTiles[j][i].tree.type, mapTiles[j][i].tree.leavesColor, mapTiles[j][i].tree.trunkColor, mapTiles[j][i].tree.hasLeaves);
                        break;
                }
            }
        }
    }
}

function generateStandaloneHouse(){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            if(mapTiles[j][i].feature == null){
                switch(mapTiles[j][i].type){
                    case "plains":
                        if(getRandomInt(0, 5000) == 0){
                            mapTiles[j][i].feature = "house";
                            mapTiles[j][i].house = new House(null, null, null, null, null);
                            mapTiles[j][i].house.assignType();
                            mapTiles[j][i].house.assignColor();
                            mapTiles[j][i].house.assignVariant();
                            mapTiles[j][i].house.setInhabitants();
                        }
                        break;
                    case "forest_edge":
                        if(getRandomInt(0, 2500) == 0){
                            mapTiles[j][i].feature = "house";
                            mapTiles[j][i].house = new House(null, null, null, null, null);
                            mapTiles[j][i].house.assignType();
                            mapTiles[j][i].house.assignColor();
                            mapTiles[j][i].house.assignVariant();
                            mapTiles[j][i].house.setInhabitants();
                        }
                        break;
                    case "forest":
                        if(getRandomInt(0, 1000) == 0){
                            mapTiles[j][i].feature = "house";
                            mapTiles[j][i].house = new House(null, null, null, null, null);
                            mapTiles[j][i].house.assignType();
                            mapTiles[j][i].house.assignColor();
                            mapTiles[j][i].house.assignVariant();
                            mapTiles[j][i].house.setInhabitants();
                        }
                        break;
                    case "water":
                        break;
                    default:
                        console.log("No biome given @ generateStandaloneHouse()");
                        break;
                }
            }
        }
    }
}

function generateVillage(){
    const VILLAGE_RADIUS = getRandomInt(3, 5);

    let villageX = Math.floor(getRandomInt((TILE_SIZE * VILLAGE_RADIUS), WIDTH - (TILE_SIZE * VILLAGE_RADIUS)) / TILE_SIZE);
    let villageY = Math.floor(getRandomInt((TILE_SIZE * VILLAGE_RADIUS), HEIGHT - (TILE_SIZE * VILLAGE_RADIUS)) / TILE_SIZE);

    mapTiles[villageY][villageX].feature = new Village(null, null, null, null, null, null);
    mapTiles[villageY][villageX].feature.setName();
    mapTiles[villageY][villageX].feature.setProsperity();
    mapTiles[villageY][villageX].feature.setNumberOfHouses();
    mapTiles[villageY][villageX].feature.setReligion();
    mapTiles[villageY][villageX].feature.setChurch();
    mapTiles[villageY][villageX].drawDebug("#00ffff");

    let houseCount = 0;
    let inhabitantsCount = 0;

    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            /*if(j == villageY && i == villageX){  // Center of village
                mapTiles[j][i].drawDebug("#00ffff");
            }*/
            if(j > villageY - VILLAGE_RADIUS && j < villageY + VILLAGE_RADIUS && i > villageX - VILLAGE_RADIUS && i < villageX + VILLAGE_RADIUS){
                if(getRandomInt(0, 4) == 0 && houseCount < mapTiles[villageY][villageX].feature.numberOfHouses){
                    if(mapTiles[j][i].type != "water" && mapTiles[j][i].feature == null){
                        mapTiles[j][i].feature = "house";
                        mapTiles[j][i].house = new House(null, null, null, null, null);
                        mapTiles[j][i].house.assignType();
                        mapTiles[j][i].house.assignColor();
                        mapTiles[j][i].house.assignVariant();
                        mapTiles[j][i].house.setInhabitants();
                        inhabitantsCount += mapTiles[j][i].house.inhabitants;
                        houseCount++;
                    }
                }
            }
        }
    }
    mapTiles[villageY][villageX].feature.population = inhabitantsCount;
    mapTiles[villageY][villageX].feature.numberOfHouses = houseCount;
}

function drawHouses(){
    for(let j = 0; j < mapTiles.length; j++){
        for(let i = 0; i < mapTiles[j].length; i++){
            if(mapTiles[j][i].feature == "house"){
                mapTiles[j][i].drawHouse(mapTiles[j][i].house.type, mapTiles[j][i].house.houseColor, mapTiles[j][i].house.roofColor, mapTiles[j][i].house.variant);
            }
        }
    }
}

function nextDay(){
    day++;
    weekdayNumber++;
    if(weekdayNumber == 8) weekdayNumber = 1;
    dayName = days[weekdayNumber - 1];

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
        if(isGregorian){
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
        } else{
            if(year % 4 == 0){
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
    }

    switch(month){
        case 3:
            if(day == springStart){
                season = "spring";
                seasonName = seasons.spring;
            }
            break;
        case 6:
            if(day == summerStart){
                season = "summer";
                seasonName = seasons.summer;
            }
            break;
        case 9:
            if(day == autumnStart){
                season = "autumn";
                seasonName = seasons.autumn;
            }
            break;
        case 12:
            if(day == winterStart){
                season = "winter";
                seasonName = seasons.winter;
            }
            break;
    }

    if(year == 1582 && month == 10 && day == (4 + 1)){
        day = 15;
        isGregorian = true;
    }
    monthName = months[month - 1];
}

function displayDate(inConsole, onScreen){
    if(inConsole) console.log(`${day}.${month}.${year}\n${seasonName}\n${dayName}, ${day} ${monthName} ${year}`);
    if(onScreen){
        ctx.fillStyle = "#000000";
        ctx.font = `bold ${Math.floor(WIDTH / 66)}px Pristina`;
        ctx.textAlign = "center";
        ctx.fillText(`${seasonName}`, WIDTH / 2, HEIGHT / 20);
        ctx.fillText(`${dayName}, ${day} ${monthName} ${year}`, WIDTH / 2, HEIGHT / 11);
        //ctx.fillText(`${day} ${monthName} ${year}`, WIDTH / 2, HEIGHT / 11);
        //ctx.fillText(`${dayName}`, WIDTH / 2, HEIGHT / 8);
    }
}

function init(){
    createMapTemplate();
    createForestTemplate();
    drawFinalTile();
    generateStandaloneHouse();
    generateVillage();
    generateForest();
    drawHouses();
    drawForest();
    displayDate(true, true);
}
init();

function update(){
    nextDay();
    updateSeasonColor();
    drawFinalTile();
    drawHouses();
    drawForest();
    displayDate(true, true);
    console.log(updateTickSpeed);
}

// User input
function fastForwardTime(event){
    if(event.key === "Enter" && isPaused){
        update();
    }
}
document.addEventListener("keydown", fastForwardTime);

function changeTimeSped(event){
    if(event.deltaY > 0 && updateTickSpeed < 2000){
        clearInterval(updateInterval);
        updateTickSpeed += 100;
        updateInterval = setInterval(update, updateTickSpeed);
    } else if(event.deltaY < 0 && updateTickSpeed > 100){
        clearInterval(updateInterval);
        updateTickSpeed -= 100;
        updateInterval = setInterval(update, updateTickSpeed);
    }
}
let updateTickSpeed = 1000;
document.addEventListener("wheel", changeTimeSped);

function toggleTime(event){
    if(event.key === " "){
        if(isPaused){
            isPaused = false;
            update();
            updateInterval = setInterval(update, updateTickSpeed);
        } else{
            isPaused = true;
            clearInterval(updateInterval);
        }
    }
}
let isPaused = true;
document.addEventListener("keyup", toggleTime);
