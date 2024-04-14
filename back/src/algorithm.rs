use rand::Rng;
use serde::Serialize;

#[derive(Serialize)]
pub struct Individual {
    id: u32,
    position: [i32; 2],
    movement_speed: u32,
    grid_size: i32,
    is_infected: bool,
    infected_time: i32,
    alive: bool,
}

impl Individual {
    fn new(
        id: u32,
        position: [i32; 2],
        movement_speed: u32,
        grid_size: i32,
        is_infected: bool,
    ) -> Self {
        Individual {
            id,
            position,
            movement_speed,
            grid_size,
            is_infected,
            infected_time: 0,
            alive: true,
        }
    }

    fn move_ind(&mut self) {
        let mut rng = rand::thread_rng();
        let movement_speed = self.movement_speed as i32;
        let movement = [
            rng.gen_range(-movement_speed..movement_speed),
            rng.gen_range(-movement_speed..movement_speed),
        ];
        self.position[0] = (self.position[0] + movement[0]).rem_euclid(self.grid_size);
        self.position[1] = (self.position[1] + movement[1]).rem_euclid(self.grid_size);
    }

    fn dead_treated(&mut self, probability: f32) {
        let mut rng = rand::thread_rng();
        if rng.gen_range(0.0..1.0) < E.powf(-probability * self.infected_time as f32) {
            if self.infected_time > 2 {
                self.is_infected = false;
                self.infected_time = 0;
            } else {
                self.infected_time += 1;
            }
        } else {
            self.alive = false;
            self.is_infected = false;
        }
    }
}

fn distance(ind1: [i32; 2], ind2: [i32; 2]) -> f32 {
    let dx = (ind1[0] - ind2[0]) as f32;
    let dy = (ind1[1] - ind2[1]) as f32;
    (dx.powf(2.0) + dy.powf(2.0)).sqrt()
}

pub fn algorithm(
    grid_size: i32,
    num_individuals: u32,
    num_iteretions: u32,
    movement_speed: u32,
    initial_infected_index: usize,
    infection_radius: u32,
    infection_probability: f32,
    probability_of_dying: f32,
) {
    let mut population: Vec<Individual> = Vec::new();
    let mut rng = rand::thread_rng();
    for i in 0..num_individuals {
        let individual = Individual::new(
            i,
            [rng.gen_range(0..grid_size), rng.gen_range(0..grid_size)],
            movement_speed,
            grid_size,
            false,
        );
        population.push(individual);
    }
    population[initial_infected_index].is_infected = true;
    for _ in 0..num_iteretions {
        send_message(&population);
        for i in 0..population.len() {
            population[i].move_ind();
            if population[i].is_infected {
                for j in 0..population.len() {
                    if i != j && population[j].is_infected {
                        population[j].dead_treated(probability_of_dying);
                        continue;
                    }
                    if population[j].alive {
                        continue;
                    }
                    let dist = distance(population[i].position, population[j].position);
                    if dist <= infection_radius as f32
                        && rng.gen_range(0.0..1.0) <= infection_probability
                    {
                        population[j].is_infected = true
                    }
                }
            }
        }
    }
}

fn main() {}
