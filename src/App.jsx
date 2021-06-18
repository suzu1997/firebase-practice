import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBsbF7t8yXMfCGwU_NSD9OPNdblZUuk0fY',
  authDomain: 'fir-practice-d0801.firebaseapp.com',
  projectId: 'fir-practice-d0801',
  storageBucket: 'fir-practice-d0801.appspot.com',
  messagingSenderId: '604664760596',
  appId: '1:604664760596:web:8405566382bed8e29c5a01',
  measurementId: 'G-WXCW9CVNKJ',
};

firebase.initializeApp(firebaseConfig);

function App() {
  const [users, setUsers] = useState([]);
  const [userName, setUserName] = useState('');
  const [age, setAge] = useState('');
  const [documentId, setDocumentId] = useState('');

  const db = firebase.firestore();

  useEffect(() => {
    const unsubscribe = db
      .collection('users')
      .orderBy('age', 'desc')
      .onSnapshot((querySnapshot) => {
        console.log(querySnapshot);
        const _users = querySnapshot.docs.map((doc) => {
          return {
            userId: doc.id,
            ...doc.data(),
          };
        });
        setUsers(_users);
      });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClickFetchButton = async () => {
    //collection 取得
    const snapshot = await db.collection('users').get();
    const _users = [];
    snapshot.forEach((doc) => {
      _users.push({
        userId: doc.id,
        ...doc.data(),
      });
    });
    setUsers(_users);
  };

  const handleClickAddButton = async () => {
    if (!userName || !age) {
      alert('"userName" or "age"が空です');
      return;
    }
    const parsedAge = parseInt(age, 10);

    if (isNaN(parsedAge)) {
      alert('numberは半角の数値でセットしてください');
      return;
    }

    await db.collection('users').add({
      name: userName,
      age: parsedAge,
    });

    setUserName('');
    setAge('');
  };

  const handleClickUpdateButton = async () => {
    if (!documentId) {
      alert('documentIdをセットしてください');
      return;
    }
    const newData = {};
    if (userName) {
      newData['name'] = userName;
    }
    if (age) {
      newData['age'] = parseInt(age, 10);
    }
    try {
      await db.collection('users').doc(documentId).update(newData);
      setUserName('');
      setAge('');
      setDocumentId('');
    } catch (error) {
      console.error(error);
    }
  };

  const handleClickDeleteButton = async () => {
    if (!documentId) {
      alert('documentIdをセットしてください');
      return;
    }
    try {
      await db.collection('users').doc(documentId).delete();
      setUserName('');
      setAge('');
      setDocumentId('');
    } catch (error) {
      console.error(error);
    }
  };

  const userListItems = users.map((user) => {
    return (
      <li key={user.userId}>
        <ul>
          <li>ID: {user.userId}</li>
          <li>name: {user.name}</li>
          <li>age: {user.age}</li>
        </ul>
      </li>
    );
  });

  return (
    <div className='App'>
      <h1>Hello World!!</h1>
      <div>
        <label htmlFor='username'>userName : </label>
        <input
          type='text'
          id='username'
          value={userName}
          onChange={(event) => {
            setUserName(event.target.value);
          }}
        />
        <label htmlFor='age'>age : </label>
        <input
          type='text'
          id='age'
          value={age}
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <label htmlFor='documentId'>documentId : </label>
        <input
          type='text'
          id='documentId'
          value={documentId}
          onChange={(event) => {
            setDocumentId(event.target.value);
          }}
        />
      </div>
      <button onClick={handleClickFetchButton}>取得</button>
      <button onClick={handleClickAddButton}>追加</button>
      <button onClick={handleClickUpdateButton}>更新</button>
      <button onClick={handleClickDeleteButton}>削除</button>
      <ul>{userListItems}</ul>
    </div>
  );
}

export default App;
