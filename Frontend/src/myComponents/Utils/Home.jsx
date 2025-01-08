import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [foodScrollPosition, setFoodScrollPosition] = useState(0);
  const [restaurantScrollPosition, setRestaurantScrollPosition] = useState(0);

  // Fetch data for food picks and restaurants
  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const response = await axios.get("https://api.spoonacular.com/recipes/random", {
          params: {
            number: 10,
            apiKey: "your_api_key",
          },
        });
        setFoods(
          response.data.recipes.map((recipe) => ({
            id: recipe.id,
            name: recipe.title,
            image: recipe.image,
            details: recipe.summary.replace(/<[^>]*>?/gm, "").slice(0, 100),
          }))
        );
      } catch (error) {
        console.error("Error fetching food data:", error);
        setFoods([
          {
            id: 1,
            name: "Pizza",
            image: "https://via.placeholder.com/150?text=Pizza",
            details: "A delicious cheesy treat topped with fresh vegetables and meat.",
          },
        ]);
      }
    };

    const fetchRestaurants = async () => {
      try {
        const mockRestaurants = [
          {
            id: 1,
            name: "Italian Bistro",
            image: "https://via.placeholder.com/150?text=Italian+Bistro",
            location: "New York, NY",
          },
          {
            id: 2,
            name: "Sushi Palace",
            image: "https://via.placeholder.com/150?text=Sushi+Palace",
            location: "San Francisco, CA",
          },
          {
            id: 3,
            name: "Grill House",
            image: "https://via.placeholder.com/150?text=Grill+House",
            location: "Chicago, IL",
          },
        ];
        setRestaurants(mockRestaurants);
      } catch (error) {
        console.error("Error fetching restaurant data:", error);
      }
    };

    fetchFoods();
    fetchRestaurants();
  }, []);

  const scrollLeft = (setScrollPosition) => {
    setScrollPosition((prev) => Math.max(prev - 300, 0));
  };

  const scrollRight = (setScrollPosition, itemCount) => {
    const maxScroll = itemCount * 280 - 900; // Adjust based on card width
    setScrollPosition((prev) => Math.min(prev + 300, maxScroll));
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6 space-y-10">
      {/* Our Food Picks Section */}
      <div className="relative bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Our Food Picks</h2>
        <div className="relative flex items-center">
          <button
            onClick={() => scrollLeft(setFoodScrollPosition)}
            className="absolute left-0 z-10 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            &#x25C0;
          </button>
          <button
            onClick={() => scrollRight(setFoodScrollPosition, foods.length)}
            className="absolute right-0 z-10 bg-blue-500 text-white p-2 rounded-full shadow-md hover:bg-blue-600"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            &#x25B6;
          </button>
          <div
            className="flex space-x-4 transition-transform duration-300"
            style={{
              transform: `translateX(-${foodScrollPosition}px)`,
            }}
          >
            {foods.map((food) => (
              <div
                key={food.id}
                className="w-[240px] bg-gray-50 rounded-md shadow-md overflow-hidden"
              >
                <img
                  src={food.image}
                  alt={food.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 text-center">
                  <p className="font-medium text-lg">{food.name}</p>
                  <p className="text-sm text-gray-600">{food.details}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Restaurants Section */}
      <div className="relative bg-white shadow-lg p-6 rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Top Restaurants</h2>
        <div className="relative flex items-center">
          <button
            onClick={() => scrollLeft(setRestaurantScrollPosition)}
            className="absolute left-0 z-10 bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            &#x25C0;
          </button>
          <button
            onClick={() => scrollRight(setRestaurantScrollPosition, restaurants.length)}
            className="absolute right-0 z-10 bg-green-500 text-white p-2 rounded-full shadow-md hover:bg-green-600"
            style={{ top: "50%", transform: "translateY(-50%)" }}
          >
            &#x25B6;
          </button>
          <div
            className="flex space-x-4 transition-transform duration-300"
            style={{
              transform: `translateX(-${restaurantScrollPosition}px)`,
            }}
          >
            {restaurants.map((restaurant) => (
              <div
                key={restaurant.id}
                className="w-[240px] bg-gray-50 rounded-md shadow-md overflow-hidden"
              >
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-2 text-center">
                  <p className="font-medium text-lg">{restaurant.name}</p>
                  <p className="text-sm text-gray-600">{restaurant.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
