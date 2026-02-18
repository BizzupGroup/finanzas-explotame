from pydantic import BaseModel
from datetime import datetime

class TransactionCreate(BaseModel):
    amount: float
    type: str
    description: str | None = None
    category_id: int

class TransactionResponse(BaseModel):
    id: int
    amount: float
    type: str
    description: str | None
    created_at: datetime
    category_id: int
    
    class Config:
        from_attributes = True
