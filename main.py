import numpy as np
from numpy.random import poisson 
from settings import *

class Individual:
    def __init__(self, position, movement_speed, grid_size, is_infected = False):
        self.position = np.array(position)
        self.movement_speed = movement_speed
        self.grid_size = grid_size
        self.is_infected = is_infected
        self.infected_time = 0
        self.alive = True

    def move(self,velocity = 5):
        movement = np.random.normal(0, self.movement_speed * velocity, size=2)
        self.position += movement.astype(int)

        self.position %= self.grid_size
    def dead_treated(self, probability_of_dying):
        if np.random.rand() < np.exp(-probability_of_dying * self.infected_time):
            if self.infected_time > 2:
                self.is_infected = False
                self.infected_time = 0
            else:
                self.infected_time += 1
        else:
            self.alive = False
            self.is_infected = False

    def __str__(self):
        return f"Position: {self.position}, Infected: {self.is_infected}, Alive: {self.alive}, infected time {self.infected_time}"


class Simulation:
    def __init__(self, grid_size, num_individuals, num_iteretions, movement_speed, initial_infected_index, infection_radius, infection_probability, probability_of_dying):
        self.grid_size = grid_size
        self.num_individuals = num_individuals
        self.num_iteretions = num_iteretions
        self.movement_speed = movement_speed
        self.infection_radius = infection_radius
        self.infection_probability = infection_probability
        self.probability_of_dying = probability_of_dying
        
        self.population = [Individual(np.random.randint(0, grid_size, size = 2), movement_speed, grid_size) for _ in range(num_individuals)]
        self.population[initial_infected_index].is_infected = True
    
    def distance(self, ind1, ind2):
        return np.linalg.norm(ind1.position - ind2.position)

    def simulate(self):
        for _ in range(self.num_iteretions):
            for i, individual in enumerate(self.population):
                individual.move()
                self.print_population_status(i)
                if individual.is_infected:
                    for other in self.population:
                        if other.is_infected:
                            other.dead_treated(self.probability_of_dying)
                            continue
                        if not other.alive:
                            continue
                        dist = self.distance(individual, other)
                        if dist <= self.infection_radius and np.random.rand() <= self.infection_radius:
                            other.is_infected = True
    def print_population_status(self, stage):
        print(f"Stage {stage}")
        for i, individual in enumerate(self.population):
            print(f"Individual {i}: {individual}")  

                            
simulation = Simulation(grid_size, num_individuals, num_iterations, movement_speed, initial_infected_index, infection_radius, infection_probability, probability_of_dying)
simulation.simulate()
