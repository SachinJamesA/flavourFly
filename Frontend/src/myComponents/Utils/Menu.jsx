import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Menu = ({ restaurantId }) => {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch('v1/restaurants/getAllRestaurants', {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        const data = await response.json();
        if (!data || !data.data || !data.data.restaurants) throw new Error("Invalid API response");
        setRestaurants(data.data.restaurants);
      } catch (err) {
        console.error(err.message || "Error fetching user data");
      }
    }
  }, []);

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
