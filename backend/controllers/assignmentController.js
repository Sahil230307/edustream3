import connection from '../db.js';

export const createAssignment = (req, res) => {
  const { webinarId, title, description, dueDate } = req.body;

  if (!webinarId || !title || !dueDate) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  connection.query(
    'INSERT INTO assignments (webinarId, title, description, dueDate, createdAt) VALUES (?, ?, ?, ?, NOW())',
    [webinarId, title, description, dueDate],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error creating assignment' });

      res.status(201).json({ message: 'Assignment created', id: results.insertId });
    }
  );
};

export const getAssignmentsByWebinar = (req, res) => {
  const { webinarId } = req.params;

  connection.query(
    'SELECT * FROM assignments WHERE webinarId = ? ORDER BY dueDate DESC',
    [webinarId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    }
  );
};

export const updateAssignment = (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate } = req.body;

  connection.query(
    'UPDATE assignments SET title = ?, description = ?, dueDate = ? WHERE id = ?',
    [title, description, dueDate, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error updating assignment' });

      res.json({ message: 'Assignment updated' });
    }
  );
};

export const deleteAssignment = (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM assignments WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error deleting assignment' });

    res.json({ message: 'Assignment deleted' });
  });
};
