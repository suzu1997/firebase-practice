const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
admin.initializeApp();

const endPoint = '/messages';

const db = admin.firestore();

// /messages
router
  .route(endPoint)
  .get(async (req, res) => {
    const messages = [];
    try {
      const querySnapshot = await db.collection('messages').get();
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      res.json({ message: 'Called by the GET method', messages });
    } catch (error) {
      console.error(error, 'エラーです！！！！！');
    }
  })
  .post(async (req, res) => {
    const { name, body } = req.body;
    const createdAt = new Date().toISOString();
    try {
      const docRef = await db.collection('messages').add({
        name,
        body,
        createdAt,
      });
      const docSnapshot = await docRef.get();
      const createdMessage = {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      };
      res.json({
        message: 'Called by the POST method',
        data: createdMessage,
      });
    } catch (error) {
      console.error(error, 'エラーです！！！！！');
    }
  });
// /messages/1
router
  .route(`${endPoint}/:id`)
  .put(async (req, res) => {
    const { id } = req.params;
    const { name, body } = req.body;
    const newData = {
      name,
      body,
    };
    try {
      await db.collection('messages').doc(id).update(newData);
      res.json({ message: `Updated!! ID: ${id}` });
    } catch (error) {
      res.status(500).res.json({ message: '何かエラーが起きたよ' });
    }
  })
  .delete(async (req, res) => {
    const { id } = req.params;
    try {
      await db.collection('messages').doc(id).delete();
      res.json({ message: `Delete data;; ID: ${id}` });
    } catch (error) {
      res.status(500).res.json({ message: '何かエラーが起きたよ' });
    }
  });

module.exports = router;
