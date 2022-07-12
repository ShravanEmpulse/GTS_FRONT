<template>
    <div>
        <b-row>
            <b-col cols="6">
                <h3>Regional Dashboard</h3>
            </b-col>
            <!-- <b-col cols="3 offset-3">
                <b-input-group prepend="Select Region">
                    <b-input-group-append>
                        <b-form-select
                        v-model="search_selected"
                        :options="search_options"
                        @change="regionChange"
                        ></b-form-select>
                    </b-input-group-append>
                </b-input-group>
            </b-col> -->
        </b-row>
        <b-row class="mt-3">
            <b-col cols="3">
                <Widget customHeader>   
                    <h6> Region </h6>
                    <hr class="count-hr">   
                    <span class="text-white">
                        <img  src="../../assets/png/icons/region.png" alt="" class="truck"/>    
                        &nbsp; <span class="h4">{{search_selected}}</span>    
                    </span>   
                </Widget>
            </b-col>
            <!-- <b-col cols="2">
                <Widget customHeader>   
                    <h6> Total </h6>
                    <hr class="count-hr">   
                    <span class="text-white" @click="moveToTrailer('',dashboardCount.totalCount)">
                            <img  src="../../assets/png/icn_transit.png" alt="" class="truck"/>    
                            &nbsp; <animated-number :value="dashboardCount.totalCount" :formatValue="formatCount" :duration="1000" :delay="0" />    
                        </span>    
                </Widget>
            </b-col> -->
            <b-col lg="3">    
                <Widget customHeader>   
                    <h6> Transit </h6>
                    <hr class="count-hr">   
                        <span class="text-white" @click="moveToTrailer('Transit',dashboardCount.transit)">
                            <img  src="../../assets/png/icn_transit.png" alt="" class="truck"/>    
                            &nbsp; <animated-number :value="dashboardCount.transitCount" :formatValue="formatCount" :duration="1000" :delay="0" />    
                        </span>  
                </Widget>
            </b-col>
            <b-col lg="3">    
                <Widget customHeader>   
                    <h6> Arrival </h6>
                    <hr class="count-hr">   
                        <span class="text-white" @click="moveToTrailer('Arrival',dashboardCount.arrival)">
                            <img  src="../../assets/png/icn_arrival.png" alt="" class="truck"/>    
                            &nbsp; <animated-number :value="dashboardCount.arrivalCount" :formatValue="formatCount" :duration="1000" :delay="0" />    
                        </span>  
                </Widget>
            </b-col>
            <b-col lg="3">    
                <Widget customHeader>   
                    <h6> Delay </h6>
                    <hr class="count-hr">   
                        <div class="text-white delay-truck-div" @click="moveToTrailer('Delay',dashboardCount.delay)">
                            <div>
                                <img  src="../../assets/png/icn_delay.png" alt="" class="truck"/>
                            </div>
                            <div class="delayCount">  
                                <animated-number :value="dashboardCount.delayCount" :formatValue="formatCount" :duration="1000" :delay="0" />
                            </div>
                            <div class="delayDetail">
                                <b-badge class="mr-xs outline-badge-light"> 1D : {{delayDetail.oneday}} </b-badge>
                                <b-badge class="mr-xs outline-badge-light"> 2D : {{delayDetail.twoday}} </b-badge>
                                <b-badge class="mr-xs outline-badge-light"> 3D : {{delayDetail.threeday}} </b-badge>
                                <b-badge class="mr-xs outline-badge-light"> 4D ~ : {{delayDetail.fourdayAbove}} </b-badge>
                            </div>
                        </div>  
                </Widget>
            </b-col>
        </b-row>
        <h4 class="mt-3">{{search_selected}} Region</h4>
        <b-row>
            <b-col cols="3" style="display: grid">
                <button @click="changeData('All')" class="btn btn-outline-default" :class="{ active: isActiveAll }">
                    <h5 style="font-weight:600;">
                        ALL
                        <span v-if="isActiveAll" class="badge badge-success">Active</span>
                    </h5>
                </button>
            </b-col>
            <b-col cols="2 offset-1" style="display: grid">
                <button @click="changeData('East')" class="btn btn-outline-default" :class="{ active: isActiveEast }">
                    <h5 style="font-weight:600;">
                        EAST
                        <span v-if="isActiveEast" class="badge badge-success">Active</span>
                    </h5>
                </button>
            </b-col>
            <b-col cols="2" style="display: grid">
                <button @click="changeData('West')" class="btn btn-outline-default" :class="{ active: isActiveWest }">
                    <h5 style="font-weight:600;">
                        WEST
                        <span v-if="isActiveWest" class="badge badge-success">Active</span>
                    </h5>
                </button>
            </b-col>
            <b-col cols="2" style="display: grid">
                <button @click="changeData('North')" class="btn btn-outline-default" :class="{ active: isActiveNorth }">
                    <h5 style="font-weight:600;">
                        NORTH
                        <span v-if="isActiveNorth" class="badge badge-success">Active</span>
                    </h5>
                </button>
            </b-col>
            <b-col cols="2" style="display: grid">
                <button @click="changeData('South')" class="btn btn-outline-default" :class="{ active: isActiveSouth}">
                    <h5 style="font-weight:600;">
                        SOUTH
                        <span v-if="isActiveSouth" class="badge badge-success">Active</span>
                    </h5>
                </button>
            </b-col>
        </b-row>
        <b-row>
            <b-col cols="12">
                <v-client-table
                    class="regionTableClass card"
                    ref="regionData"
                    :data="tableData"
                    :columns="tableColumns"
                    :options="tableOptions"
                >
                </v-client-table>
            </b-col>
        </b-row>
    </div>
</template>

<script>
    import Widget from '@/components/Widget/Widget';
    import AnimatedNumber from "animated-number-vue";
    export default {
        name:"RegionalDashboard",
        components: { Widget, AnimatedNumber },
        data(){
            return{
                dashboardCount: [],
                delayDetail: [],
                tableData:[],
                // showSelection:true,
                tableColumns:[
                    "state",
                    "transit",
                    "arrival",
                    "delay"
                ],
                isActiveAll:true,
                isActiveEast:false,
                isActiveWest:false,
                isActiveNorth:false,
                isActiveSouth:false,
                search_selected: "All",
                // search_options: [
                //     { value: "All", text: "All" },
                //     // { value: "Central", text: "Central" },
                //     { value: "East", text: "East" },
                //     { value: "West", text: "West" },
                //     { value: "North", text: "North" },
                //     { value: "South", text: "South" },
                // ],
                tableOptions: {
                    filterByColumn: true,
                    perPage: 10,
                    perPageValues: [],
                    pagination: { chunk: 5, dropdown: false },
                    orderBy: { ascending: true },
                    skin: "table table-striped table-hover",
                    filterable: [
                        "state",
                        "transit",
                        "arrival",
                        "delay"
                    ],
                    texts: {
                        filterBy: "Search by...",
                        defaultOption: "ALL",
                    },
                    templates:{
                    
                    }
                },
                state : [ 
                    {name:"Andhra Pradesh",count:10, region:"South",transit:55,arrival:25,delay:30},
                    {name:"Bihar",count:10, region:"East",transit:50,arrival:30,delay:20},
                    {name:"Chhattisgarh",count:10, region:"West",transit:32,arrival:30,delay:2},
                    {name:"Goa",count:10, region:"West",transit:66,arrival:40,delay:26},
                    {name:"Gujarat",count:10, region:"West",transit:20,arrival:15,delay:5},
                    {name:"Haryana",count:10, region:"North",transit:45,arrival:30,delay:15},
                    {name:"Jharkhand",count:10, region:"East",transit:48,arrival:32,delay:16},
                    {name:"Karnataka",count:10, region:"South",transit:52,arrival:40,delay:12},
                    {name:"Kerala",count:10, region:"South",transit:26,arrival:20,delay:6},
                    {name:"Madhya Pradesh",count:10, region:"West",transit:22,arrival:20,delay:2},
                    {name:"Maharashtra",count:10, region:"West",transit:30,arrival:20,delay:10},
                    {name:"Odisha",count:10, region:"East",transit:35,arrival:25,delay:10},
                    {name:"Punjab",count:10, region:"North",transit:25,arrival:15,delay:10},
                    {name:"Rajasthan",count:10, region:"North",transit:15,arrival:8,delay:7},
                    {name:"Sikkim",count:10, region:"East",transit:39,arrival:29,delay:10},
                    {name:"Tamil Nadu",count:10, region:"South",transit:32,arrival:20,delay:12},
                    {name:"Telangana",count:10, region:"South",transit:31,arrival:21,delay:10},
                    {name:"Uttarakhand",count:10, region:"Central",transit:22,arrival:20,delay:2},
                    {name:"Uttar Pradesh",count:10, region:"Central",transit:66,arrival:20,delay:46},
                    {name:"West Bengal",count:10, region:"East",transit:52,arrival:20,delay:32},
                    {name:"Andaman and Nicobar Islands",count:10, region:"South",transit:28,arrival:20,delay:8},
                    {name:"Dadra and Nagar Haveli",count:10, region:"West",transit:44,arrival:20,delay:24},
                    {name:"Puducherry",count:10, region:"South",transit:16,arrival:8,delay:8},
                    {name:"Delhi",count:10, region:"Central",transit:16,arrival:8,delay:8}
                ]
            }
        },
        created(){
            this.dashboardGetCount();
            this.dashboardGetDelay();
            // const role = window.sessionStorage.getItem('Role');
            // console.log(role);
            // if(role == "DEALER"){
            //     this.showSelection = false ;
            //     this.search_selected = "East"
            // }else{
            //     this.showSelection = true ;
            //     this.search_selected = "All"
            // }
            this.isActiveAll=true;
            this.isActiveEast=false;
            this.isActiveWest=false;
            this.isActiveNorth=false;
            this.isActiveSouth=false;
            console.log(this.search_selected);
            if(this.search_selected == "All"){
                for(let i=0; i<this.state.length; i++){
                        this.tableData.push({
                            state:this.state[i].name,
                            transit:this.state[i].transit,
                            arrival:this.state[i].arrival,
                            delay:this.state[i].delay
                         })
                }
            }
            console.log(this.tableData);
            
        },
        beforeMount(){
            // this.$axios.get('/api/map/transit')
            // .then((response) => {
            //     console.log(response);
            // })
            // .catch((ex)=> {
            //     console.log(ex);
            // });

            // this.$axios.get('/api/map/total')
            // .then((response) => {
            //     console.log(response);
            // })
            // .catch((ex)=> {
            //     console.log(ex);
            // })
            this.$axios.get('/api/map/count')
            .then((response) => {
                console.log(response);
                this.dashboardCount =  response.data.resultBody;
            })
            .catch((ex)=> {
                console.log(ex);
            })
        },
        methods:{
            regionChange(value){
                console.log(value);
                this.tableData=[]
                for(let i=0; i< this.state.length; i++){
                    if(this.state[i].region === value){
                        // console.log(this.state[i]);
                        this.tableData.push({
                            state:this.state[i].name,
                            transit:this.state[i].transit,
                            arrival:this.state[i].arrival,
                            delay:this.state[i].delay
                        })
                    }
                    if(this.search_selected && value === "All"){
                        this.tableData.push({
                            state:this.state[i].name,
                            transit:this.state[i].transit,
                            arrival:this.state[i].arrival,
                            delay:this.state[i].delay
                        })
                    }
                }
            },
            changeData(e){
                console.log(e);
                this.search_selected = e;
                if(e == "All"){
                    this.isActiveAll=true;
                    this.isActiveEast=false;
                    this.isActiveWest=false;
                    this.isActiveNorth=false;
                    this.isActiveSouth=false;
                }
                if(e == "East"){
                    this.isActiveAll=false;
                    this.isActiveEast=true;
                    this.isActiveWest=false;
                    this.isActiveNorth=false;
                    this.isActiveSouth=false;
                }
                if(e == "West"){
                    this.isActiveAll=false;
                    this.isActiveEast=false;
                    this.isActiveWest=true;
                    this.isActiveNorth=false;
                    this.isActiveSouth=false;
                }
                if(e == "North"){
                    this.isActiveAll=false;
                    this.isActiveEast=false;
                    this.isActiveWest=false;
                    this.isActiveNorth=true;
                    this.isActiveSouth=false;
                }
                if(e == "South"){
                    this.isActiveAll=false;
                    this.isActiveEast=false;
                    this.isActiveWest=false;
                    this.isActiveNorth=false;
                    this.isActiveSouth=true;
                }
                this.tableData=[]
                for(let i=0; i< this.state.length; i++){
                    if(this.state[i].region === e){
                        // console.log(this.state[i]);
                        this.tableData.push({
                            state:this.state[i].name,
                            transit:this.state[i].transit,
                            arrival:this.state[i].arrival,
                            delay:this.state[i].delay
                        })
                    }
                    if(this.search_selected && e === "All"){
                        this.tableData.push({
                            state:this.state[i].name,
                            transit:this.state[i].transit,
                            arrival:this.state[i].arrival,
                            delay:this.state[i].delay
                        })
                    }
                }
            },
            formatCount(value) {
                return `${Number((value).toFixed()).toLocaleString().replace(/,/g,',')}`;
            },
            dashboardGetCount(){
                this.$axios.get('/api/dashboard/count')
                .then((response) => {
                    console.log(response);
                    this.dashboardCount =  response.data.resultBody;
                }).catch((ex)=> {
                    console.log(ex);
                })
            },
            dashboardGetDelay(){
                this.$axios.get('/api/dashboard/delay')
                .then((response) => {
                    console.log(response);
                    const data = response.data.resultBody;
                    this.delayDetail = data;
                }).catch((ex)=> {
                    console.log(ex);

                })
            },
            moveToTrailer(status,count){
                if(status == 'Transit'){
                    this.$root.$router.push('/app/maps/map');
                }else{
                    if(count !== 0){
                        this.$root.$router.push({
                            name: 'TrailerPage', 
                            params: { status: status }
                        });
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .input-group-append {
    margin-left: -1px;
    width: 240px;
    /* display: grid; */
}
.input-group-prepend {
    margin-right: 1px;
}
.input-group {
    position: relative;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    // -ms-flex-wrap: wrap;
    /* flex-wrap: wrap; */
    -webkit-box-align: stretch;
    -ms-flex-align: stretch;
    align-items: stretch;
    width: 100%;
}
.input-group > .input-group-prepend > .input-group-text{
    border-radius: 5px;
    background: transparent;
    color: white;
    border: none;
}
.btn{
    border-radius: 0.3rem 0.3rem 0rem 0rem !important;
    z-index: 10000 !important;
}

.regionTableClass {
    border-top: 1px solid;
    border-radius: 0px 0px 5px 5px;
}
</style>
<style src="./RegionalDashboard.scss" lang="scss" />