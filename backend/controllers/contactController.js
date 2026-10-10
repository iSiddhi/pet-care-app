const asyncHandler = require('../middleware/asyncHandler');
const Contact = require('../models/Contact');

// @route  POST /api/contact
// @access Public
// Contact.jsx reads data.message on failure, so keep that key populated.
exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  const contact = await Contact.create({ name, email, phone, message });
  res.status(201).json({
    success: true,
    message: 'Contact form submitted successfully',
    data: contact,
  });
});

// @route  GET /api/contact (admin)
exports.getContacts = asyncHandler(async (req, res) => {
  const contacts = await Contact.find().sort({ createdAt: -1 });
  res.json({ success: true, count: contacts.length, data: contacts });
});

// @route  PATCH /api/contact/:id (admin)
exports.markHandled = asyncHandler(async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id,
    { handled: true },
    { new: true }
  );
  if (!contact) {
    res.status(404);
    throw new Error('Message not found');
  }
  res.json({ success: true, data: contact });
});
