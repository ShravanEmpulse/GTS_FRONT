<template>
  <div class="dynamic-tables">
    <PrimaryMovements />
    <SecondaryMovements />
  </div>
</template>
<script>
import Widget from '@/components/Widget/Widget';
import PrimaryMovements from './PrimaryMovements/PrimaryMovements.vue'
import SecondaryMovements from './SecondaryMovements/SecondaryMovements.vue'

export default {
  name: 'Train',
  components: { Widget, PrimaryMovements, SecondaryMovements },
  data() {
    return {
      
    }
  }
};
</script>
<style src="./Train.scss" lang="scss" />