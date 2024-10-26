const express = require('express');
const {analyzeFeedbackWithLangchainAndGemini} = require("../services/service");
const router = express.Router();

router.post('/feedback-analyze', async (req, res) =>{
  const { feedback } = req.body;

  if (typeof feedback !== 'string' || feedback.trim() === '') {
    return res.status(400).json({ error: 'Feedback must be a non-empty string.' });
  }

  try {
    const { sentiment, summary  } = await analyzeFeedbackWithLangchainAndGemini(feedback);

    res.json({
      sentiment,
      summary
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while processing your feedback.',
      message: error.message
    });
  }
});

module.exports = router;
