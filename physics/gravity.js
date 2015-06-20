$(function() {
    var canvas = $('#physics-canvas');
    canvas.width(window.innerWidth);
    canvas.height(window.innerHeight);

    paper.setup('physics-canvas');

    

    // initialise pretty side of the particle
    var radius = 25;
    var ball = new paper.Path.Circle({
        center: paper.view.center,
        radius: radius,
        fillColor: 'red'
    });

    // initialise physicsy side of the particle
    var p_0 = new Victor(paper.view.center.x, paper.view.center.y);
    var v_0 = new Victor(0, 0);
    var size = new Victor(radius, radius);
    var bounds = new Victor(paper.view.size.width, paper.view.size.height);
    console.log(bounds);
    var mass = 1;
    var coefficient_of_restitution = 1;

    var particle = new Particle(p_0, v_0, size, bounds, mass, coefficient_of_restitution);

    var gui = new dat.GUI();
    gui.add(particle, 'mass');
    gui.add(particle, 'coefficient_of_restitution');
    gui.add(particle, 'enable_drag');
    var trace_picker = gui.add(particle, 'trace_path')

    trace_picker.onChange(function() {
        trace.segments = [];
    });


    var gravity = function(particle) {
        this.g = 9.8 * 500;
        return new Victor(0, particle.mass * this.g);
    };

    particle.add_force(gravity);

    var trace = new paper.Path({
        strokeColor: [0.8],
        strokeWidth: 2,
        strokeCap: 'square'
    });

    canvas.click(function (e) {
        particle.position = new Victor(paper.view.center.x, paper.view.center.y);
        particle.velocity = new Victor(2.5 * (e.pageX - paper.view.center.x), 2.5 * (e.pageY - paper.view.center.y));

        // reset the trace
        trace.segments = [];
    });

    paper.view.onFrame = function() {
        ball.fillColor.hue += 1;

        if (particle.trace_path)
            trace.add(new paper.Point(particle.position.x, particle.position.y));

        particle.integrate(0.01);

        ball.position.x = particle.position.x;
        ball.position.y = particle.position.y;
    };
});