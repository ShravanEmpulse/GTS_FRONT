<template>
  <div>
    <b-row>
      <b-col cols="2" style="display: grid">
        <button @click="goBack()" class="btn btn-outline-default">
          <i class="la la-angle-double-left"></i> Back To Train
        </button>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col cols="12">
        <GmapMap
          v-bind:style="computedMapSize"
          style="background-color: white; overflow: hidden; border: 1px solid"
          :zoom="zoom"
          :center="center"
          ref="map"
        >
            <!-- <DirectionsRenderer travelMode="TRANSIT" :origin="startLocation" :destination="endLocation" /> -->
        </GmapMap>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
export default {
  name: "TrainPlayback",
  components: {
    
  },
  data() {
    return {
        center: {
            lat: 20.5937,
            lng: 78.9629,
        },
        zoom:5,
        startLocation:{
          lat: 14.162420458868839,
          lng: 77.61579339785216,
        },
        endLocation:{
            lat:22.5726,
            lng:88.3639
        }
    };
  },
  methods: {
    goBack() {
      this.$router.push({ name: "TrainPage" });
    },
  },
  beforeMount(){
        
  },
  computed: {
    computedMapSize() {
      return {
        width: "100%",
        height: "550px",
        borderRadius: "8px",
        overflow: "hidden",
        background: "white",
      };
    },
    google: gmapApi,
  }
};
</script>

<style lang="scss" scoped>
</style>