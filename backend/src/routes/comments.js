const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/:postId',
  [body('content').trim().notEmpty().withMessage('Comment cannot be empty')],
  commentController.createComment
);

router.get('/:postId', commentController.getComments);

router.delete('/:id', commentController.deleteComment);

module.exports = router;