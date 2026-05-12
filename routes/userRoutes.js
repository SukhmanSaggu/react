import express from 'express';
import { getDB } from '../config/db.js';

const router = express.Router();

const formatJob = (row) => ({
  id: row.id,
  title: row.title,
  type: row.type,
  location: row.location,
  description: row.description,
  salary: row.salary,
  company: {
    name: row.company_name,
    description: row.company_description,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
  },
});

router.get('/', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT
        id,
        title,
        type,
        location,
        description,
        salary,
        company_name,
        company_description,
        contact_email,
        contact_phone
      FROM view_jobs
      ORDER BY id DESC`
    );

    res.json(rows.map(formatJob));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    const [rows] = await db.execute(
      `SELECT
        id,
        title,
        type,
        location,
        description,
        salary,
        company_name,
        company_description,
        contact_email,
        contact_phone
      FROM view_jobs
      WHERE id = ?`,
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(formatJob(rows[0]));
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, type, location, description, salary, company } = req.body;
    const db = getDB();
    const [result] = await db.execute(
      'INSERT INTO addjob (title, type, location, description, salary, company_name, company_description, company_contact_email, company_contact_phone) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        title,
        type,
        location,
        description,
        salary,
        company.name,
        company.description,
        company.contactEmail,
        company.contactPhone,
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (error) {
    console.error('Error adding job:', error);
    res.status(500).json({ error: 'Failed to add job' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, type, location, description, salary, company } = req.body;
    const db = getDB();

    await db.execute(
      'UPDATE addjob SET title = ?, type = ?, location = ?, description = ?, salary = ?, company_name = ?, company_description = ?, company_contact_email = ?, company_contact_phone = ? WHERE id = ?',
      [
        title,
        type,
        location,
        description,
        salary,
        company.name,
        company.description,
        company.contactEmail,
        company.contactPhone,
        req.params.id,
      ]
    );

    res.json({ message: 'Job updated successfully' });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const db = getDB();

    await db.execute('DELETE FROM addjob WHERE id = ?', [req.params.id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
