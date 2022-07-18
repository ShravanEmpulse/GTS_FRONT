<template>
  <div>
    <div class="dynamic-tables mt-3">
      <Widget
        title="<h4 class='text-center'><b>Train Movements</b></h4>"
        customHeader
      >
        <div class="widget-middle-overflow">
          <b-row>
            <b-col cols="4 offset-4 mt-2" class="primaryBorder">
              <div class="movements">
                <div class="badgeClass">
                  <i class="fa fa-train"></i>
                  <span class="badge badge-light">ORIGIN</span>
                </div>
                <i class="fa fa-arrow-circle-o-right" aria-hidden="true"></i>
                <div class="badgeClass">
                  <span class="badge badge-light">DESTINATION</span>
                  <i class="fa fa-train"></i>
                </div>
              </div>
            </b-col>
          </b-row>
          <hr class="bg-light" />
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
                <div slot="action" slot-scope="props">
                  <b-button class="btn-outline-default" @click="getTrainData(props.row,props.index)" v-b-modal.secondary >View <i class="fa fa-eye" aria-hidden="true"></i></b-button>
                <b-button class="btn-outline-default mx-2" @click="getDirection(props.row,props.index)" > <i class="fa fa-location-arrow" aria-hidden="true"></i></b-button>
                </div>
                 <b-button slot="status" slot-scope="props" :variant="props.row.status[0].type" class="train-status-badge" >{{props.row.status[0].title}}</b-button>
            </v-client-table>
        </div>
      </Widget>
      <b-modal
      id="secondary"
      size="xl"
      title="Train Details"
      body-class="bg-white"
      ref="secondaryTableModal"
      hide-footer
    >
    <div class="trainDetail">
      <section>
          <b-row class="mt-5">
              <b-col sm='12' class="b-col-print-12">
                <h3 class="no-margin">Glovis</h3>
                
                <address v-for="(t,i) in trainInfo" :key="i">
                    FNR NO.: <strong>{{t.fnr_no}}</strong><br />
                    DEPARTURE DATE:<strong> {{t.departure_date}}</strong><br />
                    FINAL DESTINATION:<strong> {{t.final_destination}}</strong><br />
                </address>
            </b-col>
          </b-row>
        </section>
      </div>
      <hr>
      <div class="invoice mt-3">
          <table class="table table-striped">
              <thead>
                <tr>
                  <th>#</th>
                  <th>LOT NO</th>
                   <th>DEPARTURE DATE</th>
                   <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(t,i) in trainTableData" :key="i">
                  <td><i class="la la-truck text-dark fa-2x"/></td>
                  <td>{{t.lot_no}}</td>
                  <td>{{t.departure_date}}</td>
                  <td>
                    <b-button :variant="t.status.type">{{t.status.title}}</b-button>
                  </td>
                </tr>
              </tbody>
           </table>
        </div>
    </b-modal>
    </div>
  </div>
</template>

<script>
import Widget from '@/components/Widget/Widget';
export default {
  name: "TrainMovemnets",
  components: { Widget },
  props:{
    data:Array,
  },
  data(){
    return{
        tableData: [
        {
              fnr_no:"FN2020",
              departure_date:"10 june, 2022",
              eta:"11 june, 2022",
              destination:"Bangalore,Railway Station",
              current_location:"Bangalore",
              status:this.settingStatus(1)
        },
        {
              fnr_no:"FN2021",
              departure_date:"10 june, 2022",
              eta:"11 june, 2022",
              destination:"Bangalore,Railway Station",
              current_location:"Bangalore",
              status:this.settingStatus(2)
        },
        {
              fnr_no:"FN2022",
              departure_date:"10 june, 2022",
              eta:"11 june, 2022",
              destination:"Bangalore,Railway Station",
              current_location:"Bangalore",
              status:this.settingStatus(1)
        },
      ],
      status:[],
      trainInfo:[],
      trainTableData:[],
      trainColumns: ['fnr_no','departure_date','eta','destination', 'current_location' ,'status', 'action' ],
      trainOptions: {
        filterByColumn: true,
        perPage: 5,
        perPageValues: [],
        pagination: { chunk: 5, dropdown: false },
        orderBy:{ ascending:true},
        skin: 'table table-striped',
        filterable: ['departure_date','eta','destination', 'current_location','fnr_no', 'status'],
        texts:{
            filterBy: "Search by...",
            defaultOption: "ALL",
        },
      },
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
  methods:{
    getDirection(r,i){
      console.log("direction button clicked");
      this.$root.$router.push({name:'TrainPlayback'})
    },
    settingStatus(drivingStatus){

      this.status=[];

       if(drivingStatus == '1'){
          this.status.push({
            type: 'primary',
            title: 'TRANSIT'
          })
      }else if(drivingStatus == '2'){
          this.status.push({
            type: 'success',
            title: 'ARRIVAL'
          })
      }
      return this.status;
    },
    getTrainData(r,i){
        console.log(r);
        this.trainInfo = [];
        this.trainTableData = [];
        this.trainInfo.push({
            fnr_no:r.fnr_no,
            departure_date:r.departure_date,
            final_destination:r.final_destination
        })
        console.log(this.trainInfo);
        for(let i=0 ; i< this.data.length; i++){
          if(r.fnr_no == this.data[i].fnr_no){
            this.trainTableData.push({
                departure_date: this.data[i].departure_date,
                lot_no: this.data[i].lot_no,
                plate_no: this.data[i].plate_no,
                status:r.status[0],
              })
          }
        }

        console.log(this.trainTableData);
    }
  },
  created(){
    console.log(this.data);
  },
};
</script>

<style lang="scss" scoped>
.primaryBorder {
  border: 2px solid white;
  padding: 6px 19px;
  border-radius: 30px;
  .movements {
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      height: 50px;
      width: 50px;
    }
    i {
      font-size: 30px;
    }
  }
}
.invoice {
    max-height: 235px;
    overflow-y: scroll;
  }
  /* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 10px;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #4e85bd; 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
.badge {
  font-size: small;
}
.badgeClass {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  span {
    margin: 10px;
  }
}
</style>