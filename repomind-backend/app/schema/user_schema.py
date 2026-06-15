from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict
from pydantic.alias_generators import to_camel


class UserResponse(BaseModel):
    """
    Public user shape returned by the API. Fields are serialized as camelCase
    to match the frontend's TypeScript types (fullName, avatarUrl, createdAt,
    updatedAt).
    """
    id: UUID
    name: str
    email: EmailStr
    full_name: str | None = None
    avatar_url: str | None = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        alias_generator=to_camel,
        populate_by_name=True,
    )


class UserUpdate(BaseModel):
    name: str | None = None
    full_name: str | None = None
    avatar_url: str | None = None