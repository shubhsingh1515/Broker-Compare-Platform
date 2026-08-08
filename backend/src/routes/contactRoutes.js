const express = require('express');
const router = express.Router();
const {
  submitContact,
  getContacts,
  updateContactStatus,
  deleteContact
} = require('../controllers/contactController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.post('/', submitContact);
router.get('/', protectAdmin, getContacts);
router.put('/:id', protectAdmin, updateContactStatus);
router.delete('/:id', protectAdmin, deleteContact);

module.exports = router;
