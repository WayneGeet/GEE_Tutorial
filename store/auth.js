import { defineStore } from "pinia";

export const useAuth = defineStore("auth", () => {
  const eeInitialized = ref(false);
  const getAuthTokenFromServerAndInitialize = async () => {
    try {
      const data = await $fetch("http://127.0.0.1:5000/getAuthToken/");
      // Assuming this is the correct path
      const tokenArr = data.split(" ");
      console.log("token array:", tokenArr);
      window.ee.data.setAuthToken(
        "",
        "Bearer",
        tokenArr[1],
        3600,
        [],
        undefined,
        false
      );
      window.ee.initialize(null, null, () => {
        console.log("ee initialized");
        eeInitialized.value = true;
      });
    } catch (e) {
      console.error("Error fetching token:", e);
      // Handle errors appropriately
    }
  };

  const getAuthTokenFromServer = async () => {
    try {
      const data = await $fetch("http://127.0.0.1:5000/getAuthToken/");
      const tokenArr = data.split(" ");
      window.ee.data.setAuthToken(
        "",
        "Bearer",
        tokenArr[1],
        3600,
        [],
        undefined,
        false
      );
    } catch (e) {
      console.error("error has occured", e);
      eeInitialized.value = false;
    }
  };
  return {
    getAuthTokenFromServerAndInitialize,
    getAuthTokenFromServer,
    eeInitialized,
  };
});
