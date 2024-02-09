export default defineEventHandler(async (event) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/getAuthToken/");
    if (response.status === 200) {
      const token = await response.json();
      return { token: token.authToken };
    } else {
      return { message: "something went wrong" };
      // Handle other response statuses appropriately
    }
  } catch (error) {
    console.error(error, " this is error");
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
    });
  }
});
