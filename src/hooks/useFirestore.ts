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
      const termsRef = collection(db, 'terms');

      const date = new Date().toISOString();

      await setDoc(doc(usersRef, userId), {
        // YYYY-MM-dd 형식으로 저장
        last_used: date.split('T')[0],
        level: 0,
        stamps: 0,
      });

      // 회원가입 시 동시에 약관 동의 처리
      await setDoc(doc(termsRef, userId), {
        agreed: true,
        date,
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
        console.log('User Document data:', docSnap.data());
      } else {
        console.log('No such document!');
      }

      return docSnap.data();
    } catch (error) {
      console.error('Error getting document:', error);
      return undefined;
    }
  }

  async function updateUser(userId: string, data: any) {
    try {
      const db = getFirestore();
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, data);
      console.log('User updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }

  async function getStores(storeCode: string) {
    try {
      const db = getFirestore();
      const docRef = doc(db, 'stores', storeCode);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists) {
        console.log('Store Document data:', docSnap.data());
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

  async function updateSession(sessionId: string, data: any) {
    try {
      const db = getFirestore();
      const sessionRef = doc(db, 'sessions', sessionId);
      await updateDoc(sessionRef, data);
      console.log('Session updated successfully!');
    } catch (error) {
      console.error('Error updating document:', error);
    }
  }

  return {addUser, getUser, updateUser, getStores, enterNumber, updateSession};
};

export default useFirestore;
