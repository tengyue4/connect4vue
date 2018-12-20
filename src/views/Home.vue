<template>
  	<div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
        <Connect4Input />
  	</div>
</template>

<script>
// @ is an alias to /src
import Connect4Input from '@/components/Connect4Input.vue'
export default {
    name: 'home',
    components: {
        Connect4Input
    }
}
</script>
