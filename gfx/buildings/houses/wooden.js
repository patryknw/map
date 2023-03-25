function gfxHouseWooden(ctx, x, y, TILE_SIZE, houseColor, roofColor, houseVariant){
    // House Body
    let mainColor = houseColor;
    ctx.fillStyle = mainColor;
    ctx.fillRect(x * TILE_SIZE, (y * TILE_SIZE) + (TILE_SIZE / 2), TILE_SIZE, TILE_SIZE / 2);

    // House Roof
    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo((x * TILE_SIZE) - (TILE_SIZE / 4), (y * TILE_SIZE) + (TILE_SIZE / 2));
    ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 2), y * TILE_SIZE);
    ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 4) + TILE_SIZE, (y * TILE_SIZE) + (TILE_SIZE / 2));
    ctx.fill();

    // House Gable
    ctx.fillStyle = mainColor;
    ctx.beginPath();
    ctx.moveTo((x * TILE_SIZE), (y * TILE_SIZE) + (TILE_SIZE / 2));
    ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 2), (y * TILE_SIZE) + (TILE_SIZE / 6));
    ctx.lineTo((x * TILE_SIZE) + TILE_SIZE, (y * TILE_SIZE) + (TILE_SIZE / 2));
    ctx.fill();

    // Doors and Windows
    ctx.fillStyle = "#493a26";
    switch(houseVariant){
        case 0:
            ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 2.75), (y * TILE_SIZE) + (TILE_SIZE / 1.5) - (TILE_SIZE / 8), TILE_SIZE / 4, (TILE_SIZE / 3) + (TILE_SIZE / 8));  // door in the middle
            break;
        case 1:
            ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 4), (y * TILE_SIZE) + (TILE_SIZE / 1.5) - (TILE_SIZE / 8), TILE_SIZE / 4, (TILE_SIZE / 3) + (TILE_SIZE / 8));  // door on the right
            ctx.fillStyle = "#443623";
            ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 1.55), (y * TILE_SIZE) + (TILE_SIZE / 1.66), TILE_SIZE / 5, TILE_SIZE / 5);
            break;
        case 2:
            ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 2), (y * TILE_SIZE) + (TILE_SIZE / 1.5) - (TILE_SIZE / 8), TILE_SIZE / 4, (TILE_SIZE / 3) + (TILE_SIZE / 8));  // door on the left
            ctx.fillStyle = "#443623";
            ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 6.5), (y * TILE_SIZE) + (TILE_SIZE / 1.66), TILE_SIZE / 5, TILE_SIZE / 5);
            break;
    }
}
