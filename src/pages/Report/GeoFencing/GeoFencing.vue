<template>
  <div>
    <b-row>
      <b-col cols="4">
        <h3>Geo Fencing</h3>
      </b-col>
      <b-col cols="4">
        <b-row>
          <b-col cols="6">
            <div style="display: grid">
              <button
                @click="update1"
                :class="{ active: isTenKm }"
                class="btn btn-outline-default mr-4"
              >
                Upto 10 Km
                <span v-if="isTenKm" class="badge badge-success">Active</span>
              </button>
            </div>
          </b-col>
          <b-col cols="6">
            <div style="display: grid">
              <button
                @click="update2"
                :class="{ active: isFiftyKm }"
                class="btn btn-outline-default"
              >
                Upto 50 Km
                <span v-if="isFiftyKm" class="badge badge-success">Active</span>
              </button>
            </div>
          </b-col>
        </b-row>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <GmapMap
          v-bind:style="computedMapSize"
          style="background-color: white; overflow: hidden; border: 1px solid"
          :zoom="zoom"
          :center="center"
          ref="map"
          @click="mark"
        >
          <GmapMarker
            v-for="(marker, index) in markers"
            :key="index"
            :icon="marker.icon"
            :position="marker.latLng"
            :clickable="true"
            :title="marker.title"
            :draggable="true"
          />
          <GmapCluster
            :grid-size="gridSize"
            :styles="clusterStyles"
            :clickable="true"
          >
            <GmapMarker
              v-for="(marker, index) in markers1"
              :key="index"
              :icon="marker.icon"
              :position="marker.latLng"
              :clickable="true"
              :title="marker.title"
            />
          </GmapCluster>
          <GmapCircle
            v-for="pin in markers"
            :key="pin.latLng.lat"
            :center="pin.latLng"
            :radius="radius1"
            :visible="true"
            :clickable="false"
            ref="circleRef"
            :options="{
              fillColor: '#808080',
              fillOpacity: 0.6,
              strokeColor: 'transparent',
            }"
          ></GmapCircle>
          <GmapCircle
            v-for="pin in markers"
            :key="pin.latLng.lng"
            :center="pin.latLng"
            :radius="radius2"
            :visible="true"
            :clickable="false"
            ref="circleRef"
            :options="{
              fillColor: '#808080',
              fillOpacity: 0.4,
              strokeColor: 'transparent',
            }"
          ></GmapCircle>
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
              worksheet="GeoFencing"
              type="csv"
              :fields="excel_fields"
              name="GeoFencing.csv"
            >
              EXPORT EXCEL
            </download-excel>
          </div>
          <v-client-table
            class="routeTableClass card"
            ref="geoData"
            :data="tableData"
            :columns="tableColumns"
            :options="tableOptions"
          >
            <!-- <b-button
                                slot="status"
                                slot-scope="props"
                                :variant="props.row.status[0].type"
                                class="trailer-status-badge"
                                v-b-modal.detail
                                >{{ props.row.status[0].title }}</b-button> -->
          </v-client-table>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import GmapCluster from "vue2-google-maps/dist/components/cluster";
import { gmapApi } from "vue2-google-maps";
export default {
  name: "GeoFencing",
  components: {
    GmapCluster,
  },
  data() {
    return {
      center: {
        lat: 20.5937,
        lng: 78.9629,
      },
      isTenKm: true,
      isFiftyKm: false,
      zoom: 5,
      markers: [],
      markers1: [],
      status: [],
      radius1: 5000,
      radius2: 10000,
      gridSize: 60,
      tableData: [],
      excel_fields: {
        "S NO": "s_no",
        "Plate No": "plate_no",
        "TRANSPORTER NAME": "transporter_name",
        "TRANSPORTER CODE": "transporter_code",
        "CURRENT LOCATION": "current_location",
      },
      tableColumns: [
        "s_no",
        "plate_no",
        "transporter_name",
        "transporter_code",
        "current_location",
      ],
      tableOptions: {
        filterByColumn: true,
        perPage: 10,
        perPageValues: [],
        pagination: { chunk: 5, dropdown: false },
        orderBy: { ascending: true },
        skin: "table table-striped",
        filterable: ["plate_no"],
        texts: {
          filterBy: "Search by...",
          defaultOption: "ALL",
        },
        templates: {},
      },
      clusterStyles: [
        {
          url: require("../../../assets/svg/icn_density_lg.svg"),
          textColor: "black",
          anchorText: [0, 0],
          height: 50,
          width: 50,
        },
        {
          url: require("../../../assets/svg/icn_density_g.svg"),
          textColor: "black",
          anchorText: [0, 0],
          height: 55,
          width: 55,
        },
        {
          url: require("../../../assets/svg/icn_density_dg.svg"),
          textColor: "white",
          anchorText: [0, 0],
          height: 60,
          width: 60,
        },
        {
          url: require("../../../assets/svg/icn_density_bl.svg"),
          textColor: "white",
          anchorText: [0, 0],
          height: 65,
          width: 65,
        },
        {
          url: require("../../../assets/svg/icn_density_br.svg"),
          textColor: "black",
          anchorText: [0, 0],
          height: 65,
          width: 65,
        },
      ],
    };
  },
  beforeMount() {
    this.$axios
      .get("/api/map/transit")
      .then((response) => {
        console.log(response);

        const position = new Array();
        const plateNo = new Array();
        const location = new Array();
        const tpName = new Array();
        const tpCode = new Array();

        for (var i in response.data.resultBody.trailers) {
          position[i] = {
            lat: response.data.resultBody.trailers[i].lastLatitude,
            lng: response.data.resultBody.trailers[i].lastLongitude,
          };

          plateNo[i] = response.data.resultBody.trailers[i].plateNo;
          location[i] = response.data.resultBody.trailers[i].location;
          tpName[i] = response.data.resultBody.trailers[i].transporterName;
          tpCode[i] = response.data.resultBody.trailers[i].transporterCode;

          this.markers1.push({
            latLng: position[i],
            plateNo: plateNo[i],
            title: "Plate No : " + plateNo[i],
            icon: {
              url: require("../../../assets/png/icn_trailer_bl.png"),
              scaledSize: { width: 45, height: 45, f: "px", b: "px" },
            },
            currentLocation: location[i],
            transporterName: tpName[i],
            transporterCode: tpCode[i],
          });
        }
      })
      .catch((ex) => {
        console.log(ex);
      });

    // this.$axios.get('/api/map/allTrailer')
    // .then((response) => {
    //     console.log(response);
    // })
    // this.$axios.get('/api/map/alltrailer')
    // .then((response) => {
    //     // this.loadingShow = false;
    //     console.log(response);
    //     // this.totalTrailerCount = response.data.resultBody.trailerCount;

    //     const position = new Array();
    //     const plateNo = new Array();
    //     const location = new Array();
    //     const tpName = new Array();
    //     const tpCode = new Array();
    //     const status = new Array();

    //     for(var i in response.data.resultBody.trailers){

    //         position[i]={
    //             lat: response.data.resultBody.trailers[i].lastLatitude,
    //             lng: response.data.resultBody.trailers[i].lastLongitude,
    //         };

    //         plateNo[i] = response.data.resultBody.trailers[i].plateNo;
    //         location[i] = response.data.resultBody.trailers[i].location;
    //         tpName[i] = response.data.resultBody.trailers[i].transporterName;
    //         tpCode[i] = response.data.resultBody.trailers[i].transporterCode;
    //         status[i] = response.data.resultBody.trailers[i].drivingStatus;

    //         if(response.data.resultBody.trailers[i].drivingStatus == '1' ){
    //             this.markers1.push({
    //                 latLng: position[i],
    //                 plateNo: plateNo[i],
    //                 title:'Plate No : '+plateNo[i],
    //                 icon: {
    //                     url: require('../../../assets/png/icn_trailer_bl.png'),
    //                     scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
    //                 },
    //                 currentLocation:location[i],
    //                 transporterName:tpName[i],
    //                 transporterCode:tpCode[i],
    //                 status:status[i]
    //             });
    //         }else{
    //             this.markers1.push({
    //                 latLng: position[i],
    //                 plateNo: plateNo[i],
    //                 title:'Plate No : '+plateNo[i],
    //                 icon: {
    //                     url: require('../../../assets/png/icn_trailer_br.png'),
    //                     scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
    //                 },
    //                 currentLocation:location[i],
    //                 transporterName:tpName[i],
    //                 transporterCode:tpCode[i],
    //                 status:status[i]
    //             });
    //         }
    // }
    // })
    // .catch((ex)=> {
    //     console.log(ex);
    // })
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
    exportData() {
      if (typeof this.$refs.geoData !== "undefined") {
        return this.tableData;
      } else {
        return this.tableData;
      }
    },
  },
  methods: {
    settingStatus(drivingStatus) {
      this.status = [];

      if (drivingStatus == "0") {
        this.status.push({
          type: "default",
          title: "NONE",
        });
      } else if (drivingStatus == "1") {
        this.status.push({
          type: "primary",
          title: "TRANSIT",
        });
      } else if (drivingStatus == "2") {
        this.status.push({
          type: "success",
          title: "ARRIVAL",
        });
      } else if (drivingStatus == "3") {
        this.status.push({
          type: "info",
          title: "IDLE",
        });
      } else if (drivingStatus == "4") {
        this.status.push({
          type: "danger",
          title: "DELAY",
        });
      } else if (drivingStatus == "5") {
        this.status.push({
          type: "warning",
          title: "STANDBY",
        });
      }
      return this.status;
    },

    update1() {
      this.radius1 = 5000;
      this.radius2 = 10000;
      this.isTenKm = true;
      this.isFiftyKm = false;
    },
    update2() {
      this.radius1 = 40000;
      this.radius2 = 50000;
      this.isTenKm = false;
      this.isFiftyKm = true;
    },
    mark(event) {
      this.markers = [];
      this.tableData = [];
      console.log(event);
      // setInterval(this.greetings, 200);
      // let rad = 100000;
      // setInterval(()=>{
      //     if(rad <= 200000){
      //         rad += 10000
      //         this.radius2 = rad
      //     }
      //     if(rad == 200000)
      //         rad = 100000;
      // }, 100);
      const position = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      this.markers.push({
        latLng: position,
        icon: {
          url: require("../../../assets/png/icn_location.png"),
          scaledSize: { width: 20, height: 20, f: "px", b: "px" },
        },
        title: "Marker",
      });

      console.log(this.markers);
      console.log(this.$refs.circleRef);
      console.log(this.$refs.map);
      // console.log(this.google.maps);
      // console.log(this.markers1);
      let j = 1;
      for (let i = 0; i < this.markers1.length; i++) {
        var markerPosition = {
          lat: this.markers1[i].latLng.lat,
          lng: this.markers1[i].latLng.lng,
        };
        var circlePosition = { lat: position.lat, lng: position.lng };
        // var avm = new google.maps.LatLng(41.06320196648882, 28.80718122666873);
        var circleRadius = this.radius2;
        var check = this.checkCircleInMarker(
          markerPosition,
          circlePosition,
          circleRadius
        );
        if (check) {
          console.log(this.markers1[i], "In the region");
          this.tableData.push({
            s_no: j++,
            plate_no: this.markers1[i].plateNo,
            transporter_name: this.markers1[i].transporterName,
            transporter_code: this.markers1[i].transporterCode,
            current_location: this.markers1[i].currentLocation,
            // status:this.settingStatus(this.markers1[i].status)
          });
        }
        // else console.log("Out the region");
        // console.log(stadium);
        // console.log(avm);
      }
    },
    checkCircleInMarker(markerPosition, circlePosition, radius) {
      var km = radius / 1000;
      var kx = Math.cos((Math.PI * circlePosition.lat) / 180) * 111;
      var dx = Math.abs(circlePosition.lng - markerPosition.lng) * kx;
      var dy = Math.abs(circlePosition.lat - markerPosition.lat) * 111;
      return Math.sqrt(dx * dx + dy * dy) <= km;
    },
  },
};
</script>
<style lang="scss" scoped>
.btn {
  border-radius: 0.3rem 0.3rem 0rem 0rem !important;
  z-index: 10000 !important;
}
</style>
<style src="./GeoFencing.scss" lang="scss"></style>