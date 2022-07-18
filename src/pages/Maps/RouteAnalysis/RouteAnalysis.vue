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
      <b-col lg="12" style="position: relative;">
        <div class="map_style">
          <GmapMap
            v-bind:style="computedMapSize"
            style="background-color: white; overflow:hidden;"
            :zoom="zoom"
            :center="center"
            ref="map"
          >
            <GmapPolyline :path.sync="this.path" :options="{ strokeColor:'#E65442'}" />
                <GmapMarker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.latLng"
                 :clickable="true" :title="marker.title" :plateNo="marker.plateNo" :gpsDtm="marker.gpsDtm" 
                 @click="markerClickEvent(marker,index)" />  
                <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">  
                     <div class="infoContent" v-html="infoContent"></div>
                </GmapInfoWindow>
          </GmapMap>
        </div>
        <div style="width: 250px;
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    background: rgb(116 135 154 / 64%);
                    color: white;
                    border-radius: 10px;"
              v-if="showStateBorder"
                    >
            <h5 style="padding-top:10px;" class="text-center">State Border Crossed <i @click="closePopUp" class="fa fa-times px-2" style="position:absolute; right:0;"></i></h5>
            <hr>
            <p style="padding-left:20px;" v-for="(state, index) in stateBorder" :key="index">{{index+1}}. {{state}}</p>
        </div>
      </b-col>
    </b-row>
    <b-row
      style="background: rgba(0, 0, 0, 0.24); border-radius:10px;"
      class="widget-middle-overflow mt-2 mx-0"
      v-if="loadTable"
    >
      <div class="export-button">
            <!-- <b-button
              variant="outline-default"
              @click="exportExcel()">
              EXPORT EXCEL
            </b-button> -->
            <download-excel
            class   = "btn btn-outline-default"
            :data   = "exportData"
            worksheet = "RouteAnalysis"
            type    = "csv"
            :fields ="excel_fields"
            name    = "RouteAnalysis.csv">
            EXPORT EXCEL
          </download-excel>
          </div>
      <v-server-table
        class="trailerTableClass"
        :columns="(search_selected === 'DealerCode' || search_selected === 'States' || search_selected === 'TransporterCode')?vehicleColumns1:vehicleColumns"
        :options="vehicleOptions"
        ref="reftTable"
        @sorted="setSorted" 
        @filter="setFilter"
      >
      <div slot="details" class="d-flex" slot-scope="props">
          <b-button class="mx-2">
            <i @click="getDirection(props.row)" title="Direction" class="fa fa-location-arrow" aria-hidden="true"></i>
          </b-button>
          <b-button>
            <i @click="getStateData(props.row.stateCrossed)" title="State Borders" class="la la-map-signs" aria-hidden="true"></i>
          </b-button>
          <b-button @click="getRowData(props.row)" class="mx-2">
            <download-excel
              :data   = "exportData2"
              worksheet = "RouteAnalysis"
              type    = "csv"
              :fields ="excel_fields2"
              name    = "RouteAnalysis.csv">
              <i title="Excel Export" class="las la-file-excel"></i>
            </download-excel>
          </b-button>
      </div>
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
import routeAxios, { routesAxios } from "../../../main";
// import {loaded} from 'vue2-google-maps'
// import { gmapApi as googleMapsApi } from 'vue2-google-maps';
// import axios from "axios";

export default {
  components: { Widget, DatePicker, GmapCluster },
  created() {
    // this.getTrailerCount();
    // this.calculateMapSize();
    if(this.start == '' && this.end == '' ){
        this.start = this.$moment().subtract(8,'days');
        this.end = this.$moment().subtract(1,'days');
    };
    console.log(this.start);
    console.log(this.end);
  },
  data() {
    return {
      /* LOADING */
      loadingShow: false,
      loadTable:false,
      shortcuts: "",
      loadingLabel: "Loading...",
      /* MAP */
      center: { lat: 21.207, lng: 78.777 },
      //Row wise export fields.
      excel_fields2: {
              'Plate No':'plate_number',
              'Company Id':'company_id',
              'Dest Name':'dest_name',
              "Latitude":"latitude",
              "Longitude":"longitude",
              "Location":"location",
              "Speed":"speed",
              "Date":'date',
              "Time":"time"
      },
      excel_fields: {
              'Dealer Code':'dealer_code',
              'Transporter Name':'transporter_name',
              'Plate No':'plate_number',
              'Company Id':'company_id',
              'Ti No':'ti_no',
              'Departure Date':'departure_date',
              'Arrival Date':'arrival_date',
              'Actual Transit Days':'transit_days',
              'Departure Code':'departure_code',
              'Dest Name':'dest_name',
              'ETA':'eta',
              'GPS Distance':'gps_distance',
              'Number Of States Crossed':'number_of_states_crossed',
              'States Crossed':'state_crossed',
      },
      zoom: 5,
      filter:[],
      stateBorder:['Delhi','Mumbai','Kolkata'],
      showStateBorder:false,
      start:'',
      end:'',
      sorted: {
        column: 'plateNo',
        ascending: 1
      },
      markers: [],
      allRouteData:[],
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
      //EXCEL
      tableData:[],
      tableData2:[],
      // clusterStyles: [
      //   {
      //     url: require("../../../assets/svg/icn_density_lg.svg"),
      //     textColor: "black",
      //     anchorText: [0, 0],
      //     height: 50,
      //     width: 50,
      //   },
      //   {
      //     url: require("../../../assets/svg/icn_density_g.svg"),
      //     textColor: "black",
      //     anchorText: [0, 0],
      //     height: 55,
      //     width: 55,
      //   },
      //   {
      //     url: require("../../../assets/svg/icn_density_dg.svg"),
      //     textColor: "white",
      //     anchorText: [0, 0],
      //     height: 60,
      //     width: 60,
      //   },
      //   {
      //     url: require("../../../assets/svg/icn_density_bl.svg"),
      //     textColor: "white",
      //     anchorText: [0, 0],
      //     height: 65,
      //     width: 65,
      //   },
      //   {
      //     url: require("../../../assets/svg/icn_density_br.svg"),
      //     textColor: "black",
      //     anchorText: [0, 0],
      //     height: 65,
      //     width: 65,
      //   },
      // ],
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
      vehicleOptions: {
        filterByColumn: true,
        // perPage: 2,
        perPageValues: [],
        skin: "table table-striped table-hover",
        cursor:'pointer',
        filterable: [
        // "dealerCode",
        "destName",
        "transporterName",
        "plateNo",
        // "states"
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
	        gpsDistance:'GPS DISTANCE',
          transit_days:'TRANSIT DAYS',
          no_of_tolls:'NO OF TOLLS',
          toll_charges:'TOLL CARGES',
          numberOfStatesCrossed:'STATE BORDER CROSSED',
          details:'DETAILS'
        },
        requestAdapter: (data) =>{
          const startDate =  (typeof(this.start) === 'string')?this.start:this.$moment(this.start).format('YYYYMMDDHHMMSS');
          const endDate =  (typeof(this.end) === 'string')?this.end:this.$moment(this.end).format('YYYYMMDDHHMMSS');
          let SearchOption = this.search_selected
          let SearchInput = this.search_input;
          console.log(data);
          // const endDate =  this.$moment(this.end).format('YYYYMMDDHHMMSS')
          if(SearchOption === 'PlateNo'){
              return {
              pageSize:10,
              sortBy:'ASC',
              page:0,
              plateNo:SearchInput,
              startDate:startDate,
              endDate:endDate,

            };
          }
          if(SearchOption === 'Destination'){
              return {
              pageSize:10,
              sortBy:'ASC',
              page:0,
              startDate:startDate,
              endDate:endDate,
              destName:SearchInput,

            };
          }
          if(SearchOption === 'TransporterCode'){
              return {
              pageSize:2,
              sortBy:'ASC',
              page:0,
              transporterCode:SearchInput,
              startDate:startDate,
              endDate:endDate,

            };
          }
          if(SearchOption === 'DealerCode'){
              return {
              pageSize:2,
              sortBy:'ASC',
              page:0,
              dealerCode:SearchInput,
              startDate:startDate,
              endDate:endDate,

            };
          }
          if(SearchOption === 'States'){
              return {
              pageSize:2,
              sortBy:'ASC',
              page:0,
              stateName:SearchInput,
              startDate:startDate,
              endDate:endDate,

            };
          }
        },
         requestFunction: (data) => {
          //  console.log(this.start);
          console.log(data);
          if(this.loadTable){
            console.log(data);
          return routesAxios.get('v1/api/shippingArrival/report', {
                  params: data
          }).catch(function (e) {
                this.dispatch('error', e);
          }.bind(this));
          }
        },
        responseAdapter: (response) => {
          console.log(response);
          for(let i in response.data){
            let stateBorder = [];
            for(let j in response.data[i].stateCrossed){
              stateBorder.push(response.data[i].stateCrossed[j])
            }
            this.tableData.push({
              transit_days : response.data[i].actualTransitDays,
              arrival_date : this.$moment(response.data[i].arrivalDate, 'YYYYMMDDHHmmss').format('DD MMM, YYYY'),
              company_id : response.data[i].companyId,
              dealer_code : response.data[i].dealerCode,
              departure_code : response.data[i].departureCode,
              departure_date : this.$moment( response.data[i].departureDate, 'YYYYMMDDHHmmss').format('DD MMM, YYYY'),
              dest_name : response.data[i].destName,
              eta : response.data[i].eta,
              gps_distance : response.data[i].gpsDistance,
              number_of_states_crossed : response.data[i].numberOfStatesCrossed,
              plate_number : response.data[i].plateNo,
              ti_no : response.data[i].tiNo,
              transporter_name : response.data[i].transporterName,
              state_crossed:stateBorder
            })
          }
          if(this.search_selected === "Destination" || this.search_selected === 'State' || this.search_selected === 'PlateNo' || this.search_selected === 'DealerCode' || this.search_selected === 'TransporterCode'){
            console.log(response);
            const position = [];
            const path2 = []
            let row= response.data
            // this.clear()
            this.markers = [],
            this.path = [];
            this.infoWinOpen = false
            for(let i in row){
              // console.log(i);
              // let iconImage = `mark_${+i+1}`
              // console.log(iconImage);
              // console.log(row[i].latLong[i].latitude);
              for(let j in row[i].latLong){
                // console.log(j+'latlng');
              position[j]={
                          lat: row[i].latLong[j].latitude,
                          lng: row[i].latLong[j].longitude,
                      };

                      this.markers.push({
                          latLng  :position[j],
                          icon: {
                              url: require(`../../../assets/png/icn_location_new.png`),
                              scaledSize: {width: 20, height: 20, f: 'px', b: 'px',},
                          },
                          title:`${row[i].plateNo}`,
                          gpsDtm: row[i].latLong[j].gpsDateTime
                      });
                    //   this.path.push({
                    //     lat: row[i].latLong[j].latitude,
                    //     lng: row[i].latLong[j].longitude,
                    // });
                    //  path2.push({
                    //     lat: row[i].latLong[j].latitude,
                    //     lng: row[i].latLong[j].longitude,
                    //     gpsDtm: row[i].latLong[j].gpsDateTime
                    // });
                    // const getPath = path2.sort((a,b)=> b.gpsDtm - a.gpsDtm)
                    // this.path = getPath;
                    // console.log(this.path);
              }
            }
          }else{
            this.markers = [],
            this.path = [];
            this.infoWinOpen = false
          }
          return {
            data: response.data,
            count: response.data.length
          }
        },
        rowAttributesCallback:function(row){
          // console.log(row.latLong.length);
          
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
          gpsDistance: function(h,row){
            // console.log(row);
            return (Math.round(row.gpsDistance)) + ' '+'Km\'s';
          },
          toll_charges: function(h,row){
            return '--';
          },
          // numberOfStatesCrossed: function(h, row) {
          //   // console.log(h);
          //   // console.log(row);
          // }
          // state_borders_crossed: function(h,row){
          //   return '--';
          // },
        }
      },
      vehicleColumns: [
        "destName",
        "transporterName",
        "plateNo",
        "departure_date",
        "arrival_date",
        "gpsDistance",
        "transit_days",
        "no_of_tolls",
        "toll_charges",
        "numberOfStatesCrossed",
        "details"
      ],
      vehicleColumns1: [
        "dealerCode",
        "destName",
        "transporterName",
        "plateNo",
        "departure_date",
        "arrival_date",
        "gpsDistance",
        "transit_days",
        "no_of_tolls",
        "toll_charges",
        "numberOfStatesCrossed",
        "details"
      ],
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
        // console.log(startDate);
        // console.log(endDate);
      };

      $(this.$refs.daterange).daterangepicker({
        startDate: this.$moment().subtract(8,'days'),
        endDate: this.$moment().subtract(1,'days'),
        minDate: this.$moment().subtract(3,'month'),
        maxDate: this.$moment(),
        maxSpan: {"month":2},
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
          // fetchData();
       });
    this.getShippingDeparture();
    // if (this.$route.params.plateNo) {
    //   this.getParamsFromMap();
    // }
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
    // datepickerText(date) {
    //   const notBeforeDate = this.subtractMonth(date[1]);
    //   this.notBefore = this.parseDate(notBeforeDate);

    //   if (date[0] < notBeforeDate) {
    //     this.datepickerText[0] = notBeforeDate;
    //   }
    // },
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
    exportData(){
      console.log(this.$refs.reftTable);
      if(typeof this.$refs.reftTable !== 'undefined'){
        return this.tableData;
      }else{
        console.log(this.tableData);
        return this.tableData;
      }
    },
    exportData2(){
      console.log(this.$refs.reftTable);
      if(typeof this.$refs.reftTable !== 'undefined'){
        return this.tableData2;
      }else{
        console.log(this.tableData);
        return this.tableData2;
      }
    }
    // google: googleMapsApi,
  },
  methods: {
    init(start, end){
      this.start = this.$moment(start).format('YYYYMMDDHHMMSS');
      this.end = this.$moment(end).format('YYYYMMDDHHMMSS');
      console.log(this.start, this.end);
    },
    getRowData(row){
      console.log(row);
      
      for(let i in row.latLong){
        this.tableData2.push({
          plate_number:row.plateNo,
          company_id:row.companyId,
          dealer_code:row.dealerCode,
          latitude:row.latLong[i].latitude,
          longitude:row.latLong[i].longitude,
          location:row.latLong[i].location,
          speed:row.latLong[i].speed,
          date:this.$moment( row.latLong[i].gpsDateTime, 'YYYYMMDDHHmmss').format('DD MMM, YYYY'),
          time:this.$moment( row.latLong[i].gpsDateTime, 'YYYYMMDDHHmmss').format('HH : mm : ss'),
          dest_name:row.destName
        })
      }
      console.log(this.tableData2);
    },
    getDirection(row){
      console.log(row);
      const position = [];
      // this.clear()
      this.markers = [],
      this.path = [];
      this.infoWinOpen = false;
      if(row.companyId === 1001){
                        let pos = {lat:14.162420458868839, lng:77.61579339785216}
                        this.markers.push({
                          latLng:pos,
                          title:'*'+ row.departureCode,
                          icon: {
                                  url: require('../../../assets/png/icn_factory.png'),
                                  scaledSize: {width: 64, height: 64, f: 'px', b: 'px',},
                              }
                        })
                        console.log(row.companyId);
                    }
      if(row.companyId === 1002){
                      let pos = {lat:12.992691, lng:79.997237}
                      this.markers.push({
                        latLng:pos,
                        title:'*'+ row.departureCode,
                        icon: {
                                url: require('../../../assets/png/icn_factory.png'),
                                scaledSize: {width: 64, height: 64, f: 'px', b: 'px',},
                            }
                      })
                      console.log(row.companyId);
                    }
       for(var i in row.latLong){
        //  console.log(row.latLong[i].gpsDateTime);

                    position[i]={
                        lat: row.latLong[i].latitude,
                        lng: row.latLong[i].longitude,
                    };

                    this.markers.push({
                        latLng  :position[i],
                        icon: {
                            url: require('../../../assets/png/icn_location_new.png'),
                            scaledSize: {width: 25, height: 25, f: 'px', b: 'px',},
                        },
                        title:`${row.plateNo}`,
                        gpsDtm: row.latLong[i].gpsDateTime,
                        location:row.latLong[i].location
                    });
                    // console.log(this.markers);

                    // this.path.push({
                    //     lat: row.latLong[i].latitude,
                    //     lng: row.latLong[i].longitude,
                    // });
                    // console.log(this.path);
                }
                // console.log(this.markers);
                let path2 = []
                for(let i in row.latLong){
                // console.log(i)
                  path2.push({
                      lat:row.latLong[i].latitude,
                      lng:row.latLong[i].longitude,
                      gpsDtm:row.latLong[i].gpsDateTime
                  })
                }
                const getPath = path2.sort((a,b)=> a.gpsDtm - b.gpsDtm)
                console.log(getPath)
                this.path = getPath
                console.log(this.path[this.path.length-1]);
                this.markers.push({
                  latLng:{lat:this.path[this.path.length-1].lat, lng:this.path[this.path.length-1].lng},
                  icon: {
                          url: require('../../../assets/png/icn_trailer_dbr.png'),
                          scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
                        },
                  title:"Plate No. : " + row.plateNo
                })
    },
    getStateData(row){
      this.showStateBorder = true;
      // this.clear()
      this.stateBorder = []
      if(row.length == 0){
        this.showStateBorder = false;
      }
      for(var i in row){
        this.stateBorder.push(row[i])
        // console.log(row.stateCrossed[i]);
      }
    },
    closePopUp(){
      this.showStateBorder = false;
    },
    // changeData:function(row){
    //   console.log(row);
    //   const position = [];
    //   this.showStateBorder = true;
    //   // this.clear()
    //   this.stateBorder = []
    //   this.markers = [],
    //   this.path = [];
    //   if(row.row.stateCrossed.length == 0){
    //     this.showStateBorder = false;
    //   }
    //   for(var i in row.row.stateCrossed){
    //     this.stateBorder.push(row.row.stateCrossed[i])
    //     console.log(row.row.stateCrossed[i]);
    //   }
    //             for(var i in row.row.latLong){

    //                 position[i]={
    //                     lat: row.row.latLong[i].latitude,
    //                     lng: row.row.latLong[i].longitude,
    //                 };

    //                 this.markers.push({
    //                     latLng  :position[i],
    //                     icon: {
    //                         url: require('../../../assets/png/icn_location.png'),
    //                         scaledSize: {width: 20, height: 20, f: 'px', b: 'px',},
    //                     },
    //                     // gpsDtm: response.data.resultBody[i].gpsDateTime
    //                 });
    //                 // console.log(this.markers);

    //                 // this.path.push({
    //                 //     lat: row.row.latLong[i].latitude,
    //                 //     lng: row.row.latLong[i].longitude,
    //                 // });
    //                 // console.log(this.path);
    //             }
    // },
    // onChange(event){
    //   if(event === "Destination"){
    //     alert('Destination');
    //   }
    //   alert(event)
    // },
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
      console.log(this.$refs.reftTable);
      this.$refs.reftTable.getData();
      console.log(this.$refs.reftTable.getData());
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
      console.log(marker);
      console.log(idx);
      if (typeof marker.gpsDtm !== "undefined") {
        this.toggleInfoWindow(marker, idx);
      } else {
        if (typeof marker.plateNo !== "undefined") {
          this.$refs.detail.toggle(marker.plateNo);
        }
      }
      // this.toggleInfoWindow(marker, idx);
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
      console.log(marker);
      let date = this.$moment(marker.gpsDtm, "YYYYMMDDHHmmss").format("YYYY-MM-DD");
      let time = this.$moment(marker.gpsDtm, "YYYYMMDDHHmmss").format("HH:mm:ss");
      // console.log(date);
      // console.log(time);
      this.infoWindowPos = marker.latLng;
      this.infoContent = `
                          <p style="text-align:center"><b style="font-size:14px">Details</b></p>
                          <hr style="margin-top:5px; margin-bottom:5px" />
                          <b>Plate No.</b>: ${marker.title} 
                          <br/>
                          <b>Lattitude</b>: ${marker.latLng.lat} 
                          <br/> 
                          <b>Longitude</b>: ${marker.latLng.lng}
                          <br/>
                          <b>Location</b>: ${marker.location}
                          <br/>
                          <b>Date</b>: ${date}
                          <br />
                          <b>Time</b>:${time}
                          <hr />
                          `

      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
    showSearchTrailer() {
      // this.markers = [];
      // this.path = [];
      // this.searchByOption();
      if(this.search_selected === 'PlateNo'){
        this.vehicleColumns = [
        "plateNo",
        "destName",
        "transporterName",
        "departure_date",
        "arrival_date",
        "gpsDistance",
        "transit_days",
        "no_of_tolls",
        "toll_charges",
        "numberOfStatesCrossed",
        "details"
      ]
      }
      if(this.search_selected === 'Destination'){
        this.vehicleColumns = [
        "destName",
        "plateNo",
        "transporterName",
        "departure_date",
        "arrival_date",
        "gpsDistance",
        "transit_days",
        "no_of_tolls",
        "toll_charges",
        "numberOfStatesCrossed",
        "details"
      ]
      }
      if(this.search_selected === 'TransporterCode'){
        this.vehicleColumns1= [
        "transporterName",
        "dealerCode",
        "destName",
        "plateNo",
        "departure_date",
        "arrival_date",
        "gpsDistance",
        "transit_days",
        "no_of_tolls",
        "toll_charges",
        "numberOfStatesCrossed",
        "details"
      ]
      }
      this.loadTable = true;
      if(this.$refs.reftTable != undefined){
        this.getReportData()
      }
      // let row = this.allRouteData
     
      // if(search_selected === 'PlateNo'){
      //   alert('Destination')
      // }
    },
    getTrailerCount() {
      this.loadingShow = true;

      // this.$axios
      //   .get("/api/map/count")
      //   .then((response) => {
      //     // console.log(response);
      //     this.loadingShow = false;
      //     this.totalTrailerCount = response.data.resultBody.totalCount;
      //     this.transitTrailerCount = response.data.resultBody.transitCount;
      //   })
      //   .catch((ex) => {
      //     // console.log(ex);
      //     this.loadingShow = false;
      //     this.showErrorAlert(ex.response.status);
      //   });
    },
    // getParamsFromMap() {
    //   const depDate = this.$route.params.depDate;
    //   this.search_input = this.$route.params.plateNo;
    //   this.search_selected = "PlateNo";
    //   this.datepickerText = [this.parseDateforDepDate(depDate), new Date()];

    //   this.searchByOption();
    // },
    // searchByOption() {
    //   if (this.search_input == "") {
    //     this.clear();
    //   } else {
    //     this.loadingShow = true;
    //     this.getShippingDeparture();
      //   this.$axios
      //     .get("/api/map/search", {
      //       params: {
      //         selected: this.search_selected,
      //         input: this.search_input,
      //       },
      //     })
      //     .then((response) => {
      //       // console.log(response);
      //       this.loadingShow = false;
      //       const position = new Array();
      //       const plateNo = new Array();

      //       for (var i in response.data.resultBody) {
      //         position[i] = {
      //           lat: response.data.resultBody[i].lastLatitude,
      //           lng: response.data.resultBody[i].lastLongitude,
      //         };

      //         plateNo[i] = response.data.resultBody[i].plateNo;

      //         if (response.data.resultBody[i].drivingStatus == "1") {
      //           this.markers.push({
      //             latLng: position[i],
      //             plateNo: plateNo[i],
      //             title: "Plate No : " + plateNo[i],
      //             icon: {
      //               url: require("../../../assets/png/icn_trailer_bl.png"),
      //               scaledSize: { width: 45, height: 45, f: "px", b: "px" },
      //             },
      //           });
      //         } else {
      //           this.markers.push({
      //             latLng: position[i],
      //             plateNo: plateNo[i],
      //             title: "Plate No : " + plateNo[i],
      //             icon: {
      //               url: require("../../../assets/png/icn_trailer_br.png"),
      //               scaledSize: { width: 45, height: 45, f: "px", b: "px" },
      //             },
      //           });
      //         }
      //         this.searchPlateNo = response.data.resultBody[0].plateNo;
      //         this.center = position[i];
      //         this.zoom = 10;
      //       }

      //       if (response.data.resultBody.length == 0) {
      //         this.showInfoAlert(this.Notrailer);
      //       } else {
      //         this.getTrailerPaths(this.searchPlateNo);
      //       }
      //     })
      //     .catch((ex) => {
      //       // console.log(ex);
      //       this.loadingShow = false;
      //       this.showErrorAlert(ex.response.status);
      //     });
    //   }
    // },
    clear() {
      this.search_selected = "PlateNo";
      this.search_input = "";
      this.zoom = 5;
      this.marker = [];
      this.path = [];
      // this.$refs.detail.clearTrailerDetail();
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
    // getTrailerPaths(plateNo) {
    //   this.loadingShow = true;
    //   this.path = [];
    //   this.$axios
    //     .get("/api/playback/getPaths", {
    //       params: {
    //         plateNo: plateNo,
    //         startDate: this.parseDateforSearch(this.datepickerText[0]),
    //         endDate: this.parseDateforSearch(this.datepickerText[1]),
    //       },
    //     })
    //     .then((response) => {
    //       // console.log(response);
    //       this.loadingShow = false;
    //       const position = new Array();

    //       for (var i in response.data.resultBody) {
    //         position[i] = {
    //           lat: response.data.resultBody[i].latitude,
    //           lng: response.data.resultBody[i].longitude,
    //         };

    //         this.markers.push({
    //           latLng: position[i],
    //           icon: {
    //             url: require("../../../assets/png/icn_location.png"),
    //             scaledSize: { width: 20, height: 20, f: "px", b: "px" },
    //           },
    //           gpsDtm: response.data.resultBody[i].gpsDateTime,
    //         });

    //         this.path.push({
    //           lat: response.data.resultBody[i].latitude,
    //           lng: response.data.resultBody[i].longitude,
    //         });
    //       }

    //       if (response.data.resultBody.length == 0) {
    //         this.showInfoAlert(this.NoGPSData);
    //       }
    //     })
    //     .catch((ex) => {
    //       // console.log(ex);
    //       this.loadingShow = false;
    //       this.showErrorAlert(ex.response.status);
    //     });
    //   this.$refs.detail.toggle(this.searchPlateNo);
    //   this.searchPlateNo = null;
    // },
    // calculateMapSize() {
    //   const availWidth = screen.availWidth;
    //   // const availHeight = screen.availHeight;

    //   if (availWidth >= 1900) {
    //     this.mapSize.height = 64;
    //   } else if (availWidth >= 1500) {
    //     this.mapSize.height = 58;
    //   } else if (availWidth < 1500 && availWidth >= 1300) {
    //     this.mapSize.height = 35;
    //   } else {
    //     this.mapSize.height = 48;
    //   }
    // },
    // goToMapTotal() {
    //   this.$root.$router.push({
    //     name: "MapPage",
    //     params: { status: "total" },
    //   });
    // },
    // goToMapTransit() {
    //   this.$root.$router.push({
    //     name: "MapPage",
    //   });
    // },
  },
};
</script>

<style src="./RouteAnalysis.scss" lang="scss" scoped />
