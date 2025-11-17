TASK_NOTE_CREATE_EXAMPLE = {
    "title": "Troubleshooting SQL Joins",
    "content": "Encountered issues with LEFT JOIN..."
}

TASK_NOTE_READ_EXAMPLE = {
    "note_id": "abc1234-5678-90ef-gh12",
    "task_id": "task_001",
    "title": "Troubleshooting SQL Joins",
    "content": "Encountered issues with LEFT JOIN...",
    "created_at": "2025-02-24T10:00:00Z",
    "updated_at": "2025-02-25T12:00:00Z"
}

TASK_NOTE_UPDATE_EXAMPLE = {
    "title": "Troubleshooting SQL Joins - Updated",
    "content": "Resolved the LEFT JOIN issue by..."
}

TASK_NOTE_RESPONSE_EXAMPLE = {
    "message": "Nota creada correctamente",
    "data": TASK_NOTE_READ_EXAMPLE
}

TASK_NOTE_LIST_RESPONSE_EXAMPLE = {
    "message": "Notas obtenidas correctamente",
    "data": [
        {
            "note_id": "abc1234-5678-90ef-gh12",
            "task_id": "task_001",
            "title": "Troubleshooting SQL Joins",
            "content": "Encountered issues with LEFT JOIN...",
            "created_at": "2025-02-24T10:00:00Z",
            "updated_at": "2025-02-25T12:00:00Z"
        },
        {
            "note_id": "def5678-9012-34ab-cd56",
            "task_id": "task_001",
            "title": "Performance Optimization Tips",
            "content": "Found that indexing improved query time significantly...",
            "created_at": "2025-02-24T11:00:00Z",
            "updated_at": "2025-02-24T11:00:00Z"
        }
    ]
}

