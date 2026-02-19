from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from fastapi import Request
from app.routes import categories

from app.core.database import engine, Base
from app.routes import user as user_routes  # 👈 renombrado
from app.models import user  # 👈 esto es solo para registrar el modelo
from app.routes import transaction
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Finance App API")

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://finanzas-explotame-2r695olh3-saul435s-projects.vercel.app",
    "https://finanzas-explotame.vercel.app",
    "https://finanzas-explotame-mgfxfih7s-bizzups-projects.vercel.app",
    "https://finanzas-explotame-git-main-bizzups-projects.vercel.app"

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


templates = Jinja2Templates(directory="app/templates")


app.include_router(user_routes.router)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "API funcionando con usuarios"}

@app.get("/app")
def serve_app(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

app.include_router(transaction.router)

app.include_router(categories.router)