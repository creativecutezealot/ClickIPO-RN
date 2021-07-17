import immutablePersistenceTransform from '../Services/ImmutablePersistenceTransform'
import AsyncStorage from '@react-native-community/async-storage';

const REDUX_PERSIST = {
  active: true,
  reducerVersion: '5',
  storeConfig: {
    key : "root",
    storage: AsyncStorage,
    // blacklist: [], // reducer keys that you do NOT want stored to persistence here
    whitelist: ['settings'], // Optionally, just specify the keys you DO want stored to
    // persistence. An empty array means 'don't store any reducers' -> infinitered/ignite#409
    transforms: [immutablePersistenceTransform]
  }
}

export default REDUX_PERSIST
