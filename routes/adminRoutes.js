import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();
const ADMIN_TABLE = 'admin2';

router.post('/login', async (req, res) => {
  try {
    const { id, password } = req.body;

    if (id === undefined || id === null || password === undefined || password === null) {
      return res.status(400).json({ error: 'Admin id and password are required' });
    }

    const db = getDB();
    const [rows] = await db.execute(
      `SELECT id FROM ${ADMIN_TABLE} WHERE id = ? AND password = ?`,
      [id, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid admin id or password' });
    }

    res.json({ message: 'Admin login successful', adminId: rows[0].id });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ error: 'Failed to login admin' });
  }
});

router.put('/password', async (req, res) => {
  try {
    const { id, currentPassword, newPassword } = req.body;

    if (
      id === undefined ||
      id === null ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        error: 'Admin id, current password, and new password are required',
      });
    }

    const db = getDB();
    const [rows] = await db.execute(
      `SELECT id FROM ${ADMIN_TABLE} WHERE id = ? AND password = ?`,
      [id, currentPassword]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    await db.execute(
      `UPDATE ${ADMIN_TABLE} SET password = ? WHERE id = ?`,
      [newPassword, id]
    );

    res.json({ message: 'Admin password changed successfully' });
  } catch (error) {
    console.error('Error changing admin password:', error);
    res.status(500).json({ error: 'Failed to change admin password' });
  }
});

export default router;
