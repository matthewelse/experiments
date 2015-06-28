var grid = [];

$(function() {
    var canvas = $('#conway-canvas');
    canvas.width(window.innerWidth);
    canvas.height(window.innerHeight);

    paper.setup('conway-canvas');    

    for (var x = 0; x < paper.view.size.width/10; x++) {
        var row = [];
        for (var y = 0; y < paper.view.size.height/10; y++) {
            var rect = new paper.Rectangle(new paper.Point(10*x, 10*y), new paper.Size(10, 10));
            var path = new paper.Path.Rectangle(rect);
            if ((Math.abs(x) + Math.abs(y)) % 2 == 1)
                path.fillColor = '#aaa';
            else
                path.fillColor = '#bbb';

            path.oldColor = path.fillColor.clone();
            row.push(path);
        }
        grid.push(row);
    }

    var controls = {
        'play': false,
        'add': 'cell',
    }

    var gui = new dat.GUI();
    gui.add(controls, 'play');
    gui.add(controls, 'add', Object.keys(patterns));

    canvas.click(function(e) {
        var parentOffset = $(this).parent().offset();
        var x = Math.floor(e.pageX / 10);
        var y = Math.floor(e.pageY / 10);

        console.log(controls.add);

        add_pattern(grid, patterns[controls.add], x, y);
    });

    paper.view.onFrame = function(event) {
        if (controls.play) {
            for (var x = 0; x < paper.view.size.width/10; x++) {
                for (var y = 0; y < paper.view.size.height/10; y++) {
                    var neighbours = 0;
                    for (var dx = -1; dx <= 1; dx++) {
                        for (var dy = -1; dy <= 1; dy++) {
                            if ((dx == 0 && dy == 0) || x + dx < 0 || x + dx >= paper.view.size.width/10 || y + dy < 0 || y + dy >= paper.view.size.height/10)
                                continue
                            if (grid[x+dx][y+dy].oldColor.equals(new paper.Color(1,1,0)))
                                neighbours++;
                        }
                    }

                    if (grid[x][y].fillColor.equals(new paper.Color(1,1,0))) {
                        if (neighbours < 2 || neighbours > 3)
                            grid[x][y].fillColor = (Math.abs(x) + Math.abs(y)) % 2 == 1 ? '#aaa' : '#bbb';
                    } else {
                        if (neighbours == 3)
                            grid[x][y].fillColor = 'yellow';
                    }
                }
            }
            for (var x = 0; x < paper.view.size.width/10; x++) {
                for (var y = 0; y < paper.view.size.height/10; y++) {
                    grid[x][y].oldColor = grid[x][y].fillColor.clone();
                }
            }
        }
    }
});
