import firestore from '@react-native-firebase/firestore';

const useFirestore = () => {
  async function addUser() {
    await firestore().collection('users').doc('user_123').set({
      name: 'John Doe',
      email: 'johndoe@example.com',
      age: 25,
    });
    console.log('✅ User added successfully!');
  }

  async function getUser() {
    const user = await firestore().collection('users').doc('user_123').get();
    console.log('👤 User:', user.data());
  }

  return {addUser, getUser};
};

export default useFirestore;
