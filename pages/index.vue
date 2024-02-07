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
onMounted(async () => {
})

const initialize = () => {
  MapStore.createMap(map.value)
}

const getAuthTokenFromServerAndInitialize = async () => {
  try {
    const {data} = await useFetch("http://localhost:5000/getAuthToken/")
    const token = await data.value
    const tokenArr = token.token.split(" ")
    window.ee.data.setAuthToken("", "Bearer", tokenArr[1],3600, [], undefined, false)   
    window.ee.initialize(null, null, () => initialize())
  } catch (e) {
    console.error("error has occured", e )
  }
}
await getAuthTokenFromServerAndInitialize()

const getAuthTokenFromServer = async () => {
  try {
    const {data} = await useFetch("http://localhost:5000/getAuthToken/")
    const token = await data.value
    const tokenArr = token.token.split(" ")
    window.ee.data.setAuthToken("", "Bearer", tokenArr[1],3600, [], undefined, false)   
  } catch (e) {
    console.error("error has occured", e )
  }
}
await getAuthTokenFromServer()
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