<template>
    <div>
        <h1>Learning about GEE</h1>
        <div class="w-full min-h-[70vh]" ref="mapRef"></div>
    </div>
</template>

<script setup>
import {useMapStore} from "~/store/map"
const MapStore = useMapStore()
useHead({
  title: 'Home',
  meta: [
    { name: 'An app about leveraging the power of GEE in web dev', content: 'My amazing site.' }
  ]
})
const mapRef = ref(null)

onMounted( async () => {
  const data = await useFetch("/api/bye/")
  console.log(data, " this is me saying good bye")
  await getAuthTokenFromServerAndInitialize()
  setInterval(async () => {
    await getAuthTokenFromServer()
  }, 3000000)
})

const getAuthTokenFromServer = async () => {
  try {
    const {data} = await useFetch("/api/hello/")
    const [_, access] = data.value.split(" ")
    console.log(access, " this is access")

    window.ee.data.setAuthToken("","Bearer",access,3600,[],undefined, false)
  } catch (error) {
    console.log(error)
  }
}

const getAuthTokenFromServerAndInitialize = async () => {
  try {
    const {data} = await useFetch("/api/hello/")
    const token =  data.value
    console.log(data, " this is access")

    const [_, access] = token[1]
    window.ee.data.setAuthToken("","Bearer",access,3600,[],undefined, false)
    window.ee.initialize(null, null, () => initializeMap(mapRef), (e) => console.log(e))
  } catch (error) {
    console.log(error)
  }
}

const initializeMap = async (map) => {
  await MapStore.createMap(map)
}

// getAuthTokenFromServer() {
//       let that = this;
//       that.$axios
//         .$get("/ee-api/getAuthToken/")
//         .then((response) => {
//           const tokenArray = response.split(" ");
//           const token = tokenArray[1];
//           window.ee.data.setAuthToken(
//             "",
//             "Bearer",
//             token,
//             3600,
//             [],
//             undefined,
//             false
//           );
//         })
//         .catch((e) => {
//           that.$message.error(e.toString());
//         });
//     },
//     getAuthTokenFromServerAndInitialise() {
//       let that = this;
//       that.$axios
//         .$get("/ee-api/getAuthToken/")
//         .then((response) => {
//           const tokenArray = response.split(" ");
//           const token = tokenArray[1];
//           window.ee.data.setAuthToken(
//             "",
//             "Bearer",
//             token,
//             3600,
//             [],
//             undefined,
//             false
//           );

//           window.ee.initialize(
//             null,
//             null,
//             () => {
//               that.initialize();
//             },
//             (e) => {
//               console.error("Initialization error: " + e);
//             }
//           );
//         })
//         .catch((e) => {
//           that.$message.error(e.toString());
//         });
//     },

//     async initialize() {
//       await this.initializeMaps({
//         vueInstance: this,
//         mapLeftRef: this.$refs.mapLeft,
//         mapRightRef: this.$refs.mapRight,
//         mapContainerRef: this.$refs.mapContainer
//       });

//       await this.initializeDrawingManager();

//       await this.initializeEeAssets(this.GEE_PROJECT_ASSET_PATH);
//     },

</script>


<style scoped>

</style>