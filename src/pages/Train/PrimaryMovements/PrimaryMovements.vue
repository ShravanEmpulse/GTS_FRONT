<template>
    <div class="dynamic-tables mt-3">
        
        <Widget
        title="<h4 class='text-center'><b>Primary Movements</b></h4>"
        customHeader
        >
        <div class="widget-middle-overflow">
            <b-row>
              <b-col cols="4 offset-4 mt-2" class="primaryBorder">
                <div class="movements">    
                  <div class="badgeClass">
                    <i class="fa fa-industry" aria-hidden="true"></i>
                    <span class="badge badge-light">FACTORY</span>
                  </div>
                  <i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
                  <div class="badgeClass">
                    <span class="badge badge-light">TRAIN</span>
                    <i class="fa fa-train"></i>
                  </div>
                </div> 
              </b-col>
            </b-row>
            <hr class="bg-light">
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

            <v-client-table class="trainTableClass" ref="trainTable" :data="tableData" :columns="trainColumns" :options="trainOptions">
            <b-button slot="status" slot-scope="props" :variant="props.row.status[0].type" class="train-status-badge" @click="getTrainDetail(props.row)" v-b-modal.detail >{{props.row.status[0].title}}</b-button>
            <b-button slot="action" slot-scope="props" class="btn-outline-warning" @click="getPrimaryData(props.row,props.index)" v-b-modal.edit ><i class="fa fa-pencil-square-o" aria-hidden="true"></i></b-button>
            <a class="item-count" slot="item" slot-scope="props"  >{{props.row.item}}</a>
            <p slot="location" slot-scope="props" >{{getLocation(props.row.location)}}</p>
            </v-client-table>
        </div>
        </Widget>
        <b-modal
        id="edit"
        size="md"
        title="Edit Details"
        body-class="bg-white"
        ref="tableModal"
        hide-footer
        >
        <form @submit.prevent="updatePrimaryData()" class="edit-modal">
            <div class="mb-3">
            <label for="status">Status</label>
                <select
                    class="form-control"
                    v-model="edit_selected"
                    name="status"
                    id="status"
                >
                    <option
                    v-for="edit in edit_options"
                    :key="edit.text"
                    :value="edit.value"
                    >{{ edit.text }}</option
                    >
                </select>
            </div>
            <div class="mb-3">
            <label for="lotNo">LOT NO.</label>
            <input id="lotNo" type="text" class="form-control" v-model="lot_no">
            </div>
            <div class="mb-3">
            <label for="fnrNo">FNR NO.</label>
            <input id="fnrNo" type="text" class="form-control" v-model="fnr_no">
            </div>
            <div class="mt-4 update">
            <button @type="updatePrimaryData()" class="btn btn-primary update_button">
                Update
            </button>
            </div>
        </form>
        </b-modal>
        <b-modal id="detail" size="lg" title="Train Detail" body-class="bg-white" hide-footer>
        <div class="trainDetail">
            <br>
        <header>
            <b-row>
                <b-col md="6" xs="12" class="b-col-print-6">
                <h5>
                <span class="fw-semi-bold">{{trainInfo.ti_no}}</span>  
                </h5>
                </b-col>
            </b-row>
        </header>
        <br>
        <section>
            <b-row class="mb-lg">
                <b-col sm='12' class="b-col-print-12">
                    <h5 class="no-margin">Glovis</h5>
                    <h3 class="company-name m-t-1 fw-semi-bold">
                        {{trainInfo.departure}}
                    </h3>
                    <address>
                        PLATE NO: <strong>{{trainInfo.plate_no}}</strong><br />
                        TI No: <strong>{{trainInfo.ti_no}}</strong><br />
                        DEPARTURE DATE:<strong> {{trainInfo.departure_date}}</strong><br />
                        LOCATION:<strong> {{getLocation(trainInfo.location)}}</strong><br />
                    </address>
                </b-col>
            </b-row>
            </section>
        </div>
            <div class="invoice">
            <table class="table table-striped">
                <thead>
                    <tr>
                    <th>#</th>
                    <th>DESTINATION</th>
                    <th>DEALER</th>
                    <th>ETA</th>
                    <th>{{this.itmeNo}}</th>
                    <th class="hidden-sm-down">MODEL NAME</th>
                    </tr>
                </thead>
                <tbody>
                    <tr  v-for="( row, index ) in invoiceDetail" :key="index">
                    <td v-if="row.goodsCode == 'V'"><i class="fa fa-car"/></td>
                    <td v-if="row.goodsCode == 'P'"><i class="fa fa-gear"/></td>
                    <td>{{row.destName}}</td>
                    <td>{{row.dealerName}}</td>
                    <td>{{parseDateforETA(row.eta)}}</td>
                    <td>{{row.itemNo}}</td>
                    <td>{{row.itemName}}</td>
                    </tr>
                </tbody>
            </table>
            </div>
        </b-modal>

        <loading
        :show="loadingShow"
        :label="loadingLabel"
        loader-class="loading">
        </loading>
    </div>
</template>

<script>
    import Widget from '@/components/Widget/Widget';
    export default {
        name:"PrimaryMovements",
        components: { Widget },
         data() {
    return {
      /* LOADING */
      loadingShow: false,
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
        fnrNo:"",
        destination:"",
        noOfCars:""
      },
      secondaryTableData:[],
      tableData: [
        {
              status: this.settingStatus(2),
              plate_no:"AP29KJ5689",
              departure_date:"10 june, 2022",
              eta:"11 june, 2022",
              destination:"Bangalore,Railway Station",
              current_location:"Bangalore",
              lot_no:"DN1234567894",
              fnr_no:"FN2022"
        },
        {
              status: this.settingStatus(3),
              plate_no:"AP29KJ5689",
              departure_date:"10 june, 2022",
              eta:"11 june, 2022",
              destination:"Bangalore,Railway Station",
              current_location:"Bangalore",
              lot_no:"DN1234567894",
              fnr_no:"FN2022"
        },
        {
              status: this.settingStatus(1),
              plate_no:"AP29KJ5689",
              departure_date:"10 june, 2022",
              eta:"11 june, 2022",
              destination:"Bangalore,Railway Station",
              current_location:"Bangalore",
              lot_no:"DN1234567894",
              fnr_no:"FN2022"
        },
      ],
      status:[],
      trainColumns: [ 'plate_no','departure_date','eta','destination', 'current_location' , 'lot_no','fnr_no', 'status', 'action' ],
      trainOptions: {
        filterByColumn: true,
        perPage: 5,
        perPageValues: [],
        pagination: { chunk: 5, dropdown: false },
        orderBy:{ ascending:true},
        skin: 'table table-striped',
        filterable: ['plate_no','departure_date','eta','destination', 'current_location', 'status' , 'lot_no','fnr_no'],
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
    this.$emit('getPrimaryData',this.tableData)
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
    getPrimaryData(row, index){
      console.log(row);
      this.lot_no = row.lot_no;
      this.fnr_no = row.fnr_no;
      this.edit_selected = row.status[0].title;
      this.primaryIndex = index;
    },
    updatePrimaryData(){
      console.log(this.tableData[this.primaryIndex - 1]);
      this.tableData[this.primaryIndex - 1].lot_no = this.lot_no;
      this.tableData[this.primaryIndex - 1].fnr_no = this.fnr_no;
      if (this.edit_selected == "NONE") {
        this.tableData[this.primaryIndex - 1].status[0].title = this.edit_selected;
        this.tableData[this.primaryIndex - 1].status[0].type = "default";
      } else if (this.edit_selected == "TRANSIT") {
        this.tableData[this.primaryIndex - 1].status[0].title = this.edit_selected;
        this.tableData[this.primaryIndex - 1].status[0].type = "primary";
      } else if (this.edit_selected == "ARRIVAL") {
        this.tableData[this.primaryIndex - 1].status[0].title = this.edit_selected;
        this.tableData[this.primaryIndex - 1].status[0].type = "success";
      } else if (this.edit_selected == "IDLE") {
        this.tableData[this.primaryIndex - 1].status[0].title = this.edit_selected;
        this.tableData[this.primaryIndex - 1].status[0].type = "info";
      } else if (this.edit_selected == "DELAY") {
        this.tableData[this.primaryIndex - 1].status[0].title = this.edit_selected;
        this.tableData[this.primaryIndex - 1].status[0].type = "danger";
      } else if (this.edit_selected == "STANDBY") {
        this.tableData[this.primaryIndex - 1].status[0].title = this.edit_selected;
        this.tableData[this.primaryIndex - 1].status[0].type = "warning";
      }
      this.$refs.tableModal.hide();
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

.primaryBorder{
    border: 2px solid white;
    padding: 6px 19px;
    border-radius: 30px;
  .movements{
      display: flex;
      justify-content: space-between;
      align-items: center;
      img{
        height: 50px;
        width: 50px;
      }
      i{
        font-size: 30px;
      }
    }
}
.badge{
  font-size: small;
}
.badgeClass{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  span{
    margin: 10px;
  }
}
</style>