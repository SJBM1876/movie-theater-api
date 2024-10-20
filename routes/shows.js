const express = require('express');
const { body, validationResult } = require('express-validator');
const { Show, User } = require('../models');  
const router = express.Router();

// PUT update the available property of a show
router.put(
    '/:id/available',
    body('available').isBoolean().withMessage('Available must be a boolean value'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const show = await Show.findByPk(req.params.id);
            if (show) {
                show.available = req.body.available;
                await show.save();
                res.json({ message: 'Show availability updated', show });
            } else {
                res.status(404).json({ message: 'Show not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Failed to update show availability', error: error.message });
        }
    }
);

// GET all shows
router.get('/', async (req, res) => {
    try {
        const shows = await Show.findAll();
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shows', error: error.message });
    }
});

// GET one show by ID
router.get('/:id', async (req, res) => {
    try {
        const show = await Show.findByPk(req.params.id);
        if (show) {
            res.json(show);
        } else {
            res.status(404).json({ message: 'Show not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve show', error: error.message });
    }
});

// GET all users who watched a specific show
router.get('/:showId/users', async (req, res) => {
    try {
        const show = await Show.findByPk(req.params.showId, {
            include: [User], // Include associated users
        });

        if (show) {
            res.json(show.Users); // Returns the users associated with the show
        } else {
            res.status(404).json({ message: 'Show not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve users for show', error: error.message });
    }
});

// DELETE a show by ID
router.delete('/:id', async (req, res) => {
    try {
        const show = await Show.findByPk(req.params.id);
        if (show) {
            await show.destroy();
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Show not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete show', error: error.message });
    }
});

// GET shows of a particular genre (genre in req.query)
router.get('/genre', async (req, res) => {
    const { genre } = req.query;
    try {
        const shows = await Show.findAll({ where: { genre } });
        if (shows.length > 0) {
            res.json(shows);
        } else {
            res.status(404).json({ message: `No shows found for genre: ${genre}` });
        }
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve shows by genre', error: error.message });
    }
});

// Export the router
module.exports = router;


