function BanList({ banList, removeFromBanList }) {
  return (
    <div>
      <h2>🚫 Ban List</h2>
      {banList.length === 0 ? (
        <p>No breeds banned yet</p>
      ) : (
        <ul>
          {banList.map((value, idx) => (
            <li
              key={idx}
              onClick={() => removeFromBanList(value)}
              style={{ cursor: 'pointer', color: 'red' }}
            >
              {value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BanList;