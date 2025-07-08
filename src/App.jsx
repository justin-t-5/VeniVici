import { useState } from 'react';
import Discover from './components/Discover.jsx';
import BanList from './components/Banlist.jsx';

function App() {
  const [item, setItem] = useState(null);
  const [banList, setBanList] = useState([]);

  const addToBanList = (value) => {
    if (!banList.includes(value)) {
      setBanList([...banList, value]);
    }
  };

  const removeFromBanList = (value) => {
    setBanList(banList.filter(item => item !== value));
  };

  return (
    <div>
      <h1>🐶 Dog Discoverer</h1>
      <Discover item={item} setItem={setItem} banList={banList} addToBanList={addToBanList} />
      <BanList banList={banList} removeFromBanList={removeFromBanList} />
    </div>
  );
}

export default App;