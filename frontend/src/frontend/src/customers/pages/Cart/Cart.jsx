import {
  Button,
  Card,
  Divider,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { Fragment, useEffect, useState } from "react";
import AddressCard from "../../components/Address/AddressCard";
import CartItemCard from "../../components/CartItem/CartItemCard";
import { useDispatch, useSelector } from "react-redux";

import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import { Box, Modal, Grid, TextField } from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createOrder } from "../../../State/Customers/Orders/Action";
import { findCart } from "../../../State/Customers/Cart/cart.action";
import { isValid } from "../../util/ValidToOrder";
import { cartTotal } from "./totalPay";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

//
import { addNewOrder } from "../../../State/Authentication/Action";
import { create } from "@mui/material/styles/createTransitions";
const initialValues = {
  streetAddress: "",
  state: "",
  pincode: "",
  city: "",
};
const validationSchema = Yup.object().shape({
  streetAddress: Yup.string().required("Street Address is required"),
  state: Yup.string().required("State is required"),
  pincode: Yup.string()
    .required("Pincode is required")
    .matches(/^\d{6}$/, "Pincode must be 6 digits"),
  city: Yup.string().required("City is required"),
});

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  outline: "none",
  p: 4,
};

const Cart = () => {
  const [openSnackbar, setOpenSnakbar] = useState();
  //popup
  const [successMessage, setSuccessMessage] = useState(false);
  const dispatch = useDispatch();
  const { cart, auth } = useSelector((store) => store);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const handleCloseAddressModal = () => {
    setOpenAddressModal(false);
  };
  //

  // const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const handleOpenAddressModal = () => setOpenAddressModal(true);

  useEffect(() => {
    dispatch(findCart(localStorage.getItem("jwt")));
  }, []);

  const handleSubmit = (values, { resetForm }) => {
    const orderItems = cart.cartItems.map((item) => ({
      food: item.food._id, // Item ID (food ID)
      quantity: item.quantity, // Quantity of the item
      totalPrice: item.food.price * item.quantity, // Total price for this item
      ingredients: item.ingredients, // Any special ingredients if applicable
    }));
    // console.log("Handle Button Called:");
    const data = {
      jwt,
      order: {
        restaurantId: cart.cartItems[0].food?.restaurant._id,
        deliveryAddress: {
          fullName: auth.user?.fullName,
          streetAddress: values.streetAddress,
          city: values.city,
          state: values.state,
          postalCode: values.pincode,
          country: "India",
        },
        items: orderItems, // Order items (food, quantity, price, ingredients)
        totalAmount: cartTotal(cart.cartItems) + 33,
      },
    };
    console.log("jwtLgo:", localStorage.getItem("jwt"));
    // console.log("data", data);
    if (isValid(cart.cartItems)) {
      dispatch(createOrder({ data, jwt: auth.jwt || jwt }));
      setSuccessMessage(true); // Show success popup
      resetForm();
    } else setOpenSnakbar(true);
  };

  const createOrderUsingSelectedAddress = (deliveryAddress) => {
    // console.log("this order called");
    const data = {
      jwt,
      order: {
        restaurantId: cart.cartItems[0].food.restaurant._id,
        deliveryAddress: deliveryAddress,
      },
    };
    if (isValid(cart.cartItems)) {
      dispatch(createOrder({ data }));
      setSuccessMessage(true); // Show success popup
    } else setOpenSnakbar(true);
  };

  const handleCloseSankBar = () => setOpenSnakbar(false);
  const handleCloseSuccessMessage = () => setSuccessMessage(false);

  return (
    <Fragment>
      {cart.cartItems.length > 0 ? (
        <main className="lg:flex justify-between">
          <section className="lg:w-[30%] space-y-6 lg:min-h-screen pt-10">
            {cart.cartItems.map((item, i) => (
              <CartItemCard item={item} />
            ))}

            <Divider />
            <div className="billDetails px-5 text-sm">
              <p className="font-extralight py-5">Bill Details</p>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-400">
                  <p>Item Total</p>
                  <p>₹{cartTotal(cart.cartItems)}</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>Deliver Fee</p>
                  <p>₹21</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>Plateform Fee</p>
                  <p>₹5</p>
                </div>
                <div className="flex justify-between text-gray-400">
                  <p>GST and Restaurant Charges</p>
                  <p>₹33</p>
                </div>
                <Divider />
                <div className="flex justify-between text-gray-400">
                  <p>Total Pay</p>
                  <p>₹{cartTotal(cart.cartItems) + 33}</p>
                </div>
              </div>
            </div>
          </section>
          <Divider orientation="vertical" flexItem />
          <section className="lg:w-[70%] flex justify-center px-5 pb-10 lg:pb-0">
            <div className="">
              <h1 className="text-center font-semibold text-2xl py-10">
                Choose Delivery Address
              </h1>
              <div className="flex gap-5 flex-wrap justify-center ">
                {auth.user?.addresses.map((item, index) => (
                  <AddressCard
                    handleSelectAddress={createOrderUsingSelectedAddress}
                    item={item}
                    showButton={true}
                  />
                ))}

                <Card className="flex flex-col justify-center items-center p-5  w-64 ">
                  <div className="flex space-x-5">
                    <AddLocationAltIcon />
                    <div className="space-y-5">
                      <p>Add New Address</p>
                      <Button
                        onClick={handleOpenAddressModal}
                        sx={{ padding: ".75rem" }}
                        fullWidth
                        variant="contained"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <div className="flex h-[90vh] justify-center items-center">
          <div className="text-center space-y-5">
            <RemoveShoppingCartIcon sx={{ width: "10rem", height: "10rem" }} />
            <p className="font-bold text-3xl">Your Cart Is Empty</p>
          </div>
        </div>
      )}
      <Modal open={openAddressModal} onClose={handleCloseAddressModal}>
        <Box sx={style} className="w-11 bg-blue-900">
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Field
                    name="streetAddress"
                    as={TextField}
                    label="Street Address"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("streetAddress")}
                    helperText={
                      <ErrorMessage name="streetAddress">
                        {(msg) => <span className="text-red-600">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="state"
                    as={TextField}
                    label="State"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("state")}
                    helperText={
                      <ErrorMessage name="state">
                        {(msg) => <span className="text-red-600">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <Field
                    name="pincode"
                    as={TextField}
                    label="Pincode"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("pincode")}
                    helperText={
                      <ErrorMessage name="pincode">
                        {(msg) => <span className="text-red-600">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Field
                    name="city"
                    as={TextField}
                    label="City"
                    fullWidth
                    variant="outlined"
                    error={!ErrorMessage("city")}
                    helperText={
                      <ErrorMessage name="city">
                        {(msg) => <span className="text-red-600">{msg}</span>}
                      </ErrorMessage>
                    }
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary">
                    Deliver Here
                  </Button>
                </Grid>
              </Grid>
            </Form>
          </Formik>
        </Box>
      </Modal>
      <Snackbar
        severity="success"
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSankBar}
        message="Please Add Items Only From One Restaurants At time"
      />
      //
      <Snackbar
        open={successMessage}
        autoHideDuration={6000}
        onClose={handleCloseSuccessMessage}
      >
        <Alert onClose={handleCloseSuccessMessage} severity="success">
          Order Placed Successfully!
        </Alert>
      </Snackbar>
    </Fragment>
  );
};

export default Cart;
