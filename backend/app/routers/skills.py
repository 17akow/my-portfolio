from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Skill
from app.schemas.schemas import SkillCategory, SkillResponse

router = APIRouter(prefix="/skills", tags=["Skills"])


@router.get("", response_model=list[SkillCategory])
def list_skills(
    category: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Skill).order_by(Skill.order_index.asc())

    if category:
        query = query.filter(Skill.category == category)

    skills = query.all()

    grouped: dict[str, list[SkillResponse]] = {}
    for skill in skills:
        grouped.setdefault(skill.category, []).append(
            SkillResponse.model_validate(skill)
        )

    return [
        SkillCategory(category=cat, skills=sorted(skills, key=lambda s: s.proficiency, reverse=True))
        for cat, skills in grouped.items()
    ]
