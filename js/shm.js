$(function() {
    var canvas = $('#physics-canvas');
    canvas.width(window.innerWidth);
    canvas.height(window.innerHeight);

    paper.setup('physics-canvas');

    // initialise pretty side of the particle
    var radius = 25;
    var ball = new paper.Path.Circle({
        center: new paper.Point(paper.view.center.x, paper.view.center.y - 200),
        radius: radius,
        fillColor: 'red'
    });

    var support = new paper.Path.Circle({
        center: new paper.Point(paper.view.center.x, paper.view.center.y - 200),
        radius: 5,
        fillColor: 'black'
    })

    // initialise physicsy side of the particle
    var p_0 = new Victor(paper.view.center.x, paper.view.center.y - 200 + 49);
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


    var gravity = function(particle) {
        this.g = 9.8 * 500;
        return new Victor(0, particle.mass * this.g);
    };

    particle.add_force(gravity);

    var hookes_law = function(particle) {
        var T = new Victor(0, (paper.view.center.y - particle.position.y)*100);
        console.log(T);
        return T;
    };

    particle.add_force(hookes_law);

    var trace = new paper.Path({
        strokeColor: [0.8],
        strokeWidth: 2,
        strokeCap: 'square'
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