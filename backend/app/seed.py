from app.database import SessionLocal
from app.models.models import Experience, Profile, Project, Skill


def seed_database():
    db = SessionLocal()
    try:
        if db.query(Profile).count() > 0:
            print("Database already seeded.")
            return

        profile = Profile(
            name="Akbar",
            title="Full-Stack Developer & AI Engineer",
            bio="I build scalable web applications and AI-powered solutions. "
            "Passionate about clean architecture, developer experience, and "
            "creating products that make a difference.",
            avatar_url="https://avatars.githubusercontent.com/u/akbar",
            resume_url=None,
            location="San Francisco, CA",
            social_links={
                "github": "https://github.com/akbar",
                "linkedin": "https://linkedin.com/in/akbar",
                "twitter": "https://twitter.com/akbar",
                "email": "akbar@example.com",
            },
        )
        db.add(profile)

        skills_data = [
            Skill(name="Python", category="Backend", proficiency=5, order_index=1),
            Skill(name="FastAPI", category="Backend", proficiency=5, order_index=2),
            Skill(name="TypeScript", category="Frontend", proficiency=4, order_index=3),
            Skill(name="React", category="Frontend", proficiency=5, order_index=4),
            Skill(name="PostgreSQL", category="Database", proficiency=4, order_index=5),
            Skill(name="Docker", category="DevOps", proficiency=4, order_index=6),
            Skill(name="AWS", category="DevOps", proficiency=3, order_index=7),
            Skill(name="Groq/LLM APIs", category="AI", proficiency=4, order_index=8),
            Skill(name="TensorFlow", category="AI", proficiency=3, order_index=9),
            Skill(name="Next.js", category="Frontend", proficiency=4, order_index=10),
            Skill(name="GraphQL", category="Backend", proficiency=3, order_index=11),
            Skill(name="Redis", category="Database", proficiency=3, order_index=12),
        ]
        db.add_all(skills_data)

        projects_data = [
            Project(
                title="AI Portfolio Assistant",
                short_description="Groq-powered chatbot for IT portfolio",
                description="Built an intelligent chat assistant using Groq's LLaMA 3.3 API "
                "with conversation memory and Telegram notifications.",
                tech_stack=["FastAPI", "Groq", "React", "SQLite", "Telegram API"],
                github_url="https://github.com/akbar/portfolio",
                demo_url="https://portfolio.akbar.dev",
                featured=True,
                category="Full-Stack",
                year="2026",
                order_index=1,
            ),
            Project(
                title="Real-Time Dashboard",
                short_description="Analytics dashboard with WebSocket streaming",
                description="Real-time data visualization dashboard with WebSocket updates, "
                "custom chart components, and role-based access control.",
                tech_stack=["Next.js", "FastAPI", "PostgreSQL", "WebSockets", "Chart.js"],
                github_url="https://github.com/akbar/dashboard",
                featured=True,
                category="Full-Stack",
                year="2025",
                order_index=2,
            ),
            Project(
                title="ML Model Serving Platform",
                short_description="Production ML inference at scale",
                description="Designed and deployed a model serving infrastructure using Docker "
                "and Kubernetes with auto-scaling and monitoring.",
                tech_stack=["Python", "Docker", "Kubernetes", "FastAPI", "Prometheus"],
                github_url="https://github.com/akbar/ml-serving",
                featured=False,
                category="AI/ML",
                year="2025",
                order_index=3,
            ),
        ]
        db.add_all(projects_data)

        experiences_data = [
            Experience(
                company="Tech Corp",
                role="Senior Backend Engineer",
                description="Architected microservices handling 1M+ daily requests. "
                "Led migration from monolith to event-driven architecture.",
                start_date="2023-01",
                current=True,
                location="San Francisco, CA",
                order_index=1,
            ),
            Experience(
                company="StartupXYZ",
                role="Full-Stack Developer",
                description="Built the core product from MVP to production. "
                "Owned frontend, backend, and infrastructure.",
                start_date="2021-03",
                end_date="2022-12",
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
