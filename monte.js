$(function() {
    var canvas = $('#experiment-canvas');
    canvas.width(window.innerWidth);
    canvas.height(window.innerHeight);

    paper.setup('experiment-canvas');

    // generate graphics

    var radius = 300;
    var radius_sq = radius * radius;

    var p_0 = new paper.Point(paper.view.center.x - radius, paper.view.center.y - radius);
    var p_1 = new paper.Point(paper.view.center.x + radius, paper.view.center.y + radius); 

    var square = new paper.Rectangle(p_0, p_1);
    var square_path = new paper.Path.Rectangle(square);
    square_path.strokeColor = 'black';

    var circle = new paper.Path.Circle(paper.view.center, radius);
    circle.strokeColor = 'blue';

    var inside = 0;
    var total = 0;

    paper.view.onFrame = function() {
        // add a new point

        var x = (Math.random() * radius * 2) - radius;
        var y = (Math.random() * radius * 2) - radius;

        var point = new paper.Path.Circle(new paper.Point(paper.view.center.x + x, paper.view.center.y + y), 2);

        if (x*x + y*y <= radius_sq) {
            inside += 1;
            point.fillColor = 'pink';
        }
        else
            point.fillColor = 'purple';

        total += 1;                

        // r = pi / 4
        if (total % 100 == 0)
            console.log(total, (inside/total)*4);
    };

});