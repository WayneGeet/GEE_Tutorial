<template>
  <div>
      <h2>Google Earth Engine w Nuxt 3</h2>
      <div ref="map" class="w-full max-h-full h-screen"></div>
  </div>
</template>

<script setup>
  import {useMapStore} from "~/store/map"
  const MapStore = useMapStore()

  const map = ref(null)

  onMounted( () => {
    setInterval(()=> getAuthTokenFromServer(), 3000000)
    
  })
  const initialize = () => {
      map.value && MapStore.createMap(map.value)
      MapStore.initDrawingManager(MapStore.map);

    }

  const getAuthTokenFromServerAndInitialize = async () => {
    try {
      const { data } = await useFetch("/api/getToken/");
      if (data && data.value && data.value.token) {
        const token = data.value.token; // Assuming this is the correct path
        const tokenArr = token.split(" ");
        window.ee.data.setAuthToken("", "Bearer", tokenArr[1],3600, [], undefined, false)   
        window.ee.initialize(null, null, () => initialize())
      } else {
        console.error("Missing or invalid data from API response");
      }
    } catch (e) {
      console.error("Error fetching token:", e);
      // Handle errors appropriately
    }
  };
  const getAuthTokenFromServer = async () => {
    try {
      const {data} = await useFetch("/api/getToken/")
      const token =  data.value
      const tokenArr = token.split(" ")
      window.ee.data.setAuthToken("", "Bearer", tokenArr[1],3600, [], undefined, false)   
    } catch (e) {
      console.error("error has occured", e )
    }
  }
  getAuthTokenFromServerAndInitialize()



</script>

<style scoped>

</style>
<!-- getAuthTokenFromServer() {
  let that = this;
  that.$axios
    .$get("/ee-api/getAuthToken/")
    .then((response) => {
      const tokenArray = response.split(" ");
      const token = tokenArray[1];
      window.ee.data.setAuthToken(
        "",
        "Bearer",
        token,
        3600,
        [],
        undefined,
        false
      );
    })
    .catch((e) => {
      that.$message.error(e.toString());
    });
},
getAuthTokenFromServerAndInitialise() {
  let that = this;
  that.$axios
    .$get("/ee-api/getAuthToken/")
    .then((response) => {
      const tokenArray = response.split(" ");
      const token = tokenArray[1];
      window.ee.data.setAuthToken(
        "",
        "Bearer",
        token,
        3600,
        [],
        undefined,
        false
      );

      window.ee.initialize(
        null,
        null,
        () => {
          that.initialize();
        },
        (e) => {
          console.error("Initialization error: " + e);
        }
      );
    })
    .catch((e) => {
      that.$message.error(e.toString());
    });
},

async initialize() {
  await this.initializeMaps({
    vueInstance: this,
    mapLeftRef: this.$refs.mapLeft,
    mapRightRef: this.$refs.mapRight,
    mapContainerRef: this.$refs.mapContainer
  });

  await this.initializeDrawingManager();

  await this.initializeEeAssets(this.GEE_PROJECT_ASSET_PATH);
}, -->