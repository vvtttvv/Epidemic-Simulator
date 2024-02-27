import numpy as np
import matplotlib.pyplot as plt

class Individual:
    def __init__(self, position, movement_std, grid_size, is_infected=False):
        self.position = np.array(position)
        self.movement_std = movement_std
        self.grid_size = grid_size
        self.is_infected = is_infected

    def move(self):
        movement = np.random.normal(0, self.movement_std, size=2)
        self.position += movement.astype(int)
        
        # Apply periodic boundary conditions
        self.position %= self.grid_size

class EpidemicSimulation:
    def __init__(self, grid_size, num_individuals, num_iterations, movement_std, initial_infected_index, infection_radius, infection_probability):
        self.grid_size = grid_size
        self.num_individuals = num_individuals
        self.num_iterations = num_iterations
        self.movement_std = movement_std
        self.initial_infected_index = initial_infected_index
        self.infection_radius = infection_radius
        self.infection_probability = infection_probability
        
        # Initialize population
        self.population = [Individual(np.random.randint(0, grid_size, size=2), movement_std, grid_size) 
                           for _ in range(num_individuals)]
        
        # Infect one individual initially
        self.population[initial_infected_index].is_infected = True

    def distance(self, ind1, ind2):
        return np.linalg.norm(ind1.position - ind2.position)

    def run_simulation(self):
        for _ in range(self.num_iterations):
            for i, individual in enumerate(self.population):
                individual.move()
                if individual.is_infected:
                    for other in self.population:
            if other.is_infected:
                continue
                dist = self.distance(individual, other)
                    if dist <= self.infection_radius and np.random.rand() < self.infection_probability:
                            other.is_infected = True
                        if np.random.rand() < np.exp(-0.5 * t):
                            other.is_dead = True
            self.visualize()

    def visualize(self):
        plt.clf()
        positions = np.array([individual.position for individual in self.population])
        colors = ['red' if individual.is_infected else 'blue' for individual in self.population]
        plt.scatter(positions[:, 0], positions[:, 1], c=colors)
        
        # Visualize infection radius
        for individual in self.population:
            if individual.is_infected:
                circle = plt.Circle((individual.position[0], individual.position[1]), self.infection_radius, color='red', alpha=0.1)
                plt.gca().add_artist(circle)
        
        plt.xlim(0, self.grid_size)
        plt.ylim(0, self.grid_size)
        plt.title('Epidemic Simulation')
        plt.xlabel('X')
        plt.ylabel('Y')
        #plt.axis('equal')
        plt.pause(0.1)

# Parameters
grid_size = 1000
num_individuals = 1000
num_iterations = 1000
movement_std = 2
initial_infected_index = 0
infection_radius = 15
infection_probability = 0.2

# Run simulation
simulation = EpidemicSimulation(grid_size, num_individuals, num_iterations, movement_std, initial_infected_index, infection_radius, infection_probability)
simulation.run_simulation()
plt.show()

