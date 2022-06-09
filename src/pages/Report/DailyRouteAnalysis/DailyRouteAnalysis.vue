<template>
  <div class="dynamic-tables">
    <h4 class="page-title">    
      <span>Daily Route Analysis</span>    
    </h4> 
    <Widget
      title="<h4></h4>"
      customHeader
      >
      <div class="widget-middle-overflow">
        <b-row>
            <b-col cols="3 mt-2">
                <div class="d-flex">
                  <input type="text" placeholder="Search.." class="form-control mx-2 d-grid">
                  <button class="btn btn-outline-default">Search</button>
                </div>
            </b-col>
            <b-col cols="4 mt-2">
              <button class="btn btn-outline-default ml-4"><i class="la la-angle-left"></i> 100 Km's</button>
              <button class="btn btn-outline-default mx-4"><i class="la la-angle-right"></i> 400 Km's</button>
            </b-col>
          <b-col cols="2 offset-1">
            <div class="export-button">
              <download-excel
            class   = "btn btn-outline-default"
            :data   = "exportData"
            worksheet = "DailyRouteAnalysis"
            type    = "csv"
            :fields ="excel_fields"
            name    = "DailyRouteAnalysis.csv">
            EXPORT EXCEL
          </download-excel>
            </div>
          </b-col>
          <b-col cols="2">
            <div class="daterange">
              DRIVE DATE <input ref="daterange" id="daterangepicker" class="form-control" name="dates" />
            </div> 
          </b-col>
        </b-row>
            <v-server-table class="reportTableClass" ref="reportTable"  :columns="columns" :options="options" @sorted="setSorted" @filter="setFilter">
                <div slot="details" class="d-flex" slot-scope="props">
                    <b-button class="mx-2">
                        <i @click="getDirection(props.row)" title="Direction" class="fa fa-location-arrow" aria-hidden="true"></i>
                    </b-button>
                </div>
            </v-server-table>
        </div>
    </Widget>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
import downloadjs from 'downloadjs';
export default {
  name: 'DeliveryDistanceReport',
  components: {
    Widget
  },
  computed:{
    exportData(){
      console.log(this.$refs.reportTable);
      if(typeof this.$refs.reportTable !== 'undefined'){
        return this.tableData;
      }else{
        console.log(this.tableData);
        return this.tableData;
      }
    }
  },
  created() {
    if(this.start == '' && this.end == '' ){
        this.start = this.$moment().subtract(8,'days');
        this.end = this.$moment().subtract(1,'days');
    };
  },
  data() {
    return {
      start:'',
      end: '',
      filter: [],
      excel_fields: {
              "Transporter Name":"transporterName",
              "Plate No.":"plateNo",
              "Current Location":"currentLocation",
              "Total Distance(Km's)":"total",
              "Date":"25 May, 2022",
              "Date":"26 May, 2022",
              "Date":"27 May, 2022",
              "Date":"28 May, 2022",
              "Date":"29 May, 2022",
              "Date":"30 May, 2022",
              "Date":"31 May, 2022",
              "Date":"01 Jun, 2022"
      },
      sorted: {
        column: 'plateNo',
        ascending: 1
      },
      columns: [],
      tableData: [],
      options: {
        perPage:10,
        perPageValues:[10],
        skin: 'table table-striped',
        filterByColumn: true,
        sortable: ['transporterName' , 'plateNo', 'total'],
        filterable: ['transporterName' , 'plateNo', 'dayAndNight'],
        listColumns:{
          dayAndNight:[
            {
              id: 'D',
              text: 'DAY'
            },
            {
              id: 'N',
              text: 'NIGHT'
            }
          ]
        },
        texts:{
          filterBy: "Search by...",
          defaultOption: "ALL",
        },
        headings: {
          transporterName: 'TRANSPORTER',
          plateNo: 'PLATE NO',
          total: 'TOTAL (KM)',
          details:'Details',
          currentLocation: 'CURR. LOCATION',
          departureDate:'DEPT. DATE',
          destination:'DESTINATION',
          arrivalDate:'ARRIVAL DATE',
        },
        requestAdapter: (data) => {
          console.log(this.start);
          console.log(this.end);
          const startDate =  this.$moment(this.start).format('YYYYMMDD');
          const endDate =  this.$moment(this.end).format('YYYYMMDD')
          return {
            ascending: data.ascending,
            byColumn: data.byColumn,
            pageSize: data.limit,
            orderBy: data.orderBy ? data.orderBy : "plateNo",
            page: data.page,
            query: data.query,
            pageResult: ((data.page-1)*data.limit),
            startDate: startDate,
            endDate: endDate
          };
        },
        requestFunction: function (data) {
          console.log(data);
          return this.$axios.get('/api/report/deliveryDistanceReport', {
                params: data
          }).catch(function (e) {
                this.dispatch('error', e);
          }.bind(this));
        },
        responseAdapter: (response) => {
          console.log(response);
          // this.columns = response.data.resultBody.columns;
          this.columns = ["transporterName","plateNo","currentLocation","departureDate","destination","arrivalDate","total","25 May, 2022","26 May, 2022","27 May, 2022","28 May, 2022","29 May, 2022","30 May, 2022","31 May, 2022","01 Jun, 2022"]
          this.columns.push('details')
          return {
            // data: response.data.resultBody.data,
            data:[{"transporterName":"SKYLIN","plateNo":"PB11BR1791","currentLocation":"Kolkata","departureDate":"25 May, 2022","destination":"Kolkata","arrivalDate":"1 Jun, 2022","total":"1800","25 May, 2022":"240","26 May, 2022":"321","27 May, 2022":"244","28 May, 2022":"100","29 May, 2022":"500","30 May, 2022":"129","31 May, 2022":"111","01 Jun, 2022":"50"},{"transporterName":"Glovis India Anantapur private limited","plateNo":"AP01AB1234","currentLocation":"Delhi","departureDate":"25 May, 2022","destination":"Delhi","arrivalDate":"1 Jun, 2022","total":"1800","25 May, 2022":"240","26 May, 2022":"321","27 May, 2022":"244","28 May, 2022":"100","29 May, 2022":"500","30 May, 2022":"129","31 May, 2022":"111","01 Jun, 2022":"50"}],
            count: response.data.resultBody.count 
          }
        },
      }
    }
  },
  methods: {
    showErrorAlert(status) {
      this.$swal({
          title: 'Error',
          text: status,
          confirmButtonText: 'OK'
      });
    },
    getDirection(row){
        console.log(row);
        this.$root.$router.push({name:'DailyRoutePlayback',params:{row:row}})
    },
    setSorted(sorted){
      this.sorted = sorted;
    },
    setFilter(filter){
      let filterValue = filter.value;

      this.filter.push({
        name: filter.name,
        value: filterValue
      });
    },
    init(start, end){
      this.start = this.$moment(start).format('YYYYMMDD');
      this.end = this.$moment(end).format('YYYYMMDD');
      console.log(this.start, this.end);
    },
    getReportData(){
      this.$refs.reportTable.getData();
      console.log(this.$refs.reportTable.getData());
    }
  },
    mounted(){
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
      
  },
}
</script>
