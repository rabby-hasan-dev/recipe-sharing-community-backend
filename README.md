

# Recipe Sharing Community - API Endpoints

## Authentication & User Management

### **Authentication**
- **POST** `/auth/login`: Login with email and password to receive a JWT token.
- **POST** `/auth/refresh-token`: Refresh the JWT token.
- **POST** `/auth/change-password`: Change the user's password.
- **POST** `/auth/forgot-password`: Send a password reset link to the user's email.
- **POST** `/auth/reset-password`: Reset the user's password using a token.

### **User Creation**
- **POST** `/register/create-user`: Register a new user.
- **POST** `/register/create-admin`: Register a new admin user.

## User Profile Management
- **GET** `/profile/me`: Get the current user's profile.
- **PATCH** `/profile/me`: Update the current user's profile.
- **GET** `/profile/:userId`: Get another user's profile.
- **GET** `/profile/me/followers`: Get the current user's followers.
- **GET** `/profile/me/following`: Get the current user's following.
- **PUT** `/profile/:userId/follow`: Follow a user.
- **PUT** `/profile/:userId/unfollow`: Unfollow a user.

### **Admin Profile**
- **GET** `/admins/profile/me`: Get the admin's profile.
- **PATCH** `/admins/profile/me`: Update the admin's profile.

## Admin Controls

### **Manage Users**
- **GET** `/admin/users`: Get all users (only accessible to admins).
- **PUT** `/admin/users/:id/block`: Block a user (only accessible to admins).
- **DELETE** `/admin/users/:id`: Delete a user (only accessible to admins).

### **Manage Recipes**
- **PUT** `/admin/recipes/:recipeId/publish`: Publish a recipe (only accessible to admins).
- **DELETE** `/admin/recipes/:recipeId`: Delete a recipe (only accessible to admins).

## Recipe Management

### **Recipe CRUD**
- **POST** `/recipes`: Create a new recipe. (Requires JWT authentication).
- **GET** `/recipes`: Fetch all recipes with optional filters (search, tags, etc.).
  - **Query Params**: `?search=spaghetti&tag=Italian`
- **GET** `/recipes/:recipeId`: Fetch a specific recipe by recipeId.
- **PUT** `/recipes/:recipeId`: Update an existing recipe. (Requires JWT authentication - must be the author or an admin).
- **DELETE** `/recipes/:recipeId`: Delete a recipe by recipeId. (Requires JWT authentication - must be the author or an admin).


## Social Features

### **Recipe Ratings**
- **POST** `/recipes/:recipeId/rate`: Rate a recipe.
- **GET** `/recipes/:recipeId/ratings`: Fetch all ratings for a recipe.
- **GET** `/recipes/:recipeId/rating/average`: Fetch the average rating for a recipe.

### **Comments on Recipes**
- **POST** `/recipes/:recipeId/comments`: Post a comment on a recipe. (Requires JWT authentication).
  - **Request Body**: `{ "content": "Great recipe!" }`
- **GET** `/recipes/:recipeId/comments`: Fetch all comments for a recipe.
- **PUT** `/recipes/:recipeId/comments/:commentId`: Edit a comment. (Requires JWT authentication - must be the author).
- **DELETE** `/recipes/:recipeId/comments/:commentId`: Delete a comment. (Requires JWT authentication - must be the author).

### **Upvote/Downvote System**
- **PUT** `/recipes/:recipeId/upvote`: Upvote a recipe. (Requires JWT authentication).
- **PUT** `/recipes/:recipeId/downvote`: Downvote a recipe. (Requires JWT authentication).
- **GET** `/recipes/:recipeId/votes`: Fetch the total upvotes/downvotes for a recipe.

## Recipe Feed

### **Public Recipe Feed**
- **GET** `/feed`: Fetch a feed of public recipes. Includes infinite scroll and optional filters (tags, ratings, etc.).
  - **Query Params**: `?tag=vegan&sort=rating`

### **Premium Content Feed**
- **GET** `/feed/premium`: Fetch recipes that are exclusive to premium users. Requires JWT authentication and a valid premium subscription.

## Premium Membership

### **Premium Subscription**
- **POST** `/premium/subscribe`: Subscribe to premium membership using payment (AAMARPAY/Stripe). Requires JWT authentication.
  - **Request Body**: `{ "paymentMethod": "stripe", "plan": "monthly" }`
- **GET** `/premium/status`: Check the current user's premium membership status.

### **Premium Content Access**
- **GET** `/premium/recipes`: Fetch premium-only recipes. Requires JWT authentication and premium membership.

