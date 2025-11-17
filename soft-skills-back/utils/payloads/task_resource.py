TASK_RESOURCE_CREATE_EXAMPLE = {
    "type": "video",
    "title": "SQL Tutorial for Beginners",
    "link": "https://example.com/sql-guide"
}

TASK_RESOURCE_READ_EXAMPLE = {
    "resource_id": "abc1234-5678-90ef-gh12",
    "task_id": "task_001",
    "type": "video",
    "title": "SQL Tutorial for Beginners",
    "link": "https://example.com/sql-guide",
    "created_at": "2025-02-24T10:00:00Z",
    "updated_at": "2025-02-25T12:00:00Z"
}

TASK_RESOURCE_UPDATE_EXAMPLE = {
    "type": "article",
    "title": "Advanced SQL Techniques",
    "link": "https://example.com/advanced-sql"
}

TASK_RESOURCE_RESPONSE_EXAMPLE = {
    "message": "Recurso creado correctamente",
    "data": TASK_RESOURCE_READ_EXAMPLE
}

TASK_RESOURCE_LIST_RESPONSE_EXAMPLE = {
    "message": "Recursos obtenidos correctamente",
    "data": [
        {
            "resource_id": "abc1234-5678-90ef-gh12",
            "task_id": "task_001",
            "type": "video",
            "title": "SQL Tutorial for Beginners",
            "link": "https://example.com/sql-guide",
            "created_at": "2025-02-24T10:00:00Z",
            "updated_at": "2025-02-25T12:00:00Z"
        },
        {
            "resource_id": "def5678-9012-34ab-cd56",
            "task_id": "task_001",
            "type": "article",
            "title": "PostgreSQL Documentation",
            "link": "https://www.postgresql.org/docs/",
            "created_at": "2025-02-24T11:00:00Z",
            "updated_at": "2025-02-24T11:00:00Z"
        }
    ]
}

