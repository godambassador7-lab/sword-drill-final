Spiritual Gifts Exam for Sword Drill
===================================

Files
-----
- spiritual_gifts_exam.json

JSON Structure
--------------
Root keys:
- metadata: general information and 1–5 response scale
- gifts: list of spiritual gift definitions, Scriptures, examples, and cultivation tips
- questions: 50 assessment statements. Each has:
    - id: numeric question id
    - text: the question text the user answers
    - gifts_weights: mapping of gift_id -> integer weight (1 or 2)
- scoring: description of how to calculate scores

Recommended Use
---------------
1. Present each of the 50 questions with a 1–5 Likert scale:
   1 = Strongly Disagree
   2 = Disagree
   3 = Neutral / Unsure
   4 = Agree
   5 = Strongly Agree

2. For each response:
   - For every gift listed in gifts_weights, multiply the answer value by that weight.
   - Add those values to the running total for that gift.

3. After all 50 questions:
   - Rank gifts from highest to lowest score.
   - Show the user all gifts, but highlight the top 3 as primary areas for cultivation.
   - Display each gift’s card (from the gifts array) with:
     * summary
     * how_to_use_today
     * scripture_refs
     * biblical_examples
     * cultivation_tips

4. Encourage users to:
   - Thank God for the way He has wired them.
   - Prayerfully pursue opportunities to use their highest‑ranked gifts.
   - Share results with pastors, elders, or mentors for confirmation and guidance.

Theological Note
----------------
This exam draws on New Testament passages on spiritual gifts (e.g., Romans 12; 1 Corinthians 12–14;
Ephesians 4; 1 Peter 4). It is meant to be a biblically informed tool to prompt reflection, not a
replacement for prayer, Scripture, or the discernment of the local church.