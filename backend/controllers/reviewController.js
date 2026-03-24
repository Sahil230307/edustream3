import connection from '../db.js';

export const addReview = (req, res) => {
  const { webinarId, rating, comment } = req.body;
  const userId = req.user.id;

  if (!webinarId || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating or missing fields' });
  }

  connection.query(
    'INSERT INTO reviews (webinarId, userId, rating, comment, createdAt) VALUES (?, ?, ?, ?, NOW())',
    [webinarId, userId, rating, comment || null],
    (err, results) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'You have already reviewed this webinar' });
        }
        return res.status(500).json({ error: 'Error adding review' });
      }

      res.status(201).json({ message: 'Review added', id: results.insertId });
    }
  );
};

export const getReviewsByWebinar = (req, res) => {
  const { webinarId } = req.params;

  connection.query(
    'SELECT r.*, u.name FROM reviews r JOIN users u ON r.userId = u.id WHERE r.webinarId = ? ORDER BY r.createdAt DESC',
    [webinarId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    }
  );
};

export const getWebinarRating = (req, res) => {
  const { webinarId } = req.params;

  connection.query(
    'SELECT AVG(rating) as averageRating, COUNT(*) as reviewCount FROM reviews WHERE webinarId = ?',
    [webinarId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results[0]);
    }
  );
};

export const updateReview = (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Invalid rating' });
  }

  connection.query(
    'UPDATE reviews SET rating = ?, comment = ? WHERE id = ? AND userId = ?',
    [rating, comment || null, id, userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error updating review' });

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Review not found or not authorized' });
      }

      res.json({ message: 'Review updated' });
    }
  );
};

export const deleteReview = (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  connection.query('DELETE FROM reviews WHERE id = ? AND userId = ?', [id, userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error deleting review' });

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Review not found or not authorized' });
    }

    res.json({ message: 'Review deleted' });
  });
};
