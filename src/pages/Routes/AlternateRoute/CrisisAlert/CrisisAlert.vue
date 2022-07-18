<template>
  <div class="mt-3">
    <Widget
      title="<h4 class='text-center'><b>CRISIS ISSUE</b></h4>"
      customHeader
    >
      <div class="widget-middle-overflow">
        <div class="export-button">
          <download-excel
                class   = "btn btn-outline-default"
                :data   = "exportData"
                worksheet = "Crisis Data"
                type    = "csv"
                :fields ="excel_fields"
                name    = "CrisisData.csv">
                EXPORT EXCEL
            </download-excel>
        </div>

        <v-client-table
          class="trainTableClass"
          ref="crisisTable"
          :data="tableData"
          :columns="crisisColumns"
          :options="crisisOptions"
        >
        <b-button
            slot="status"
            slot-scope="props"
            :variant="props.row.status[0].type"
            class="trailer-status-badge"
            >{{ props.row.status[0].title }}</b-button
          >
          <b-button slot="action" variant="outline-warning" slot-scope="props" @click="getTableData(props)" v-b-modal.edit
            ><i class="fa fa-pencil-square-o" aria-hidden="true"></i
            ></b-button
          >
          <!-- <b-button slot="action" variant="danger" class="mx-3"
            ><i class="fa fa-trash px-2" aria-hidden="true"></i>Delete</b-button
          > -->
        </v-client-table>
      </div>
    </Widget>
    <b-modal
      id="edit"
      size="md"
      title="Update Crisis Details"
      body-class="bg-white"
      ref="crisisUpdate"
      hide-footer
    >
      <form  @submit.prevent="updateCrisisData()">
        <div class="mt-3">
          <label for="endDate">End Date</label>
          <input @change="onChangeEnd" type="date" class="form-control" placeholder="Enter End Date">
        </div>
        <div class="mt-3">
          <label for="status">Status</label>
          <select
            class="form-control"
            v-model="selectStatus"
            name="status"
            id="status"
          >
            <option
              v-for="edit in search_options"
              :key="edit.text"
              :value="edit.value"
              >{{ edit.text }}</option
            >
          </select>
        </div>
        <div class="mt-4 mb-4" style="display:grid">
          <button @type="updateCrisisData()" class="btn btn-primary">UPDATE</button>
        </div>
      </form>
    </b-modal>
  </div>
</template>

<script>
import Widget from "../../../../components/Widget/Widget.vue";
import routeAxios, { routesAxios } from "../../../../main";
export default {
  name: "CrisisAlert",
  data() {
    return {
      tableData: [],
      status: [],
      selectStatus:"DAMAGED",
      crisisColumns: [
        "transporter_name",
        "location",
        "start_date",
        "end_date",
        "issue_name",
        "status",
        "action",
      ],
      updateColumn:{
        endDate:'',
        status:null,
        id:null
      },
      search_options: [
                    { value: "ONGOING", text: "ONGOING" },
                    { value: "DAMAGED", text: "DAMAGED" },
                    { value: "RESOLVED", text: "RESOLVED" },
        ],
      issue_data:{
        endDate:"",
        status: null,
      },
      crisisOptions: {
        filterByColumn: true,
        perPage: 5,
        perPageValues: [],
        pagination: { chunk: 5, dropdown: false },
        orderBy: { ascending: true },
        skin: "table table-striped",
        filterable: ["location"],
        texts: {
          filterBy: "Search by...",
          defaultOption: "ALL",
        },
      },
      excel_fields: {
        STATUS: {
          field: "status",
          callback: (value) => {
            return value[0].title;
          },
        },
        "TRANSPORTER NAME": "transporter_name",
        "START DATE": "start_date",
        "END DATE": "end_date",
        "ISSUE NAME": "issue_name",
        "LATITUDE":"latitude",
        "LONGITUDE":"longitude",
        LOCATION: {
          field: "location",
          callback: (value) => {
            if (!value) {
              return "-";
            } else {
              return value;
            }
          },
        },
      },
    };
  },
  methods: {
    addIssue() {
      console.log("Issue Added");
    },
    updateCrisisData(){
      if(this.selectStatus == "DAMAGED"){
        this.updateColumn.status = 1
      }
      if(this.selectStatus == "ONGOING"){
        this.updateColumn.status = 0
      }
      if(this.selectStatus == "RESOLVED"){
        this.updateColumn.status = 2
      }
      routesAxios.put("/v1/api/crisis/modify", this.updateColumn).then((res)=>{
        console.log(res);
        this.$refs.crisisUpdate.hide();
        this.getCrisisData()
      })
    },
    onChangeEnd(e){
        console.log(e.target.value);
        this.updateColumn.endDate = this.$moment(e.target.value).format('YYYYMMDDHHMMSS');
        // console.log(this.start, 'Start');
    },
    getTableData(r){
      console.log(r);
      console.log(this.$refs.crisisTable);
      this.selectStatus = r.row.status[0].title
      this.updateColumn.id = r.row.id
    },
    setEnd(place) {
      console.log(place);
    },
    getCrisisData(){
      this.tableData = [];
      routesAxios.get("/v1/api/crisis/details").then((res) => {
        console.log(res);
        for(let i=0 ; i< res.data.length; i++){
          console.log(i);
          this.tableData.push({
            transporter_name:res.data[i].transporterName,
            location: res.data[i].location,
            start_date: this.$moment(res.data[i].startDate, "YYYYMMDDHHmmss").format("DD MMM, YYYY"),
            end_date: (res.data[i].endDate == null || res.data[i].endDate == "")?"Ongoing" :this.$moment(res.data[i].endDate, "YYYYMMDDHHmmss").format("DD MMM, YYYY"),
            issue_name: res.data[i].issueName,
            status:this.settingStatus(res.data[i].status),
            latitude:res.data[i].latitude,
            longitude:res.data[i].longitude,
            id:res.data[i].id
          })
        }
      });
    },
    settingStatus(status) {
      this.status = [];

      if (status == "0") {
        this.status.push({
          type: "primary",
          title: "ONGOING",
        });
      } else if (status == "1") {
        this.status.push({
          type: "danger",
          title: "DAMAGED",
        });
      } else if (status == "2") {
        this.status.push({
          type: "success",
          title: "RESOLVED",
        });
      } 
      return this.status;
    },
  },
  beforeMount() {
    this.getCrisisData()
  },
  components: { Widget },
  computed:{
    exportData() {
      if (typeof this.$refs.crisisTable !== "undefined") {
        return this.$refs.crisisTable.allFilteredData;
      } else {
        return this.tableData;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>