<template>
    <div class="flex h-screen" ref="mapContainerRef">
      <div class="w-1/2 h-full bg-orange-500 relative" id="left" ref="">
        <p>left panel</p>
        <div
          id="map-left"
          class="h-full w-full absolute right-0 top-0 left-0 bottom-0"
          ref="mapLeftRef"
        ></div>
      </div>
      <div class="w-1/2 h-full bg-sky-500 relative" id="right" ref="">
        <p>right panel</p>
        <div
          id="map-right"
          class="h-full absolute right-0 top-0 left-0 bottom-0"
          ref="mapRightRef"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup>  
  import {useMapStore} from "~/store/map"
    import {useAuth} from "~/store/auth"
    import {useEe} from "~/store/ee"

    const MapStore = useMapStore();
    const AuthStore = useAuth();
    const EeStore = useEe();

    const mapContainerRef = ref(null);
    const mapLeftRef = ref(null);
    const mapRightRef = ref(null);
    const split = ref(null);
    const mapLeft = ref(null);
    const mapRight = ref(null);

    const {data:token} = await useFetch("/api/getToken")
    console.log(token)
  
  onMounted(() => {
    // const obj = MapStore.initializeMap(mapLeftRef.value, mapRightRef.value);
    // mapLeft.value = obj.map1;
    // mapRight.value = obj.map2;
    
    split.value = window.Split(["#left", "#right"], {
      sizes: [50, 50],
      minSize: 200,
      gutterSize: 10,
      snapOffset:50,
      gutter: (index, direction) => {
        const gutter = document.createElement('div');
        gutter.className = `gutter gutter-${direction}`;
        return gutter;
      },
    });
  });
  </script>
  
  <style scoped>
  /* .split-container {
    display: flex;
    height: 100vh;
  } */
  
  /* #left, #right {
    width: 50%;
    height: 100%;
    background-color: #f0f0f0;
    position: relative;
  } */
  
  .gutter {
    background-color: #ccc;
    cursor: ew-resize;
    width: 10px;
  }
  </style>
  