# SEIAMD Algorithm Model

## Introduction

In crafting a mathematical model, our aim is to mirror authentic data with great precision, enabling us to leverage the derived parameters to infer insights about real-world scenarios. While the SIR model's straightforward nature is beneficial for initial analyses of an epidemic under data-limited conditions, its application to specific viruses has often yielded unsatisfactory outcomes. This is due to several factors inherent to these viruses, such as significant latency periods, the presence of asymptomatic carriers, and the potential for reinfection stemming from the diminishing of immunity.

To address these shortcomings of the SIR model in capturing the dynamics of emerging viruses, we introduce the SEIAMD model. This augmented version of the SIR framework takes into account several additional complexities: the emergence of new virus strains over time, multiple phases of vaccination campaigns, the presence of undetected asymptomatic carriers, and the waning of immunity that was previously established either through infection or vaccination.

The SEIAMD model that we propose is based on the article “A Mathematical Model for the COVID-19 Pandemic in Tokyo through Changing Point Calculus” by Laura Martinez-Vazquez and Pau Fonseca i Casas. The model is an extension of the SIR model and it consists of six compartments: Susceptible, Exposed, Identified, Asymptomatic, iMmunized, and Deceased.

## Compartments

- **S - Susceptible:** Individuals who have not been infected and are at risk of contracting the virus.
- **E - Exposed:** Individuals who have been exposed to the virus and are currently in the incubation period, not yet infectious or symptomatic.
- **I - Identified:** Infected individuals who have been diagnosed as positive for the virus.
- **A - Asymptomatic:** Infected individuals who do not exhibit symptoms and thus have not been diagnosed or identified as carriers.
- **M - Immunized:** Individuals who have acquired immunity, either post-infection or through vaccination, with consideration for the potential decrease in immunity over time.
- **D - Deceased:** Individuals who have succumbed to the virus. This model assumes that deceased individuals had been positively identified.

## SEIAMD Model Parameters

The SEIAMD model incorporates several key parameters to simulate the spread and control of infectious diseases with realistic precision:

- **β (Effective Contact Rate):** A measure combining the rate of contact and the probability of transmission. It includes variant-specific contact rates.
- **φ (Vaccination Parameter):** Denotes the number of individuals immunized by vaccination, accounting for different efficacy rates post-dose.
- **σ (Re-Susceptibility Rate):** The fraction of immunized individuals who can become susceptible again.
- **p (Immunity Waning Period):** The time frame after which immunity starts to wane.
- **λ (Latency Rate):** The incubation period for the virus, varies according to different viral strains.
- **α (Asymptomatic Case Proportion):** The estimated proportion of infected individuals who are asymptomatic and thus not identified.
- **γ (Recovery Rate):** Calculated based on the number of individuals discharged from medical care over a specified time frame.
- **μ (Mortality Rate):** Determined from official data, this rate reflects the proportion of the population that succumbs to the disease over a given time period.

These parameters enable the model to more accurately reflect the complexities of epidemic trends, considering the impact of interventions like vaccination and natural disease progression.

```python
class Parameters:
    def __init__(self, date, beta_i, lambda_p, alpha, gamma, mu, sigma):
        self.date = date
        self.beta_i = beta_i
        self.lambda_p = lambda_p
        self.alpha = alpha
        self.gamma = gamma
        self.mu = mu
        self.sigma = sigma
```

## Model Equations
The resulting system of difference equations that rule the SEIAMD model behavior is:
![image](https://github.com/vvtttvv/Epidemic-Simulator/assets/110112748/30ae744b-c8bc-48a7-9215-9502840b0cea)

```python
def model_equations(s_t, e_t, i_t, a_t, m_t, d_t, n_t, m_p6m, p_phi, p):
    s_n = s_t - p.beta_i * s_t / n_t * i_t - p.beta_a * s_t / n_t * a_t - p_phi + p.sigma * m_p6m
    e_n = e_t + p.beta_i * s_t / n_t * i_t + p.beta_a * s_t / n_t * a_t - p.lambda_p * e_t
    i_n = i_t + p.alpha * p.lambda_p * e_t - p.gamma * i_t - p.mu * i_t
    a_n = a_t + (1 - p.alpha) * p.lambda_p * e_t - p.gamma * a_t
    m_n = m_t + p.gamma * i_t + p.gamma * a_t + p_phi - p.sigma * m_p6m
    d_n = d_t + p.mu * i_t
    n_n = s_n + e_n + i_n + a_n + m_n + d_n
    return (s_n, e_n, i_n, a_n, m_n, d_n, n_n)
```

## Bibliography:
https://www.mdpi.com/2076-3417/13/22/12252
