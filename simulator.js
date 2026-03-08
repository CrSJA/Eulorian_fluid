class Fluid {
  constructor(size_x, size_y, cell_size) {
    this.cell_size = cell_size;
    this.size_x = size_x + 2;
    this.size_y = size_y + 2;
    this.cell_total = this.size_x * this.size_y;
    this.y = new Float32Array(this.cell_total);
    this.x = new Float32Array(this.cell_total);
    this.y_prime = new Float32Array(this.cell_total);
    this.x_prime = new Float32Array(this.cell_total);
    this.state = new Float32Array(this.cell_total);
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

  force_inconpresibility(dt) {
    for (let j = 1; j < this.size_y - 1; j++) {
      for (let i = 1; i < this.size_x - 1; i++) {
        if (this.state[j * n + i] == 0.0) continue;
        let left_velocity = this.x[j * n + i];
        let right_velocity = this.x[j * n + i + 1];

        let down_velocity = this.y[j * n + 1 + i];
        let up_velocity = this.y[j * n + i];

        //var flow= this.y[]
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
