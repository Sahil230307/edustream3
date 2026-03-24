import connection from '../db.js';

export const getAllWebinars = (req, res) => {
  connection.query('SELECT * FROM webinars ORDER BY date DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
};

export const getWebinarById = (req, res) => {
  const { id } = req.params;

  connection.query('SELECT * FROM webinars WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    res.json(results[0]);
  });
};

export const createWebinar = (req, res) => {
  const { 
    title, 
    speaker, 
    speakerEmail, 
    date, 
    time, 
    description, 
    category, 
    difficulty, 
    maxCapacity, 
    imageUrl 
  } = req.body;

  if (!title || !speaker || !date || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  connection.query(
    'INSERT INTO webinars (title, speaker, speakerEmail, date, time, description, category, difficulty, maxCapacity, imageUrl) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [title, speaker, speakerEmail, date, time, description, category, difficulty, maxCapacity, imageUrl],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error creating webinar' });

      res.status(201).json({ message: 'Webinar created', id: results.insertId });
    }
  );
};

export const updateWebinar = (req, res) => {
  const { id } = req.params;
  const { title, speaker, speakerEmail, date, time, description, category, difficulty, maxCapacity, imageUrl } = req.body;

  connection.query(
    'UPDATE webinars SET title = ?, speaker = ?, speakerEmail = ?, date = ?, time = ?, description = ?, category = ?, difficulty = ?, maxCapacity = ?, imageUrl = ? WHERE id = ?',
    [title, speaker, speakerEmail, date, time, description, category, difficulty, maxCapacity, imageUrl, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error updating webinar' });

      res.json({ message: 'Webinar updated successfully' });
    }
  );
};

export const deleteWebinar = (req, res) => {
  const { id } = req.params;

  connection.query('DELETE FROM webinars WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: 'Error deleting webinar' });

    res.json({ message: 'Webinar deleted successfully' });
  });
};

export const searchWebinars = (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.status(400).json({ error: 'Search query required' });
  }

  connection.query(
    'SELECT * FROM webinars WHERE title LIKE ? OR description LIKE ? OR category LIKE ?',
    [`%${search}%`, `%${search}%`, `%${search}%`],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    }
  );
};
