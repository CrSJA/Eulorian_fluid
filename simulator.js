class Fluid {
  constructor(size_x, size_y, cell_size, density) {
    this.cell_size = cell_size;
    this.density = density;
    this.size_x = size_x + 2;
    this.size_y = size_y + 2;
    this.cell_total = this.size_x * this.size_y;
    this.y = new Float32Array(this.cell_total);
    this.x = new Float32Array(this.cell_total);
    this.y_prime = new Float32Array(this.cell_total);
    this.x_prime = new Float32Array(this.cell_total);
    this.state = new Float32Array(this.cell_total);
    this.presure = new Float32Array(this.cell_total);
  }

  modifie_vel(dt, gravity) {
    for (let j = 1; j < this.size_y - 1; j++) {
      for (let i = 1; i < this.size_x - 1; i++) {
        if (
          this.state[this.size_x * (j + 1) + i] !== 0.0 &&
          this.state[this.size_x * j + i]
        ) {
          this.y[j * this.size_x + i] += dt * gravity;
        }
      }
    }
  }

  /* I need to force divergence == 0, i must use a staggered grid */

  force_inconpresibility(num_iterations, dt) {
    over_relaxation = 1.6; //remember to change this at the end
    n = this.size_x; //were size x is how many cells are in each row

    //remember that a=F/m <=> -1/d*(delta P/cell_size)
    // If we want the chance in presure for a specific chanche in velocity that is
    // delta P=(d*cell_size)/dt * delta v
    // or shorter presure_coeficient*velocity_correction
    let presure_coeficient = (this.density * this.cell_size) / dt;

    for (let temp = 0; temp < num_iterations; temp++) {
      for (let j = 1; j < this.size_y - 1; j++) {
        for (let i = 1; i < this.size_x - 1; i++) {
          if (this.state[j * n + i] == 0.0) continue;

          // I will let this for clarity, the below can be read as:
          /*
        let left_velocity = this.x[j * n + i]; //positive means points right
        let right_velocity = this.x[j * n + i + 1];

        let down_velocity = this.y[(j+1) * n + i]; positive means points up
        let up_velocity = this.y[j * n + i];
        */

          let flow = //flow positive when stuf comes out, negaticve when comes in
            this.x[j * n + i + 1] -
            this.x[j * n + i] +
            this.y[j * n + i] -
            this.y[(j + 1) * n + i];
          /*this part is kind of hart so, the explanation.

        first, we need to over relax to do that we ned to know much presure
        must chance so that the total divergese (flow) becomes cero.
        Note thas we need to know how many cells we are toching aren't walls

        */
          let abyacent_units =
            this.state[j * n + i - 1] +
            this.state[j * n + i + 1] +
            this.state[(j + 1) * n + i] + // since a wall is 0.0 that hole thing is
            this.state[(j - 1) * n + i]; // how many units are NOT walls

          /* Now for the relaxation */

          let velocity_correction = flow / abyacent_units;

          // we could aply the correction, but in deferent
          // iteration is gona mess it up so we up the correction
          // so it has a margin of error
          // also only correct what isn't a wall

          this.presure[j * n + i] +=
            presure_coeficient * velocity_correction * over_relaxation;

          this.x[j * n + i] +=
            velocity_correction * over_relaxation * this.state[j * n + (i - 1)];
          this.x[j * n + i + 1] -=
            velocity_correction * over_relaxation * this.state[j * n + (i + 1)];
          this.y[j * n + i] -=
            velocity_correction * over_relaxation * this.state[(j - 1) * n + i];
          this.y[j * n + 1 + i] +=
            velocity_correction * over_relaxation * this.state[(j + 1) * n + i];
        }
      }
    }
  }

  /*
  modifie_vel(dt, aceleration_x, aceleration_y) {
    var size_x = this.size_x;
    for (var j = 1; j < this.size_y - 1; j++) {
      for (var i = 1; i < this.size_x - 1; i++) {


        if (this.state[size_x * j + i] !== 0.0) {

          let is_pushing_aginst_wall_x = aceleration_x < 0 && this.state[size_x * (j) + i - 1] == 0.0 || aceleration_x > 0 && this.state[size_x * (j) + i + 1] == 0.0;
          let is_pushing_aginst_wall_y = aceleration_y < 0 && this.state[size_x * (j + 1) + i] == 0.0 || aceleration_y > 0 && this.state[size_x * (j - 1) + i] == 0.0;

          if (!is_pushing_aginst_wall_x){
            this.x[size_x * j + i] += aceleration_x * dt;
            }
          if (!is_pushing_aginst_wall_y) {
          this.y[size_x * j + i] += aceleration_y * dt;
          }
        }
     }
    }
  }
*/
}
