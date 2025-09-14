import uuid
from datetime import datetime, timedelta, timezone
from collections import defaultdict
from uuid import UUID

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
from utils.mongodb import MongoDB

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def sync_to_mongodb(users, learning_goals, objectives, tasks):
    """Sync seed data to MongoDB collections"""
    try:
        mongodb = MongoDB()
        
        users_data = [user.model_dump() for user in users]
        learning_goals_data = [lg.model_dump() for lg in learning_goals]
        objectives_data = [obj.model_dump() for obj in objectives]
        tasks_data = [task.model_dump() for task in tasks]
        
        if users_data:
            for user_data in users_data:
                mongodb.insert_one("users", user_data)
            print(f"Synced {len(users_data)} users to MongoDB")
            
        if learning_goals_data:
            for lg_data in learning_goals_data:
                mongodb.insert_one("learning_goals", lg_data)
            print(f"Synced {len(learning_goals_data)} learning goals to MongoDB")
            
        if objectives_data:
            for obj_data in objectives_data:
                mongodb.insert_one("objectives", obj_data)
            print(f"Synced {len(objectives_data)} objectives to MongoDB")
            
        if tasks_data:
            for task_data in tasks_data:
                mongodb.insert_one("tasks", task_data)
            print(f"Synced {len(tasks_data)} tasks to MongoDB")
            
    except Exception as e:
        print(f"Failed to sync to MongoDB: {e}")


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

    for user in ["Bob Smith", "Charlie Brown", "Diana Prince"]:
        for j in range(2):
            lg = LearningGoal(
                learning_goal_id=uuid.uuid4(),
                user_id=user_map[user],
                title=f"{user.split()[0]}'s Learning Goal {j+1}",
                description=f"Personal learning goal for {user}",
                impact="Enhancing personal growth"
            )
            learning_goals.append(lg)

    session.add_all(learning_goals)
    session.commit()

    learning_goal_map = {lg.title: lg.learning_goal_id for lg in learning_goals}

    objectives = []

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
                    due_date=datetime.now(timezone.utc) + timedelta(days=30 * obj_id)
                )
            )

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
                        due_date=datetime.now(timezone.utc) + timedelta(days=15 * obj_id)
                    )
                )

    session.add_all(objectives)
    session.commit()

    objective_map = defaultdict(list)
    for obj in objectives:
        objective_map[obj.learning_goal_id].append(obj.objective_id)
    
    for lg in learning_goals:
        if lg.learning_goal_id in objective_map:
            lg.objectives_order = objective_map[lg.learning_goal_id]
    
    session.add_all(learning_goals)
    session.commit()

    tasks = []
    task_map = defaultdict(list)

    for obj in objectives:
        for task_id in range(1, 4):
            task_uuid = uuid.uuid4()
            
            task1_started = datetime.now(timezone.utc) - timedelta(days=3)
            task1_completed = datetime.now(timezone.utc) - timedelta(days=1)
            task2_started = datetime.now(timezone.utc) - timedelta(days=2)
            
            if task_id == 1:
                task_status = Status.COMPLETED
                actual_time = 60 * 1.5
                started_at = task1_started
                completed_at = task1_completed
            elif task_id == 2:
                task_status = Status.IN_PROGRESS
                actual_time = None
                started_at = task2_started
                completed_at = None
            else:
                task_status = Status.NOT_STARTED
                actual_time = None
                started_at = None
                completed_at = None
            
            tasks.append(
                Task(
                    task_id=task_uuid,
                    objective_id=obj.objective_id,
                    title=f"Task {task_id} for {obj.title}",
                    description=f"Detailed task description {task_id} for {obj.title}",
                    task_type=TaskType.READING if task_id % 3 == 0 else TaskType.WRITING,
                    status=task_status,
                    priority=Priority.MEDIUM if task_id % 2 == 0 else Priority.HIGH,
                    estimated_time=60 * (1 + task_id * 0.5),  # 60, 90, 120 minutes (1, 1.5, 2 pomodoros)
                    actual_time=actual_time,
                    started_at=started_at,
                    completed_at=completed_at,
                    due_date=obj.due_date - timedelta(days=task_id * 5),
                    is_optional=(task_id == 3)
                )
            )
            task_map[obj.objective_id].append((task_id, task_uuid, task_status))

    session.add_all(tasks)
    session.commit()

    for obj in objectives:
        sorted_tasks = sorted(task_map[obj.objective_id], key=lambda x: x[0])
        
        obj.tasks_order_by_status = {
            "not_started": [],
            "in_progress": [],
            "completed": [],
            "paused": [],
        }
        
        has_active_tasks = False
        has_completed_tasks = False
        
        for _, task_uuid, task_status in sorted_tasks:
            if task_status == Status.COMPLETED:
                obj.tasks_order_by_status["completed"].append(str(task_uuid))
                has_completed_tasks = True
            elif task_status == Status.IN_PROGRESS:
                obj.tasks_order_by_status["in_progress"].append(str(task_uuid))
                has_active_tasks = True
            elif task_status == Status.PAUSED:
                obj.tasks_order_by_status["paused"].append(str(task_uuid))
                has_active_tasks = True
            else: 
                obj.tasks_order_by_status["not_started"].append(str(task_uuid))
        
        if has_active_tasks or has_completed_tasks:
            obj.started_at = task1_started
            obj.status = Status.IN_PROGRESS if has_active_tasks else Status.COMPLETED
            
            if not has_active_tasks and has_completed_tasks:
                obj.completed_at = task1_completed

    session.add_all(objectives)
    session.commit()

    for lg in learning_goals:
        lg_objectives = [obj for obj in objectives if obj.learning_goal_id == lg.learning_goal_id]
        
        if lg_objectives:
            has_active_objectives = any(obj.status in [Status.IN_PROGRESS, Status.COMPLETED] for obj in lg_objectives)
            all_completed = all(obj.status == Status.COMPLETED for obj in lg_objectives)
            
            if has_active_objectives and not lg.started_at:
                lg.started_at = task1_started
                
            if all_completed and not lg.completed_at:
                lg.completed_at = task1_completed

    session.add_all(learning_goals)
    session.commit()

    sync_to_mongodb(users, learning_goals, objectives, tasks)

    print("Seed data inserted successfully!")


if __name__ == "__main__":
    session = next(get_session())
    try:
        create_seed_data(session)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error seeding data: {e}")
    finally:
        session.close()

