from typing import List

from model.module import ModuleBase
from schema.base import BaseResponse, PaginatedResponse
from sqlmodel import Field, SQLModel
from utils.payloads import (MODULE_CREATE_EXAMPLE, MODULE_READ_EXAMPLE,
                            MODULE_UPDATE_EXAMPLE)


class ModuleCreate(ModuleBase):
  model_config = {"json_schema_extra": {"example": MODULE_CREATE_EXAMPLE}}


class ModuleRead(ModuleBase):
  id: int
  model_config = {"json_schema_extra": {"example": MODULE_READ_EXAMPLE}}

class ModuleUpdate(SQLModel):
  title:  str | None = Field(default=None, description="Updated title of the module")
  category:  str | None = Field(default=None, description="Updated category of the module. Must be one of the predefined categories.")
  status:  str | None = Field(default=None, description="Updated status of the module. Can be 'active' or 'archived'")
  description:  str | None = Field(default=None, description="Updated description of the module, explaining its content and purpose.")
  image_url:  str | None = Field(default=None, description="Updated URL of the module's cover image.")
  objective:  str | None = Field(default=None, description="Updated objective of the module, describing what the user will achieve")
  tags: List[str] | None = Field(
    default=None, 
    description="Updated list of tags. If omitted, tags remain unchanged. If an empty list is sent, tags will be removed."
  )

  model_config = {"json_schema_extra": {"example": MODULE_UPDATE_EXAMPLE}}

class ModuleResponse(BaseResponse[ModuleRead]):
  data: ModuleRead

ModulePaginatedResponse = PaginatedResponse[ModuleRead]