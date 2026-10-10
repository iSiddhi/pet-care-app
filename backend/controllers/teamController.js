const asyncHandler = require('../middleware/asyncHandler');
const TeamMember = require('../models/TeamMember');

// @route  GET /api/team
// @access Public  -- api.js consumes a bare array
exports.getTeam = asyncHandler(async (req, res) => {
  const team = await TeamMember.find().sort({ order: 1, createdAt: 1 });
  res.json(team);
});

// @route  POST /api/team (admin)
exports.createTeamMember = asyncHandler(async (req, res) => {
  const member = await TeamMember.create(req.body);
  res.status(201).json({ success: true, member });
});
