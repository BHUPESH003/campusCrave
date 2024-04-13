import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import image from '../../assets/CART.png'
import { env } from '../../../env';
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
// import { Link } from 'react-router-dom'
// import { Model } from 'mongoose'
export default function MyOrders(props) {
  console.log(props)
  const timestamp = props.order_time;
const date = new Date(timestamp);

const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1 and pad with 0 if needed
const day = String(date.getDate()).padStart(2, '0'); // Pad with 0 if needed

const formattedDate = `${year}-${month}-${day}`;
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(props.overall_rating); // State to store the selected rating
  const token=localStorage.getItem('usertoken')
  const [hover , setHover] = useState(0)
  const [comment, setComment] = useState(props.orderreview); // State to store the comment

  const handleCommentChange = (event) => {
    setComment(event.target.value); // Update the comment state as the user types
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const notify1 = () => toast.success('Review Submitted successfully!');
  const notify2 = () => toast.warning('Review is Already submitted');
   

  const handleSubmitReview = async () => {
    try {
      const response = await fetch(`${env.baseUrl}/orders/${props.id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
         
          Authorization: `Bearer ${token}`,
       
        },
        body: JSON.stringify({ rating, comment }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to submit review');
      }
  
      // Review successfully submitted, close the modal and show success message
      console.log('Review submitted successfully!');
      handleCloseModal();
      notify1();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      notify2();
      // Handle error, show error message or retry logic
      
    }
  };
  

  return (
   
    <div className="row border-bottom border-2 my-2  " >
       
      <div className="col-9 align-self-center">
        <div>
          <span className="body-font fw-bold">{props.vendor_name}</span> <br />
          <span className="d-flex justify-content-between">
          <Button className='border-0 bg-white' onClick={handleShowModal}><span className="body-font border border-1 border-warning rounded text-warning fw-bold">View Details</span></Button>
            <span className="body-font text-muted fw-semibold">{props.price} </span>
           

            <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header >
          <Modal.Title>
          Order Number - #{props.id}
          </Modal.Title>
          
        </Modal.Header>
        <Modal.Body className='m-3'>
          <div className='row'>
          <div className='body-font text-end text-muted'>{formattedDate}</div>
          </div>
          
          <div className='fw-bold row  text-muted sub-heading '>Items</div>
          {props.items.map((item)=>{
            return <div className=' row m-2 sub-heading' key={item.item_id}>
                  <div className='col-6 text-start'>{item.item_name} x {item.quantity}</div>
                  <div className="col-6 text-end">Rs {item.item_price*item.quantity}</div>
            </div>
          })}
          <div className='border-top border-1 m-2  sub-heading border-danger row'>
            <div className='col-6 text-start'>Paid via Credit/Debit</div>
            <div className='col-3 text-center fw-bold '>Bill Total </div>
            <div className='col-3 text-end'>Rs {props.price}</div>
          </div>

          <div className="star-rating heading ">
            <span className='fw-bold  text-danger body-font mx-4 '>{rating ? "Rated" : "Rate Us" }</span>
      {!props.overall_rating ? [...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            onClick={() => setRating(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            <span className="star">&#9733;</span>
          </button>
        );
      }) :  [...Array(5)].map((star, index) => {
        index += 1;
        return (
          <button
            type="button"
            key={index}
            className={index <= (hover || rating) ? "on" : "off"}
            
          >
            <span className="star">&#9733;</span>
          </button>
        );
      })}
    </div>
   {rating && !props.overall_rating && <div className="mb-3 heading border shadow border-primary ">
            <textarea
              rows="3"
              placeholder="Write your review..."
              value={comment}
              onChange={handleCommentChange}
              className="form-control"
            />
          </div>}
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="primary" onClick={handleSubmitReview}>Save changes</Button>
        </Modal.Footer>
      </Modal>
            
            {/* <Button
              className="bg-light text-black border-1 border-secondary rounded"
              
            >
              <span style={{ fontSize: "1.2rem" }}>Reorder</span>
            </Button> */}
          </span>
        </div>
        <div className="body-font">
          {props.items.map((item)=>{
           return  <span key={item.item_id} className='body-font text-muted'>{item.item_name} x {item.quantity}{"  "}</span>
          })}
        </div>
      </div>
      <div className="col-3 d-flex align-items-center justify-content-center  position-relative">
        <img
          src={image}
          // src={props.image_url}

          alt=""
          style={{ width: "55%", height: "65%" }}
          className="rounded"
        />
        {/* <Button style={{width:'5vw',left:'45vw',top:'100vw'}} className='bg-light text-black  position-absolute  translate-middle-x translate-middle-y p-2 border border-success'><span className="body-font fw-bold m-2 ">ADD</span><CIcon className="mt-2" icon={cilPlus} size="xxl" /></Button> */}
      </div>
    </div>
  )
}

