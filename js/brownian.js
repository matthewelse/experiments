$(function () {
    var gas_particle = function(mass, bounds, size, position) {
        // generate a particle...
        var speed = dis.random();
        var angle = Math.random() * 2 * Math.PI;

        var velocity = new Victor(speed * Math.cos(angle), speed * Math.sin(angle));
        position = position || new Victor(Math.random() * bounds.x, Math.random() * bounds.y);

        return new Particle(position, velocity, size, bounds, mass, 1);
    }

    var canvas = $('#physics-canvas');
    canvas.width(window.innerWidth);
    canvas.height(window.innerHeight);

    paper.setup('physics-canvas');

    var molecules = {
        'xenon': 131.293,
        'oxygen': 32,
        'neon': 20.1797
    };

    var settings = {
        'molecules': {
            'xenon': {
                'mass': 131.293,
                'size': 6
            },
            'oxygen': {
                'mass': 32.00,
                'size': 4
            },
            'neon': {
                'mass': 20.1797,
                'size': 2
            },
            'chlorine': {
                'mass': 70,
                'size': 10
            }
        },
        'temperature': 298, // K
        'gas': 'xenon',
        'cold_colour': {
            'h': 0,
            's': 1,
            'v': 1,
        },
        'hot_colour': {
            'h': 240,
            's': 1,
            'v': 1,
        },
        'colour_scale': false
    };

    var dis = new MaxwellBoltzmannDistribution(settings.molecules[settings.gas].mass * 1.67E-27, settings.temperature);

    var particles = [];
    var balls = [];

    var number_of_particles = 10;
    var bounds = new Victor(paper.view.size.width, paper.view.size.height);

    var gui = new dat.GUI();

    var temperature_colours = gui.add(settings, 'colour_scale')

    temperature_colours.onChange(function(value) {
        for (var i = 0; i < particles.length; i++) {
            if (value) {
                var t = particles[i].velocity.length()*particles[i].velocity.length()*particles[i].mass/3/dis.k;
                var ratio = Math.min(t/1000, 1);

                balls[i].fillColor = [ratio, 0, 1 - ratio]
            }
            else {
                balls[i].fillColor = [1, 0, 0]
            }
        }
    });

    var temperature_changer = gui.add(settings, 'temperature', 0, 1000);

    temperature_changer.onChange(function(value) {
        if (dis.temperature == 0)
            randomise = true;
        else
            randomise = false

        dis.temperature = value;

        for (var i = 0; i < particles.length; i++) {
            var speed = dis.random();

            if (!randomise) {
                particles[i].velocity = particles[i].velocity.norm();
                particles[i].velocity.x *= speed;
                particles[i].velocity.y *= speed;
            }
            else {
                var angle = Math.random() * 2 * Math.PI;
                particles[i].velocity= new Victor(speed * Math.cos(angle), speed * Math.sin(angle));
            }

            if (settings.colour_scale) {
                var t = particles[i].velocity.length()*particles[i].velocity.length()*particles[i].mass/3/dis.k;
                var ratio = Math.min(t/1000, 1);

                balls[i].fillColor = [ratio, 0, 1 - ratio]
            }
            else {
                balls[i].fillColor = [1, 0, 0]
            }
        }
    });

    var gas_changer = gui.add(settings, 'gas', Object.keys(settings.molecules));

    var refill_screen = function() {
        var size = new Victor(settings.molecules[settings.gas].size, settings.molecules[settings.gas].size);
        var speed_rms = 3 * 0.5 * dis.k * dis.T;

        for (var i = 0; i < number_of_particles; i++) {
            // generate a particle...
            var particle = gas_particle(settings.molecules[settings.gas].mass * 1.67E-27, bounds, size);
            particles.push(particle);

            if (settings.colour_scale) {
                var t = particle.velocity.length()*particle.velocity.length()*particle.mass/3/dis.k;
                var ratio = Math.min(t/1000, 1);
            }
            else {
                var ratio = 1
            }

            var ball = new paper.Path.Circle({
                center: paper.Point(particle.position.x, particle.position.y),
                radius: settings.molecules[settings.gas].size,
                fillColor: [ratio, 0, 1-ratio]
            });
            balls.push(ball);
        }
    }

    gas_changer.onChange(function(value) {
        dis.mass = settings.molecules[value].mass * 1.67E-27

        balls.map(function(ball) {
            ball.remove();
        });

        refill_screen();
    });

    //gui.addColor(settings, 'hot_colour');
    //gui.addColor(settings, 'cold_colour');

    refill_screen();

    canvas.click(function(e) {
        var particle = gas_particle(settings.molecules[settings.gas].mass * 1.67E-27, bounds, new Victor(settings.molecules[settings.gas].size, settings.molecules[settings.gas].size), new Victor(e.pageX, e.pageY));

        if (settings.colour_scale) {
            var t = particle.velocity.length()*particle.velocity.length()*particle.mass/3/dis.k;
            var ratio = Math.min(t/1000, 1);
        }
        else {
            var ratio = 1;
        }

        var ball = new paper.Path.Circle({
            center: paper.Point(particle.position.x, particle.position.y),
            radius: settings.molecules[settings.gas].size,
            fillColor: [ratio, 0, 1-ratio]
        });
        particles.push(particle);
        balls.push(ball);
    });

    paper.view.onFrame = function() {
        if (particles.length != balls.length)
            console.error("oops...");

        var sum_squares = 0;

        for (var i = 0; i < particles.length; i++) {
            particles[i].integrate(0.01);

            sum_squares += particles[i].velocity.lengthSq();

            balls[i].position.x = particles[i].position.x;
            balls[i].position.y = particles[i].position.y;
        }

        var c_rms_sq = sum_squares / particles.length;
        var e_k_mean = 0.5 * 1.67E-27 * settings.molecules[settings.gas].mass * c_rms_sq;
        var exp_ek_mean = 3*0.5*dis.boltzmann_constant*settings.temperature;

        //console.log(e_k_mean, exp_ek_mean);
    };
});
