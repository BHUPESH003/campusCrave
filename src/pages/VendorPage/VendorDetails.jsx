import React, { useState } from "react";
import image from "../../assets/food_1.png";
import { Link } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilPlus } from "@coreui/icons";
import { Button } from "react-bootstrap";
import { handleCartService } from "../services/internalServices/handlecart";
import { useAtom } from "jotai";
import { cartAtomNew } from "../../store";
import CartToast from "../../Components/CartToast/CartToast";
import { s3 } from "../../../env";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

const VendorDetails = (props) => {
  console.log(props)
  const [cartItems, setCartItems] = useAtom(cartAtomNew);
  
  // const handleAddToCart = (data) => {
  //   // console.log(cartItems)
  // //   let cc = handleCartService.updateCartApi(cartItems, data);
  // //   setCartItems([...cc]);
  // // };
  const handleAddToCart = (data) => {

    const currentCartItem = cartItems.find((x) => x.productId === data.item_id);
    // Check if cart contains items and if they belong to a different vendor
    const hasDifferentVendor = cartItems.some(
      (item) => item.product.vendor_id !== data.vendor_id
    );

    if (hasDifferentVendor) {
      const confirmEmpty = window.confirm(
        "Adding items from a different vendor will empty your cart. Do you want to continue?"
      );

      if (confirmEmpty) {
        // Clear the cart by setting it to an empty array
        setCartItems([]);
        return
      } else {
        return; // Cancel adding items if user chooses not to empty the cart
      }
    }
    if (currentCartItem) {
      const updatedCartItems = cartItems.map((cartItem) => {
        if (cartItem.productId === data.item_id) {
          return {
            ...cartItem,
            bagCount: cartItem.bagCount + 1,
            totalAmount: (parseFloat(data.price) * (cartItem.bagCount + 1))
              .toFixed(2)
              .toString(),
          };
        }
        return cartItem;
      });
      setCartItems(updatedCartItems);
    } else
      setCartItems([
        ...cartItems,
        {
          productId: data.item_id,
          product: data,
          bagCount: 1,
          totalAmount: data.price,
        },
      ]);
    
  };

  // console.log(props.image_url)
  const notify = () => toast.success('Added to cart!'
    );
  
  const slicedString=props.image_url.slice(2,props.image_url.length-2);
  // const slicedStringAgain=slicedString.slice(slicedString.length-2,slicedString.length)
  return (
  
    <div class="row border-bottom border-2 my-2">
       
      <div className="col-9 align-self-center ">
        <div>
          <div className="my-4"><span className="sub-heading fw-bold">{props.item_name}</span></div>
          <span className="d-flex justify-content-between">
            <span className="body-font fw-semibold">₹{props.price} </span>
            <span className="body-font">
              🌟{parseFloat(props.avg_rating).toFixed(1)}{" "}
            </span>
            {/* <button className="bg-light text-black border-1 border-secondary px-2 py-1 rounded body-font">
              ADD+
            </button> */}
            <Button
              className="bg-light text-black border-1 border-secondary rounded"
              onClick={() => {
                handleAddToCart(props);
                notify();
              }}
            >
              <span style={{ fontSize: "1.2rem" }}>ADD +</span>
            </Button>


          </span>
        </div>


        <div className="body-font  text-muted mt-2 col-12 col-sm-5 ">{props.item_description}</div>
      </div>
      <div className="col-3 text-center  d-flex align-items-center justify-content-center  position-relative my-4">
        <img
          // src={image}
          src={s3.baseUrl + slicedString
          }

          alt={props.item_name}
          style={{ width: "100vw", height: "20vh" }}
          className="rounded img-fluid"
        />
        {/* <Button style={{width:'5vw',left:'45vw',top:'100vw'}} className='bg-light text-black  position-absolute  translate-middle-x translate-middle-y p-2 border border-success'><span className="body-font fw-bold m-2 ">ADD</span><CIcon className="mt-2" icon={cilPlus} size="xxl" /></Button> */}
      </div>
    </div>
    
  );
};

export default VendorDetails;
