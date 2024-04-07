import datetime
import matplotlib.pyplot as plt

# Global constants
MIN_DATE = datetime.datetime(2020, 1, 26)
MAX_DATE = datetime.datetime(2022, 9, 26)

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
        return .58 * self.beta_i

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

# Function that receives the values of the compartments of the model and the parameters, and returns the updated values of the compartments of the model
def model_get_next_values(s_t, e_t, i_t, a_t, m_t, d_t, n_t, m_p6m, p_phi, p):
    s_n = s_t - p.beta_i * s_t / n_t * i_t - p.beta_a * s_t / n_t * a_t - p_phi + p.sigma * m_p6m
    e_n = e_t + p.beta_i * s_t / n_t * i_t + p.beta_a * s_t / n_t * a_t - p.lambda_p * e_t
    i_n = i_t + p.alpha * p.lambda_p * e_t - p.gamma * i_t - p.mu * i_t
    a_n = a_t + (1 - p.alpha) * p.lambda_p * e_t - p.gamma * a_t
    m_n = m_t + p.gamma * i_t + p.gamma * a_t + p_phi - p.sigma * m_p6m
    d_n = d_t + p.mu * i_t
    n_n = s_n + e_n + i_n + a_n + m_n + d_n
    return (s_n, e_n, i_n, a_n, m_n, d_n, n_n)

# Main function
def main():
    # Set the population size
    n = 10000  # Example population size

    # Create a list of dates for the simulation
    dates = [MIN_DATE + datetime.timedelta(days=i) for i in range((MAX_DATE - MIN_DATE).days + 1)]

    # Create a parameter table
    ptable = ParameterTable()
    # Add your parameters here
    ptable.add_parameters(Parameters(
        date=datetime.datetime(2020, 1, 1),
        beta_i=0.5,
        lambda_p=0.2,
        alpha=0.83,
        gamma=0.12,
        mu=0.001,
        sigma=0.81
    ))

    # Simulate the values
    results = []
    s_t, e_t, i_t, a_t, m_t, d_t, n_t = (n, 0, 1, 0, 0, 0, n)
    for date in dates:
        result = model_get_next_values(s_t, e_t, i_t, a_t, m_t, d_t, n_t, 0, 0, ptable.get_parameters(date))
        results.append(result)
        s_t, e_t, i_t, a_t, m_t, d_t, n_t = result

    # Extract the results for each compartment
    S, E, I, A, M, D, N = zip(*results)

    # Set up the plot
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.plot(dates, S, label='Susceptible')
    ax.plot(dates, E, label='Exposed')
    ax.plot(dates, I, label='Infected')
    ax.plot(dates, A, label='Asymptomatic')
    ax.plot(dates, M, label='Immunized')
    ax.plot(dates, D, label='Deceased')

    # Format plot
    ax.set_xlim(MIN_DATE, MAX_DATE)
    ax.set_ylim(0, n)
    ax.set_xlabel('Date')
    ax.set_ylabel('Number of Individuals')
    ax.legend()
    ax.grid(True)
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Save the figure
    plt.savefig('epidemic_results.png')
    plt.close(fig)

if __name__ == '__main__':
    main()
