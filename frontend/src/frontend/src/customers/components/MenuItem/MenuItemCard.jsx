import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  FormControlLabel,
  Alert,
  FormGroup,
  Typography,
  Snackbar,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addItemToCart } from "../../../State/Customers/Cart/cart.action";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { categorizedIngredients } from "../../util/CategorizeIngredients";

const MenuItemCard = ({ item }) => {
  const dispatch = useDispatch();

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  // order Placed
  const [openSnackbar, setOpenSnackbar] = useState(false);
  console.log("item:", item);
  const handleCheckboxChange = (itemName) => {
    if (selectedIngredients.includes(itemName)) {
      console.log("yes");
      setSelectedIngredients(
        selectedIngredients.filter((item) => item !== itemName)
      );
    } else {
      console.log("no");
      setSelectedIngredients([...selectedIngredients, itemName]);
    }
  };

  const handleAddItemToCart = (e) => {
    const data = {
      token: localStorage.getItem("jwt"),
      cartItem: {
        menuItemId: item._id,
        quantity: 1,
        ingredients: selectedIngredients,
      },
    };
    dispatch(addItemToCart(data));
    setOpenSnackbar(true);
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <div className="lg:flex items-center justify-between">
            <div className="lg:flex items-center lg:space-x-5">
              <img
                className="w-[7rem] h-[7rem] object-cover"
                src={item.images[0]}
                alt=""
              />

              <div className="space-y-1 lg:space-y-5 lg:max-w-2xl">
                <p className="font-semibold text-xl">{item.name}</p>
                <p>₹{item.price}</p>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>
            {/* <div>
        <Button onClick={handleAddItemToCart}>Add To Cart</Button>
      </div> */}
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <form onSubmit={handleAddItemToCart}>
            <div className="flex gap-5 flex-wrap">
              {Object.keys(categorizedIngredients(item?.ingredients))?.map(
                (category) => (
                  <div className="pr-5">
                    <p>{category}</p>
                    <FormGroup>
                      {categorizedIngredients(item?.ingredients)[category].map(
                        (ingredient, index) => (
                          <FormControlLabel
                            key={ingredient.name}
                            control={
                              <Checkbox
                                checked={selectedIngredients.includes(
                                  ingredient.name
                                )}
                                onChange={() =>
                                  handleCheckboxChange(ingredient.name)
                                }
                                disabled={!ingredient.inStoke}
                              />
                            }
                            label={ingredient.name}
                          />
                        )
                      )}
                    </FormGroup>
                  </div>
                )
              )}
            </div>

            <div className="pt-5">
              <Button
                variant="contained"
                // done
                // disabled={!item.available}
                type="submit"
              >
                {item.available ? "Add To Carrt" : "Out of stock"}
              </Button>
            </div>
          </form>
        </AccordionDetails>
      </Accordion>
      {/* do */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          variant="filled"
        >
          Order Added Succesfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default MenuItemCard;
