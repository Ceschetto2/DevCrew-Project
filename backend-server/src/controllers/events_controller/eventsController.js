const { Op, where } = require('sequelize');
const { Events, Users } = require('../../models');



exports.getAllEvents = async (req, res) => {
    try {
        const events = await Events.findAll({
            order: [['start', 'ASC']],
            include: [{
                model: Users,
                as: 'participants',
                attributes: ['user_id'],
                through: {
                    where: { user_id: req.user.user_id },
                    attributes: [],
                },
                required: false,
            }],
        });


        const payload = events.map(e => {
            const json = e.get({ plain: true });
            const participationStatus = (json.participants?.length || 0) > 0;
            delete json.participants;
            return { ...json, participationStatus };
        });
        return res.json(payload);

    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch events data' });
    }
};







exports.addSingleEvent = async (req, res) => {
    try {

        const newEvent = await Events.create({
            ...req.body,
            createdBy: req.user.user_id
        });

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Error creating event:", error);
        res.status(500).json({ error: "Failed to create event" });
    }
}

exports.addMultipleEvents = async (req, res) => {
    try {
        const eventsData = req.body.events.map(event => ({
            ...event,
            createdBy: req.user.user_id
        }));
        const createdEvents = await Events.bulkCreate(eventsData);

        res.status(201).json(createdEvents);
    } catch (error) {
        console.error("Error creating multiple events:", error);
        res.status(500).json({ error: "Failed to create multiple events" });
    }
}


exports.submitParticipation = async (req, res) => {

    try {
        const event = await Events.findByPk(req.body.event_id)
        await event.addParticipants(req.user.user_id)
        res.status(201).json({ message: "Partecipazione registrata!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.getEventParticipations = async (req, res) => {
    try {
        const participations = await Events.findByPk(req.body.event_id)
        const participants = await participations.getParticipants();
        res.status(201).json(participants);
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.cancelParticipation = async (req, res) => {
    try {
        const event = await Events.findByPk(req.body.event_id);
        await event.removeParticipant(req.user.user_id);
        res.status(201).json("Partecipation Deleted for user:" + req.user.user_id + "event:" + req.body.event_id);
    } catch (error) {
        console.error("Error deleting event participation:", error);
        res.status(500).json({ error: "Failed to delete event participation" });
    }
}


exports.getFilteredEvents = async (req, res) => {
    try {
        const { text = '', date, isGrowOrd } = req.query;

        const where = {};
        const q = text.trim();
        if (q) {
            where[Op.or] = [
                { title: { [Op.like]: `%${q}%` } },
                { description: { [Op.like]: `%${q}%` } },
                { competitionCode: { [Op.like]: `%${q}%` } },
                { location: { [Op.like]: `%${q}%` } },
                { eventType: { [Op.like]: `%${q}%` } },
            ];
        }

        const now = new Date();
        const d = date ? new Date(date) : null;
        if (d && !isNaN(d) && d < now) {
            const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);
            where.start = { [Op.between]: [dayStart, dayEnd] };
        } else {
            // nessuna data valida: mostra solo eventi passati
            where.start = { [Op.lt]: now };
        }

        const order = [['start', String(isGrowOrd).toLowerCase() === 'true' ? 'ASC' : 'DESC']];

        const events = await Events.findAll({ where, order });
        return res.json(events);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch events data' });
    }
};


exports.deleteEvent = async (req, res) => {
    console.log("test:", req.query)

    try {
        console.log("test:", req.query)
        const event = await Events.findByPk(req.query.event_id);
        console.log(event)
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await event.destroy();
        return res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to delete event' });
    }
};



