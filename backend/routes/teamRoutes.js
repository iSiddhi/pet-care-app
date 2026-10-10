const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const c = require('../controllers/teamController');

const router = express.Router();

router.route('/')
  .get(c.getTeam)
  .post(protect, authorize('admin'), c.createTeamMember);

module.exports = router;
