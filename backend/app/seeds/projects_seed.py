import asyncio
import logging
from sqlalchemy.future import select
from app.core.database import SessionLocal
from app.modules.projects.models.project import Project, ProjectStatus, ProjectPriority, ProjectType

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("projects_seed")

INITIAL_PROJECTS = [
    {
        "name": "Flux Limp",
        "slug": "flux-limp",
        "description": "Plataforma inteligente de agendamento e otimizaçao de rotas para serviços de limpeza residencial e comercial.",
        "status": ProjectStatus.DEVELOPMENT,
        "priority": ProjectPriority.HIGH,
        "project_type": ProjectType.SAAS,
        "stack": ["React", "NestJS", "PostgreSQL", "TailwindCSS"],
        "github_url": "https://github.com/devpilot/flux-limp",
        "production_url": "https://fluxlimp.com"
    },
    {
        "name": "Flux Guard",
        "slug": "flux-guard",
        "description": "Sistema de monitoramento e segurança perimetral com análise computacional em tempo real.",
        "status": ProjectStatus.PLANNING,
        "priority": ProjectPriority.CRITICAL,
        "project_type": ProjectType.AUTOMATION,
        "stack": ["Python", "FastAPI", "OpenCV", "Redis"],
        "github_url": "https://github.com/devpilot/flux-guard",
        "production_url": None
    },
    {
        "name": "Consigo",
        "slug": "consigo",
        "description": "Aplicativo de microcrédito e educaçao financeira voltado para microempreendedores individuais.",
        "status": ProjectStatus.TESTING,
        "priority": ProjectPriority.MEDIUM,
        "project_type": ProjectType.MOBILE_APP,
        "stack": ["Flutter", "Go", "PostgreSQL"],
        "github_url": "https://github.com/devpilot/consigo",
        "production_url": "https://consigo.app"
    },
    {
        "name": "ZapScore",
        "slug": "zapscore",
        "description": "API de análise de crédito e reputaçao de clientes integrada a conversas do WhatsApp.",
        "status": ProjectStatus.PUBLISHED,
        "priority": ProjectPriority.HIGH,
        "project_type": ProjectType.API,
        "stack": ["Node.js", "Express", "MongoDB", "Redis"],
        "github_url": "https://github.com/devpilot/zapscore",
        "production_url": None
    },
    {
        "name": "Job Pilot AI",
        "slug": "job-pilot-ai",
        "description": "Agente inteligente que automatiza a busca, triagem e candidatura personalizada a vagas de tecnologia.",
        "status": ProjectStatus.DEVELOPMENT,
        "priority": ProjectPriority.HIGH,
        "project_type": ProjectType.AGENT,
        "stack": ["Python", "FastAPI", "Qdrant", "LangChain"],
        "github_url": "https://github.com/devpilot/job-pilot-ai",
        "production_url": None
    },
    {
        "name": "Agente Idiomas",
        "slug": "agente-idiomas",
        "description": "Tutor personalizado de conversaçao multilíngue utilizando inteligência artificial generativa de voz.",
        "status": ProjectStatus.IDEA,
        "priority": ProjectPriority.LOW,
        "project_type": ProjectType.AGENT,
        "stack": ["Next.js", "Python", "FastAPI", "WebRTC"],
        "github_url": "https://github.com/devpilot/agente-idiomas",
        "production_url": None
    }
]

async def seed_projects():
    logger.info("Starting projects seed...")
    async with SessionLocal() as session:
        for project_data in INITIAL_PROJECTS:
            # Check if project already exists
            result = await session.execute(
                select(Project).filter(Project.slug == project_data["slug"])
            )
            existing = result.scalars().first()
            
            if existing:
                logger.info(f"Project '{project_data['name']}' ({project_data['slug']}) already exists. Skipping.")
                continue
                
            project = Project(
                name=project_data["name"],
                slug=project_data["slug"],
                description=project_data["description"],
                status=project_data["status"],
                priority=project_data["priority"],
                project_type=project_data["project_type"],
                stack=project_data["stack"],
                github_url=project_data["github_url"],
                production_url=project_data["production_url"]
            )
            session.add(project)
            logger.info(f"Adding project '{project.name}'...")
            
        await session.commit()
    logger.info("Seed completed successfully.")

if __name__ == "__main__":
    asyncio.run(seed_projects())
