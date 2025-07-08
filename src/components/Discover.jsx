import { useEffect, useState } from 'react';

const BREEDS_API = 'https://api.thedogapi.com/v1/breeds';
const IMAGE_API = 'https://api.thedogapi.com/v1/images/search';

function Discover({ banList, addToBanList }) {
  const [breeds, setBreeds] = useState([]);
  const [item, setItem] = useState(null); // holds current dog image + breed info
  const [loading, setLoading] = useState(false);

  // Step 1: Fetch all breeds once on mount
  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const res = await fetch(BREEDS_API, {
          headers: { 'x-api-key': import.meta.env.VITE_DOG_API_KEY || '' },
        });
        if (!res.ok) {
          console.error('Failed to fetch breeds:', res.status);
          return;
        }
        const data = await res.json();
        setBreeds(data);
      } catch (err) {
        console.error('Error fetching breeds:', err);
      }
    };
    fetchBreeds();
  }, []);

  // Fetch a random dog image for a random breed that’s NOT banned
  const fetchDog = async () => {
    if (breeds.length === 0) return; // breeds not loaded yet

    const allowedBreeds = breeds.filter(b => !banList.includes(b.name));
    if (allowedBreeds.length === 0) {
      alert('No breeds left to discover! Please remove some bans.');
      return;
    }

    const randomBreed = allowedBreeds[Math.floor(Math.random() * allowedBreeds.length)];

    setLoading(true);
    try {
      const res = await fetch(`${IMAGE_API}?breed_id=${randomBreed.id}&limit=1`, {
        headers: { 'x-api-key': import.meta.env.VITE_DOG_API_KEY || '' },
      });
      if (!res.ok) {
        console.error('Failed to fetch dog image:', res.status);
        setLoading(false);
        return;
      }
      const data = await res.json();

      if (data.length === 0) {
        console.log('No images for breed, fetching again...');
        setLoading(false);
        return fetchDog(); // try another breed
      }

      setItem({ ...data[0], breed: randomBreed });
    } catch (err) {
      console.error('Error fetching dog image:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Discover a Dog!</h2>

      {!item && (
        <div>
          <p>{loading ? 'Loading breeds...' : 'Click below to discover a dog!'}</p>
          <button onClick={fetchDog} disabled={loading || breeds.length === 0}>
            Discover Dog
          </button>
        </div>
      )}

      {item && (
        <div>
          {loading && <p>Loading new dog...</p>}

          <img src={item.url} alt="dog" width="300" />
          <p
            onClick={() => addToBanList(item.breed.name)}
            style={{ cursor: 'pointer', color: 'blue' }}
            title="Click to ban this breed"
          >
            <strong>Breed:</strong> {item.breed.name}
          </p>
          <p><strong>Group:</strong> {item.breed.breed_group || 'Unknown'}</p>
          <p><strong>Temperament:</strong> {item.breed.temperament || 'Unknown'}</p>

          <button onClick={fetchDog} disabled={loading}>
            Discover Another Dog
          </button>
        </div>
      )}
    </div>
  );
}

export default Discover;
