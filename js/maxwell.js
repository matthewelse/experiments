// simulate an ideal gas :D

var MaxwellBoltzmannDistribution = function(mass, temperature) {
    this.mass = mass;
    this.temperature = temperature;
    
    this.boltzmann_constant = 1.3806488E-23; // m2 kg s-2 K-1
    this.k = this.boltzmann_constant;
};

MaxwellBoltzmannDistribution.prototype = {
    pdf: function(v) {
        var _a = this.mass/(2*Math.PI*this.k*this.temperature);
        var a = Math.pow(_a, 3/2);
        var b = 4 * Math.PI * v * v;
        var p = - (this.mass * v * v) / (2 * this.k * this.temperature);

        return a * b * Math.exp(p);
    },
    random: function() {
        var v_max = 2500;
        var c_rms = Math.sqrt(3 * this.k * this.temperature / this.mass);
        var pd_max = this.pdf(c_rms);

        // 100 times so we don't end up with an infinite loop if there's a bug
        for (var i = 0; i < 100; i++) {
            var v = Math.random() * v_max;
            var pd = Math.random() * pd_max;

            if (this.pdf(v) > pd)
                return v;
        }
        
        console.error("Unable to generate random point. Try again.");
    }
};
