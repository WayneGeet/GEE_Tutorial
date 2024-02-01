<template>
    <div>
        <h1>Learning about GEE</h1>
    </div>
</template>

<script setup>
useHead({
  title: 'GEE Training',
  meta: [
    { name: 'An app about leveraging the power of GEE in web dev', content: 'My amazing site.' }
  ]
})
const {data} = await useFetch("localhost:3000/getAuth")
console.log(data.value)
</script>


<style scoped>

</style>