<template>
	<div>
		<v-head></v-head>
    	<router-view></router-view>
    </div>
</template>

<script>
    import vHead from './components/header.vue';

  	export default {
            components:{
            vHead
        }
  	}

</script>

<style>
  	
</style>
