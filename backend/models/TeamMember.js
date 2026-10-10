const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true, default: '' },
    avatar: { type: String, default: '' },
    bio: { type: String, default: '' },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TeamMember', teamMemberSchema);
