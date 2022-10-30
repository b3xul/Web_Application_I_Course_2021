-- SQLite
SELECT id, description, urgent, private, deadline
FROM tasks
WHERE description LIKE '%lab%';