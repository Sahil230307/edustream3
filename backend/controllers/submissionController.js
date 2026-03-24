import connection from '../db.js';

export const submitAssignment = (req, res) => {
  const { assignmentId, content } = req.body;
  const userId = req.user.id;

  if (!assignmentId || !content) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  connection.query(
    'INSERT INTO submissions (assignmentId, userId, content, submittedAt) VALUES (?, ?, ?, NOW())',
    [assignmentId, userId, content],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error submitting assignment' });

      res.status(201).json({ message: 'Assignment submitted', id: results.insertId });
    }
  );
};

export const getSubmissionsByAssignment = (req, res) => {
  const { assignmentId } = req.params;

  connection.query(
    'SELECT s.*, u.name, u.email FROM submissions s JOIN users u ON s.userId = u.id WHERE s.assignmentId = ? ORDER BY s.submittedAt DESC',
    [assignmentId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    }
  );
};

export const getMySubmissions = (req, res) => {
  const userId = req.user.id;

  connection.query(
    'SELECT s.*, a.title, w.title as webinarTitle FROM submissions s JOIN assignments a ON s.assignmentId = a.id JOIN webinars w ON a.webinarId = w.id WHERE s.userId = ? ORDER BY s.submittedAt DESC',
    [userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Database error' });

      res.json(results);
    }
  );
};

export const gradeSubmission = (req, res) => {
  const { id } = req.params;
  const { grade, feedback } = req.body;

  connection.query(
    'UPDATE submissions SET grade = ?, feedback = ?, gradedAt = NOW() WHERE id = ?',
    [grade, feedback, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'Error grading submission' });

      res.json({ message: 'Submission graded' });
    }
  );
};
