<template>
  	<div>
		  <ul>
			  <li v-for="(log, i) in $store.state.logs" :key="i">{{log}}</li>
		  </ul>
  	</div>
</template>

<script>
export default {
    name: 'Log'
}
</script>
