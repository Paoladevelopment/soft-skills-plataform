import uuid
from datetime import datetime, timedelta, timezone

from enums.common import Priority, Status
from enums.task import TaskType
from enums.user import UserRoles
from model.learning_goal import LearningGoal
from model.objective import Objective
from model.task import Task
from model.user import User
from passlib.context import CryptContext
from sqlmodel import Session
from utils.db import get_session

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_seed_data(session: Session):
    users = [
        User(
            user_id=uuid.uuid4(),
            name="Alice Johnson",
            username="alicej",
            email="alice@example.com",
            password=pwd_context.hash("securepassword1"),
            role=UserRoles.ADMIN
        ),
        User(
            user_id=uuid.uuid4(),
            name="Bob Smith",
            username="bobsmith",
            email="bob@example.com",
            password=pwd_context.hash("securepassword2"),
            role=UserRoles.USER
        ),
        User(
            user_id=uuid.uuid4(),
            name="Charlie Brown",
            username="charlieb",
            email="charlie@example.com",
            password=pwd_context.hash("securepassword3"),
            role=UserRoles.USER
        ),
        User(
            user_id=uuid.uuid4(),
            name="Diana Prince",
            username="dianap",
            email="diana@example.com",
            password=pwd_context.hash("securepassword4"),
            role=UserRoles.USER
        ),
    ]

    session.add_all(users)
    session.commit()
    
    user_map = {user.name: user.user_id for user in users}

    learning_goals = []

    # User 1: 10 learning goals, each with 3 objectives
    for i in range(10):
        lg = LearningGoal(
            learning_goal_id=uuid.uuid4(),
            user_id=user_map["Alice Johnson"],
            title=f"Learning Goal {i+1}",
            description=f"Description for Learning Goal {i+1}",
            estimated_completion_time=90,
            impact="Boosting skills in various domains"
        )
        learning_goals.append(lg)

    # Other users: 2 learning goals each with varied objectives
    for user in ["Bob Smith", "Charlie Brown", "Diana Prince"]:
        for j in range(2):
            lg = LearningGoal(
                learning_goal_id=uuid.uuid4(),
                user_id=user_map[user],
                title=f"{user.split()[0]}'s Learning Goal {j+1}",
                description=f"Personal learning goal for {user}",
                status=Status.IN_PROGRESS if j % 2 == 0 else Status.NOT_STARTED,
                priority=Priority.LOW if j % 2 == 0 else Priority.MEDIUM,
                estimated_completion_time=45,
                impact="Enhancing personal growth"
            )
            learning_goals.append(lg)

    session.add_all(learning_goals)
    session.commit()

    # Mapping learning goals for objectives
    learning_goal_map = {lg.title: lg.learning_goal_id for lg in learning_goals}

    # Objectives for each learning goal
    objectives = []

    # Alice: 3 objectives per learning goal
    for i in range(10):
        for obj_id in range(1, 4):
            objectives.append(
                Objective(
                    objective_id=uuid.uuid4(),
                    learning_goal_id=learning_goal_map[f"Learning Goal {i+1}"],
                    title=f"Objective {obj_id} for Learning Goal {i+1}",
                    description=f"Detailed description for Objective {obj_id} of Learning Goal {i+1}",
                    status=Status.NOT_STARTED,
                    priority=Priority.MEDIUM,
                    order_index=obj_id,
                    due_date=datetime.now(timezone.utc) + timedelta(days=30 * obj_id)
                )
            )

    # Other users: Varied objectives per learning goal
    for user in ["Bob Smith", "Charlie Brown", "Diana Prince"]:
        for j in range(2):
            num_objectives = 2 if j == 0 else 4 
            for obj_id in range(1, num_objectives + 1):
                objectives.append(
                    Objective(
                        objective_id=uuid.uuid4(),
                        learning_goal_id=learning_goal_map[f"{user.split()[0]}'s Learning Goal {j+1}"],
                        title=f"Objective {obj_id} for {user.split()[0]}'s Learning Goal {j+1}",
                        description=f"Description for Objective {obj_id}",
                        status=Status.NOT_STARTED,
                        priority=Priority.LOW if obj_id % 2 == 0 else Priority.HIGH,
                        order_index=obj_id,
                        due_date=datetime.now(timezone.utc) + timedelta(days=15 * obj_id)
                    )
                )

    session.add_all(objectives)
    session.commit()

    tasks = []

    # Assigning tasks to objectives
    for obj in objectives:
        for task_id in range(1, 4): 
            tasks.append(
                Task(
                    task_id=uuid.uuid4(),
                    objective_id=obj.objective_id,
                    title=f"Task {task_id} for {obj.title}",
                    description=f"Detailed task description {task_id} for {obj.title}",
                    task_type=TaskType.READING if task_id % 3 == 0 else TaskType.WRITING,
                    status=Status.NOT_STARTED,
                    priority=Priority.MEDIUM if task_id % 2 == 0 else Priority.HIGH,
                    estimated_time=30 + (task_id * 10),
                    actual_time=None,
                    due_date=obj.due_date - timedelta(days=task_id * 5),
                    order_index=task_id,
                    is_optional=True if task_id == 3 else False
                )
            )

    session.add_all(tasks)
    session.commit()

    print("✅ Seed data inserted successfully!")

if __name__ == "__main__":
    session = next(get_session())
    try:
        create_seed_data(session)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"❌ Error seeding data: {e}")
    finally:
        session.close()

