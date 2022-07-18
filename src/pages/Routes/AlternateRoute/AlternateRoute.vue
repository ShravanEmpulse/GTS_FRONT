<template>
  <div>
    <b-row class="mt-3">
      <b-col cols="4" style="display: grid">
        <button @click="menuButtonClick('alternate')" :class="{ active: alternateRoute }"
          class="btn btn-outline-default py-2">
          <h5><b>Alternate Route Recommendation</b> <span v-if="alternateRoute" class="badge badge-success">Active</span></h5>
            
        </button>
      </b-col>
      <b-col cols="4" style="display: grid">
        <button @click="menuButtonClick('issue')" :class="{ active: issue }" class="btn btn-outline-default py-2">
          <h5><b>Add Issue</b> <span v-if="issue" class="badge badge-success">Active</span></h5>
            
        </button>
      </b-col>
      <b-col cols="4" style="display: grid">
        <button @click="menuButtonClick('crisis')" :class="{ active: crisis }" class="btn btn-outline-default py-2">
          <h5><b>Crisis Alert </b> <span v-if="crisis" class="badge badge-success">Active</span></h5>
            
        </button>
      </b-col>
    </b-row>
    <div v-if="alternateRoute" class="mt-3">
      <b-row>
        <b-col cols="3">
          <div class="card">
            <div style="padding-bottom: 0px" class="card-header text-center">
              <b-row>
                <b-col cols="6" style="display: grid">
                  <button @click="sideBarMenu('route')" :class="{ active: route }" class="btn btn-outline-default">
                    <h5><b> Alternate Route</b></h5>
                  </button>
                </b-col>
              </b-row>
            </div>
            <div v-if="route" class="card-body" style="border: 1px solid">
              <h5 class="text-center">Alternate Route</h5>
              <b-row>
                <b-col cols="1">
                  <div class="left_icon">
                    <p class="circle"><i class="la la-circle-thin"></i></p>
                    <p class="dot">
                      <i>.</i>
                      <i>.</i>
                      <i>.</i>
                    </p>
                    <p><i class="la la-map-marker text-danger h5"></i></p>
                  </div>
                </b-col>
                <b-col cols="10">
                  <div class="input_field">
                    <!-- <GmapAutocomplete
                    class="form-control"
                    placeholder="From Location"
                    @place_changed="setStart"
                  /> -->
                    <input type="text" class="form-control" placeholder="From Location" :value="origin" disabled />
                    <GmapAutocomplete class="form-control my-2" placeholder="To Location" @place_changed="setEnd" />
                  </div>
                </b-col>
                <b-col cols="1">
                  <div class="right_icon">
                    <p></p>
                    <p class="exchange">
                      <i class="fa fa-exchange" aria-hidden="true"></i>
                    </p>
                    <p></p>
                  </div>
                </b-col>
              </b-row>
              <hr />
              <div id="sidebar"></div>
            </div>
          </div>
        </b-col>
        <b-col cols="9" v-bind:style="computedMapSize">
          <GmapMap v-bind:style="computedMapSize" :zoom="zoom" :center="center" ref="map">
            <GmapMarker v-for="(marker, i) in markers" :icon="marker.icon" :position="marker.latLng" :clickable="true"
              :title="marker.title" :animation="1" :key="i" @click="markerClickEvent(marker, i)" />
            <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen"
              @closeclick="infoWinOpen = false">
              <div class="infoContent" v-html="infoContent"></div>
            </GmapInfoWindow>
            <DirectionsRenderer travelMode="DRIVING" :origin="startLocation" :destination="endLocation" />
            <GmapCircle
              v-for="pin in markers"
              :key="pin.latLng.lng"
              :center="pin.latLng"
              :radius="pin.crisisRange"
              :visible="true"
              :clickable="false"
              ref="circleRef"
              :options="{
                fillColor: 'red',
                fillOpacity: 0.3,
                strokeColor: 'transparent',
              }"
            ></GmapCircle>
          </GmapMap>
        </b-col>
      </b-row>
      <b-row>
        <b-col cols="12 mt-3">
          <div>
            <div>
              <download-excel class="btn btn-outline-default" :data="exportData" worksheet="AlternateRoute" type="csv"
                :fields="excel_fields" name="AlternateRoute.csv">
                EXPORT EXCEL
              </download-excel>
            </div>
            <v-client-table class="routeTableClass" ref="routeData" :data="resData" :columns="routeColumn"
              :options="routeOptions" style="border: 1px solid; border-radius: 5px">
            </v-client-table>
          </div>
        </b-col>
      </b-row>
    </div>
    <div v-if="crisis">
      <crisis-alert></crisis-alert>
    </div>
    <div v-if="issue">
      <AddIssue />
    </div>
  </div>
</template>

<script>
import DirectionsRenderer, { data } from "./DirectionRenderer";
// import {data} from "./DirectionRenderer";
import { gmapApi } from "vue2-google-maps";
import { routesAxios } from "../../../main";
import CrisisAlert from "./CrisisAlert/CrisisAlert.vue";
import AddIssue from "./AddIssue/AddIssue.vue";
export default {
  name: "AlternateRoute",
  components: {
    DirectionsRenderer,
    CrisisAlert,
    AddIssue,
  },
  data() {
    return {
      center: {
        lat: 20.5937,
        lng: 78.9629,
      },
      /* INFOWINDOW */
      infoContent: "",
      infoWindowPos: {
        lat: 0,
        lng: 0,
      },
      infoWinOpen: false,
      infoOptions: {
        pixelOffset: {
          width: -1,
          height: -15,
        },
      },
      alternateRoute: true,
      crisis: false,
      route: true,
      issue: false,
      issue_location: "Please Mark location on Map by clicking",
      zoom: 5,
      startLocation: null,
      from_location: "",
      to_location: "",
      endLocation: null,
      origin: "",
      resData: [],
      excel_fields: {
        "S NO": "s_no",
        "FROM LOCATION": "from_location",
        "TO LOCATION": "to_location",
        SUMMARY: "summary",
        DISTANCE: "distance",
        DURATION: "duration",
      },
      routeColumn: [
        "s_no",
        "from_location",
        "to_location",
        "summary",
        "distance",
        "duration",
      ],
      markers: [],
      routeOptions: {
        filterByColumn: true,
        perPage: 10,
        perPageValues: [],
        pagination: { chunk: 5, dropdown: false },
        orderBy: { ascending: true },
        skin: "table table-striped",
        filterable: [
          "summary",
          "from_location",
          "to_location",
          "duration",
          "distance",
        ],
        texts: {
          filterBy: "Search by...",
          defaultOption: "ALL",
        },
        templates: {
          from_location: (h, row) => {
            return this.from_location;
          },
          to_location: (h, row) => {
            return this.to_location;
          },
        },
      },
      options: {
        polylineOptions: {
          strokeColor: "#FF0000",
          strokeOpacity: 0.5,
          strokeWeight: 4,
        },
        // markerOptions: { icon: blackMarker },
        icon: { scale: 3 },
      },
    };
  },
  computed: {
    google: gmapApi,
    computedMapSize() {
      return {
        width: "100%",
        height: "550px",
        borderRadius: "8px",
        overflow: "hidden",
        background: "white",
      };
    },
    exportData() {
      if (typeof this.$refs.routeData !== "undefined") {
        return this.resData;
      } else {
        return this.resData;
      }
    },
  },
  created() {
    // let map = new google.maps
    // console.log(map);
  },
  beforeMount() {
    console.log(this.$refs);
    routesAxios.get("v1/api/shippingArrival/companyId").then((res) => {
      console.log(res);
      if (res.data === 1001) {
        //   console.log("KVF1");
        this.startLocation = {
          lat: 14.162420458868839,
          lng: 77.61579339785216,
        };
        this.origin = "KVF1";
        this.from_location = "KVF1";
      }
      if (res.data === 1002) {
        this.startLocation = {
          lat: 12.992691,
          lng: 79.997237,
        };
        this.origin = "HMI";
      }
    });
    routesAxios.get("/v1/api/crisis/details").then((res) => {
      console.log(res);
      const position = new Array();
      const location = new Array();
      const issue = new Array();
      const startDate = new Array();
      const crisisRange = new Array();
      for (let i = 0; i < res.data.length; i++) {
        console.log(i);
        position[i] = {
          lat: res.data[i].latitude,
          lng: res.data[i].longitude,
        };

        location[i] = res.data[i].location;
        issue[i] = res.data[i].issueName;
        startDate[i] = res.data[i].startDate;
        crisisRange[i] = parseInt(res.data[i].crisisRange);

        if (
          res.data[i].status == 0 ||
          res.data[i].status == 1
        ) {
          this.markers.push({
            latLng: position[i],
            title: "Issue Area",
            icon: {
              url: require("../../../assets/png/icons/error_icon.png"),
              scaledSize: { width: 30, height: 30, f: "px", b: "px" },
            },
            location: location[i],
            issue: issue[i],
            startDate: this.$moment(startDate[i], "YYYYMMDDHHmmss").format(
              "DD MMM, YYYY"
            ),
            crisisRange:crisisRange[i],
          });
        }
      }
    });
  },
  methods: {
    setStart(place) {
      console.log(place);
      this.startLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
    },
    markerClickEvent(marker, i) {
      this.toggleInfoWindow(marker, i);
    },
    toggleInfoWindow: function (marker, idx) {
      console.log(marker);
      // console.log(date);
      // console.log(time);
      this.infoWindowPos = marker.latLng;
      this.infoContent = `
                          <p style="text-align:center"><b style="font-size:14px">Issue Details</b></p>
                          <hr style="margin-top:5px; margin-bottom:5px" />
                          <b>Issue Name</b>: ${marker.issue} 
                          <br/>
                          <b>Lattitude</b>: ${marker.latLng.lat} 
                          <br/> 
                          <b>Longitude</b>: ${marker.latLng.lng}
                          <br/>
                          <b>Location</b>: ${marker.location}
                          <br/>
                          <b>Date</b>: ${marker.startDate}
                          <hr />
                          `;

      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    mark(event) {
      this.markers = [];
      // console.log(event);
      // this.markers.push({
      //   position:{
      //     lat:event.latLng.lat(),
      //     lng:event.latLng.lng(),
      //   }
      // })
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
          console.log(this.issue_location, "issue location");
          if (add != "" || add != undefined) {
            this.issue_location = add;
          }
        }
      });
    },
    menuButtonClick(e) {
      if (e == "alternate") {
        this.alternateRoute = true;
        this.crisis = false;
        this.issue = false;
      }
      if (e == "crisis") {
        this.alternateRoute = false;
        this.crisis = true;
        this.issue = false;
      }
      if (e == "issue") {
        this.alternateRoute = false;
        this.crisis = false;
        this.issue = true;
      }
    },
    sideBarMenu(e) {
      if (e == "route") {
        this.route = true;
        this.issue = false;
      }
      if (e == "issue") {
        this.route = false;
        this.issue = true;
      }
    },
    getCompanyId() {
      console.log("Get data");
    },
    setEnd(place) {
      console.log(place);
      console.log(data);

      this.resData = data;
      this.$refs.routeData.allFilteredData;
      this.endLocation = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
      this.to_location = place.vicinity;
      console.log(this.resData);
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
  height: 550px;
}

.left_icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  margin-top: 5px;

  .circle {
    padding: 0px;
    margin: 0;
  }
}

.dot {
  display: flex;
  flex-direction: column;
  line-height: 6px;
}

.input_field {
  display: flex;
  flex-direction: column;
}

.right_icon {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  transform: rotate(90deg);
}

.btn {
  border-radius: 0.3rem 0.3rem 0rem 0rem !important;
}

.infoContent {
  color: #000;
  margin-bottom: 0px;
}
</style>
<style src="./AlternateRoute.scss" lang="scss">
</style>
