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

## Model Parameters
The model parameters are defined as follows:

- β -- effective contact rate (product of the total contact rate and the transmission risk); the rate at which the contact between a susceptible individual and others infected will cause the susceptible individual to become infected. The parameters β<sub>i</sub> and β<sub>a</sub> represent the effective contact rate for the identified and for the asymptomatic, respectively. Considering the scientific research, we assume that β<sub>a</sub> = 0.58β<sub>i</sub>. On the other hand, β<sub>i</sub> is calculated by the product of basic reproduction number (R<sub>0</sub>) and recovery rate (γ):
  - β<sub>i</sub> = R<sub>0</sub> × γ

- ϕ -- the number of individuals immunized by vaccine.
- σ -- represents the proportion of immunized individuals that are susceptible again after a period of time (rate of loss of immunity).
- λ -- the latency rate.
- α -- the proportion of infected individuals that are identified, and we assume that non-identified individuals are asymptomatic.
- γ -- the recovery rate.
- μ -- the mortality rate.
- R<sub>0</sub> -- basic reproduction number.

## Model Equations
We decided to use the SEIAMD model that was formulated as a discrete-time model. A fast and direct way to discretize the model is by the forward Euler method, using the formula:
![image](https://github.com/vvtttvv/Epidemic-Simulator/assets/110112748/38845764-348e-4acb-9a48-83b0402b9aab)

with **Δt = 1** day.
Thus, by applying the same procedure described above, the resulting system of difference equations that rule the SEIAMD model behavior is:

![image](https://github.com/vvtttvv/Epidemic-Simulator/assets/110112748/96947bc2-ec6d-4b2d-98db-a575479a8937)


where **N<sub>t</sub> = S<sub>t</sub> + E<sub>t</sub> + I<sub>t</sub> + A<sub>t</sub> + M<sub>t</sub> + D<sub>t</sub>**.

## Bibliography:
https://www.mdpi.com/2076-3417/13/22/12252
