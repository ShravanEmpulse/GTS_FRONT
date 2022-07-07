<template>
    <div class="dynamic-tables">
        <h4 class="page-title mt-3">    
      <span>Secondary Movements</span>    
    </h4> 
    <Widget
      title="<h4></h4>"
      customHeader
      >
      <div class="widget-middle-overflow">

        <div class="export-button">
          <download-excel
            class   = "btn btn-outline-default"
            :data   = "exportData"
            worksheet = "Train"
            type    = "csv"
            :fields ="excel_fields"
            name    = "Train.csv">
            EXPORT EXCEL
          </download-excel>
        </div>

        <v-client-table class="trainTableClass" ref="secondaryTrainTable" :data="tableData1" :columns="trainColumns1" :options="trainOptions1">
          <b-button slot="action" slot-scope="props" class="btn-outline-default" @click="getSecondaryData(props.row,props.index)" v-b-modal.secondary >View <i class="fa fa-eye" aria-hidden="true"></i></b-button>
        </v-client-table>
      </div>
    </Widget>
    <b-modal
      id="secondary"
      size="xl"
      title="Secondary Details"
      body-class="bg-white"
      ref="secondaryTableModal"
      hide-footer
    >
    <div class="trainDetail">
      <section>
          <b-row class="mt-5">
              <b-col sm='12' class="b-col-print-12">
                <h3 class="no-margin">Glovis</h3>
                
                <address v-for="(t,i) in trainInfo1" :key="i">
                    FNR NO.: <strong>{{t.fnr_no}}</strong><br />
                    DEPARTURE DATE:<strong> {{t.departure_date}}</strong><br />
                    FINAL DESTINATION:<strong> {{t.final_destination}}</strong><br />
                </address>
            </b-col>
          </b-row>
        </section>
      </div>
      <hr>
      <b-row>
        <b-col cols="2 offset-10" >
          <div style="display:grid;">
            <button class="btn btn-primary" v-b-modal.addSecondaryTrailer>Add</button>
          </div>
        </b-col>
      </b-row>
      <div class="invoice mt-3">
          <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>PLATE NO</th>
                  <th>DEALER CODE</th>
                   <th>SECONDARY LOT NO.</th>
                  <th>DESTINATION</th>
                  <th>NO. OF CARS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(t,i) in secondaryTableData" :key="i">
                  <td><i class="fa fa-car"/></td>
                  <td>{{t.plateNo}}</td>
                  <td>{{t.dealerCode}}</td>
                  <td>{{t.secondaryLotNo}}</td>
                  <td>{{t.destination}}</td>
                  <td>{{t.noOfCars}}</td>
                  <td>
                    <button class="btn btn-outline-warning" @click="updateSecondaryData(t)" v-b-modal.addSecondaryTrailer><i class="fa fa-pencil"></i></button>
                  </td>
                </tr>
              </tbody>
           </table>
        </div>
    </b-modal>
    <b-modal
      id="addSecondaryTrailer"
      size="lg"
      title="Add Details"
      body-class="bg-white"
      ref="secondaryDataTableModal"
      hide-footer
    >
    <form @submit.prevent="updateSecondaryLot()" class="edit-modal">
        <div class="mb-3">
          <label for="plateNo">PLATE NO.</label>
          <input id="plateNo" type="text" class="form-control" v-model="secondaryData.plateNo">
        </div>
        <div class="mb-3">
          <label for="dealerCode">DEALER CODE</label>
          <input id="dealerCode" type="text" class="form-control" v-model="secondaryData.dealerCode">
        </div>
        <div class="mb-3">
          <label for="lotNo">SECONDARY LOT NO.</label>
          <input id="lotNo" type="text" class="form-control" v-model="secondaryData.secondaryLotNo">
        </div>
        <div class="mb-3">
          <label for="destination">DESTINATION</label>
          <input id="destination" type="text" class="form-control" v-model="secondaryData.destination">
        </div>
        <div class="mb-3">
          <label for="noOfCars">NO. OF CARS</label>
          <input id="noOfCars" type="text" class="form-control" v-model="secondaryData.noOfCars">
        </div>
        <div class="mt-4 update">
          <button @type="updateSecondaryLot()" class="btn btn-primary update_button">
            Update
          </button>
        </div>
      </form>
    </b-modal>
    <loading
      :show="loadingShow1"
      :label="loadingLabel"
      loader-class="loading">
    </loading>
    </div>
</template>

<script>
    import Widget from '@/components/Widget/Widget';
    export default {
        name:"SecondaryMovements",
        components: { Widget },
         data() {
    return {
      /* LOADING */
      loadingShow1: false,
      loadingLabel: 'Loading...',
      lot_no:"",
      fnr_no:"",
      edit_options: [
        { value: "NONE", text: "NONE" },
        { value: "TRANSIT", text: "TRANSIT" },
        { value: "ARRIVAL", text: "ARRIVAL" },
        { value: "IDLE", text: "IDLE" },
        { value: "DELAY", text: "DELAY" },
        { value: "STANDBY", text: "STANDBY" },
      ],
      edit_selected: "IDEL",
      primaryIndex:null,
      secondaryData:{
        plateNo:"",
        dealerCode:"",
        secondaryLotNo:"",
        destination:"",
        noOfCars:""
      },
      secondaryTableData:[],
      tableData1: [
        {
              departure_date:"10 june, 2022",
              eta:"17 june, 2022",
              final_destination:"Delhi,Railway Station",
              lot_no:"DN1234567894",
              fnr_no:"FN2021"
        },
        {
              departure_date:"10 june, 2022",
              eta:"17 june, 2022",
              final_destination:"Mumbai,Railway Station",
              lot_no:"DN1234567894",
              fnr_no:"FN2022"
        },
        {
              departure_date:"10 june, 2022",
              eta:"17 june, 2022",
              final_destination:"Kolkata,Railway Station",
              lot_no:"DN1234567894",
              fnr_no:"FN2023"
        },
      ],
      status:[],
      trainColumns1: ['lot_no','departure_date','eta','final_destination' ,'action' ],
      trainOptions1: {
        filterByColumn: true,
        perPage: 10,
        perPageValues: [],
        pagination: { chunk: 5, dropdown: false },
        orderBy:{ ascending:true},
        skin: 'table table-striped',
        filterable: ['lot_no','departure_date','eta','final_destination' , 'action' ],
        texts:{
            filterBy: "Search by...",
            defaultOption: "ALL",
        },
      },
      invoiceDetail: [{
        goodsCode: 'P',
        destName: 'Rajasthan',
        dealerName: 'SMD',
        eta: '2hrs',
        itemNo: '28392',
        itemName:'Package',
      }],
      trainInfo: [],
      trainInfo1: [],
      excel_fields: {
        'STATUS': {
          field:'status',
          callback:(value)=>{
            return value[0].title;
          }
        },
        'PLATE NO': 'plate_no',
        'TI NO': 'ti_no',
        'FNR NO': 'fnr_no',
        'DEPARTURE DATE': 'departure_date',
        'DEPARTURE': 'departure',
        'ETA': 'eta', 
        'DESTINATION': 'destination',
        'LOCATION': {
          field:'location',
          callback:(value)=>{
            if(!value){
              return "-"
            }else{
              return value
            }
          }
        },
      },
      itmeNo: 'ITEM NO',
    };
  },
  created() {
    // this.getTrainInfo(); 
  },
  mounted(){
     if(this.$route.params.status){
       this.setFilter(this.$route.params.status);
     }
  },
  computed: {
    exportData(){
      if(typeof this.$refs.trainTable !== 'undefined'){
        return this.$refs.trainTable.allFilteredData;
      }else{
        return this.tableData;
      }
    }
  },
  methods: {
    getSecondaryData(row,index){
      this.trainInfo1 = [];
      console.log(row);
      this.trainInfo1.push({
        fnr_no:row.fnr_no,
        departure_date:row.departure_date,
        final_destination:row.final_destination
      })
      console.log(this.trainInfo1);

    },
    updateSecondaryLot(){
      console.log(this.secondaryData);
      this.secondaryTableData.push(this.secondaryData);
      this.$refs.secondaryDataTableModal.hide();
      this.secondaryData={
        plateNo:"",
        dealerCode:"",
        secondaryLotNo:"",
        fnrNo:"",
        destination:"",
        noOfCars:""
      };
    },
    updateSecondaryData(t){
        console.log(t);
    },
    parseDateforETA(date) {
        return  this.$moment(date,'YYYYMMDD').format('DD MMM, YYYY');
    },
    parseDateforDepDate(date) {
        return  this.$moment(date,'YYYYMMDDHHmmss').format('DD MMM, YYYY');
    },
    getTrainInfo(){
      this.tableData = [];
      this.loadingShow = true;
      this.loadingShow1 = true;
      this.$axios.get('/api/train/trainInfo')
      .then((response) => {
        this.loadingShow = false;
        this.loadingShow1 = false;
        const data = response.data.resultBody;

        for(let i in data){

          if(data[i].destCount==1){
            this.tableData.push({
              status: this.settingStatus(data[i].drivingStatus),
              plate_no: data[i].plateNo,
              ti_no: data[i].tiNo,
              departure_date: data[i].departureDate,
              departure: data[i].departureName,
              eta: data[i].eta,
              destination: data[i].destName,
              shippingId: data[i].shippingId,
              location: data[i].location
            })
          }else{
            this.tableData.push({
              status: this.settingStatus(data[i].drivingStatus),
              transporter_name: data[i].transporterName,
              plate_no: data[i].plateNo,
              ti_no: data[i].tiNo,
              departure_date: data[i].departureDate,
              departure: data[i].departureName,
              eta: data[i].eta,
              destination: data[i].destName+' and '+(data[i].destCount-1),
              shippingId: data[i].shippingId,
              location: data[i].location
            })
          }
        }
      })
      .catch(()=> {
        this.loadingShow = false;
        this.loadingShow1 = false;
      })
    },
    settingStatus(drivingStatus){

      this.status=[];

      if(drivingStatus == '0'){
          this.status.push({
            type: 'default',
            title: 'NONE'
          })
      }else if(drivingStatus == '1'){
          this.status.push({
            type: 'primary',
            title: 'TRANSIT'
          })
      }else if(drivingStatus == '2'){
          this.status.push({
            type: 'success',
            title: 'ARRIVAL'
          })
      }else if(drivingStatus == '3'){
          this.status.push({
            type: 'info',
            title: 'IDLE'
          })
      }
      else if(drivingStatus == '4'){
          this.status.push({
            type: 'danger',
            title: 'DELAY'
          })
      }
      else if(drivingStatus == '5'){
          this.status.push({
            type: 'warning',
            title: 'STANDBY'
          })
      }
      return this.status;
    },
    getTrainDetail(trainInfo){
      this.loadingShow = true;
      this.loadingShow1 = true;
      this.$axios.get('/api/train/invoiceDetail', {
          params: { plateNo: trainInfo.plate_no, shippingId: trainInfo.shippingId }
      })
      .then((response) => {
        this.loadingShow = false;
        this.loadingShow1 = false;
        this.trainInfo = trainInfo;
        // this.invoiceDetail = response.data.resultBody;

        if(this.invoiceDetail[0].goodsCode == 'V'){
          this.itmeNo = "VIN";
        }else if(this.invoiceDetail[0].goodsCode == 'P'){
          this.itmeNo = "ITEM NO";
        }
      })
      .catch(()=> {
        this.loadingShow = false;
        this.loadingShow1 = false;
      }) 
    },
    setFilter(paramStatus){
      this.$refs.trainTable.setFilter({
        status: paramStatus
      });
    },
    getLocation(location){
     if(!location){
       return '-'
     }else{
       return location
     }
    }
  }
    }
</script>

<style lang="scss" scoped>

</style>