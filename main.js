Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true
    }
  },

  template: `
    <div class="product">
    <div class="product-image" >
      <!-- v-bind binds an attribute(src) to an expression(inside ""). you can skip writing v-bind and just keep the :src -->
      <img v-bind:src="image">
      <br>
      <a target=”_blank” v-bind:href="link">Don't click this</a>
    </div>
    <div class="product-info">
      <h1>  {{ title }}  </h1>
      <p>{{ description }}</p>
      <p v-if="inventory > 10"> <strong>In Stock</strong></p>
      <p v-else-if="inventory<=10 && inventory > 0"> <strong>Almost Sold Out</strong></p>
      <p v-show="stinky"> <strong>Extra Stinky</strong></p>
      <p v-else> <strong>Out Of Stock</strong></p>
      <p> Shipping: {{ shipping }}</p>
      <br>
      <p class="sale" v-if="onSale"> <strong> On Sale Now! </strong></p>

      <ul>
        <li v-for='detail in details'>{{ detail }}</li>
      </ul>
      <!-- The v-on has a shorthand which is @mouseover -->
      <!-- Below were binding to a style attribute by adding backgroundColor and changing it with the variant.variantColor to blue or green -->
      <div v-for="(variant, index) in variants" v-bind:key="variant.variantId"
      class="color-box"
      :style="{ backgroundColor:variant.variantColor }"
      v-on:mouseover="updateProduct(index)">
      </div>
      <!-- Class Bindings below if the product is not in stock the button will get disabled and the class of disabledButton will kick in -->
      <span><button v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{disabledButton: !inStock}"> Add to Cart </button> <button v-on:click="removeFromCart"> Remove From Cart </button> </span>
    </div>

    <div>
    <h2> Reviews </h2>
    <p v-if="!reviews.length "> There are no reviews yet. </p>

    <ul>
      <li v-for='review in reviews'>
      <p> {{ review.name }} </p>
      <p> Rating: {{ review.rating }} </p>
      <p> {{ review.review }} </p>
       </li>
    </ul>


    </div>
    <div>
      <product-review @review-submitted="addReview"></product-review>
    </div>

  </div>
  `,
  data() {
    return {
      product: "Socks",
      description: "These socks are waterproof but smell kinda funny",
      brand: "Stay Dry",
      selectedVariant: 0,
      // image: "./assets/vmSocks-green-onWhite.jpg",
      link: "https://www.youtube.com/watch?v=-jigGg5mhGY&feature=youtu.be",
      inventory: 10,
      stinky: false,
      onSale: true,
      details: ["80% Seal", "20% Shark Skin", "Gender Neutral"],
      variants: [
        {
          variantId: 1,
          variantColor: "green",
          variantImage: "./assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10
        },
        {
          variantId: 2,
          variantColor: "blue",
          variantImage: "./assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 0
        }
      ],
      reviews: []
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
    },
    addReview(productReview) {
      this.reviews.push(productReview);
    }
  },
  //LESSON 7 COMPUTED PROPERTIES NOT CLEAR FROM 2:00 ONWARDS
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return "$2.99";
    }
  }
});

Vue.component("product-review", {
  template: `
  <form class="review-form" @submit.prevent="onSubmit">
  <p>
    <label for="name">Name:</label>
    <input id="name" v-model="name" placeholder="name">
  </p>

  <p>
    <label for="review">Review:</label>
    <textarea id="review" v-model="review" required></textarea>
  </p>

  <p>
    <label for="rating">Rating:</label>
    <select id="rating" v-model.number="rating">
      <option>5</option>
      <option>4</option>
      <option>3</option>
      <option>2</option>
      <option>1</option>
    </select>
  </p>

  <p>
    <input type="submit" value="Submit">
  </p>

</form>
  `,
  data() {
    return {
      name: null,
      rating: null,
      review: null
    };
  },
  methods: {
    onSubmit() {
      let productReview = {
        name: this.name,
        review: this.review,
        rating: this.rating
      };
      this.$emit("review-submitted", productReview);
      this.name = null;
      this.review = null;
      this.rating = null;
    }
  }
});

let app = new Vue({
  el: "#app",
  data: {
    premium: false,
    cart: []
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      for (var i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          this.cart.splice(i, 1);
        }
      }
    }
  }
});
