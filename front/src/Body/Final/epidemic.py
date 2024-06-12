import datetime
import matplotlib.pyplot as plt
import numpy as np
from collections import OrderedDict

# Class that holds the parameters of the model
class Parameters:
    def __init__(self, date, beta_i, lambda_p, alpha, gamma, mu, sigma, p_phi):
        self.date = date
        self.beta_i = beta_i
        self.lambda_p = lambda_p
        self.alpha = alpha
        self.gamma = gamma
        self.mu = mu
        self.sigma = sigma
        self.p_phi = p_phi

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


# Class that holds the official data
class Record:
    def __init__(self, total_population, date, confirmed, gamma, sigma, susceptible, discharged=0, deaths=0, exposed=0, immunized_idv=0):
        self.total_population = total_population
        self.date = date
        self.confirmed = confirmed
        self.discharged = discharged
        self.deaths = deaths
        self.immunized_idv = immunized_idv
        self.immunized_6m = 0
        self.gamma = gamma
        self.sigma = sigma
        self.exposed = exposed
        self.susceptible = susceptible

    def __str__(self):
        return (f'Day {self.date}: Total Population = {self.total_population}, '
                f'S = {self.susceptible}, E = {self.exposed}, '
                f'I = {self.confirmed}, A = {self.asymptomatic}, '
                f'M = {self.immunized_idv}, D = {self.deaths}')

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
        self.confirmed = int(i_t)
        self.asymptomatic = int(a_t)
        self.immunized_6m = int(m_t)
        self.deaths = int(d_t)
        # Ensure total population is consistent
        self.total_population = self.susceptible + self.exposed + self.confirmed + self.asymptomatic + self.immunized_idv + self.deaths


def get_user_parameters():
    # User Input Parameters
    print("Please enter the model parameters:")
    r0 = 2.5
    gamma = 0.01
    lambda_p = 0.2
    alpha = 0.2
    mu = 0.01
    sigma = 0.1
    p_phi = 0.5

    # Calculate beta_i using the provided R0 and gamma
    beta_i = Parameters.calibrate_beta_i(r0, gamma)
    return Parameters(None, beta_i, lambda_p, alpha, gamma, mu, sigma, p_phi)


# Calculate the immunized after six months and complete the records
def fill_immunized_6m(drecords):
    for record in drecords.values():
        tdate = record.date - datetime.timedelta(days=6 * 30)
        if tdate in drecords:
            record.immunized_6m = drecords[tdate].immunized
        else:
            print('fill_immunized_6m: Date not recorded:', tdate)


# Funtion that receives the values of the comparments of the model and the paramenters, and returns the updated values of the compartments of the model
def model_get_next_values(s_t, e_t, i_t, a_t, m_t, d_t, n_t, m_p6m, p, day):
    # Subtract the number of vaccinations for the first day only
    vaccinations_today = p.p_phi if day == 1 else 0

    # Adjust the susceptible count for vaccinations
    s_n = s_t - p.beta_i * s_t / n_t * i_t - p.beta_a * s_t / n_t * a_t + p.sigma * m_p6m - vaccinations_today
    e_n = e_t + p.beta_i * s_t / n_t * i_t + p.beta_a * s_t / n_t * a_t - p.lambda_p * e_t
    i_n = i_t + p.alpha * p.lambda_p * e_t - p.gamma * i_t - p.mu * i_t
    a_n = a_t + (1 - p.alpha) * p.lambda_p * e_t - p.gamma * a_t
    # Adjust the immunized count for vaccinations
    m_n = m_t + p.gamma * i_t + p.gamma * a_t - p.sigma * m_p6m + vaccinations_today
    d_n = d_t + p.mu * i_t
    n_n = s_n + e_n + i_n + a_n + m_n + d_n

    print(f"Day {day} update: S={s_n}, E={e_n}, I={i_n}, A={a_n}, M={m_n}, D={d_n}, Total={n_n}")

    return (s_n, e_n, i_n, a_n, m_n, d_n, n_n)


def plot_all_components(dates, s, e, i, a, m, d):
    plt.figure(figsize=(10, 6))

    # Plot each component with its respective label and color
    plt.plot(dates, s, label='Susceptible', color='blue')
    plt.plot(dates, e, label='Exposed', color='orange')
    plt.plot(dates, i, label='Infected', color='red')
    plt.plot(dates, a, label='Asymptomatic', color='green')
    plt.plot(dates, m, label='Immunized', color='purple')
    plt.plot(dates, d, label='Deceased', color='black')

    # Calculate max value for better y-axis scaling
    max_val = max(max(s), max(e), max(i), max(a), max(m), max(d)) * 1.1  # 10% more than max for better visibility

    # Add titles and labels
    plt.title('SEIAMD Model Components')
    plt.xlabel('Days')
    plt.ylabel('Population')
    plt.legend()
    plt.grid(True)

    # Adjust x-axis and y-axis limits and ticks to fit the simulation duration and population scale
    plt.xticks(np.arange(0, len(dates), step=max(1, len(dates) // 10)))  # Adjust x-ticks to not overcrowd
    plt.yticks(np.linspace(0, max_val, num=11))  # Adjust y-ticks to evenly spread across the range

    # Optionally set the y-axis to show numbers in 'k' (thousands)
    plt.gca().get_yaxis().set_major_formatter(
        plt.matplotlib.ticker.FuncFormatter(lambda x, p: format(int(x), ',')))

    plt.tight_layout()
    plt.savefig('SEIAMD-components.pdf')
    plt.show()


def generate_compartment_plot(final_record):
    fig, ax = plt.subplots()

    # Define the size of the grid
    grid_size = int(np.ceil(np.sqrt(final_record.total_population)))

    # Hold the coordinates and colors of each individual
    coordinates = []
    colors = []

    compartment_colors = {
        'susceptible': 'blue',
        'exposed': 'orange',
        'infected': 'red',
        'asymptomatic': 'green',
        'immunized': 'purple',
        'deceased': 'black'
    }

    compartment_counts = {
        'susceptible': int(final_record.susceptible),
        'exposed': int(final_record.exposed),
        'infected': int(final_record.confirmed),
        'asymptomatic': int(round(final_record.asymptomatic)),
        'immunized': int(round(final_record.immunized_idv)),
        'deceased': int(final_record.deceased)
    }

    # Calculate the positions and colors for each individual
    idx = 0
    for compartment, count in compartment_counts.items():
        for _ in range(count):
            # Calculate the row and column to place this individual
            row, col = divmod(idx, grid_size)
            coordinates.append((col, grid_size - row - 1))  # Flip row index for display
            colors.append(compartment_colors[compartment])
            idx += 1

    # Plot the circles at each individual's coordinates
    for coord, color in zip(coordinates, colors):
        ax.scatter(*coord, color=color, s=20)  # s = size of the circle

    # Legend
    handles = [plt.Line2D([0], [0], marker='o', color='w', label=comp,
                          markerfacecolor=color, markersize=10) for comp, color in compartment_colors.items()]

    ax.legend(handles=handles, bbox_to_anchor=(1.05, 1), loc='upper left', borderaxespad=0.)

    # Adjust the layout to make room for the legend
    plt.subplots_adjust(right=0.7)

    plt.axis('off')  # Turn off the axis
    plt.gca().invert_yaxis()  # Invert the y-axis to match the grid layout
    plt.show()



def main():
    population = 200
    while population <= 0:
        print("Population size must be greater than zero.")
        population = int(input("Enter the total population size: "))

    initial_infected = 5
    while initial_infected < 0 or initial_infected > population:
        print("Initial number of infected individuals must be between 0 and the total population size.")
        initial_infected = int(input("Enter the initial number of infected individuals: "))

    simulation_length = 360
    while simulation_length <= 0:
        print("Number of days for the simulation must be greater than zero.")
        simulation_length = int(input("Enter the number of days for the simulation: "))

    parameters = get_user_parameters()

    # Initialize the records with initial conditions
    drecords = OrderedDict()
    initial_susceptible = population - initial_infected  # Calculate initial susceptible
    initial_record = Record(population, 0, initial_infected, parameters.gamma, parameters.sigma, initial_susceptible)
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

    for day in range(1, simulation_length + 1):
        dates.append(day)
        s.append(s_t)
        e.append(e_t)
        i.append(i_t)
        a.append(a_t)
        m.append(m_t)
        d.append(d_t)

        s_t, e_t, i_t, a_t, m_t, d_t, n_t = model_get_next_values(
            s_t, e_t, i_t, a_t, m_t, d_t, n_t,
            drecords[day - 1].immunized_6m,
            parameters,
            day
        )

        new_record = Record(
            population, day, confirmed=int(i_t),
            gamma=parameters.gamma, sigma=parameters.sigma,
            susceptible=int(s_t),
            deaths=int(d_t), immunized_idv=int(m_t)
        )
        new_record.exposed = int(e_t)
        drecords[day] = new_record

    plot_all_components(dates, s, e, i, a, m, d)

    final_record = drecords[max(drecords.keys())]  # Get the last record
    generate_compartment_plot(final_record)

if __name__ == '__main__':
    main()
