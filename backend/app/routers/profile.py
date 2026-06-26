from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import Profile
from app.schemas.schemas import ProfileResponse

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("", response_model=ProfileResponse | None)
def get_profile(db: Session = Depends(get_db)):
    return db.query(Profile).order_by(Profile.id.asc()).first()
