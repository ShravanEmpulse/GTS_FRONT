<template>
  <div>
    <b-row>
      <b-col lg="2">
        <h4 class="page-title">
          <span>Route Analysis</span>
        </h4>
      </b-col>
    </b-row>

    <b-row class="map-header">
      <b-col xs="4" md="4">
        <!-- <b-input-group-append class="map-count">    
                <b-button variant="default" class="map-total-count" size="md" @click="goToMapTotal">    
                    <img  src="../../../assets/png/icn_truck_br.png" alt="" class="truckCount"/>  &nbsp;&nbsp;Total &nbsp; 
                    <span class='fw-semi-bold'> {{totalTrailerCount.toLocaleString()}} </span>   
                </b-button>    
                <b-button variant="default" class="map-transit-count" size="md" @click="goToMapTransit">    
                   <img  src="../../../assets/png/icn_truck_bl.png" alt="" class="truckCount"/>  &nbsp;&nbsp;Transit &nbsp; 
                   <span class='fw-semi-bold'> {{transitTrailerCount.toLocaleString()}} </span>
                </b-button>    
            </b-input-group-append> -->
      </b-col>

      <b-col lg="2" offset-lg="2">
        <!-- <DatePicker
          lang="en"
          v-model="datepickerText"
          :format="datepicketFormat"
          range
          input-class="form-control"
          width="220"
          :shortcuts="shortcuts"
        >
          <i class="glyphicon glyphicon-glyph-calendar" slot="calendar-icon" />
        </DatePicker> -->
        <div class="daterange">
           <input ref="daterange" id="daterangepicker" class="form-control" name="dates" />
        </div> 
      </b-col>

      <b-col lg="4">
        <b-input-group class="map-search">
          <b-input-group-append>
            <b-form-select
              v-model="search_selected"
              :options="search_options"
              @change="onChange($event)"
            ></b-form-select>
          </b-input-group-append>
          <b-form-input
            placeholder="Search.."
            v-model="search_input"
            maxlength="30"
            @keyup.enter="showSearchTrailer()"
          />
          <b-input-group-append>
            <b-button
              variant="default"
              class="mr-xs"
              size="md"
              @click="showSearchTrailer()"
              >Search</b-button
            >
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row>
    <b-row style="border-radius:10px;">
      <b-col lg="12">
        <div class="map_style">
          <GmapMap
            v-bind:style="computedMapSize"
            style="background-color: white; overflow:hidden;"
            :zoom="zoom"
            :center="center"
            ref="map"
          >
            <!-- <GmapPolyline :path.sync="this.path" :options="{ strokeColor:'#E65442'}" /> -->
                <GmapMarker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.latLng"
                 :clickable="true" :title="marker.title" :plateNo="marker.plateNo" :gpsDtm="marker.gpsDtm" 
                 @click="markerClickEvent(marker,index)" />  
                <!-- <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">  
                     <div class="infoContent" v-html="infoContent"></div>
                </GmapInfoWindow> -->
          </GmapMap>
        </div>
      </b-col>
    </b-row>
    <b-row
      style="background: rgba(0, 0, 0, 0.24); border-radius:10px;"
      class="widget-middle-overflow mt-2 mx-0"
    >
      <div class="export-button">
            <b-button
              variant="outline-default"
              @click="exportExcel()">
              EXPORT EXCEL
            </b-button>
          </div>
      <v-server-table
        v-if="search_selected === 'PlateNo' || search_selected === 'Destination' "
        class="trailerTableClass"
        :columns="vehicleColumns"
        :options="vehicleOptions"
        ref="reftTable"
        @sorted="setSorted" 
        @filter="setFilter"
      >
      </v-server-table>
      <v-server-table 
        v-if="search_selected === 'DealerCode' || search_selected === 'States' || search_selected === 'TransporterCode'"
        class="trailerTableClass"
        :columns="vehicleColumns1"
        ref="reftTable"
        :options="vehicleOptions"
        @sorted="setSorted" 
        @filter="setFilter"
      >
      </v-server-table>
    </b-row>
    <loading :show="loadingShow" :label="loadingLabel" loader-class="loading">
    </loading>
  </div>
</template>

<script>
import Widget from "@/components/Widget/Widget";
import DatePicker from "vue2-datepicker";
import GmapCluster from "vue2-google-maps/dist/components/cluster";
import axios from "axios";

export default {
  components: { Widget, DatePicker, GmapCluster },
  created() {
    this.getTrailerCount();
    this.calculateMapSize();
    if(this.start == '' && this.end == '' ){
        this.start = this.$moment().subtract(8,'days');
        this.end = this.$moment().subtract(1,'days');
    };
  },
  data() {
    return {
      /* LOADING */
      loadingShow: false,
      shortcuts: "",
      loadingLabel: "Loading...",
      /* MAP */
      center: { lat: 21.207, lng: 78.777 },
      excel_fields: {
        STATUS: {
          field: "status",
          callback: (value) => {
            return value[0].title;
          },
        },
      },
      zoom: 5,
      filter:[],
      start:'',
      sorted: {
        column: 'plateNo',
        ascending: 1
      },
      end:'',
      markers: [],
      mapSize: { width: 100, heigth: 62 },
      path: [],
      searchPlateNo: null,
      /* COUNT */
      transitTrailerCount: 0,
      totalTrailerCount: 0,
      /* SEARCH */
      search_input: null,
      search_selected: "PlateNo",
      gridSize: 60,
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
      search_options: [
        { value: "PlateNo", text: "Plate No" },
        { value: "Destination", text: "Destination" },
        { value: "States", text: "States" },
        { value: "DealerCode", text: "Dealer Code" },
        { value: "TransporterCode", text: "Transporter Code" },
      ],
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
      /* DATE PICKER */
      datepickerText: [new Date(), new Date()],
      datepicketFormat: "DD MMM, YYYY",
      notBefore: this.subtractMonth(new Date()),
      vehicleOptions: {
        filterByColumn: true,
        perPage: 10,
        perPageValues: [10],
        pagination: { chunk: 5, dropdown: false },
        orderBy: { ascending: true },
        skin: "table table-striped",
        filterable: [
        "dealerCode",
        "destName",
        "transporterName",
        "plateNo",
        "states"
        ],
        texts: {
          filterBy: "Search by...",
          defaultOption: "ALL",
        },
        headings: {
	        dealerCode: 'DEALER CODE',
          transporterName: 'TRANSPORTER',
          plate_number: 'PLATE NO',
          destName: 'DESTINATION',
          departure_date: 'DEP DATE',
          arrival_date: 'ARRIVAL DATE',
	        gps_distance:'GPS DISTANCE',
          transit_days:'TRANSIT DAYS',
          no_of_tolls:'NO OF TOLLS',
          toll_charges:'TOLL CARGES',
          state_borders_crossed:'STATE BORDER CROSSED'
        },
        requestAdapter: function(data) {
          console.log(data);
          // const startDate =  this.$moment(this.start).format('YYYYMMDD');
          // const endDate =  this.$moment(this.end).format('YYYYMMDD')
          return {
            ascending: data.ascending,
            byColumn: data.byColumn,
            pageSize: data.limit,
            orderBy: data.orderBy ? data.orderBy : "arrivalDate",
            page: data.page,
            query: data.query,
            pageResult: ((data.page-1)*data.limit),
            // startDate: startDate,
            // endDate: endDate
            // pageSize:2,
            // sortBy:'ASC',
            // page:0,
            // plateNo:'NL01L7554',
            // startDate:20210115000000,
            // endDate:20220216000000,
          };
        },
         requestFunction: function (data) {
          return this.$axios.get('/api/report/shippingArrivalReport', {
                params: data,
          }).catch(function (e) {
                this.dispatch('error', e);
          }.bind(this));
        },
        responseAdapter: (response) => {
          console.log(response);
          return {
            data: response.data.resultBody.data,
            count: response.data.resultBody.count
          }
        },
        templates: {
          departure_date: function(h,row) {
              if(row.departureDate == null || row.departureDate==''){
                return "";
              }else{
                return this.$moment(row.departureDate, 'YYYYMMDD').format('DD MMM, YYYY');
              }
          },
          arrival_date: function(h,row) {
            if(row.arrivalDate == null || row.arrivalDate==''){
              return "";
            }else{
              return this.$moment(row.arrivalDate, 'YYYYMMDD').format('DD MMM, YYYY');
            }
          },
          transit_days:function(h,row) {
            // console.log(row);
            const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            const firstDate = new Date(this.$moment(row.departureDate, 'YYYYMMDD').format('DD MMM, YYYY'));
            const secondDate = new Date(this.$moment(row.arrivalDate, 'YYYYMMDD').format('DD MMM, YYYY'));

            const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
            // console.log(diffDays);
            return diffDays;
          },
          no_of_tolls: function(h,row){
            return '--';
          },
          gps_distance: function(h,row){
            return '-- km';
          },
          toll_charges: function(h,row){
            return '--';
          },
          state_borders_crossed: function(h,row){
            return '--';
          },
        }
      },
      vehicleColumns: [
        "destName",
        "transporterName",
        "plateNo",
        "departure_date",
        "arrival_date",
        "gps_distance",
        "transit_days",
        "no_of_tolls",
        "toll_charges",
        "state_borders_crossed",
      ],
      vehicleColumns1: [
        "dealerCode",
        "destName",
        "transporterName",
        "plateNo",
        "departure_date",
        "arrival_date",
        "gps_distance",
        "transit_days",
        "no_of_tolls",
        "toll_charges",
        "state_borders_crossed",
      ],
      // vehicles: [
      //   {
      //     destination: "Rajasthan",
      //     transporters_name: "KMT",
      //     plate_number: "NL01AA4521",
      //     departure_date: "10-04-2022",
      //     arrival_date: "18-04-2022",
      //     gps_distance: "1200",
      //     transit_days: "7",
      //     no_of_tolls: "15",
      //     toll_charges: "4500",
      //     state_borders_crossed: "5",
      //   },
      //   {
      //     destination: "Rajasthan",
      //     transporters_name: "RSAI",
      //     plate_number: "NL01AB1921",
      //     departure_date: "14-04-2022",
      //     arrival_date: "22-04-2022",
      //     gps_distance: "2300",
      //     transit_days: "15",
      //     no_of_tolls: "22",
      //     toll_charges: "8500",
      //     state_borders_crossed: "8",
      //   },
      // ],
      // vehicles1: [
      //   {
      //     dealer_code:'125487',
      //     destination: "Rajasthan",
      //     transporters_name: "KMT",
      //     plate_number: "NL01AA4521",
      //     departure_date: "10-04-2022",
      //     arrival_date: "18-04-2022",
      //     gps_distance: "1200",
      //     transit_days: "7",
      //     no_of_tolls: "15",
      //     toll_charges: "4500",
      //     state_borders_crossed: "5",
      //   },
      //   {
      //     dealer_code:'235698',
      //     destination: "Rajasthan",
      //     transporters_name: "RSAI",
      //     plate_number: "NL01AB1921",
      //     departure_date: "14-04-2022",
      //     arrival_date: "22-04-2022",
      //     gps_distance: "2300",
      //     transit_days: "15",
      //     no_of_tolls: "22",
      //     toll_charges: "8500",
      //     state_borders_crossed: "8",
      //   },
      // ],
    };
  },
  
  mounted() {
    let startDate = '';
      let endDate ='';

      const onDateSelected = (start, end) => {
        this.$emit('change', {
          startDate : start,
          endDate : end
        });
        this.init(start, end);
      };

      $(this.$refs.daterange).daterangepicker({
        startDate: this.$moment().subtract(8,'days'),
        endDate: this.$moment().subtract(1,'days'),
        minDate: this.$moment().subtract(1,'year'),
        maxDate: this.$moment(),
        maxSpan: {"month":1},
        locale: {
          format: 'DD MMM, YYYY'
        },
      }, function(start, end, label) {
        console.log(start, end);
          onDateSelected(start, end);
      });

      const fetchData = () =>{
        this.getReportData();
      }

      $(this.$refs.daterange).on('apply.daterangepicker', function(ev, picker) {
          fetchData();
       });
    this.getShippingDeparture();
    if (this.$route.params.plateNo) {
      this.getParamsFromMap();
    }
  },
  watch: {
    markers(markers) {
        if (markers.length > 2) {
            const bounds = new google.maps.LatLngBounds();
            for (let m of markers) {
                bounds.extend(m.latLng)
            }
            this.$refs.map.fitBounds(bounds)
        }
    },
    datepickerText(date) {
      const notBeforeDate = this.subtractMonth(date[1]);
      this.notBefore = this.parseDate(notBeforeDate);

      if (date[0] < notBeforeDate) {
        this.datepickerText[0] = notBeforeDate;
      }
    },
  },
  computed: {
    computedMapSize() {
      return {
        width: "100%",
        height: "500px",
        border: "2px solid rgba(0, 0, 0, 0.24)",
        borderRadius: "10px",
      };
    },
  },
  methods: {
    init(start, end){
      this.start = this.$moment(start).format('YYYYMMDD');
      this.end = this.$moment(end).format('YYYYMMDD');
    },
    onChange(event){
      if(event === "Destination"){
        alert('Destination');
      }
      alert(event)
    },
    setSorted(sorted){
      this.sorted = sorted;
    },
    setFilter(filter){
      let filterValue = filter.value;
      console.log(filter);
      // if(this.search_selected === 'PlateNo'){
      //   alert('plateNo')
      // }
      // this.filter.push({
      //   name: filter.name,
      //   value: filterValue
      // });
      console.log(this.filter);
    },
    getReportData(){
      this.$refs.reftTable.getData();
    },
    
    parseDate(date) {
      return this.$moment(date, "YYYYMMDDHHmmss").format("DD MMM, YYYY");
    },
    parseDateforSearch(date) {
      return this.$moment(date, "L").format("YYYYMMDD");
    },
    parseDateforInfoWindow(date) {
      return this.$moment(date, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
    },
    parseDateforDepDate(date) {
      return this.$moment(date, "YYYYMMDDHHmmss").format("L");
    },
    markerClickEvent(marker, idx) {
      if (typeof marker.gpsDtm !== "undefined") {
        this.toggleInfoWindow(marker, idx);
      } else {
        if (typeof marker.plateNo !== "undefined") {
          this.$refs.detail.toggle(marker.plateNo);
        }
      }
    },
    exportExcel(){
        this.$axios({
        method: 'post',
        url: '/api/report/shippingArrivalReportForExcel',
        data:{
          filter: this.filter, 
          orderBy: this.sorted.column, 
          ascending: this.sorted.ascending ? 1 : 0
        },
        withCredentials: true,
        responseType: 'blob',
        headers: {
          'Accept': 'application/vnd.openxmlformats-officedocument'
           + '.spreadsheetml.sheet',
        },
      }).then(function(response) {
        console.log(response);
        downloadjs(response.data,'Shipping_Arrival_Report.xlsx');
      }).catch((ex)=> {
        this.showErrorAlert(ex.response.status);
      }); 

    },
    subtractMonth(date) {
      return this.$moment(date, "YYYYMMDDHHmmss")
        .subtract(1, "month")
        .toDate();
    },
    showInfoAlert(textMessage) {
      this.$swal({
        title: "Info",
        text: textMessage,
        confirmButtonText: "OK",
      });
    },
    showErrorAlert(status) {
      this.$swal({
        title: "Error",
        text: status,
        confirmButtonText: "OK",
      });
    },
    toggleInfoWindow: function(marker, idx) {
      this.infoWindowPos = marker.latLng;
      this.infoContent = this.parseDateforInfoWindow(marker.gpsDtm);

      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    showSearchTrailer() {
      this.markers = [];
      this.path = [];
      this.searchByOption();
      if(search_selected === 'PlateNo'){
        alert('Destination')
      }
    },
    getTrailerCount() {
      this.loadingShow = true;

      this.$axios
        .get("/api/map/count")
        .then((response) => {
          // console.log(response);
          this.loadingShow = false;
          this.totalTrailerCount = response.data.resultBody.totalCount;
          this.transitTrailerCount = response.data.resultBody.transitCount;
        })
        .catch((ex) => {
          // console.log(ex);
          this.loadingShow = false;
          this.showErrorAlert(ex.response.status);
        });
    },
    getParamsFromMap() {
      const depDate = this.$route.params.depDate;
      this.search_input = this.$route.params.plateNo;
      this.search_selected = "PlateNo";
      this.datepickerText = [this.parseDateforDepDate(depDate), new Date()];

      this.searchByOption();
    },
    searchByOption() {
      if (this.search_input == "") {
        this.clear();
      } else {
        this.loadingShow = true;
        this.getShippingDeparture();
        this.$axios
          .get("/api/map/search", {
            params: {
              selected: this.search_selected,
              input: this.search_input,
            },
          })
          .then((response) => {
            // console.log(response);
            this.loadingShow = false;
            const position = new Array();
            const plateNo = new Array();

            for (var i in response.data.resultBody) {
              position[i] = {
                lat: response.data.resultBody[i].lastLatitude,
                lng: response.data.resultBody[i].lastLongitude,
              };

              plateNo[i] = response.data.resultBody[i].plateNo;

              if (response.data.resultBody[i].drivingStatus == "1") {
                this.markers.push({
                  latLng: position[i],
                  plateNo: plateNo[i],
                  title: "Plate No : " + plateNo[i],
                  icon: {
                    url: require("../../../assets/png/icn_trailer_bl.png"),
                    scaledSize: { width: 45, height: 45, f: "px", b: "px" },
                  },
                });
              } else {
                this.markers.push({
                  latLng: position[i],
                  plateNo: plateNo[i],
                  title: "Plate No : " + plateNo[i],
                  icon: {
                    url: require("../../../assets/png/icn_trailer_br.png"),
                    scaledSize: { width: 45, height: 45, f: "px", b: "px" },
                  },
                });
              }
              this.searchPlateNo = response.data.resultBody[0].plateNo;
              this.center = position[i];
              this.zoom = 10;
            }

            if (response.data.resultBody.length == 0) {
              this.showInfoAlert(this.Notrailer);
            } else {
              this.getTrailerPaths(this.searchPlateNo);
            }
          })
          .catch((ex) => {
            // console.log(ex);
            this.loadingShow = false;
            this.showErrorAlert(ex.response.status);
          });
      }
    },
    clear() {
      this.search_selected = "PlateNo";
      this.search_input = "";
      this.zoom = 5;
      this.marker = [];
      this.path = [];
      this.$refs.detail.clearTrailerDetail();
      this.getShippingDeparture();
    },
    getShippingDeparture() {
      this.$axios
        .get("/api/map/departure")
        .then((response) => {
          // console.log(response);

          const position = new Array();
          const departureCode = new Array();

          for (var i in response.data.resultBody) {
            position[i] = {
              lat: response.data.resultBody[i].latitude,
              lng: response.data.resultBody[i].longitude,
            };
            console.log(position);

            departureCode[i] = response.data.resultBody[i].departureCode;

            if (
              response.data.resultBody[i].companyId == "1001" ||
              response.data.resultBody[i].companyId == "1002"
            ) {
              this.markers.push({
                latLng: position[i],
                title: "* " + departureCode[i],
                icon: {
                  url: require("../../../assets/png/icn_factory.png"),
                  scaledSize: { width: 64, height: 64, f: "px", b: "px" },
                },
              });
            } else {
              this.markers.push({
                latLng: position[i],
                title: "* " + departureCode[i],
                icon: {
                  url: require("../../../assets/png/icn_storage.png"),
                  scaledSize: { width: 64, height: 64, f: "px", b: "px" },
                },
              });
            }
          }
        })
        .catch((ex) => {
          // console.log(ex);
          this.showErrorAlert(ex.response.status);
        });
    },
    getTrailerPaths(plateNo) {
      this.loadingShow = true;
      this.path = [];
      this.$axios
        .get("/api/playback/getPaths", {
          params: {
            plateNo: plateNo,
            startDate: this.parseDateforSearch(this.datepickerText[0]),
            endDate: this.parseDateforSearch(this.datepickerText[1]),
          },
        })
        .then((response) => {
          // console.log(response);
          this.loadingShow = false;
          const position = new Array();

          for (var i in response.data.resultBody) {
            position[i] = {
              lat: response.data.resultBody[i].latitude,
              lng: response.data.resultBody[i].longitude,
            };

            this.markers.push({
              latLng: position[i],
              icon: {
                url: require("../../../assets/png/icn_location.png"),
                scaledSize: { width: 20, height: 20, f: "px", b: "px" },
              },
              gpsDtm: response.data.resultBody[i].gpsDateTime,
            });

            this.path.push({
              lat: response.data.resultBody[i].latitude,
              lng: response.data.resultBody[i].longitude,
            });
          }

          if (response.data.resultBody.length == 0) {
            this.showInfoAlert(this.NoGPSData);
          }
        })
        .catch((ex) => {
          // console.log(ex);
          this.loadingShow = false;
          this.showErrorAlert(ex.response.status);
        });
      this.$refs.detail.toggle(this.searchPlateNo);
      this.searchPlateNo = null;
    },
    calculateMapSize() {
      const availWidth = screen.availWidth;
      // const availHeight = screen.availHeight;

      if (availWidth >= 1900) {
        this.mapSize.height = 64;
      } else if (availWidth >= 1500) {
        this.mapSize.height = 58;
      } else if (availWidth < 1500 && availWidth >= 1300) {
        this.mapSize.height = 35;
      } else {
        this.mapSize.height = 48;
      }
    },
    goToMapTotal() {
      this.$root.$router.push({
        name: "MapPage",
        params: { status: "total" },
      });
    },
    goToMapTransit() {
      this.$root.$router.push({
        name: "MapPage",
      });
    },
  },
};
</script>

<style src="./RouteAnalysis.scss" lang="scss" scoped />
