from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Project
from app.schemas.schemas import ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.get("", response_model=list[ProjectResponse])
def list_projects(
    featured: bool | None = None,
    category: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Project).order_by(Project.order_index.asc(), Project.created_at.desc())

    if featured is not None:
        query = query.filter(Project.featured == featured)
    if category:
        query = query.filter(Project.category == category)

    return query.all()
