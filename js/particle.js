var Particle = function (position, velocity, size, bounds, mass, coefficient_of_restitution) {
    this.position = position;
    this.velocity = velocity;

    this.size = size;
    this.bounds = bounds;

    this.trace_path = false;

    //this.g = g;
    this.mass = mass;
    this.coefficient_of_restitution = coefficient_of_restitution;
    this.enable_drag = false;

    this.forces = [];
};

Particle.prototype = {
    check_bounds: function () {
        if (this.position.x + this.size.x > this.bounds.x) {
            this.velocity.x *= -this.coefficient_of_restitution;
            this.position.x = this.bounds.x - this.size.x;
        } else if (this.position.x < this.size.x) {
            this.velocity.x *= -this.coefficient_of_restitution;
            this.position.x = this.size.x;
        }

        if (this.position.y + this.size.y > this.bounds.y) {
            this.velocity.y *= -this.coefficient_of_restitution;
            this.position.y = this.bounds.y - this.size.y;
        } else if (this.position.y < this.size.y) {
            this.velocity.y *= -this.coefficient_of_restitution;
            this.position.y = this.size.y;
        }
    },
    integrate: function (delta_t) {
        var F = new Victor(0, 0);

        var self = this;
        this.forces.map(function(f) {
            if (f.constructor === Victor) {
                F.add(f);
            }
            else if (typeof f == 'function') {
                // f had better return a Victor
                var _f = f(self);
                
                if (_f.constructor !== Victor)
                    console.error(f.toString() + ' is not a valid force function.');
                else 
                    F.add(_f);
            }
            else {
                console.error('Invalid force: ' + f.toString());
            }
        });

        // Newton's Second Law
        var a = F.clone().divide(new Victor(this.mass, this.mass));

        // numerical integration :D
        var dv = new Victor(a.x * delta_t, a.y * delta_t);
        this.velocity.x += dv.x;
        this.velocity.y += dv.y;

        var ds = new Victor(this.velocity.x * delta_t, this.velocity.y * delta_t);
        this.position.x += ds.x;
        this.position.y += ds.y;

        // check bounds
        this.check_bounds();
    },
    add_force: function(force) {
        this.forces.push(force);
    }
};
