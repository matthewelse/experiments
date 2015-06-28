var patterns = {
    cell: ['O'],
    coeship: ["....OOOOOO",
        "..OO.....O",
        "OO.O.....O",
        "....O...O",
        "......O",
        "......OO",
        ".....OOOO",
        ".....OO.OO",
        ".......OO"],
    hivenudger: ["OOOO.....O..O",
        "O...O...O",
        "O.......O...O",
        ".O..O...OOOO",
        "",
        ".....OO",
        ".....OO",
        ".....OO",
        "",
        ".O..O...OOOO",
        "O.......O...O",
        "O...O...O",
        "OOOO.....O..O"],
    hammerhead: ["OOOOO",
        "O....O.......OO",
        "O...........OO.OOO",
        ".O.........OO.OOOO",
        "...OO...OO.OO..OO",
        ".....O....O..O",
        "......O.O.O.O",
        ".......O",
        ".......O",
        "......O.O.O.O",
        ".....O....O..O",
        "...OO...OO.OO..OO",
        ".O.........OO.OOOO",
        "O...........OO.OOO",
        "O....O.......OO",
        "OOOOO"],
    lightweight_spaceship: [".O..O",
        "O",
        "O...O",
        "OOOO"],
    heavyweight_spaceship: ["...OO",
        ".O....O",
        "O",
        "O.....O",
        "OOOOOO"],
    canada_goose: ["OOO",
        "O.........OO",
        ".O......OOO.O",
        "...OO..OO",
        "....O",
        "........O",
        "....OO...O",
        "...O.O.OO",
        "...O.O..O.OO",
        "..O....OO",
        "..OO",
        "..OO"],
    dragon: ["............O",
        "............OO..............O",
        "..........O.OO.....O.O....OO",
        ".....O...O...OOO..O....O",
        "OO...O..O......O.O.....OOO..O",
        "OO...O.OO......O...O.O.O",
        "OO...O..........O.O.......OO",
        ".....OO..............O......O",
        ".......O............O.O",
        ".......O............O.O",
        ".....OO..............O......O",
        "OO...O..........O.O.......OO",
        "OO...O.OO......O...O.O.O",
        "OO...O..O......O.O.....OOO..O",
        ".....O...O...OOO..O....O",
        "..........O.OO.....O.O....OO",
        "............OO..............O",
        "............O"]
}

function add_pattern(grid, pattern, x, y) {
    var height = pattern.length;
    var width = Math.max.apply(Math,pattern.map(function(line) {
        return line.length;
    }));

    var grid_height = grid[0].length;
    var grid_width = grid.length;

    if (height + y > grid_height || width + x > grid_width) {
        console.warn('Can\'t place something here.');
        return;
    }

    for (var dy = 0; dy < height; dy++) {
        for (var dx = 0; dx < width; dx++) {
            if (dx < pattern[dy].length) {
                if (pattern[dy].charAt(dx) == 'O')
                    grid[x + dx][y + dy].fillColor = 'yellow';
                else if ((Math.abs(x+dx) + Math.abs(y+dy)) % 2 == 1)
                    grid[x + dx][y + dy].fillColor = '#aaa';
                else
                    grid[x + dx][y + dy].fillColor = '#bbb';

                grid[x+dx][y+dy].oldColor = grid[x+dx][y+dy].fillColor.clone();
            }
        }
    }
}

function clear_grid(grid) {
    for (var x = 0; x < grid.length; x++) {
        for (var y = 0; y < grid[x].length; y++) {
            if ((Math.abs(x) + Math.abs(y)) % 2 == 1)
                grid[x][y].fillColor = '#aaa';
            else
                grid[x][y].fillColor = '#bbb';

            grid[x][y].oldColor = grid[x][y].fillColor.clone();
        }
    }
}
