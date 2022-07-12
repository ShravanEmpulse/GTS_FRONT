<template>
  <div class="dynamic-tables">
    <b-row>
      <b-col cols="4" style="display: grid">
        <button @click="changeData('primary')" class="btn btn-outline-default" :class="{ active: isAddClassPrimary }">
          <h5 style="font-weight:600;">
            Primary Movements
            <span v-if="primary" class="badge badge-success">Active</span>
          </h5>
        </button>
      </b-col>
      <b-col cols="4" style="display: grid">
        <button @click="changeData('train')" class="btn btn-outline-default" :class="{ active: isAddClassTrain }">
          <h5 style="font-weight:600;">
            Train Movements
            <span v-if="train" class="badge badge-success">Active</span>
          </h5>
        </button>
      </b-col>
      <b-col cols="4" style="display: grid">
        <button @click="changeData('secondary')" class="btn btn-outline-default"
          :class="{ active: isAddClassSecondary }">
          <h5 style="font-weight:600;">
            Secondary Movements
            <span v-if="secondary" class="badge badge-success">Active</span>
          </h5>
        </button>
      </b-col>
    </b-row>
    <PrimaryMovements @getPrimaryData="getPrimaryData($event)" v-if="primary" />
    <TrainMovements :data="fnrData" v-if="train" />
    <SecondaryMovements v-if="secondary" />
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";
import PrimaryMovements from "./PrimaryMovements/PrimaryMovements.vue";
import SecondaryMovements from "./SecondaryMovements/SecondaryMovements.vue";
import TrainMovements from "./TrainMovements/TrainMovements.vue";

export default {
  name: "Train",
  components: { Widget, PrimaryMovements, SecondaryMovements, TrainMovements },
  data() {
    return {
      primary: true,
      secondary: false,
      isAddClassPrimary: false,
      isAddClassSecondary: false,
      isAddClassTrain: false,
      train:false,
      fnrData:[]
    };
  },
  methods: {
    changeData(e) {
      if (e == "primary") {
        this.primary = true;
        this.secondary = false;
        this.train = false;
        this.isAddClassPrimary = true;
        this.isAddClassSecondary = false;
        this.isAddClassTrain = false;
      }
      if (e == "secondary") {
        this.primary = false;
        this.train = false;
        this.secondary = true;
        this.isAddClassPrimary = false;
        this.isAddClassTrain = false;
        this.isAddClassSecondary = true;
      }
      if (e == "train") {
        this.primary = false;
        this.train = true;
        this.secondary = false;
        this.isAddClassPrimary = false;
        this.isAddClassSecondary = false;
        this.isAddClassTrain = true;
      }
    },
    getPrimaryData(e){
      console.log(e);
      this.fnrData = e
    }
  },
  created() {
    this.primary = true;
    this.secondary = false;
    this.train = false;
    this.isAddClassPrimary = true;
    this.isAddClassSecondary = false;
    this.isAddClassTrain = false;
  },
};
</script>

<style src="./Train.scss" lang="scss" />