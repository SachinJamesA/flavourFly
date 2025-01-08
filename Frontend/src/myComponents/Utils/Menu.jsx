import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = ({ restaurantId }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch the menu items for the restaurant by its ID
    const fetchMenu = async () => {
      try {
        const response = await axios.get(`/v1/api/restaurants/getAllRestaurants`);
        setMenu(response.data.menu); // Assuming the API response includes a 'menu' array
        setLoading(false);
      } catch (err) {
        setError('Error fetching menu items');
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  if (loading) {
    return <p>Loading menu...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="menu-container">
      <h2>Menu</h2>
      <div className="menu-items">
        {menu.length === 0 ? (
          <p>No items available in the menu.</p>
        ) : (
          menu.map((item) => (
            <div key={item._id} className="menu-item">
              <h3>{item.name}</h3>
              <p>{item.description}</p>
              <p><strong>Price:</strong> ${item.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Menu;
