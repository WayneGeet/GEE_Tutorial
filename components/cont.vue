<template>
    <div class="w-full">
        <div :class="`bg-gradient-to-r from-${gradient[0]}-500 via-white to-green-500 py-3 w-full `"></div>
    </div>
</template>

<script setup>
    const {gradient} = defineProps(["gradient"])

    watchEffect(()=> {
        console.log(gradient[0])
    })
</script>

<style scoped>

</style>