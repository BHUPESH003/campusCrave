import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FoodItem from "../../Components/FoodItem/FoodItem";
import { env } from "../../../env";

import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

export default function CategoryDetails() {
  const { categoryId } = useParams();
  console.log(categoryId);
  const [menuItems, setMenuItems] = useState([]);
  



  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `${env.baseUrl}/categories/${categoryId}/menuItems`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch menu items");
        }
        const data = await response.json();
        console.log(data)

        setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchMenuItems();
  }, [categoryId]);
  console.log(menuItems);

  return (
    <div className="container">
      <ToastContainer autoClose={2000}  style={{fontSize:"6rem"}}/>
      <h2 className="sub-heading">Menu Items for Category {categoryId}</h2>
      <div className="row ">
        {menuItems.map((menuItem) => (
          <FoodItem {...menuItem }   />
        ))}
      </div>
    </div>
  );
}
