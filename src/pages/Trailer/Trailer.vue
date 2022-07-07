<template>
  <div class="dynamic-tables">
    <h4 class="page-title">
      <span>Trailer</span>
    </h4>
    <Widget title="<h4></h4>" customHeader>
      <div class="widget-middle-overflow">
        <div class="export-button">
          <download-excel
            class="btn btn-outline-default"
            :data="exportData"
            worksheet="Trailer"
            type="csv"
            :fields="excel_fields"
            name="Trailer.csv"
          >
            EXPORT EXCEL
          </download-excel>
        </div>

        <v-client-table
          class="trailerTableClass"
          ref="trailerTable"
          :data="tableData"
          :columns="trailerColumns"
          :options="trailerOptions"
        >
          <b-button
            slot="status"
            slot-scope="props"
            :variant="props.row.status[0].type"
            class="trailer-status-badge"
            @click="getTrailerDetail(props.row)"
            v-b-modal.detail
            >{{ props.row.status[0].title }}</b-button
          >
          <a class="item-count" slot="item" slot-scope="props">{{
            props.row.item
          }}</a>
          <p slot="location" slot-scope="props">
            {{ getLocation(props.row.location) }}
          </p>
          <b-button
            class="btn-outline-warning"
            slot="edit"
            slot-scope="props"
            @click="getData(props.row)"
            v-b-modal.edit
          >
            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
          </b-button>
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
      <form @submit.prevent="updateStatus()" class="edit-modal">
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
          <label for="remarks">Remarks</label>
          <textarea
            v-model="remarksInput"
            type="text"
            id="remarks"
            name="remarks"
            class="form-control"
            placeholder="Enter Remarks"
          ></textarea>
        </div>
        <div class="mt-4 update">
          <button @type="updateStatus()" class="btn btn-primary update_button">
            Update
          </button>
        </div>
      </form>
    </b-modal>
    <b-modal
      id="detail"
      size="lg"
      title="Trailer Detail"
      body-class="bg-white"
      hide-footer
    >
      <div class="trailerDetail">
        <br />
        <header>
          <b-row>
            <b-col md="6" xs="12" class="b-col-print-6">
              <h5>
                <span class="fw-semi-bold">{{ trailerInfo.ti_no }}</span>
              </h5>
            </b-col>
          </b-row>
        </header>
        <br />
        <section>
          <b-row class="mb-lg">
            <b-col sm="12" class="b-col-print-12">
              <h5 class="no-margin">Glovis</h5>
              <h3 class="company-name m-t-1 fw-semi-bold">
                {{ trailerInfo.departure }}
              </h3>
              <address>
                PLATE NO: <strong>{{ trailerInfo.plate_no }}</strong
                ><br />
                TP VENDOR: <strong>{{ trailerInfo.tp_vendor }}</strong
                ><br />
                DEPARTURE DATE:<strong> {{ trailerInfo.departure_date }}</strong
                ><br />
                LOCATION:<strong>
                  {{ getLocation(trailerInfo.location) }}</strong
                ><br />
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
              <th>{{ this.itmeNo }}</th>
              <th class="hidden-sm-down">MODEL NAME</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in invoiceDetail" :key="index">
              <td v-if="row.goodsCode == 'V'"><i class="fa fa-car" /></td>
              <td v-if="row.goodsCode == 'P'"><i class="fa fa-gear" /></td>
              <td>{{ row.destName }}</td>
              <td>{{ row.dealerName }}</td>
              <td>{{ parseDateforETA(row.eta) }}</td>
              <td>{{ row.itemNo }}</td>
              <td>{{ row.itemName }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </b-modal>

    <loading :show="loadingShow" :label="loadingLabel" loader-class="loading">
    </loading>
  </div>
</template>
<script>
import Widget from "@/components/Widget/Widget";

export default {
  name: "Trailer",
  components: { Widget },
  data() {
    return {
      /* LOADING */
      loadingShow: false,
      loadingLabel: "Loading...",
      tableData: [],
      status: [],
      remarksInput: "",
      // isModelVisible: false,
      statusPlateNo: "",
      setDrivingStatus: "",
      edit_options: [
        { value: "NONE", text: "NONE" },
        { value: "TRANSIT", text: "TRANSIT" },
        { value: "ARRIVAL", text: "ARRIVAL" },
        { value: "IDLE", text: "IDLE" },
        { value: "DELAY", text: "DELAY" },
        { value: "STANDBY", text: "STANDBY" },
      ],
      edit_selected: "IDEL",
      remarksValue: "",
      trailerColumns: [
        "plate_no",
        "transporter_code",
        "transporter_name",
        "ti_no",
        "departure_date",
        "eta",
        "destination",
        "location",
        "status",
        "remarks",
        "edit",
      ],
      trailerOptions: {
        filterByColumn: true,
        perPage: 10,
        perPageValues: [],
        pagination: { chunk: 5, dropdown: false },
        orderBy: { ascending: true },
        skin: "table table-striped",
        filterable: [
          "plate_no",
          "ti_no",
          "transporter_code",
          "transporter_name",
          "departure_date",
          "eta",
          "destination",
          "location",
          "status",
        ],
        texts: {
          filterBy: "Search by...",
          defaultOption: "ALL",
        },
      },
      invoiceDetail: [],
      trailerInfo: [],
      excel_fields: {
        STATUS: {
          field: "status",
          callback: (value) => {
            return value[0].title;
          },
        },
        "TP VENDOR": "tp_vendor",
        "PLATE NO": "plate_no",
        "TI NO": "ti_no",
        "TRANSPORTER NAME": "transporter_name",
        "TRANSPORTER CODE": "transporter_code",
        "DEPARTURE DATE": "departure_date",
        DEPARTURE: "departure",
        ETA: "eta",
        REMARKS:"remarks",
        DESTINATION: "destination",
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
      itmeNo: "ITEM NO",
    };
  },
  created() {
    this.getTrailerInfo();
  },
  mounted() {
    if (this.$route.params.status) {
      this.setFilter(this.$route.params.status);
    }
  },
  computed: {
    exportData() {
      if (typeof this.$refs.trailerTable !== "undefined") {
        return this.$refs.trailerTable.allFilteredData;
      } else {
        return this.tableData;
      }
    },
  },
  methods: {
    parseDateforETA(date) {
      return this.$moment(date, "YYYYMMDD").format("DD MMM, YYYY");
    },
    parseDateforDepDate(date) {
      return this.$moment(date, "YYYYMMDDHHmmss").format("DD MMM, YYYY");
    },
    updateStatus() {
      console.log(this.statusPlateNo);
      if (this.edit_selected == "NONE") {
        this.setDrivingStatus = "0";
      } else if (this.edit_selected == "TRANSIT") {
        this.setDrivingStatus = "1";
      } else if (this.edit_selected == "ARRIVAL") {
        this.setDrivingStatus = "2";
      } else if (this.edit_selected == "IDLE") {
        this.setDrivingStatus = "3";
      } else if (this.edit_selected == "DELAY") {
        this.setDrivingStatus = "4";
      } else if (this.edit_selected == "STANDBY") {
        this.setDrivingStatus = "5";
      }

      const data = {
        plateNo: this.statusPlateNo,
        remarks: this.remarksInput,
        // drivingStatus: (this.edit_selected == "NONE")?"0":(this.edit_selected == "TRANSIT")?"1":(this.edit_selected == "ARRIVAL")?"2":(this.edit_selected == "IDLE")?"3":(this.edit_selected == "DELAY")?"4":(this.edit_selected == "STANDBY")?"5":"0",
        drivingStatus:this.setDrivingStatus
      };
      this.$axios
        .put(
          `/api/trailer/updateStatus?plateNo=${data.plateNo}&remarks=${data.remarks}&drivingStatus=${data.drivingStatus}`
        )
        .then((res) => {
          console.log(res);
          // this.isModelVisible = false;
          this.$refs.tableModal.hide()
          this.getTrailerInfo();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getData(row) {
      console.log(row);
      // this.isModelVisible = true;
      this.edit_selected = row.status[0].title;
      this.remarksInput = row.remarks;
      this.statusPlateNo = row.plate_no;
      
    },
    getTrailerInfo() {
      this.tableData = [];
      this.loadingShow = true;
      this.$axios
        .get("/api/trailer/trailerInfo")
        .then((response) => {
          this.loadingShow = false;
          const data = response.data.resultBody;
          console.log(response);

          for (let i in data) {
            if (data[i].destCount == 1) {
              this.tableData.push({
                status: this.settingStatus(data[i].drivingStatus),
                tp_vendor: data[i].transporterName,
                plate_no: data[i].plateNo,
                transporter_name: data[i].transporterName,
                transporter_code: data[i].transporterCode,
                ti_no: data[i].tiNo,
                departure_date: data[i].departureDate,
                departure: data[i].departureName,
                eta: data[i].eta,
                destination: data[i].destName,
                shippingId: data[i].shippingId,
                location: data[i].location,
                remarks: data[i].remarks,
              });
            } else {
              this.tableData.push({
                status: this.settingStatus(data[i].drivingStatus),
                tp_vendor: data[i].transporterName,
                transporter_name: data[i].transporterName,
                transporter_code: data[i].transporterCode,
                plate_no: data[i].plateNo,
                ti_no: data[i].tiNo,
                departure_date: data[i].departureDate,
                departure: data[i].departureName,
                eta: data[i].eta,
                destination:
                  data[i].destName + " and " + (data[i].destCount - 1),
                shippingId: data[i].shippingId,
                location: data[i].location,
                remarks: data[i].remarks,
              });
            }
          }
        })
        .catch((ex) => {
          console.log(ex);
          this.loadingShow = false;
        });
    },
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
    getTrailerDetail(trailerInfo) {
      this.loadingShow = true;
      this.$axios
        .get("/api/trailer/invoiceDetail", {
          params: {
            plateNo: trailerInfo.plate_no,
            shippingId: trailerInfo.shippingId,
          },
        })
        .then((response) => {
          this.loadingShow = false;
          this.trailerInfo = trailerInfo;
          this.invoiceDetail = response.data.resultBody;

          if (this.invoiceDetail[0].goodsCode == "V") {
            this.itmeNo = "VIN";
          } else if (this.invoiceDetail[0].goodsCode == "P") {
            this.itmeNo = "ITEM NO";
          }
        })
        .catch((ex) => {
          console.log(ex);
          this.loadingShow = false;
        });
    },
    setFilter(paramStatus) {
      this.$refs.trailerTable.setFilter({
        status: paramStatus,
      });
    },
    getLocation(location) {
      if (!location) {
        return "-";
      } else {
        return location;
      }
    },
  },
};
</script>
<style src="./Trailer.scss" lang="scss" />
