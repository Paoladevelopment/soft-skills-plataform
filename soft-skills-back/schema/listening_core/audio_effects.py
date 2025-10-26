from sqlmodel import SQLModel, Field

class AudioEffects(SQLModel):
    reverb: float | None = Field(default=None, ge=0.0, le=1.0)
    echo: float | None = Field(default=None, ge=0.0, le=1.0)
    background_noise: float | None = Field(default=None, ge=0.0, le=1.0)
    speed_variation: float | None = Field(default=None, ge=0.0, le=1.0)

    model_config = {
        "extra": "forbid",
        "from_attributes": True
    }