function gfxTreeConifer(ctx, x, y, TILE_SIZE, leavesColor, trunkColor, offsetX, offsetY){
    // Trunk
    ctx.fillStyle = trunkColor;
    ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 4) + (TILE_SIZE / 8) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY, TILE_SIZE / 4, TILE_SIZE / 2);

    // Needles
    ctx.fillStyle = leavesColor;
    ctx.beginPath();
    ctx.moveTo((x * TILE_SIZE) + offsetX, (y * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 4) + offsetY);
    ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) + offsetY);
    ctx.lineTo((x * TILE_SIZE) + TILE_SIZE + offsetX, (y * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 4) + offsetY);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo((x * TILE_SIZE) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2.25) + offsetY);
    ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) - (TILE_SIZE / 4) + offsetY);
    ctx.lineTo((x * TILE_SIZE) + TILE_SIZE + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2.25) + offsetY);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo((x * TILE_SIZE) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 8) + offsetY);
    ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) - (TILE_SIZE / 2) + offsetY);
    ctx.lineTo((x * TILE_SIZE) + TILE_SIZE + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 8) + offsetY);
    ctx.fill();
}
