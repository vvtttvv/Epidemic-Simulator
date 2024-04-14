import datetime
import matplotlib.pyplot as plt
import numpy as np
from collections import OrderedDict
from matplotlib.colors import ListedColormap

# Class that holds the parameters of the model

class Parameters:

    def __init__(self, date, beta_i, lambda_p, alpha, gamma, mu, sigma):
        self.date = date
        self.beta_i = beta_i
        self.lambda_p = lambda_p
        self.alpha = alpha
        self.gamma = gamma
        self.mu = mu
        self.sigma = sigma

    @property
    def beta_a(self):
        # From [Jammi-2020]:
        return .58 * self.beta_i

    def __str__(self):
        return f'{self.date}: beta_i = {self.beta_i}, beta_a = {self.beta_a}, lambda_p = {self.lambda_p}, alpha = {self.alpha}, gamma = {self.gamma}, mu = {self.mu}, sigma = {self.sigma}'

    @staticmethod
    def calibrate_beta_i(r0, gamma):
        # Estimate beta_i from R0 and gamma
        return r0 * gamma

# Class that holds a list of parameters and provides the latest parameters for a given date

class ParameterTable:

    def __init__(self):
        self.parameter_list = []

    def add_parameters(self, parameters):
        self.parameter_list.append(parameters)

    def get_parameters(self, date):
        result = self.parameter_list[0]
        for parameters in sorted(self.parameter_list, key=lambda x: x.date):
            if parameters.date > date:
                break
            result = parameters
        return result

    def __str__(self):
        return '\n'.join(str(parameters) for parameters in sorted(self.parameter_list, key=lambda x: x.date))


# Class that holds the official data

class Record:
    GAMMA_CONSTANT = 0.12
    SIGMA_CONSTANT = 0.81

    def __init__(self, total_population, date, confirmed, discharged=0, deaths=0):
        self.total_population = total_population
        self.date = date
        self.confirmed = confirmed
        self.discharged = discharged
        self.deaths = deaths
        self.immunized_6m = 0
        self.gamma = Record.GAMMA_CONSTANT
        self.sigma = Record.SIGMA_CONSTANT

        # Additional state variables
        self.exposed = 0
        self.susceptible = total_population - confirmed

    def __str__(self):
        return f'Record({self.date}, {self.confirmed}, {self.discharged}, {self.deaths}, {self.identified}, Immunized 6m: {self.immunized_6m})'


    @property
    def identified(self):
        return self.confirmed - self.discharged - self.deaths

    @property
    def asymptomatic(self):
        # Assuming 2% of the total population is asymptomatic
        return self.total_population * .02 - self.identified * .17

    @property
    def immunized(self):
        # Simplified to focus on natural immunity and past immunization
        return int(self.gamma * (self.identified + self.asymptomatic) - self.sigma * self.immunized_6m)

    @property
    def deceased(self):
        return int(self.deaths)

    def update_counts(self, s_t, e_t, i_t, a_t, m_t, d_t):
        self.susceptible = int(s_t)
        self.exposed = int(e_t)
        self.confirmed = int(i_t)  # Infected individuals
        self.asymptomatic = int(a_t)
        self.immunized_6m = int(m_t)  # Immunized for more than 6 months
        self.deaths = int(d_t)

# Calculate the immunized after six months and complete the records

def fill_immunized_6m(drecords):
    for record in drecords.values():
        tdate = record.date - datetime.timedelta(days=6 * 30)
        if tdate in drecords:
            record.immunized_6m = drecords[tdate].immunized
        else:
            print('fill_immunized_6m: Date not recorded:', tdate)


# Funtion that receives the values of the comparments of the model and the paramenters, and returns the updated values of the compartments of the model

def model_get_next_values(s_t, e_t, i_t, a_t, m_t, d_t, n_t, m_p6m, p_phi, p):
    s_n = s_t - p.beta_i * s_t / n_t * i_t - p.beta_a * s_t / n_t * a_t - p_phi + p.sigma * m_p6m
    e_n = e_t + p.beta_i * s_t / n_t * i_t + p.beta_a * s_t / n_t * a_t - p.lambda_p * e_t
    i_n = i_t + p.alpha * p.lambda_p * e_t - p.gamma * i_t - p.mu * i_t
    a_n = a_t + (1 - p.alpha) * p.lambda_p * e_t - p.gamma * a_t
    m_n = m_t + p.gamma * i_t + p.gamma * a_t + p_phi - p.sigma * m_p6m
    d_n = d_t + p.mu * i_t
    n_n = s_n + e_n + i_n + a_n + m_n + d_n  # Ensure total population is consistent

    # Debugging output to trace values
    print(f"Day update: S={s_n}, E={e_n}, I={i_n}, A={a_n}, M={m_n}, D={d_n}, Total={n_n}")

    return (s_n, e_n, i_n, a_n, m_n, d_n, n_n)



# Generator that yields values of the compartment i, obtained by applying the model to all dates of the record list provided but using only the input data for the first calculation

def model_get_i_projection(n, records, ptable):
    s_t, e_t, i_t, a_t, m_t, d_t, n_t = (n - records[0].identified, 0, records[0].identified, 0, 0, 0, n)
    yield i_t
    for r in records[1:]:
        s_t, e_t, i_t, a_t, m_t, d_t, n_t = model_get_next_values(
            s_t, e_t, i_t, a_t, m_t, d_t, n_t,
            r.immunized_6m,  # m_p6m
            r.immunized_by_vaccine,  # p_phi
            ptable.get_parameters(r.date)
        )
        yield i_t


# Plot the calculated values
def plot_results(n, records, simulation_length):
    x = [r.date for r in records]
    y1 = [r.confirmed for r in records]
    y2 = [r.deaths for r in records]

    plt.figure(figsize=(11, 5), dpi=300)
    plt.plot(x, y1, label='Simulated')
    plt.plot(x, y2, label='Simulated Deaths', color='red')
    plt.xticks(range(0, len(x), 10))
    #plt.yticks([0, 50000, 100000, 150000, 200000, 250000, 300000], ['0', '50k', '100k', '150k', '200k', '250k', '300k'])
    plt.yticks([0, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000], ['0', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000'])
    plt.xlim(0, simulation_length)
    plt.legend(loc='upper left')
    plt.grid(True)
    plt.xlabel('Day')
    plt.ylabel('Number of persons')
    plt.tight_layout()
    plt.savefig('SEIAMD-resultsSimulated_test_13.04.pdf')

def plot_all_components(dates, s, e, i, a, m, d):
    plt.figure(figsize=(10, 6))

    plt.plot(dates, s, label='Susceptible', color='blue')
    plt.plot(dates, e, label='Exposed', color='orange')
    plt.plot(dates, i, label='Infected', color='red')
    plt.plot(dates, a, label='Asymptomatic', color='green')
    plt.plot(dates, m, label='Immunized', color='purple')
    plt.plot(dates, d, label='Deceased', color='black')

    # Add titles and labels
    plt.title('SEIAMD Model Components')
    plt.xlabel('Days')
    plt.ylabel('Population')
    plt.legend()
    plt.grid(True)

    # Optionally set the y-axis to show numbers in 'k' (thousands)
    plt.gca().get_yaxis().set_major_formatter(
        plt.matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))

    plt.tight_layout()
    plt.savefig('SEIAMD-components.pdf')
    plt.show()

def plot_population_grid(record):
    population_size = record.total_population
    grid_size = int(np.ceil(np.sqrt(population_size)))  # Ensure grid is large enough
    grid = np.zeros((grid_size, grid_size), dtype=int)

    # Log and count the number of individuals in each category
    susceptible_count = int(record.susceptible)
    exposed_count = int(record.exposed)
    identified_count = int(record.identified)
    asymptomatic_count = int(record.asymptomatic)
    immunized_count = int(record.immunized)
    deceased_count = int(record.deceased)

    total_statuses = (susceptible_count + exposed_count + identified_count +
                      asymptomatic_count + immunized_count + deceased_count)

    # Print counts for debugging
    print(f"Susceptible: {susceptible_count}, Exposed: {exposed_count}, Identified: {identified_count}, "
          f"Asymptomatic: {asymptomatic_count}, Immunized: {immunized_count}, Deceased: {deceased_count}, "
          f"Total: {total_statuses}, Expected: {population_size}")

    # If the total doesn't match the expected population size, adjust susceptible
    if total_statuses != population_size:
        susceptible_count += population_size - total_statuses  # Adjust to fix discrepancies

    # Generate the list of statuses
    statuses = (['S'] * susceptible_count + ['E'] * exposed_count +
                ['I'] * identified_count + ['A'] * asymptomatic_count +
                ['M'] * immunized_count + ['D'] * deceased_count)

    np.random.shuffle(statuses)  # Shuffle for randomness

    # Populate the grid
    index = 0
    for status in statuses:
        if index < grid_size * grid_size:
            grid[index // grid_size, index % grid_size] = {'S': 1, 'E': 2, 'I': 3, 'A': 4, 'M': 5, 'D': 6}[status]
            index += 1

    # Create the color map and plot
    cmap = ListedColormap(['blue', 'orange', 'red', 'green', 'purple', 'black'])
    plt.figure(figsize=(10, 10))
    plt.imshow(grid, cmap=cmap, aspect='equal')
    plt.colorbar(ticks=[1, 2, 3, 4, 5, 6], format=plt.FuncFormatter(lambda val, loc: ['S', 'E', 'I', 'A', 'M', 'D'][loc]))
    plt.axis('off')
    plt.show()

def print_records(records):
    print(80 * '-')
    for r in records:
        print(r)
    print(80 * '-')


def main():
    population = 1000  # Example population size
    simulation_length = 100  # Run the simulation for 100 days
    estimated_r0 = 2.5
    gamma = 1 / 10
    beta_i_calibrated = Parameters.calibrate_beta_i(estimated_r0, gamma)

    parameters = Parameters(
        None,  # No specific date needed since parameters are constant
        beta_i=beta_i_calibrated, lambda_p=0.3333333333333333, alpha=0.83, gamma=Record.GAMMA_CONSTANT,
        mu=0.001, sigma=Record.SIGMA_CONSTANT
    )

    # Initialize the records with initial conditions
    drecords = OrderedDict()
    initial_record = Record(population, 0, confirmed=33)  # Initial number of confirmed cases
    drecords[0] = initial_record

    # Initialize compartment lists for plotting
    s, e, i, a, m, d = [], [], [], [], [], []
    dates = []

    # Initial state for the model's compartments
    s_t = population - initial_record.identified  # Susceptible
    e_t = 0  # Exposed
    i_t = initial_record.identified  # Infected
    a_t = 0  # Asymptomatic
    m_t = 0  # Immunized
    d_t = 0  # Deceased
    n_t = population  # Total population

    for day in range(1, simulation_length + 1):  # Start from day 1 to day 100
        dates.append(day)
        s.append(s_t)
        e.append(e_t)
        i.append(i_t)
        a.append(a_t)
        m.append(m_t)
        d.append(d_t)

        # Update the model to the next day
        s_t, e_t, i_t, a_t, m_t, d_t, n_t = model_get_next_values(
            s_t, e_t, i_t, a_t, m_t, d_t, n_t, 0, 0, parameters
        )

        # Correct any rounding errors by adjusting the susceptible compartment
        total_compartments = s_t + e_t + i_t + a_t + m_t + d_t
        if total_compartments != population:
            correction = population - total_compartments
            s_t += correction  # Adjust susceptible to fix any discrepancies

            # Optional: Print to debug the day and the adjustments made
            print(f"Day {day}: Adjustment made, total compartments corrected by {correction}.")

        new_record = Record(population, day, confirmed=int(i_t), deaths=int(d_t))
        drecords[day] = new_record

    # After running the simulation, plot the results
    records = list(drecords.values())
    plot_results(population, records, simulation_length)

    # Plot all components on one graph
    plot_all_components(dates, s, e, i, a, m, d)

    # After running the simulation, visualize the final population grid
    final_record = list(drecords.values())[-1]
    plot_population_grid(final_record)

    print_records(records)

if __name__ == '__main__':
    main()

