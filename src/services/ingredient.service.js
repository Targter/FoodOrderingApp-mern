const IngredientCategory = require("../models/ingredientCategory.model.js");
const IngredientsItem = require("../models/ingredientItem.model.js");
const Restaurant = require("../models/restaurant.model.js");

module.exports = {
  async createIngredientsCategory(name, restaurantId) {
    try {
      let category = await IngredientCategory.findOne({
        restaurant: restaurantId,
        name: name,
      });
      if (category) {
        return category;
      }

      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error(`Restaurant not found with ID ${restaurantId}`);
      }

      category = new IngredientCategory({
        name: name,
        restaurant: restaurantId,
      });
      const createdCategory = await category.save();
      return createdCategory;
    } catch (error) {
      throw new Error(
        `Failed to create ingredients category: ${error.message}`
      );
    }
  },

  async findIngredientsCategoryById(id) {
    try {
      const category = await IngredientCategory.findById(id);
      if (!category) {
        throw new Error(`Ingredient category not found with ID ${id}`);
      }
      return category;
    } catch (error) {
      throw new Error(
        `Failed to find ingredients category with ID ${id}: ${error.message}`
      );
    }
  },

  async findIngredientsCategoryByRestaurantId(restaurantId) {
    try {
      const categories = await IngredientCategory.find({
        restaurant: restaurantId,
      });
      return categories;
    } catch (error) {
      throw new Error(
        `Failed to find ingredients categories for restaurant with ID ${restaurantId}: ${error.message}`
      );
    }
  },

  async findRestaurantsIngredients(restaurantId) {
    try {
      const items = await IngredientsItem.find({
        restaurant: restaurantId,
      }).populate("category");
      return items;
    } catch (error) {
      throw new Error(
        `Failed to find ingredients for restaurant with ID ${restaurantId}: ${error.message}`
      );
    }
  },

  async createIngredientsItem(
    restaurantId,
    ingredientName,
    ingredientCategoryId
  ) {
    try {
      // Find the ingredient category by its ID
      const category = await this.findIngredientsCategoryById(
        ingredientCategoryId
      );

      if (!category) {
        throw new Error(
          `Ingredient category not found with id ${ingredientCategoryId}`
        );
      }

      // Check if the item already exists in the same restaurant under the same category
      let item = await IngredientsItem.findOne({
        restaurant: restaurantId,
        name: ingredientName,
        category: category._id,
      }).populate("category");

      if (item) {
        return item; // Return the existing item
      }

      // Ensure the restaurant exists before creating the new ingredient item
      const restaurant = await Restaurant.findById(restaurantId);
      if (!restaurant) {
        throw new Error(`Restaurant not found with ID ${restaurantId}`);
      }

      // Create a new IngredientsItem without populating immediately
      item = new IngredientsItem({
        name: ingredientName,
        restaurant: restaurantId,
        category: category._id,
      });

      // Save the new item to the database
      const savedItem = await item.save();

      // Populate the category field after saving the item
      await savedItem.populate("category");

      // Add the saved item to the category's ingredients list and save the category
      category.ingredients.push(savedItem._id);
      await category.save();

      return savedItem;
    } catch (error) {
      throw new Error(`Failed to create ingredients item: ${error.message}`);
    }
  },

  async updateStoke(id) {
    try {
      const item = await IngredientsItem.findById(id).populate("category");
      if (!item) {
        throw new Error(`Ingredient not found with ID ${id}`);
      }

      // Toggle the 'inStoke' status
      item.inStoke = !item.inStoke;
      await item.save();
      return item;
    } catch (error) {
      throw new Error(
        `Failed to update ingredient stock status with ID ${id}: ${error.message}`
      );
    }
  },
};
