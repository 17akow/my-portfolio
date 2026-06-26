import datetime

from pydantic import BaseModel, EmailStr, Field


class ProfileBase(BaseModel):
    name: str
    title: str
    bio: str | None = None
    avatar_url: str | None = None
    resume_url: str | None = None
    location: str | None = None
    social_links: dict | None = None


class ProfileResponse(ProfileBase):
    id: int
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True


class SkillBase(BaseModel):
    name: str
    category: str
    proficiency: int = Field(ge=1, le=5, default=3)
    icon: str | None = None
    color: str | None = None
    order_index: int = 0


class SkillResponse(SkillBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class SkillCategory(BaseModel):
    category: str
    skills: list[SkillResponse]


class ProjectBase(BaseModel):
    title: str
    description: str
    short_description: str | None = None
    tech_stack: list[str] | None = None
    github_url: str | None = None
    demo_url: str | None = None
    image_url: str | None = None
    featured: bool = False
    category: str | None = None
    year: str | None = None
    order_index: int = 0


class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class ExperienceBase(BaseModel):
    company: str
    role: str
    description: str | None = None
    start_date: str
    end_date: str | None = None
    current: bool = False
    location: str | None = None
    order_index: int = 0


class ExperienceResponse(ExperienceBase):
    id: int
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(max_length=300, default="")
    message: str = Field(min_length=1, max_length=5000)


class ContactResponse(BaseModel):
    id: int
    name: str
    email: str
    subject: str | None
    message: str
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True


class ContactSuccess(BaseModel):
    success: bool = True
    message: str = "Message received. I'll get back to you soon!"


class ChatRequest(BaseModel):
    session_id: str | None = None
    message: str = Field(min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    tokens_used: int | None = None


class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
