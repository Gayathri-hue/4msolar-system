// // import dotenv from "dotenv";
// // dotenv.config();

// // import mongoose from "mongoose";
// // import app from "./app.js";

// // const PORT = process.env.PORT || 8000;
// // const DATABASE = process.env.DATABASE;

// // const startServer = async () => {
// //   try {
// //     await mongoose.connect(DATABASE);
// //     console.log("MongoDB connected successfully!");

// //     app.listen(PORT, () => {
// //       console.log(`Server running on port ${PORT}`);
// //     });
// //   } catch (err) {
// //     console.error("MongoDB Connection Error:", err.message);
// //     process.exit(1);
// //   }
// // };

// // startServer();

// import app from "./app.js";
// import mongoose from "mongoose";
// import { config } from "dotenv";

// const { connect } = mongoose;

// config({
//   path: "./.env",
// });

// const database = process.env.DATABASE;
// const port = process.env.PORT || 8000;

// connect(database, {})
//   .then(() => {
//     console.log("DB Connected");
//   })
//   .catch((err) => {
//     console.error("DB Connection Error:", err);
//   });

// app.listen(port, "0.0.0.0", () => {
//   console.log(`Server running on port ${port}`);
// });

// import mongoose from "mongoose";
// import app from "./app.js";
// import { config } from "dotenv";

// config();

// const database = process.env.DATABASE;
// const port = process.env.PORT || 8000;

// mongoose
//   .connect(database)
//   .then(() => console.log("DB Connected"))
//   .catch((err) => console.error("DB Connection Error:", err));

// app.listen(port, "0.0.0.0", () => {
//   console.log(`Server running on port ${port}`);
// });

import mongoose from "mongoose";
import app from "./app.js";
import { config } from "dotenv";

config();

const database = process.env.DATABASE;
const port = process.env.PORT || 8000;

mongoose
  .connect(database)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Connection Error:", err));

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
});
