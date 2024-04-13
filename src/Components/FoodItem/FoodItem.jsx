import React, { useState } from "react";
import image from "../../assets/food_1.png";
import { Button } from "react-bootstrap";
import { cilCart } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { cartAtomNew } from "../../store";
import { useAtom } from "jotai";
import { s3 } from "../../../env";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const FoodItem = ({ item_name, vendor_name, vendor_rating, avg_rating, price, item_id, vendor_id,image_url  }) => {
  const [isItemBag, setisItemBag] = useState(false);
  const [cartItems, setCartItems] = useAtom(cartAtomNew);
  const slicedString=image_url.slice(2,image_url.length-2);
  const handleAddBag = () => {
    setisItemBag(!isItemBag);
  };
  const notify = () => toast.success('Added to Cart');
  const handleAddToCart = () => {
    const currentItem = {
      item_name,
      vendor_name,
      vendor_rating,
      avg_rating,
      price,
      item_id,
      vendor_id,
      image_url
    };

    const currentCartItem = cartItems.find((x) => x.productId === item_id);
    const hasDifferentVendor = cartItems.some(
      (item) => item.product.vendor_id !== vendor_id
    );
      
    if (hasDifferentVendor) {
      const confirmEmpty = window.confirm(
        "Adding items from a different vendor will empty your cart. Do you want to continue?"
      );

      if (confirmEmpty) {
        setCartItems([]);
      } else {
        return;
      }
    }
    if (currentCartItem) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.productId === item_id) {
          return {
            ...cartItem,
            bagCount: cartItem.bagCount + 1,
            totalAmount: (parseFloat(price) * (cartItem.bagCount + 1))
              .toFixed(2)
              .toString(),
          };
        }
        return cartItem;
      });
      setCartItems(updatedCartItems);
    } else {
      setCartItems([
        ...cartItems,
        {
          productId: item_id,
          product: currentItem,
          bagCount: 1,
          totalAmount: price,
        },
      ]);
    }
    
    
  };

  return (
    <div className="col-6 col-md-3 mt-4 text-center">
      <div className="rounded p-2" style={{ border: "2px solid #6c757d", overflow: "hidden" }}>
        <div>
          <img
            className="img-fluid rounded"
            style={{ width: "100%", height: "15vw", objectFit: "cover" }}
            src={s3.baseUrl + slicedString}
            alt={item_name}
          />
        </div>

        <div style={{ marginTop: "10px" }}>
          <div>
            <div className="body-font fw-semibold" style={{ color: "#0d6efd" }}>
              {vendor_name}'s{" "}
              <span className="body-font fw-normal">🌟 : {parseFloat(vendor_rating).toFixed(1)}</span>
            </div>

            <div className="body-font fw-semibold" style={{ color: "#0d6efd" }}>
              {item_name}{" "}
              <span className="body-font fw-normal">🌟 : {avg_rating}</span>
            </div>
          </div>

          <div style={{ width: "100%" }} className="d-flex justify-content-around align-items-center">
            <span className="body-font fw-semibold" style={{ color: "#198754" }}>
              £{price}
            </span>
            {isItemBag ? (
              <CIcon  icon={cilCart} size="xxl" style={{ color: "#dc3545", fontSize: "1.5rem" }} />
            ) : (
              <Button
                className="bg-light text-black border-1 border-secondary rounded"
                onClick={() => {
                  handleAddToCart();
                  handleAddBag();
                  notify();
                }}
              >
                <span style={{ fontSize: "1.2rem" }}>ADD +</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItem;
