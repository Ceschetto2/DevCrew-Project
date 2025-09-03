const eventsController = require("../controllers/events_controller/eventsController");
const { tokenValidation, roleValidation } = require("../controllers/auth_controller/authController");
const router = require('express').Router();


router.get("/allEvents", tokenValidation, roleValidation(['athlete','president', 'trainer']),  eventsController.getAllEvents);
router.post("/addSingleEvent", tokenValidation, roleValidation(['president', 'trainer']), eventsController.addSingleEvent);    
router.post("/addMultipleEvents", tokenValidation, roleValidation(['president', 'trainer']), eventsController.addMultipleEvents);
router.post("/submitParticipation", tokenValidation, roleValidation(['athlete','president', 'trainer']), eventsController.submitParticipation);
router.get("/getEventParticipations" , tokenValidation, roleValidation(['president', 'trainer']), eventsController.getEventParticipations);
router.post("/cancelParticipation", tokenValidation, roleValidation(['athlete','president', 'trainer']), eventsController.cancelParticipation)
router.get("/getFilteredEvents",tokenValidation, roleValidation(['athlete','president', 'trainer']), eventsController.getFilteredEvents)
router.delete('/', tokenValidation, roleValidation(['president', 'trainer']), eventsController.deleteEvent);
module.exports = router;