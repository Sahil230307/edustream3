import connection from '../db.js';

export const registerForWebinar = (req, res) => {
  const { webinarId } = req.body;
  const userId = req.user.id;

  if (!webinarId) {
    return res.status(400).json({ error: 'Webinar ID required' });
  }

  // Check if already registered
  connection.query(
    'SELECT * FROM registrations WHERE userId = ? AND webinarId = ?',
    [userId, webinarId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      if (results.length > 0) {
        return res.status(409).json({ error: 'Already registered for this webinar' });
      }

      // Insert registration
      connection.query(
        'INSERT INTO registrations (userId, webinarId, registeredAt) VALUES (?, ?, NOW())',
        [userId, webinarId],
        (err) => {
          if (err) return res.status(500).json({ error: 'Error registering' });

          res.status(201).json({ message: 'Registered successfully' });
        }
      );
    }
  );
};

export const getMyRegistrations = (req, res) => {
  const userId = req.user.id;

  connection.query(
    'SELECT w.*, r.id as registrationId, r.registeredAt FROM registrations r JOIN webinars w ON r.webinarId = w.id WHERE r.userId = ?',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    }
  );
};

export const unregister = (req, res) => {
  const { webinarId } = req.params;
  const userId = req.user.id;

  connection.query(
    'DELETE FROM registrations WHERE userId = ? AND webinarId = ?',
    [userId, webinarId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error unregistering' });

      res.json({ message: 'Unregistered successfully' });
    }
  );
};

export const getWebinarRegistrations = (req, res) => {
  const { webinarId } = req.params;

  connection.query(
    'SELECT u.id, u.name, u.email, r.registeredAt FROM registrations r JOIN users u ON r.userId = u.id WHERE r.webinarId = ?',
    [webinarId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    }
  );
};

export const addToWishlist = (req, res) => {
  const { webinarId } = req.body;
  const userId = req.user.id;

  connection.query(
    'INSERT INTO wishlist (userId, webinarId, addedAt) VALUES (?, ?, NOW())',
    [userId, webinarId],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ error: 'Already in wishlist' });
        }
        return res.status(500).json({ error: 'Error adding to wishlist' });
      }

      res.status(201).json({ message: 'Added to wishlist' });
    }
  );
};

export const removeFromWishlist = (req, res) => {
  const { webinarId } = req.params;
  const userId = req.user.id;

  connection.query(
    'DELETE FROM wishlist WHERE userId = ? AND webinarId = ?',
    [userId, webinarId],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error removing from wishlist' });

      res.json({ message: 'Removed from wishlist' });
    }
  );
};

export const getWishlist = (req, res) => {
  const userId = req.user.id;

  connection.query(
    'SELECT w.* FROM wishlist wl JOIN webinars w ON wl.webinarId = w.id WHERE wl.userId = ? ORDER BY wl.addedAt DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    }
  );
};
