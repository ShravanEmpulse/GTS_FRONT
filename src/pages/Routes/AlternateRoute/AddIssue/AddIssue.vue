<template>
  <div>
    <b-row>
      
      <b-col cols="9 mt-3" v-bind:style="computedMapSize">
        <GmapMap
          v-bind:style="computedMapSize"
          :zoom="zoom"
          :center="center"
          ref="map"
          @click="mark"
        >
          <GmapMarker
            v-for="(marker, i) in markers"
            :position="marker.position"
            :clickable="true"
            :draggable="true"
            :key="i"
            @drag="updateMarker(i, $event.latLng)"
          />
        </GmapMap>
      </b-col>
      <b-col cols="3 mt-3">
        <div class="card" style="height:600px">
          <div
            class="card-body"
            style="border: 1px solid; border-radius: 5px ;"
          >
            <h4 class="text-center">Add Issue</h4>
            <b-row>
              <b-col cols="12">
                <form @submit.prevent="addIssue()" >
                    <div>
                      <label for="location">Location</label>
                      <input
                          type="text"
                          name="location"
                          class="form-control"
                          disabled
                          v-model="issue_data.location"
                      />
                    </div>
                    <div class="mt-3">
                      <label for="transporter">Transporter Name</label>
                      <input
                          type="text"
                          name="transporter"
                          class="form-control"
                          placeholder="Transporter Name"
                          v-model="issue_data.transporterName"
                      />
                    </div>
                    <div class="mt-3">
                      <label for="issue">Issue Name</label>
                      <input
                          type="text"
                          name="issue"
                          class="form-control"
                          placeholder="Issue Name"
                          v-model="issue_data.issueName"
                      />
                    </div>
                    <div class="mt-3">
                        <label for="range">Range</label>
                        <b-input-group style="display:grid;">
                            <b-input-group-append>
                                <b-form-select
                                v-model="selectRange"
                                :options="rangeOptions"
                                @change="rangeSelected"
                                ></b-form-select>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                    <div class="mt-3">
                        <label for="startDate">Start Date</label>
                        <input @change="onChangeStart" type="date" name="startDate" id="startDate" class="form-control">
                    </div>
                    <div class="mt-3">
                        <label for="status">Status</label>
                        <b-input-group style="display:grid;">
                            <b-input-group-append>
                                <b-form-select
                                v-model="selectStatus"
                                :options="search_options"
                                @change="selectedValue"
                                ></b-form-select>
                            </b-input-group-append>
                        </b-input-group>
                    </div>
                    <hr>
                    <div class="mt-4 my-2" style="display:grid;">
                        <button @type="addIssue()" class="btn btn-primary shadow">Add Issue</button>
                    </div>
                </form>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import { gmapApi } from "vue2-google-maps";
import routeAxios, { routesAxios } from "../../../../main";
export default {
  name: "AddIssue",
  data() {
    return {
      issue_data:{
        location: "Please mark location on map by clicking",
        latitude:"",
        longitude:"",
        startDate:"",
        endDate:"",
        issueName:"",
        status: null,
        transporterName:"",
        crisisRange:""
      },
      selectStatus:"Ongoing",
      selectRange:"10000",
      zoom: 5,
      center: {
        lat: 20.5937,
        lng: 78.9629,
      },
      markers: [],
      
        search_options: [
                    { value: "Ongoing", text: "Ongoing" },
                    { value: "Damaged", text: "Damaged" },
                    { value: "Resolved", text: "Resolved" },
        ],
        rangeOptions: [
                    { value: "10000", text: "10 km's" },
                    { value: "20000", text: "20 km's" },
                    { value: "30000", text: "30 km's" },
                    { value: "40000", text: "40 km's" },
                    { value: "50000", text: "50 km's" },
        ],
    };
  },
  computed: {
    google: gmapApi,
    computedMapSize() {
      return {
        width: "100%",
        height: "600px",
        borderRadius: "8px",
        overflow: "hidden",
      };
    },
  },
  mounted(){
    
  },
  methods: {
    selectedValue(e){
        console.log(e);
    },
    rangeSelected(e){
      console.log(e);
      console.log(this.selectRange);
      this.issue_data.crisisRange = this.selectRange
    },
    showSuccessrAlert() {
        this.$swal({
            title: 'Success',
            text: 'Issue Added Successfully!',
            confirmButtonText: 'OK'
        }).then(() => {
          window.location.reload();
      })
    },
    onChangeStart(e){
        console.log(e.target.value);
        this.issue_data.startDate = this.$moment(e.target.value).format('YYYYMMDDHHMMSS');
        // console.log(this.start, 'Start');
    },
    onChangeEnd(e){
        console.log(e.target.value);
        this.issue_data.endDate = this.$moment(e.target.value).format('YYYYMMDDHHMMSS');
        // console.log(this.start, 'Start');
    },
    addIssue(){
        console.log(this.issue_data);
        // let statusNo = null;
        console.log(this.issue_data.status);

        if(this.selectStatus == "Ongoing"){
            this.issue_data.status = 0
        }
        else if(this.selectStatus == "Damaged"){
            this.issue_data.status = 1
        }
        else if(this.selectStatus == "Resolved"){
            this.issue_data.status = 2
        }
        console.log(this.issue_data);
        // let URL = `/v1/api/crisis/create?transporterName=${this.issue_data.transporterName}&status=${statusNo}&issueName=${this.issue_data.issueName}&location=${this.issue_data.issueLocation}&startDate=${this.issue_data.startDate}&endDate=${this.issue_data.endDate}&latitude=${this.issue_data.latitude}&longitude=${this.issue_data.longitude}`;
        let URL = "/v1/api/crisis/create"
         routesAxios.post(URL,this.issue_data)
         .then((res)=>{
            console.log(res);
            this.showSuccessrAlert()
         })
    },
    mark(event) {
      this.markers = [];
      console.log(event);
      this.markers.push({
        position: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng(),
        },
      });
      var geocoder = new google.maps.Geocoder(); // create a geocoder object
      var location = new google.maps.LatLng(event.latLng.lat(), event.latLng.lng());
      geocoder.geocode({ latLng: location }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          var add = results[0].formatted_address;
          console.log(add);
            this.issue_data.location = add;
            console.log(this.issue_data.location, "issue location");
            this.issue_data.latitude =event.latLng.lat()
            this.issue_data.longitude = event.latLng.lng()
            console.log(this.issue_data);
        }
      });
    },
    updateMarker(index, event) {
      console.log(index);
      console.log(event);
      var geocoder = new google.maps.Geocoder(); // create a geocoder object
      var location = new google.maps.LatLng(event.lat(), event.lng());
      geocoder.geocode({ latLng: location }, (results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          var add = results[0].formatted_address;
          console.log(add);
          console.log(this.issue_data.location, "issue location");
            this.issue_data.location = add;
            this.issue_data = {
                latitude:event.lat(),
                longitude:event.lng()
            }
            console.log(this.issue_data);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>