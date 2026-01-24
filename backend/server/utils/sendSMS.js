// import axios from "axios";

// export const sendSMS = async (phone, message) => {
//   try {
//     const res = await axios.post(
//       "https://www.fast2sms.com/dev/bulkV2",
//       {
//         route: "q",
//         message: message,
//         numbers: phone,
//       },
//       {
//         headers: {
//           authorization: process.env.FAST2SMS_KEY,
//           "Content-Type": "application/json",
//         },
//       },
//     );

//     console.log("SMS Response:", res.data);
//   } catch (err) {
//     console.log("SMS Error:", err.response?.data || err.message);
//   }
// };
