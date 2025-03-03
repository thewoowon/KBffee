import {FirebaseFirestoreTypes} from '@react-native-firebase/firestore/lib';
import {
  doc,
  getFirestore,
  getDoc,
  setDoc,
  collection,
  updateDoc,
} from '@react-native-firebase/firestore';

const useFirestore = () => {
  async function addUser(userId: string) {
    try {
      const db = getFirestore();

      const usersRef = collection(db, 'users');

      const date = new Date().toISOString();

      await setDoc(doc(usersRef, userId), {
        // YYYY-MM-dd 형식으로 저장
        last_used: date.split('T')[0],
        level: 0,
        stamps: 0,
      });

      console.log('✅ User added successfully!');

      return true;
    } catch (error) {
      console.error('Error adding document:', error);
      return false;
    }
  }

  async function getUser(userId: string) {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'users', userId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        console.log('Document data:', docSnap.data());
      } else {
        console.log('No such document!');
      }

      return docSnap.data();
    } catch (error) {
      console.error('Error getting document:', error);
      return undefined;
    }
  }

  async function getStores(storeCode: string) {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'stores', storeCode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        console.log('Document data:', docSnap.data());
      } else {
        console.log('No such document!');
      }

      return docSnap.data();
    } catch (error) {
      console.error('Error getting document:', error);
      return undefined;
    }
  }

  async function enterNumber(sessionId: string) {
    try {
      const db = getFirestore();
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, {mode: 'waiting'});
      console.log('고객 태블릿이 전화번호 입력 화면으로 전환됩니다!');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }

  return {addUser, getUser, getStores, enterNumber};
};

export default useFirestore;
