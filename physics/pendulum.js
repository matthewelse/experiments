$(function() {
    var canvas = $('#physics-canvas');
    canvas.width(window.innerWidth);
    canvas.height(window.innerHeight);

    paper.setup('physics-canvas');

    var particle_position = new Victor(paper.view.center.x, paper.view.center.y + 200);
    particle_position.l = 200;
    var particle_velocity = new Victor(-400, 0);
    var particle_size = new Victor(10, 10);
    var pivot_position = new Victor(paper.view.center.x, paper.view.center.y);
    var bounds = new Victor(paper.view.size.width, paper.view.size.height);

    var bob = new Particle(particle_position, particle_velocity, particle_size, bounds, 1, 1);

    var string = new paper.Path();
    string.strokeColor = 'black';
    string.add(new paper.Point(pivot_position.x, pivot_position.y));
    string.add(new paper.Point(particle_position.x, particle_position.y));

    bob.add_force(function(particle) {
        return new Victor(0, 9800*particle.mass);
    });

    bob.add_force(function(particle) {
        var line = particle.position.clone().subtract(pivot_position);
        var theta = line.verticalAngle();
        
        var t = particle.mass * (particle.velocity.lengthSq() / bob.position.clone().subtract(pivot_position).length() + 9800*Math.cos(theta));
        var T = new Victor(-t*Math.sin(theta), -t*Math.cos(theta));

        return T;
    });

    var ball = new paper.Path.Circle({
        center: paper.view.center,
        radius: 10,
        fillColor: 'red'
    });

    var pivot = new paper.Path.Circle({
        center: new paper.Point(pivot_position.x, pivot_position.y),
        radius: 5,
        fillColor: 'green'
    });

    var trace = new paper.Path({
        strokeColor: [0.8],
        strokeWidth: 2,
        strokeCap: 'square'
    });

    var gui = new dat.GUI();
    //gui.add(bob, 'mass');
    var trace_picker = gui.add(bob, 'trace_path')
    var string_length = gui.add(particle_position, 'l', 1, paper.view.center.y - particle_size.y).listen();

    trace_picker.onChange(function() {
        trace.segments = [];
    });

    string_length.onChange(function(value) {
        bob.position.y = pivot_position.y + value;
        bob.position.x = pivot_position.x;
        
        bob.velocity = new Victor(-100, 0);
    });

    canvas.click(function(e) {
        var new_vector = new Victor(e.pageX, e.pageY);

        if (new_vector.clone().subtract(pivot_position).length() <= paper.view.center.y - particle_size.y/2) {
            bob.position = new_vector;

            bob.velocity = new Victor(0, 0);
            particle_position.l = bob.position.clone().subtract(pivot_position).length();
        }
    });

    paper.view.onFrame = function(event) {
        ball.fillColor.hue += 1;

        if (bob.trace_path)
            trace.add(new paper.Point(bob.position.x, bob.position.y));

        bob.integrate(event.delta / 10);

        ball.position.x = bob.position.x;
        ball.position.y = bob.position.y;

        string.segments[1].point.x = bob.position.x;
        string.segments[1].point.y = bob.position.y;
    };
});