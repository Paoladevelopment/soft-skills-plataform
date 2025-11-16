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
  title:  str | None = Field(default=None, description="Título actualizado del módulo")
  category:  str | None = Field(default=None, description="Categoría actualizada del módulo. Debe ser una de las categorías predefinidas.")
  status:  str | None = Field(default=None, description="Estado actualizado del módulo. Puede ser 'active' o 'archived'")
  description:  str | None = Field(default=None, description="Descripción actualizada del módulo, explicando su contenido y propósito.")
  image_url:  str | None = Field(default=None, description="URL actualizada de la imagen de portada del módulo.")
  objective:  str | None = Field(default=None, description="Objetivo actualizado del módulo, describiendo lo que el usuario logrará")
  tags: List[str] | None = Field(
    default=None, 
    description="Lista actualizada de etiquetas. Si se omite, las etiquetas permanecen sin cambios. Si se envía una lista vacía, las etiquetas se eliminarán."
  )
  route_path: str | None = Field(default=None, description="Ruta actualizada del módulo.")

  model_config = {"json_schema_extra": {"example": MODULE_UPDATE_EXAMPLE}}

class ModuleResponse(BaseResponse[ModuleRead]):
  data: ModuleRead

ModulePaginatedResponse = PaginatedResponse[ModuleRead]