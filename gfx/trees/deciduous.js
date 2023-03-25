function gfxTreeDeciduous(ctx, x, y, TILE_SIZE, leavesColor, trunkColor, hasLeaves, offsetX, offsetY){
    // Trunk
    ctx.fillStyle = trunkColor;
    ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 4) + (TILE_SIZE / 8) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 8) + offsetY, TILE_SIZE / 4, (TILE_SIZE / 2) + (TILE_SIZE / 8));

    // Leaves
    if(hasLeaves){
        ctx.fillStyle = leavesColor;
        ctx.beginPath();
        ctx.arc(((x * TILE_SIZE) + (TILE_SIZE / 2)) + offsetX, (y * TILE_SIZE) + offsetY, TILE_SIZE / 2, 0, 2 * Math.PI);
        ctx.fill();
    } else{
        ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 4) + (TILE_SIZE / 16) + (TILE_SIZE / 8) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 2) + offsetY, (TILE_SIZE / 4) - (TILE_SIZE / 8), (TILE_SIZE / 2) + (TILE_SIZE / 2));
        ctx.fillRect((x * TILE_SIZE) + (TILE_SIZE / 8) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 6) + offsetY, TILE_SIZE - (TILE_SIZE / 8) - (TILE_SIZE / 8), (TILE_SIZE / 8));
        ctx.strokeStyle = trunkColor;
        ctx.lineWidth = Math.floor(TILE_SIZE / 10);
        ctx.beginPath();
        ctx.moveTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY);
        ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 6) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 5) + offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY);
        ctx.lineTo((x * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 6) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 5) + offsetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY);
        ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 6) + (TILE_SIZE / 8) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 18) + offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) + offsetY);
        ctx.lineTo((x * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 6) - (TILE_SIZE / 8) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 18) + offsetY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 8) + offsetY);
        ctx.lineTo((x * TILE_SIZE) + (TILE_SIZE / 5) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) + (TILE_SIZE / 12) + offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo((x * TILE_SIZE) + (TILE_SIZE / 2) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) - (TILE_SIZE / 8) + offsetY);
        ctx.lineTo((x * TILE_SIZE) + TILE_SIZE - (TILE_SIZE / 5) + offsetX, (y * TILE_SIZE) + (TILE_SIZE / 2) + (TILE_SIZE / 12) + offsetY);
        ctx.stroke();
    }
}
