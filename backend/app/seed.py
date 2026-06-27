from app.database import SessionLocal
from app.models.models import Experience, Profile, Project, Skill


def seed_database():
    db = SessionLocal()
    try:
        if db.query(Profile).count() > 0:
            print("Database already seeded.")
            return

        profile = Profile(
            name="Akbarbek Umedilloev",
            title="Full Stack Developer | React.js | Django | Python | AI Integration",
            bio="Motivated Full Stack Developer and Computer Science student with 2+ years of experience "
            "building modern web applications and AI-powered solutions. Proficient in React.js, JavaScript, "
            "Python, Django, REST APIs, and databases. Open to remote opportunities worldwide.",
            avatar_url=None,
            resume_url=None,
            location="Uzbekistan",
            social_links={
                "github": "https://github.com/17akow",
                "linkedin": "https://linkedin.com/in/17akow",
                "email": "akbareur@gmail.com",
                "phone": "+998 94 734 51 00",
            },
        )
        db.add(profile)

        skills_data = [
            # Frontend
            Skill(name="HTML5", category="Frontend", proficiency=5, order_index=1),
            Skill(name="CSS3 / Tailwind CSS", category="Frontend", proficiency=5, order_index=2),
            Skill(name="JavaScript ES6+", category="Frontend", proficiency=5, order_index=3),
            Skill(name="React.js", category="Frontend", proficiency=5, order_index=4),
            Skill(name="TypeScript (Basic)", category="Frontend", proficiency=3, order_index=5),
            Skill(name="Redux Toolkit", category="Frontend", proficiency=4, order_index=6),
            Skill(name="React Router", category="Frontend", proficiency=4, order_index=7),
            Skill(name="Axios / Fetch API", category="Frontend", proficiency=4, order_index=8),
            # Backend
            Skill(name="Python", category="Backend", proficiency=5, order_index=9),
            Skill(name="Django", category="Backend", proficiency=4, order_index=10),
            Skill(name="Django REST Framework", category="Backend", proficiency=4, order_index=11),
            Skill(name="PostgreSQL", category="Backend", proficiency=4, order_index=12),
            Skill(name="JWT Authentication", category="Backend", proficiency=4, order_index=13),
            Skill(name="API Development", category="Backend", proficiency=4, order_index=14),
            # AI & Tools
            Skill(name="OpenAI API", category="AI & Tools", proficiency=4, order_index=15),
            Skill(name="AI Chatbots", category="AI & Tools", proficiency=4, order_index=16),
            Skill(name="Prompt Engineering", category="AI & Tools", proficiency=4, order_index=17),
            Skill(name="Git & GitHub", category="AI & Tools", proficiency=4, order_index=18),
            Skill(name="Docker (Basic)", category="AI & Tools", proficiency=2, order_index=19),
            Skill(name="Linux / Bash", category="AI & Tools", proficiency=3, order_index=20),
            Skill(name="VS Code", category="AI & Tools", proficiency=5, order_index=21),
        ]
        db.add_all(skills_data)

        projects_data = [
            Project(
                title="AI Assistant Platform",
                short_description="AI-powered chatbot with auth, conversation history, role-based access",
                description="Full-stack AI chatbot platform with user authentication, conversation history "
                "persistence, role-based access control, and OpenAI/Groq integration. Built with React.js "
                "frontend and Django REST Framework backend with PostgreSQL.",
                tech_stack=["React.js", "Django", "OpenAI API", "PostgreSQL", "JWT"],
                github_url="https://github.com/17akow/ai-assistant",
                demo_url=None,
                featured=True,
                category="Full-Stack",
                year="2025",
                order_index=1,
            ),
            Project(
                title="Full Stack Dashboard",
                short_description="Responsive admin dashboard with charts, analytics, user management",
                description="Responsive admin dashboard featuring interactive charts and analytics, "
                "user management interface, and a secure REST API. Built with React.js frontend and "
                "Django REST Framework backend with PostgreSQL and Tailwind CSS styling.",
                tech_stack=["React.js", "Django REST", "PostgreSQL", "Tailwind CSS", "Chart.js"],
                github_url="https://github.com/17akow/dashboard",
                demo_url=None,
                featured=True,
                category="Full-Stack",
                year="2025",
                order_index=2,
            ),
            Project(
                title="E-commerce Web Application",
                short_description="Full-stack e-commerce with product mgmt, cart, checkout, payment sim",
                description="Full-stack e-commerce platform with product management, shopping cart, "
                "checkout flow, and payment simulation. Features JWT authentication, PostgreSQL database, "
                "and a responsive React.js frontend.",
                tech_stack=["React.js", "Django", "PostgreSQL", "JWT", "Tailwind CSS"],
                github_url="https://github.com/17akow/ecommerce",
                demo_url=None,
                featured=False,
                category="Full-Stack",
                year="2025",
                order_index=3,
            ),
            Project(
                title="Personal Portfolio Website",
                short_description="Modern portfolio website to showcase skills and experience",
                description="Modern personal portfolio website built with HTML, CSS, and JavaScript. "
                "Showcases skills, projects, and professional experience with a clean responsive design.",
                tech_stack=["HTML", "CSS", "JavaScript"],
                github_url=None,
                demo_url="https://akbarbek.dev",
                featured=True,
                category="Frontend",
                year="2025",
                order_index=4,
            ),
        ]
        db.add_all(projects_data)

        experiences_data = [
            Experience(
                company="Self-Employed (Remote)",
                role="Freelance Full Stack Developer",
                description="Developed 10+ web projects including landing pages, portfolios, and dashboards. "
                "Built responsive frontends using React.js, JavaScript, and Tailwind CSS. "
                "Developed backend REST APIs using Python, Django, and Django REST Framework. "
                "Integrated JWT authentication, PostgreSQL, and third-party APIs.",
                start_date="2022-01",
                current=True,
                location="Remote",
                order_index=1,
            ),
            Experience(
                company="Google / Coursera",
                role="IT Support Learner & Network Lab Practice",
                description="Completed 5-course Google IT Support Professional Certificate. "
                "Gained hands-on experience with networking (TCP/IP, DNS, DHCP), Linux & Windows "
                "administration, and IT security fundamentals.",
                start_date="2023-01",
                end_date="2024-07",
                current=False,
                location="Remote",
                order_index=2,
            ),
        ]
        db.add_all(experiences_data)

        db.commit()
        print("Database seeded successfully!")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
