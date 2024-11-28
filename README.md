Getting meta with my sickness, and potentially forecast its duration.

### Experiment Design
We will model the spread of influenza B in NYC from 2009 to 2018. The Reproduction rate is 1.4, indicating that 1.4 people will be infected by each infected person. Reference `Recommneded Readings` section for all cited research.

### Relevant Parameters
R0, the reproduction number, is the average number of people an infected person will infect (if R0 < 1, the epidemic will die out. if R0 > 1, the epidemic will grow). The following list of elements will be considered to calculate R0:
- Population density (we'll do NYC for something interesting)
- Vaccination rate
- Pre-existing immunity
- Human behavior

We are interested in the following population groups:
- Infected (I) - people who have the disease
- Susceptible (S) - people who can receive the disease
- Recovered (R) - people who have recovered from the disease and can no longer get it

### Recommended Readings
- [quantifying outbreaks](https://sph.umich.edu/pursuit/2020posts/how-scientists-quantify-outbreaks.html) with R0 (Reproduction Number) to predict maximum epidemic potential
- modeling the spread of [seasonal flu](https://arxiv.org/pdf/2101.07926) based on human behavior and vaccination dynamics
- simulating the spread of viruses, by [3Blue1Brown](https://www.youtube.com/watch?v=gxAaO2rsdIs)
- [mathematical equations](https://jxshix.people.wm.edu/2009-harbin-course/classic/Kermack-McKendrick-1927-I.pdf) used for SIR model, studied by Kermack and McKendrick 
- new york influenza [dataset](https://www.kaggle.com/datasets/titustitus/h1n1-new-york-2009?resource=download) (2009 - 2018)