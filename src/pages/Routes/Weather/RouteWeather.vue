<template>
<div>
    <b-row>
        <b-col lg="2">
            <h4 class="page-title">
                <span>Route Weather</span>
            </h4>
        </b-col>
        <b-col cols="3" class="offset-1">
            <!-- <b-input-group class="input-base">
                <b-form-input placeholder="Search"></b-form-input>
                <b-input-group-append>
                    <span class="input-group-text"><i class="fa fa-search fa-lg"></i></span>
                </b-input-group-append>
            </b-input-group> -->
            <div class="d-flex">
                <!-- <input type="text" class="form-control" placeholder="Search.."> -->
                <GmapAutocomplete placeholder="Search place" class="form-control" @place_changed="setPlace" />
                <button class="btn" @click="getWeatherData"><i class="fa fa-search"></i></button>
            </div>
        </b-col>
        <b-col cols="3">
            <div class="daterange">
                <input ref="daterange" id="daterangepicker" class="form-control" name="dates" />
            </div> 
        </b-col>
        <b-col cols="3" class="right-align">
            <!-- <div>
                <b-dropdown id="dropdown-right" variant="secondary" right text="Select Route" class="m-2">
                <b-dropdown-item href="#">Action</b-dropdown-item>
                <b-dropdown-item href="#">Another action</b-dropdown-item>
                <b-dropdown-item href="#">Something else here</b-dropdown-item>
            </b-dropdown>
            </div> -->
            <select class="form-control" name="" id="">
                <option value="Action">Action</option>
                <option value="Action">Action</option>
                <option value="Action">Action</option>
            </select>
        </b-col>
    </b-row>
    <b-row>
        <b-col cols="9" v-bind:style="computedMapSize">
            <!-- <GmapAutocomplete
                    placeholder="This is a placeholder"
                    >
                </GmapAutocomplete> -->
            <GmapMap v-bind:style="computedMapSize" :zoom="6" :center="{
                lat: 21.207,
                lng: 78.777
            }" ref="map">
                <!-- <GmapPolyline :path.sync="this.path" :options="{ strokeColor:'#E65442'}" />
                <GmapMarker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.latLng" :clickable="true" :title="marker.title" :plateNo="marker.plateNo" :gpsDtm="marker.gpsDtm" @click="markerClickEvent(marker,index)" />
                <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">
                    <div class="infoContent" v-html="infoContent"></div>
                </GmapInfoWindow> -->
                
                <GmapCluster :grid-size="gridSize" :styles="clusterStyles">
                    <GmapMarker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.latLng"
                    :clickable="true" :title="marker.title" :plateNo="marker.plateNo"  @click="markerClickEvent(marker.plateNo)" />    
                </GmapCluster>
            </GmapMap>
        </b-col>
        <b-col cols="3" class="weather-details">
            <div class="card">
                <div class="card-header text-center">
                    <h3>Weather in Degrees</h3>
                </div>
                <hr>
                <div class="card-body">
                    <b-row class="weather-row">
                    <b-col cols=2><i class="las la-cloud-sun-rain"></i></b-col>
                    <b-col cols=2>
                        <p>22°</p>
                    </b-col>
                    <b-col>
                        <p>: Rain</p>
                    </b-col>
                </b-row>
                <b-row class="weather-row">
                    <b-col cols=2><i class="las la-cloud-sun"></i></b-col>
                    <b-col cols=2>
                        <p>23°</p>
                    </b-col>
                    <b-col>
                        <p>: Mostly Cloudy</p>
                    </b-col>
                </b-row>
                <b-row class="weather-row">
                    <b-col cols=2><i class="las la-cloud-showers-heavy"></i></b-col>
                    <b-col cols=2>
                        <p>25°</p>
                    </b-col>
                    <b-col>
                        <p>: Scattered T-Storms</p>
                    </b-col>
                </b-row>
                <b-row class="weather-row">
                    <b-col cols=2><i class="las la-cloud-rain"></i></b-col>
                    <b-col cols=2>
                        <p>21°</p>
                    </b-col>
                    <b-col>
                        <p>: Light Rain</p>
                    </b-col>
                </b-row>
                </div>
            </div>
            <div class="card mt-2">
                <div class="card-header">
                    <h3 class="text-center">Today and Week Weather</h3>
                </div>
                <hr>
                <div class="card-body">
                    <b-row>
                        <b-col cols="4 text-center mt-2">
                            <h5 style="font-size:20px">MONDAY</h5>
                            <i class="las la-cloud-sun h1"></i>
                            <p>Partly Cloudy</p>
                        </b-col>
                        <b-col cols="4">
                            <h1 class="text-center" style="font-size:58px">24°</h1>
                            <p>Feels like 22°</p>
                        </b-col>
                        <b-col cols="4 mt-1">
                            <div class="d-flex">
                                <p class="px-2">
                                    <i class="las la-angle-down"></i>20°
                                </p>
                                <p>
                                    <i class="las la-angle-up"></i>27°
                                </p>
                            </div>
                            <div class="mt-1 text-center">
                                <p>Wind: 6 km/h</p>
                                <p><i class="las la-tint"></i>72%</p>
                            </div>
                        </b-col>
                        <b-col cols="4">
                            <div class="card text-center">
                                <p class="pt-3">
                                    TUE
                                    <i class="las la-cloud-showers-heavy px-2"></i>
                                    20°
                                </p>
                            </div>
                        </b-col>
                        <b-col cols="4">
                            <div class="card text-center">
                                <p class="pt-3">
                                    WED
                                    <i class="las la-sun px-2"></i>
                                    25°
                                </p>
                            </div>
                        </b-col>
                        <b-col cols="4">
                            <div class="card text-center">
                                <p class="pt-3">
                                    WED
                                    <i class="las la-cloud px-2"></i>
                                    23°
                                </p>
                            </div>
                        </b-col>
                    </b-row>
                </div>
                <div class="card-footer">
                    <b-row class="text-center">
                        <b-col class="card mr-1">
                            <p>SUN</p>
                            <i class="las la-sun"></i>
                            <p>+20°C</p>
                        </b-col>
                        <b-col class="card mr-1">
                            <p>MON</p>
                            <i class="las la-cloud-showers-heavy"></i>
                            <p>+05°C</p>
                        </b-col>
                        <b-col class="card mr-1">
                            <p>TUE</p>
                            <i class="las la-sun"></i>
                            <p>+20°C</p>
                        </b-col>
                        <b-col class="card mr-1">
                            <p>WED</p>
                            <i class="las la-sun"></i>
                            <p>+20°C</p>
                        </b-col>
                        <b-col class="card mr-1">
                            <p>THU</p>
                            <i class="las la-cloud-showers-heavy"></i>
                            <p>+20°C</p>
                        </b-col>
                        <b-col class="card mr-1">
                            <p>FRI</p>
                            <i class="las la-sun"></i>
                            <p>+20°C</p>
                        </b-col>
                        <b-col class="card">
                            <p>SAT</p>
                            <i class="las la-cloud-showers-heavy"></i>
                            <p>+20°C</p>
                        </b-col>
                    </b-row>
                </div>
            </div>
        </b-col>
    </b-row>
</div>
</template>

<script>
import GmapCluster from 'vue2-google-maps/dist/components/cluster'
import  { routesAxios } from "../../../main";

export default {
    components: {
        GmapCluster
    },
    data(){
        return{
            /* LOADING */
            loadingShow: false,
            loadingLabel: 'Loading...',
            /* MAP */
            center: { lat: 21.207, lng: 78.777 },
            zoom: 5,
            start:'',
            end:'',
            markers: [],
            mapSize: { width: 100, heigth: 62 },
            gridSize: 60,
            paramsLatLng:{lat:'', lon:''},
            clusterStyles: [
                {
                    url:require('../../../assets/svg/icn_density_lg.svg'),
                    textColor: 'black',
                    anchorText: [0,0],
                    height: 50,
                    width: 50
                },
                {
                    url:require('../../../assets/svg/icn_density_g.svg'),
                    textColor: 'black',
                    anchorText: [0,0],
                    height: 55,
                    width: 55
                },
                {
                    url:require('../../../assets/svg/icn_density_dg.svg'),                
                    textColor: 'white',
                    anchorText: [0,0],
                    height: 60,
                    width: 60
                },
                {
                    url:require('../../../assets/svg/icn_density_bl.svg'),                
                    textColor: 'white',
                    anchorText: [0,0],
                    height: 65,
                    width: 65
                },
                {
                    url:require('../../../assets/svg/icn_density_br.svg'),                
                    textColor: 'black',
                    anchorText: [0,0],
                    height: 65,
                    width: 65
                }
            ],
            timeOut:null,
            userRole: null,
        }
    },
    created() {
        this.getTrailerCount();
        this.calculateMapSize();
    },
    mounted(){
      const token = window.sessionStorage.getItem('Dorothy-Auth-Token');
      this.userRole = this.$jwt.decode(token).jti;

        if(this.$route.params.status =='total'){
            this.showTotalTrailer();
        }else{
            this.showTransitTrailer();
        }

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
        minDate: this.$moment().subtract(2,'year'),
        maxDate: this.$moment(),
        maxSpan: {"year":2},
        locale: {
          format: 'DD MMM, YYYY'
        },
      }, function(start, end, label) {
        console.log(start, end);
          onDateSelected(start, end);
      });
    },

    beforeDestroy(){
        clearTimeout(this.timeOut)
    },
    watch: {
        markers(markers) {
            if (markers.length > 2) {
                const bounds = new google.maps.LatLngBounds();
                for (let m of markers) {
                    bounds.extend(m.latLng)
                }
                console.log(this.$refs.map);
                this.$refs.map.fitBounds(bounds);
            }
        }
    },
    computed: {
        computedMapSize() {
            return {
                width: '100%',
                height: '600px',
                borderRadius:'8px',
                overflow:'hidden'
            }
        }
    },
    methods: {
        showInfoAlert(textMessage) {
            this.$swal({
                title: 'Info',
                text: textMessage,
                confirmButtonText: 'OK'
            });
        },
        setPlace(place){
            console.log(place);
            this.paramsLatLng.lat = place.geometry.location.lat();
            this.paramsLatLng.lon = place.geometry.location.lng();
            console.log(this.paramsLatLng);
        },
        getWeatherData(){
            routesAxios.post('v1/api/weather/hourlyForecast',this.paramsLatLng).then((res)=>{
                console.log(res);
            })
        },
        init(start, end){
            this.start = this.$moment(start).format('YYYYMMDDHHMMSS');
            this.end = this.$moment(end).format('YYYYMMDDHHMMSS');
            console.log(this.start, this.end);
            },
        showErrorAlert(status) {
            this.$swal({
                title: 'Error',
                text: status,
                confirmButtonText: 'OK'
            });
        },
        showTotalTrailer() {
            clearTimeout(this.timeOut);
            this.markers = [];
            this.getTransitTrailer();
            this.getTotalTrailer();
            if (this.userRole !== "DEALER") {
              this.getShippingDeparture();
            }

            this.timeOut = setTimeout(this.showTotalTrailer, 30*60*1000);
        },
        showTransitTrailer() {
            clearTimeout(this.timeOut);
            this.markers = [];
            this.clearSearchInput();
            this.getTransitTrailer();
            if (this.userRole !== "DEALER") {
              this.getShippingDeparture();
            }

            this.timeOut = setTimeout(this.showTransitTrailer, 30*60*1000);
        },
        showSearchTrailer(){
            clearTimeout(this.timeOut);
             this.markers = [];
             this.searchByOption();

             this.timeOut = setTimeout(this.showSearchTrailer, 30*60*1000);
        },
        markerClickEvent(plateNo) {
            if (typeof plateNo !== 'undefined'){
                this.$refs.detail.toggle(plateNo);
            }
        },
        getTotalTrailer(){

            this.loadingShow = true;
            this.$axios.get('/api/map/total')
            .then((response) => {
                this.loadingShow = false;
                console.log(response);
                this.totalTrailerCount = response.data.resultBody.trailerCount;

                const position = new Array();
                const plateNo = new Array();

                for(var i in response.data.resultBody.trailers){

                    position[i]={
                        lat: response.data.resultBody.trailers[i].lastLatitude,
                        lng: response.data.resultBody.trailers[i].lastLongitude,
                    };

                    plateNo[i] = response.data.resultBody.trailers[i].plateNo;

                    this.markers.push({
                        latLng: position[i],
                        plateNo: plateNo[i],
                        title: 'Plate No : '+plateNo[i],
                        icon: {
                            url: require('../../../assets/png/icn_trailer_br.png'),
                            scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
                        } 
                    });
                }
            })
            .catch((ex)=> {
                this.loadingShow = false;
                console.log(ex);
                this.showErrorAlert(ex.response.status);
            })
        },
        getTransitTrailer(){

            this.loadingShow = true;
            this.$axios.get('/api/map/transit')
            .then((response) => {
                this.loadingShow = false;
                console.log(response);
                this.transitTrailerCount = response.data.resultBody.trailerCount;

                const position = new Array();
                const plateNo = new Array();
                
                for(var i in response.data.resultBody.trailers){

                    position[i]={
                        lat: response.data.resultBody.trailers[i].lastLatitude,
                        lng: response.data.resultBody.trailers[i].lastLongitude,
                    }

                    plateNo[i] = response.data.resultBody.trailers[i].plateNo;

                    this.markers.push({
                        latLng: position[i],
                        plateNo: plateNo[i],
                        title:'Plate No : '+plateNo[i],
                        icon: {
                            url: require('../../../assets/png/icn_trailer_bl.png'),
                            scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
                        } 
                    });
                }
            })
            .catch((ex)=> {
                this.loadingShow = false;
                console.log(ex);
                this.showErrorAlert(ex.response.status);
            })
        },
        getTrailerCount(){

            this.$axios.get('/api/map/count')
            .then((response) => {
                console.log(response);

                this.totalTrailerCount = response.data.resultBody.totalCount;
                this.transitTrailerCount = response.data.resultBody.transitCount;

            })
            .catch((ex)=> {
                console.log(ex);
                this.showErrorAlert(ex.response.status);
            })

        },
        searchByOption(){

            if(this.search_input == ''){
                this.showTransitTrailer();
            }else{
                this.loadingShow = true;
                this.$axios.get('/api/map/search', {
                    params: { selected: this.search_selected, input: this.search_input }
                })
                .then((response) => {
                    console.log(response);
                    this.loadingShow = false;
                    const position = new Array();
                    const plateNo = new Array();
                    
                    for(var i in response.data.resultBody){

                        position[i]={
                            lat: response.data.resultBody[i].lastLatitude,
                            lng: response.data.resultBody[i].lastLongitude,
                        }

                        plateNo[i]=response.data.resultBody[i].plateNo;

                        if(response.data.resultBody[i].drivingStatus == '1'){

                            this.markers.push({
                            latLng: position[i],
                            plateNo: plateNo[i],
                            title: 'Plate No : '+plateNo[i],
                            icon: {
                                    url: require('../../../assets/png/icn_trailer_bl.png'),
                                    scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
                                } 
                            });

                        }else{

                            this.markers.push({
                            latLng: position[i],
                            plateNo: plateNo[i],
                            title: 'Plate No : '+plateNo[i],
                            icon: {
                                    url: require('../../../assets/png/icn_trailer_br.png'),
                                    scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
                                } 
                            });

                        }
                    this.center = position[i];
                    this.zoom = 8;
                    }

                    if(response.data.resultBody.length == 0){
                        this.showInfoAlert(this.Notrailer);
                    }
                })
                .catch((ex)=> {
                    console.log(ex); 
                    this.loadingShow = false;
                    this.showErrorAlert(ex.response.status);
                })
            }

        },
        clearSearchInput(){
            this.search_selected = 'PlateNo';
            this.search_input = '';
            this.zoom = 5;
        },
        getShippingDeparture(){
            this.$axios.get('/api/map/departure')
            .then((response) => {
                console.log(response);
                const position = new Array();
                const departureCode = new Array();

                for(var i in response.data.resultBody){

                    position[i]={
                        lat: response.data.resultBody[i].latitude,
                        lng: response.data.resultBody[i].longitude,
                    };

                    departureCode[i] = response.data.resultBody[i].departureCode;
                    
                    if(response.data.resultBody[i].companyId=='1001' || response.data.resultBody[i].companyId=='1002'){

                        this.markers.push({
                            latLng: position[i],
                            title: '* '+departureCode[i],
                            icon: {
                                url: require('../../../assets/png/icn_factory.png'),
                                scaledSize: {width: 64, height: 64, f: 'px', b: 'px',},
                            } 
                       });

                    }else{

                        this.markers.push({
                            latLng: position[i],
                            title: '* '+departureCode[i],
                            icon: {
                                url: require('../../../assets/png/icn_storage.png'),
                                scaledSize: {width: 64, height: 64, f: 'px', b: 'px',},
                            } 
                       });
                
                    }
                }

            })
            .catch((ex)=> {
                console.log(ex);
                this.showErrorAlert(ex.response.status);
            })
        },
        calculateMapSize() {
            const availWidth = screen.availWidth;
            const availHeight = screen.availHeight;

            if ( availWidth >= 1900 ) { this.mapSize.height = 65 }
            else if ( availWidth >= 1500 ) { this.mapSize.height = 58 }
            else if ( availWidth < 1500 && availWidth >= 1300 ) { this.mapSize.height = 35 }
            else { this.mapSize.height = 48 }
        },
    }
}
</script>

<style lang="scss" scoped>
$background: rgba($color: #ffffff, $alpha: 0.2);

.input-group {
    input {
        background-color: $background;
        border: none;
    }

    input:focus {
        background: #ffffff;
    }
}

.input-group-append {
    span {
        background-color: $background;
        border: none;
        color: #ffffff;
    }
}

.dropdown-toggle {
    background: $background;
    border: none;
}

.right-align {
    text-align: right;
}

.card{
    .card-header{
        margin-bottom: 0px;
        h3{
            margin: 0;
        }
    }
    .card-body{
        margin-top: 0;
        padding-top: 0rem;
    }
    hr{
        margin: 0px !important;
    }
}
.la-sun{
    color: orange;
}

.weather-details {
    width: 100%;
    height: 600px;
    // background-color: #36455a;
    // padding: 10px;
    border-radius: 5px;

    .weather-row {
        font-size: large;
        margin: 0;
        // padding: 6px 6px;

        i {
            font-size: 26px;
        }
    }

    .week-weather {
        background-color: #799cbf;
        border-radius: 10px;

        .header {
            background-color: #4f7397;
            padding: 14px;
            font-size: medium;
            font-weight: bold;
            border-radius: 10px 10px 0px 0px;
        }

        .main-section {
            text-align: center;
            font-size: 15px;

            i {
                font-size: 40px;
            }

            h1 {
                font-size: 30px;
            }

            .trend-section {
                padding: 0px;
                display: flex;
                // flex-direction: column;
                justify-content: space-around;
                font-size: 18px;
                h6{
                    display: flex;
                    padding-top: 10px;
                }

                i {
                    font-size: 20px;
                }
            }

            .trend-section-bottom {
                display: block;
                // text-align: left;
            }

        }

        .footer {
            display: flex;
            justify-content: space-around;

            p {
                background: #4f7397;
                border-radius: 20px;
                padding: 5px;
                font-size: 16px;
                font-weight: 400;
            }
        }
    }

    .weather-bottom-section {
        padding: 8px;
        text-align: center;

        .card {
            font-weight: 500;
            font-size: 18px;
            margin: 2px;
            padding: 6px;
            background: #00a2ff88;
            border-radius: 10px;

            i {
                font-size: 26px;
            }

            p{
                font-size: 12px;
            }
        }
    }
}
</style>