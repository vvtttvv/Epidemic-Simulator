# Documentation

## Movement

- Chaotic Movement\
For chaotic movement is used gaussian movement $\large x' = x + \delta_{x} \cdot V_{x}$ were $\large \delta_{x}$ is a movement coefficient in range [-1,1] and $V_{x}$ is the speed of the point usually in interval from [0.5,3](cp)
- Centered movement\
It will add a center point(cp) were all persons will come with some probability P(k) default 0.5 (cp) if it pass the point will move by a function $\large x' = x + \alpha(x_{c}-x)$ were $\large \alpha$ is the power of atraction to center(cp)

## Getting sick
Every infected person has a radius of infection $\large r$(user can change it) and a probability to infect some one helthy $\large p$(cp)\
So the probability of getting sick is $p * t+1 \space \space  if \space  d(i,j) \leq r\space$ and $\space0  \space \space if \space d(i,j) > r$\
d(i,j) is the Euclidean distance $\sqrt{(x_{i} - x_{j})^{2} + (y_{i} - y_{j})^{2}}$

## Death after time 
Probability of surviving it given by a well known surviving formula $\large S(t) = e^{- \lamda t}$ were $\large \lamda$ is the probability of dying(cp).After some time t(cp) a person if it not die become helthy and recive some imunity i(cp) for getting sick next time and the formula for surviving will be $\large e^{-\lamda i t}$

## Quarantined
Is a simulation option that will enabled adds a quarantine zone where if a person is sick will go with probability of q(cp)
- Exists a option with no simtoms persons. If enabled a person with probability (cp) will become with no simptoms when getting sick(will not be quarantined)

