# Documentation

## Movement

- Chaotic Movement\
For chaotic movement is used gaussian movement $\large x' = x + \delta_{x} \cdot V_{x}$ were $\delta_{x}$ is a movement coefficient in range [-1,1] and $V_{x}$ is the speed of the point usually in interval from [0.5,3](user can change this parametr)
- Centered movement\
It will add a center point(user can put the coordinates of this point) were all persons will come with some probability P(k) default 0.5 (user can change it) if it pass the point will move by a function $x' = x + \alpha(x_{c}-x)$ were $\alpha$ is the power of atraction to center(user can change this parametr)

