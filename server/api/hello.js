export default defineEventHandler(async (event) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/getAuthToken/");
    if (response.status === 200) {
      console.log(response, " this is from express");
      return response;
    }
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      statusMessage: "Something went wrong",
    });
  }
});
