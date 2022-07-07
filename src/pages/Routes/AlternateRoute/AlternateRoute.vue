<template>
  <div>
    <b-row>
      <b-col cols="4">
        <h4>Alternate Route Recommendation</h4>
      </b-col>
      <!-- <b-col cols="4 offset-4 d-flex">
        <GmapAutocomplete
          class="form-control"
          placeholder="From Location"
          @place_changed="setStart"
        />
        <GmapAutocomplete
          class="form-control mx-2"
          placeholder="To Location"
          @place_changed="setEnd"
        />
        <button @click="getCompanyId" class="btn btn-outline-default">
          Search
        </button>
      </b-col> -->
    </b-row>
    <b-row>
      <b-col cols="3 mt-3">
        <div class="card">
          <div class="card-header text-center">
            <h5>Alternate Route</h5>
            <hr />
          </div>
          <div class="card-body">
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
                  <input type="text" class="form-control" placeholder="From Location" :value="origin" disabled>
                  <GmapAutocomplete
                    class="form-control my-2"
                    placeholder="To Location"
                    @place_changed="setEnd"
                  />
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
      <b-col cols="9 mt-3" v-bind:style="computedMapSize">
        <GmapMap
          v-bind:style="computedMapSize"
          :zoom="zoom"
          :center="center"
          ref="map"
        >
          <DirectionsRenderer
            travelMode="DRIVING"
            options="{
              polylineOptions: {
                strokeColor: '#FF0000',
                strokeOpacity: 0.5,
                strokeWeight: 4
              },
              icon: { scale: 3 }
            }"
            :origin="startLocation"
            :destination="endLocation"
          />
        </GmapMap>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12 mt-3">
        <div>
          <div class="export-button">
          <download-excel
            class="btn btn-outline-default"
            :data="exportData"
            worksheet="AlternateRoute"
            type="csv"
            :fields="excel_fields"
            name="AlternateRoute.csv"
          >
            EXPORT EXCEL
          </download-excel>
        </div>
        <v-client-table
            class="routeTableClass"
            ref="routeData"
            :data="resData"
            :columns="routeColumn"
            :options="routeOptions"
          >
       </v-client-table>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import DirectionsRenderer, {data} from "./DirectionRenderer";
// import {data} from "./DirectionRenderer";
import { routesAxios } from "../../../main";
export default {
  name: "AlternateRoute",
  components: {
    DirectionsRenderer,
  },
  data() {
    return {
      center: {
        lat: 20.5937,
        lng: 78.9629,
      },
      zoom: 5,
      startLocation: null,
      from_location:"",
      to_location:"",
      endLocation: null,
      origin:"",
      resData:[],
      excel_fields: {
        "S NO":"s_no",
        "FROM LOCATION":"from_location",
        "TO LOCATION":"to_location",
        "SUMMARY":"summary",
        "DISTANCE":"distance",
        "DURATION":"duration"
      },
      routeColumn:[
        "s_no",
        "from_location",
        "to_location",
        "summary",
        "distance",
        "duration",
      ],
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
          "distance"
        ],
        texts: {
          filterBy: "Search by...",
          defaultOption: "ALL",
        },
        templates:{
          from_location:(h,row)=>{
            return this.from_location
          },
          to_location:(h,row)=>{
            return this.to_location
          },

        }
      },
      options:{
              polylineOptions: {
                strokeColor: "#FF0000",
                strokeOpacity: 0.5,
                strokeWeight: 4
              },
              // markerOptions: { icon: blackMarker },
              icon: { scale: 3 }
            }
    };
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
    exportData() {
      if (typeof this.$refs.routeData !== "undefined") {
        return this.resData;
      } else {
        return this.resData;
      }
    },
  },
  beforeMount() {
    routesAxios.get("v1/api/shippingArrival/companyId").then((res) => {
      console.log(res);
      if(res.data === 1001){
        //   console.log("KVF1");
        this.startLocation = {
            lat:14.162420458868839,
            lng:77.61579339785216
        }
        this.origin = "KVF1"
        this.from_location = "KVF1"
      }
      if(res.data === 1002){
          this.startLocation = {
              lat:12.992691,
              lng:79.997237
          }
          this.origin = "HMI"
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

</style>
<style src="./AlternateRoute.scss" lang="scss"></style>
