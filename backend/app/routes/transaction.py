from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse
from fastapi import APIRouter, Depends, HTTPException
from app.models.category import Category
from fastapi import HTTPException
from app.services.security import get_current_user
from app.models.user import User
from sqlalchemy import func


router = APIRouter(prefix="/transactions", tags=["Transactions"])

#@router.post("/", response_model=TransactionResponse)
#def create_transaction(
#    transaction: TransactionCreate,
#    db: Session = Depends(get_db),
#    current_user: User = Depends(get_current_user)
#):
#    new_transaction = Transaction(
#        amount=transaction.amount,
#        type=transaction.type,
#        description=transaction.description,
#        user_id=current_user.id
#    )
#
#    db.add(new_transaction)
#    db.commit()
#    db.refresh(new_transaction)
#
#    return new_transaction


@router.get("/", response_model=list[TransactionResponse])
def get_my_transactions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Transaction).filter(
        Transaction.user_id == current_user.id
    ).all()


@router.get("/balance")
def get_balance(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    total_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "income"
    ).scalar() or 0

    total_expense = db.query(func.sum(Transaction.amount)).filter(
        Transaction.user_id == current_user.id,
        Transaction.type == "expense"
    ).scalar() or 0

    balance = total_income - total_expense

    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "balance": balance
    }

# @router.delete("/{transaction_id}")
# def delete_transaction(
#     transaction_id: int,
#     db: Session = Depends(get_db),
#     current_user: User = Depends(get_current_user)
# ):
#     transaction = db.query(Transaction).filter(
#         Transaction.id == transaction_id,
#         Transaction.user_id == current_user.id
#     ).first()

#     if not transaction:
#         raise HTTPException(status_code=404, detail="Transaction not found")

#     db.delete(transaction)
#     db.commit()

#     return {"message": "Transaction deleted"}

@router.delete("/{transaction_id}")
def delete_transaction(transaction_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id,
        Transaction.user_id == current_user.id
    ).first()

    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")

    db.delete(transaction)
    db.commit()

    return {"message": "Transaction deleted"}




@router.post("/", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Verificar que la categoría exista y pertenezca al usuario
    category = db.query(Category).filter(
        Category.id == transaction.category_id,
        Category.user_id == current_user.id
    ).first()

    if not category:
        raise HTTPException(status_code=400, detail="Invalid category")

    new_transaction = Transaction(
        amount=transaction.amount,
        type=transaction.type,
        description=transaction.description,
        user_id=current_user.id,
        category_id=transaction.category_id
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction
