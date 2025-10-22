# Getting started with the task
Due to the size of the assignment in context of the recruitment process, I decided to utilize Cursor to start with. The first 9 commits are from Cursor. I reviewed the plan and Cursor (eagerly) implemented it's own plan. 

The plan looks fine from high-level perspective, because:
- cover the full breadth of the functional requirements, utilizing various technologies
- the setup with an API gateway and load balancer, utilizing redis cache is to be expected in production scenarios. 
- compliance (GDPR, WCAG 2.1 AA) have been identified.

Points of interest:
- I don't have experience with all technologies used e.g. Ocelot, iTextSharp. I should take a quick look at them to scout fit-for-purpose and any general architecture-level concerns
- This is AI - it might not work at all or just look good on paper. Make sure it does what it says and make it run.

General direction:
- I need to review it all and make sure the individual components run. The initial implementation does not seem bloated in terms of project structure and scaffolding. While the usage of some patterns (e.g. using mediatr and messaging) at the current scale (1 developer) is not necessary, it resembles a real-world scenario.
- continuous documentation - I will continuously document my thought process, along with major findings and decisions (fix or describe).
- I will mostly ignore the frontend (unless it doesn't start) as the position is for backend.
- After the code review, I will run the system in full.

Progress:
- Reviewed most of the components.
- Ran only UserManagement through VS without local postgres, so it failed immediately but at least it compiles. No time for the rest.
- I haven't tested the makefile either.
