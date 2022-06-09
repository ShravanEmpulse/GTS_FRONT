<template>
  <div>
    <h5 @click="goBack" class="btn btn-outline">
      <i class="la la-angle-double-left"></i> Daily Route Analysis
    </h5>
    <hr />
    <GmapMap
      v-bind:style="computedMapSize"
      style="background-color: white; overflow:hidden;"
      :zoom="zoom"
      :center="center"
      ref="map"
    >
    <GmapPolyline :path.sync="this.path" :options="options" />
    <GmapMarker v-for="(marker, index) in markers" :key="index" :icon="marker.icon" :position="marker.latLng"
                 :clickable="true" :title="marker.title" :plateNo="marker.plateNo" :gpsDtm="marker.gpsDtm" 
                  @click="markerClickEvent(marker,index)" />
                  <GmapInfoWindow :options="infoOptions" :position="infoWindowPos" :opened="infoWinOpen" @closeclick="infoWinOpen=false">  
                     <div class="infoContent" v-html="infoContent"></div>
                </GmapInfoWindow>
    </GmapMap>
    <!-- <button @click="getData">click</button> -->
  </div>
</template>

<script>
export default {
  name: "DailyRoutePlayback",
  data() {
    return {
      zoom: 5,
      center: { lat: 21.207, lng: 78.777 },
      sampleData: {
        companyId: 1002,
        transporterName: "ROHTA",
        plateNo: "NL01AB7889",
        tiNo: "D202205-04493",
        dealerCode: "E1200",
        destName: "Kolkata",
        departureCode: "HMI",
        departureDate: 20220528154738,
        eta: "20220603",
        arrivalDate: 20220601004059,
        gpsDistance: 1613.589996240431,
        actualTransitDays: 4,
        numberOfStatesCrossed: 4,
        stateCrossed: ["Andhra Pradesh", "Tamil Nadu", "West Bengal", "Orissa"],
        latLong: [
          {
            latitude: 21.5524467,
            longitude: 86.955845,
            gpsDateTime: 20220531001050,
            location: "Hotel Maa Durga, Nagram, Odisha (SE)",
          },
          {
            latitude: 13.0590133,
            longitude: 80.0783833,
            gpsDateTime: 20220529025538,
            location:
              "panimalar medical college, Banaveduthottam, Tamil Nadu (NE)",
          },
          {
            latitude: 17.3000944,
            longitude: 82.424825,
            gpsDateTime: 20220529232541,
            location: "Annavaram, Andhra Pradesh (NW)",
          },
          {
            latitude: 17.1557083,
            longitude: 82.0045267,
            gpsDateTime: 20220529214014,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531133625,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528192132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531172143,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531193638,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 21.8932067,
            longitude: 87.2637611,
            gpsDateTime: 20220531055544,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NW)",
          },
          {
            latitude: 19.1695817,
            longitude: 84.7171583,
            gpsDateTime: 20220530114013,
            location: "AH45, Orissa (SW)",
          },
          {
            latitude: 20.82994,
            longitude: 86.2005967,
            gpsDateTime: 20220530201047,
            location:
              "Maa durga store,Purna chandra sahoo, Chandipur, Odisha (NE)",
          },
          {
            latitude: 18.53319,
            longitude: 84.1641044,
            gpsDateTime: 20220530085543,
            location:
              "Srikakulam - Ichchapuram Hwy Kurudu, Andhra Pradesh (NE)",
          },
          {
            latitude: 16.7454911,
            longitude: 81.15917,
            gpsDateTime: 20220529181030,
            location:
              "Denduluru Highway Bus Stop, Uppugudem, Andhra Pradesh (SW)",
          },
          {
            latitude: 17.01841,
            longitude: 81.6836283,
            gpsDateTime: 20220529201042,
            location: "Sai Durga Hotel, Andhra Pradesh (SE)",
          },
          {
            latitude: 17.5311511,
            longitude: 82.823345,
            gpsDateTime: 20220530004037,
            location: "Chennai - Kolkata Hwy Yerravaram, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.431435,
            longitude: 87.8203233,
            gpsDateTime: 20220531102548,
            location: "Bardabarh Bus Stop, Bardabar, West Bengal (NE)",
          },
          {
            latitude: 18.251835,
            longitude: 83.7734767,
            gpsDateTime: 20220530072401,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.2832783,
            longitude: 87.3948733,
            gpsDateTime: 20220531085533,
            location:
              "Kolaghat - Pansila - Cuttack Rd, Chakturia, West Bengal (SW)",
          },
          {
            latitude: 17.6829183,
            longitude: 83.0274933,
            gpsDateTime: 20220530012538,
            location: "Chennai - Kolkata Hwy Sankaram, Andhra Pradesh (SW)",
          },
          {
            latitude: 19.535695,
            longitude: 85.0877217,
            gpsDateTime: 20220530134001,
            location: "Katikata - Jaipur Rd, Jagannathapatna, Orissa (NE)",
          },
          {
            latitude: 22.564105,
            longitude: 88.1591467,
            gpsDateTime: 20220531205553,
            location:
              "Nabghara Bus Stand, Amta-Sankrail Rd, Shekh Para, Ranihati, Howrah, West Bengal (NE)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220529015147,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 21.13242,
            longitude: 86.5570083,
            gpsDateTime: 20220530215546,
            location: "Ranital, Ranj, Orissa (NE)",
          },
          {
            latitude: 20.2341883,
            longitude: 85.7443617,
            gpsDateTime: 20220530174043,
            location:
              "Katikata - Jaipur Rd, Patrapada, Bhubaneswar, Orissa (SW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531200633,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.6540733,
            longitude: 88.3267461,
            gpsDateTime: 20220531215546,
            location: "Toll Plaza, Bally, Howrah, West Bengal (SW)",
          },
          {
            latitude: 17.97992,
            longitude: 83.4497933,
            gpsDateTime: 20220530055539,
            location:
              "Reliance Petroleum, RELIANCE PETROLEUM RETAIL OUTLET, MANDAL, Vizag, RAVADA-VILLAGE, Bhogapuram, Andhra Pradesh (SW)",
          },
          {
            latitude: 19.3656133,
            longitude: 85.01079,
            gpsDateTime: 20220530124044,
            location: "Chennai - Kolkata Hwy, Humuribana, Orissa (NE)",
          },
          {
            latitude: 14.3642083,
            longitude: 79.9297917,
            gpsDateTime: 20220529091035,
            location: "Guntur-Chennai Hwy Kakutur, Andhra Pradesh (SW)",
          },
          {
            latitude: 21.538545,
            longitude: 86.901745,
            gpsDateTime: 20220530235549,
            location:
              "Kolaghat - Pansila - Cuttack Rd, Mangalapur, Orissa (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531125419,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 13.0310417,
            longitude: 80.0316067,
            gpsDateTime: 20220528182432,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 21.4299511,
            longitude: 86.8366083,
            gpsDateTime: 20220530232547,
            location: "Badshahi Rd, Karanaghanti, Orissa (SW)",
          },
          {
            latitude: 18.3071311,
            longitude: 83.8728144,
            gpsDateTime: 20220530075541,
            location: "AH45 Srikakulam, Andhra Pradesh (SW)",
          },
          {
            latitude: 18.4547567,
            longitude: 84.0949983,
            gpsDateTime: 20220530084043,
            location: "Chinnabammidi Nimmada, Andhra Pradesh (SW)",
          },
          {
            latitude: 14.1722483,
            longitude: 79.8601333,
            gpsDateTime: 20220529081036,
            location: "Guntur-Chennai Hwy, Andhra Pradesh (NE)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531035413,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 22.6677028,
            longitude: 88.4447083,
            gpsDateTime: 20220531231050,
            location:
              "Jamia Islamia Madania Masjid, Birati, Kolkata, West Bengal (SE)",
          },
          {
            latitude: 14.2123528,
            longitude: 79.8757533,
            gpsDateTime: 20220529082534,
            location: "Chennai - Srikakulam Hwy Manubolu, Andhra Pradesh (SW)",
          },
          {
            latitude: 21.8932067,
            longitude: 87.2637611,
            gpsDateTime: 20220531071043,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NW)",
          },
          {
            latitude: 13.3464861,
            longitude: 80.14337,
            gpsDateTime: 20220529040950,
            location:
              "Hotel Dwaraka Family Restaurant, Peruvayal, Tamil Nadu (NE)",
          },
          {
            latitude: 20.0691467,
            longitude: 85.5511567,
            gpsDateTime: 20220530164011,
            location: "Chennai - Kolkata Hwy, Malipada, Orissa (NE)",
          },
          {
            latitude: 14.1128167,
            longitude: 79.877235,
            gpsDateTime: 20220529075344,
            location: "AH45 Mutyalapadu Rural, Andhra Pradesh (NW)",
          },
          {
            latitude: 19.0503583,
            longitude: 84.6359383,
            gpsDateTime: 20220530105547,
            location:
              "Sri Sai Durga Ioc Retail Outlet, Karapadu, Andhra Pradesh (NW)",
          },
          {
            latitude: 12.9947117,
            longitude: 80.0127183,
            gpsDateTime: 20220528155531,
            location:
              "Axis Bank ATM, Brakes India Ltd, No F 64, Mando, Sriperumbudur, Tamil Nadu (SW)",
          },
          {
            latitude: 20.4951983,
            longitude: 85.9203733,
            gpsDateTime: 20220530184045,
            location:
              "Goleichakk, Jagatpur Industrial Estate, Jagatpur, Orissa (NE)",
          },
          {
            latitude: 21.229565,
            longitude: 86.65481,
            gpsDateTime: 20220530222547,
            location: "Archita hotel, Unnamed Road, Chaulasabira, Odisha (SW)",
          },
          {
            latitude: 17.131005,
            longitude: 81.944215,
            gpsDateTime: 20220529211044,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (SE)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220529003647,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 21.7346983,
            longitude: 87.1389328,
            gpsDateTime: 20220531005541,
            location: "Kolaghat - Pansila - Cuttack Rd, Junbalada, Orissa (NE)",
          },
          {
            latitude: 21.8932067,
            longitude: 87.2637611,
            gpsDateTime: 20220531064044,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NW)",
          },
          {
            latitude: 15.886625,
            longitude: 80.0707267,
            gpsDateTime: 20220529141033,
            location:
              "Bollapalli Toll plaza, Anantapur - Tadipatri - Guntur Hwy, Narnevaaripalem, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.478725,
            longitude: 88.0658661,
            gpsDateTime: 20220531112409,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.4096394,
            longitude: 87.7155683,
            gpsDateTime: 20220531101048,
            location: "Badshahi Rd, Janabar, West Bengal (NW)",
          },
          {
            latitude: 19.7616933,
            longitude: 85.1948094,
            gpsDateTime: 20220530142549,
            location: "Katikata - Jaipur Rd, Gopinathpur, Orissa (SW)",
          },
          {
            latitude: 16.5242933,
            longitude: 80.6781117,
            gpsDateTime: 20220529164037,
            location: "MDR75 currency nagar Vijayawada, Andhra Pradesh (SE)",
          },
          {
            latitude: 16.7860633,
            longitude: 81.2228683,
            gpsDateTime: 20220529182541,
            location:
              "ZPP High School, Sitampeta, West Godavari, NH-5, Eluru Rajamundry Road, Gundugolanu, Gundugolanu, Andhra Pradesh (SE)",
          },
          {
            latitude: 19.1548167,
            longitude: 84.7082828,
            gpsDateTime: 20220530112548,
            location: "Chennai - Kolkata Hwy, AMIN SAHIB PETA, Odisha (SW)",
          },
          {
            latitude: 16.6231478,
            longitude: 80.9349917,
            gpsDateTime: 20220529172538,
            location:
              "Chennai - Kolkata Hwy Serinarasannapalem, Andhra Pradesh (SW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531175132,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 17.0067717,
            longitude: 81.5049333,
            gpsDateTime: 20220529194041,
            location: "SH 184, Sangaigudem, Andhra Pradesh (NE)",
          },
          {
            latitude: 13.128325,
            longitude: 80.0524383,
            gpsDateTime: 20220529031029,
            location:
              "Chennai - Thiruttani - Renigunta Hwy, Pattabiram, Tamil Nadu (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531165549,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 18.0995061,
            longitude: 83.5597878,
            gpsDateTime: 20220530064040,
            location: "Vizag - Srikakulam Hwy Vempadam, Andhra Pradesh (SW)",
          },
          {
            latitude: 15.7908917,
            longitude: 80.0380667,
            gpsDateTime: 20220529135533,
            location:
              "Guntur-Chennai Hwy Pichikalagudipadu, Andhra Pradesh (SW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531123859,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531140611,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.5813378,
            longitude: 88.44922,
            gpsDateTime: 20220601001058,
            location:
              "KFC, Ground Floor, DLF IT Park, Major Arterial Road(South-East), AF Block(Newtown), Action Area 1A, Newtown, New Town, West Bengal (SW)",
          },
          {
            latitude: 16.083955,
            longitude: 80.160155,
            gpsDateTime: 20220529144034,
            location:
              "Chennai - Kolkata Hwy Chilakaluripet, Andhra Pradesh (SW)",
          },
          {
            latitude: 18.902835,
            longitude: 84.5523844,
            gpsDateTime: 20220530102536,
            location: "AH45 Korlam, Andhra Pradesh (NW)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220529013647,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531152503,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 17.1810333,
            longitude: 82.0709783,
            gpsDateTime: 20220529221034,
            location: "Jaggampeta - Ramavaram, Andhra Pradesh (NE)",
          },
          {
            latitude: 13.8833633,
            longitude: 79.9190017,
            gpsDateTime: 20220529055524,
            location: "AH45 Juvvalapalem, Andhra Pradesh (NW)",
          },
          {
            latitude: 13.0310417,
            longitude: 80.0316067,
            gpsDateTime: 20220528183932,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 22.61952,
            longitude: 88.4632717,
            gpsDateTime: 20220531234057,
            location: "NH12, Tali Park, Newtown, New Town, West Bengal (NW)",
          },
          {
            latitude: 20.5367,
            longitude: 85.9587583,
            gpsDateTime: 20220530185545,
            location: "Odisha Hotel, Nergundi Nh16, Alarpur, Odisha (NW)",
          },
          {
            latitude: 16.665195,
            longitude: 81.0085817,
            gpsDateTime: 20220529174027,
            location:
              "Indian Oil Petrol Pump, NH-5, Eluru Vijayawada Road, Hanuman Junction, Dist, Hanuman Junction, Andhra Pradesh (SW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528190632,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531164042,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 15.1812367,
            longitude: 80.01176,
            gpsDateTime: 20220529114040,
            location:
              "Chennai - Vijayawada Hwy L Rajupalem, Andhra Pradesh (SW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531185543,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 16.394265,
            longitude: 80.54397,
            gpsDateTime: 20220529161036,
            location: "NH 16 Service Rd, Kaza, Andhra Pradesh (NE)",
          },
          {
            latitude: 16.8406061,
            longitude: 81.2789017,
            gpsDateTime: 20220529185541,
            location:
              "Eluru Gundugolanu Kovvur Rd Amberpeta, Andhra Pradesh (NE)",
          },
          {
            latitude: 20.2097533,
            longitude: 85.6950733,
            gpsDateTime: 20220530172543,
            location: "Jatani Gate, Talakheta, Ogalapada, Orissa (NE)",
          },
          {
            latitude: 15.028305,
            longitude: 79.99913,
            gpsDateTime: 20220529111039,
            location: "Guntur-Chennai Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 20.069155,
            longitude: 85.5511267,
            gpsDateTime: 20220530162521,
            location: "Chennai - Kolkata Hwy, Malipada, Orissa (NE)",
          },
          {
            latitude: 18.0592983,
            longitude: 83.5219567,
            gpsDateTime: 20220530061900,
            location: "AH45 Natavalasa, Andhra Pradesh (SW)",
          },
          {
            latitude: 18.8312283,
            longitude: 84.483295,
            gpsDateTime: 20220530101045,
            location: "Srikakulam - Ichchapuram Hwy, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.5880017,
            longitude: 88.4856483,
            gpsDateTime: 20220531235519,
            location:
              "Aliah University Rd, Kadampukur Village, Newtown, New Town, West Bengal (SE)",
          },
          {
            latitude: 14.9343833,
            longitude: 80.0091167,
            gpsDateTime: 20220529105529,
            location: "Guntur-Chennai Hwy, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531160931,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 19.3321517,
            longitude: 84.9122733,
            gpsDateTime: 20220530122543,
            location: "Chennai - Kolkata Hwy, Sindhigan, Orissa (SE)",
          },
          {
            latitude: 21.7695717,
            longitude: 87.1981567,
            gpsDateTime: 20220531011052,
            location: "Kolaghat - Pansila - Cuttack Rd, Ektali, Orissa (NE)",
          },
          {
            latitude: 22.1971867,
            longitude: 87.3897167,
            gpsDateTime: 20220531084043,
            location: "AH45, Makrampur, Gotgerya, West Bengal (SW)",
          },
          {
            latitude: 21.042215,
            longitude: 86.479445,
            gpsDateTime: 20220530212546,
            location: "Balasore - Bhadrak - Cuttack Rd, Nalanga, Orissa (SW)",
          },
          {
            latitude: 22.478705,
            longitude: 88.0658733,
            gpsDateTime: 20220531110539,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 21.17997,
            longitude: 86.5927333,
            gpsDateTime: 20220530220947,
            location: "Balasore - Bhadrak - Cuttack Rd, Markona, Orissa (NW)",
          },
          {
            latitude: 22.4556917,
            longitude: 87.9116228,
            gpsDateTime: 20220531104048,
            location: "Badshahi Rd, Chak Kamala, West Bengal (SW)",
          },
          {
            latitude: 14.5862717,
            longitude: 79.9824133,
            gpsDateTime: 20220529095538,
            location:
              "Vowel India SCHOOL, Chennai - Srikakulam Hwy, Basavaipalem, Andhra Pradesh (NE)",
          },
          {
            latitude: 20.985845,
            longitude: 86.4136867,
            gpsDateTime: 20220530211045,
            location: "AH45, Orissa (NE)",
          },
          {
            latitude: 21.3744633,
            longitude: 86.794555,
            gpsDateTime: 20220530231047,
            location: "Basudevpur - Balasore Rd, Betagadia, Orissa (SW)",
          },
          {
            latitude: 13.2272261,
            longitude: 80.1644817,
            gpsDateTime: 20220529034030,
            location:
              "10, GNT Rd, semvulivaram sholavaram, Chennai, Tamil Nadu (SE)",
          },
          {
            latitude: 17.1557083,
            longitude: 82.0045267,
            gpsDateTime: 20220529215514,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (NW)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220528233647,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 21.8932067,
            longitude: 87.2637611,
            gpsDateTime: 20220531072543,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531151002,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 17.8871144,
            longitude: 83.3303428,
            gpsDateTime: 20220530025531,
            location:
              "18/1 Anandapuram Highway Anandapuram Gudilova, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531120911,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531144110,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 21.0768883,
            longitude: 86.5073583,
            gpsDateTime: 20220530214046,
            location:
              "IOCL : Beena Filling Station, NH 5, Dhanigadia Charampa, Bhadrak, Odisha (SW)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531050623,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220529002147,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 21.2962394,
            longitude: 86.692455,
            gpsDateTime: 20220530224049,
            location: "Badshahi Rd, Soro, Orissa (SW)",
          },
          {
            latitude: 15.7334667,
            longitude: 80.0102983,
            gpsDateTime: 20220529132402,
            location: "Guntur-Chennai Hwy Medaramatla, Andhra Pradesh (NW)",
          },
          {
            latitude: 13.0310417,
            longitude: 80.0316067,
            gpsDateTime: 20220528180932,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 17.8005267,
            longitude: 83.13447,
            gpsDateTime: 20220530021040,
            location: "SH 9 Pinagadi, Andhra Pradesh (SW)",
          },
          {
            latitude: 20.6455667,
            longitude: 86.1024061,
            gpsDateTime: 20220530192456,
            location: "Balasore - Bhadrak - Cuttack Rd, Kadai, Orissa (NE)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528200632,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531180633,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528195132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528215132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531023913,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220528232147,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 17.6984717,
            longitude: 83.0224517,
            gpsDateTime: 20220530014042,
            location:
              "Chennai - Srikakulam Hwy Niddanam Doddi Chintanippula Agraharam, Andhra Pradesh (NE)",
          },
          {
            latitude: 13.1815128,
            longitude: 80.1147667,
            gpsDateTime: 20220529032529,
            location:
              "Vijaya Bank, Vel-High Tech Sri Rangarajan Shakuntala Engineering College, Vellanur, Alamadhi Road, Chennai, Tamil Nadu (SE)",
          },
          {
            latitude: 14.1128167,
            longitude: 79.877235,
            gpsDateTime: 20220529072345,
            location: "AH45 Mutyalapadu Rural, Andhra Pradesh (NW)",
          },
          {
            latitude: 21.60034,
            longitude: 87.0259083,
            gpsDateTime: 20220531002539,
            location: "Kolaghat - Pansila - Cuttack Rd, Gobinda, Orissa (NW)",
          },
          {
            latitude: 21.6757928,
            longitude: 87.0728444,
            gpsDateTime: 20220531004040,
            location: "Hotel Omm Sai, Chandansiha, Odisha (SW)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531022414,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531043934,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 22.478725,
            longitude: 88.0658661,
            gpsDateTime: 20220531113909,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 16.7373733,
            longitude: 81.07093,
            gpsDateTime: 20220529175542,
            location: "Chennai - Kolkata Hwy Duggirala, Andhra Pradesh (SW)",
          },
          {
            latitude: 13.0309994,
            longitude: 80.0316333,
            gpsDateTime: 20220529021027,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 17.227125,
            longitude: 82.22026,
            gpsDateTime: 20220529224036,
            location: "near nh 5Road, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.6434467,
            longitude: 88.4323911,
            gpsDateTime: 20220531232552,
            location:
              "Baba Temple, Airport Gate, No. 1, VIP Rd, International Airport, Dum Dum, Kolkata, West Bengal (NW)",
          },
          {
            latitude: 13.3205917,
            longitude: 80.145105,
            gpsDateTime: 20220529035530,
            location:
              "sangeetha dhaba hotel restaurant, Tiruvallur, Tamil Nadu (SE)",
          },
          {
            latitude: 20.0462733,
            longitude: 85.5319217,
            gpsDateTime: 20220530155011,
            location: "Katikata - Jaipur Rd, Jankia, Orissa (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531195132,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.6525933,
            longitude: 88.3401544,
            gpsDateTime: 20220531222556,
            location:
              "Bally, 1nochalk lane, Bally Khal, Uttarpara, West Bengal (SW)",
          },
          {
            latitude: 16.1698633,
            longitude: 80.224005,
            gpsDateTime: 20220529145534,
            location: "Guntur-Chennai Hwy Edlapadu, Andhra Pradesh (SW)",
          },
          {
            latitude: 20.9311783,
            longitude: 86.259225,
            gpsDateTime: 20220530204050,
            location:
              "Durga Mandap, Sathipur - Barundei Rd, Sathipur Chhak, Ranigoda, Odisha (SE)",
          },
          {
            latitude: 21.893195,
            longitude: 87.2642583,
            gpsDateTime: 20220531052534,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 20.16157,
            longitude: 85.6088167,
            gpsDateTime: 20220530171041,
            location:
              "GREENCHILLYZ HIGHWAY RESTAURANT, Near collector office, NH16, Khordha, Odisha (NW)",
          },
          {
            latitude: 21.8932067,
            longitude: 87.2637611,
            gpsDateTime: 20220531061043,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528230633,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 13.0037283,
            longitude: 79.9950167,
            gpsDateTime: 20220528161031,
            location:
              "State Bank of India, 18/1, Irungattukottai Sriperumpudur Taluk, National Highway 4, Mevalurkuppam, Tamil Nadu (SE)",
          },
          {
            latitude: 17.6659417,
            longitude: 82.9526078,
            gpsDateTime: 20220530011038,
            location:
              "Vijayawad Hotel - Hotel Chandra Shekar ,Kasimkota , 51031, Anakapalle Bypass, Sampatti Puram, Sampathipuram, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.58627,
            longitude: 88.2164033,
            gpsDateTime: 20220531211054,
            location:
              "Guru Nanak Public School, Andul Rd, Kamrangu, Andul, Kamrangu, Andul, Howrah, West Bengal (NW)",
          },
          {
            latitude: 18.7784817,
            longitude: 84.4019183,
            gpsDateTime: 20220530095545,
            location:
              "Srikakulam - Ichchapuram Hwy Kistupuram, Andhra Pradesh (SW)",
          },
          {
            latitude: 14.2817828,
            longitude: 79.9079417,
            gpsDateTime: 20220529085537,
            location:
              "Sri Sai Balaji family dhaba & Hotel, Gurivindapudi, Andhra Pradesh (NE)",
          },
          {
            latitude: 17.3987167,
            longitude: 82.6789817,
            gpsDateTime: 20220530000808,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 19.2589883,
            longitude: 84.77253,
            gpsDateTime: 20220530115543,
            location:
              "Trimurty Car & Care, Konishil, Konisi, Brahmapur, Odisha (NE)",
          },
          {
            latitude: 21.98954,
            longitude: 87.2993483,
            gpsDateTime: 20220531075551,
            location:
              "Kolaghat - Pansila - Cuttack Rd, Simulia Uttar Mongalmar, West Bengal (NW)",
          },
          {
            latitude: 18.2271417,
            longitude: 83.7123833,
            gpsDateTime: 20220530071040,
            location:
              "Vizag - Srikakulam Hwy Thallavalasa, Andhra Pradesh (SW)",
          },
          {
            latitude: 19.3073117,
            longitude: 84.8445183,
            gpsDateTime: 20220530121044,
            location: "AH45, Dura Bahadurpetta, Orissa (SW)",
          },
          {
            latitude: 19.4542717,
            longitude: 85.0802478,
            gpsDateTime: 20220530132540,
            location: "Chennai - Kolkata Hwy, Kalapur, Orissa (NE)",
          },
          {
            latitude: 18.7178333,
            longitude: 84.3594467,
            gpsDateTime: 20220530094034,
            location:
              "Srikakulam - Ichchapuram Hwy Savarabanapuram, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531132459,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 18.67564,
            longitude: 84.3175678,
            gpsDateTime: 20220530092544,
            location: "Srikakulam - Ichchapuram Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 13.0310417,
            longitude: 80.0316067,
            gpsDateTime: 20220528175432,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 16.9109317,
            longitude: 81.3477317,
            gpsDateTime: 20220529191041,
            location:
              "Brahmamgari Complex, Ghantavari Gudem, Andhra Pradesh (NW)",
          },
          {
            latitude: 17.8413844,
            longitude: 83.2512661,
            gpsDateTime: 20220530024041,
            location:
              "Gandigundam Pendurthi-Anandapuram Rd Gandigundam, Andhra Pradesh (SW)",
          },
          {
            latitude: 17.8878961,
            longitude: 83.335205,
            gpsDateTime: 20220530025611,
            location: "SH 9 Sontyam, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531143614,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531182453,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528213632,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 17.267995,
            longitude: 82.3843717,
            gpsDateTime: 20220529231026,
            location: "AH45, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531162543,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531032413,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 13.0310417,
            longitude: 80.0316067,
            gpsDateTime: 20220528170602,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 14.0834783,
            longitude: 79.8892667,
            gpsDateTime: 20220529062534,
            location: "Guntur-Chennai Hwy, Andhra Pradesh (NW)",
          },
          {
            latitude: 21.8252978,
            longitude: 87.2408567,
            gpsDateTime: 20220531012552,
            location:
              "Red Chilli Hotel & Resturant + Toilet & bathroom, Parhiharpur, Jaleswar, Odisha (NW)",
          },
          {
            latitude: 15.3738278,
            longitude: 80.0426483,
            gpsDateTime: 20220529121031,
            location:
              "Chennai - Vijayawada Hwy Pula Rede Palam, Andhra Pradesh (NW)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531045553,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528205132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 13.9839617,
            longitude: 79.8954567,
            gpsDateTime: 20220529061036,
            location: "Guntur-Chennai Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 22.3711067,
            longitude: 87.3705183,
            gpsDateTime: 20220531091054,
            location:
              "TATA HITACHI Construction Machinery Co Pvt Ltd Main Gate, Kharagpur Bypass, Malipur, West Bengal (SE)",
          },
          {
            latitude: 15.6704928,
            longitude: 80.0162183,
            gpsDateTime: 20220529125532,
            location:
              "BPCL Fuel Station - Manasa Enterprises, GUNTUR To ONGOLE Road, Gundlapalli, Andhra Pradesh (NW)",
          },
          {
            latitude: 20.7970333,
            longitude: 86.1463633,
            gpsDateTime: 20220530195546,
            location: "AH45, Odanga, Orissa (NE)",
          },
          {
            latitude: 17.0384094,
            longitude: 81.747385,
            gpsDateTime: 20220529202532,
            location: "Godavari Fourth Bridge Kovvur, Andhra Pradesh (NE)",
          },
          {
            latitude: 16.3861978,
            longitude: 80.5339917,
            gpsDateTime: 20220529155536,
            location: "Saibaba Temple @ kaza, Guntur, Andhra Pradesh (SW)",
          },
          {
            latitude: 19.8193517,
            longitude: 85.2691983,
            gpsDateTime: 20220530144039,
            location:
              "Harikunda Baradi, H.K Baradi, NH16, Dattapur, Odisha (SW)",
          },
          {
            latitude: 20.2889383,
            longitude: 85.8142928,
            gpsDateTime: 20220530175547,
            location: "AH45, RBI Colony, Nayapalli, Bhubaneswar, Odisha (SW)",
          },
          {
            latitude: 22.6535311,
            longitude: 88.4372683,
            gpsDateTime: 20220531225528,
            location:
              "84, Belghoria Expressway Flyover, Manikpur, Rajbari, Dum Dum, Kolkata, West Bengal (NE)",
          },
          {
            latitude: 22.1214583,
            longitude: 87.3725144,
            gpsDateTime: 20220531082542,
            location: "Bubai Shop, Bakhrabad, West Bengal (NE)",
          },
          {
            latitude: 16.2316883,
            longitude: 80.3161033,
            gpsDateTime: 20220529151035,
            location: "Guntur-Chennai Hwy Chinakondrupadu, Andhra Pradesh (SE)",
          },
          {
            latitude: 20.0462733,
            longitude: 85.5319217,
            gpsDateTime: 20220530160513,
            location: "Katikata - Jaipur Rd, Jankia, Orissa (NW)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220529000647,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528220632,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 20.0400483,
            longitude: 85.5259883,
            gpsDateTime: 20220530154041,
            location:
              "Hotel Raja Rani, Bhubaneswar - Khurdha - Brahmapur Rd, Jankia, Odisha (SW)",
          },
          {
            latitude: 18.2602017,
            longitude: 83.7882811,
            gpsDateTime: 20220530074041,
            location:
              "Chennai - Srikakulam Hwy Arinam Akkivalasa, Andhra Pradesh (SW)",
          },
          {
            latitude: 16.28033,
            longitude: 80.40706,
            gpsDateTime: 20220529152535,
            location: "MDR105 Guntur, Andhra Pradesh (SE)",
          },
          {
            latitude: 22.4847928,
            longitude: 88.10763,
            gpsDateTime: 20220531204052,
            location: "Jelatola, Fuleswar, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 19.38469,
            longitude: 85.0472333,
            gpsDateTime: 20220530131040,
            location: "SH 26, Ganjam, Orissa (SE)",
          },
          {
            latitude: 21.9067161,
            longitude: 87.2666567,
            gpsDateTime: 20220531074051,
            location:
              "Kolaghat - Pansila - Cuttack Rd, Dantan, West Bengal (SW)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531025413,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 14.1128167,
            longitude: 79.877235,
            gpsDateTime: 20220529073844,
            location: "AH45 Mutyalapadu Rural, Andhra Pradesh (NW)",
          },
          {
            latitude: 17.0481644,
            longitude: 81.8143667,
            gpsDateTime: 20220529204043,
            location:
              "Godavari Fourth Bridge Konthamuru Rajahmundry, Andhra Pradesh (SE)",
          },
          {
            latitude: 15.13242,
            longitude: 80.003475,
            gpsDateTime: 20220529112540,
            location:
              "Chennai - Vijayawada Hwy L Rajupalem, Andhra Pradesh (SW)",
          },
          {
            latitude: 19.67416,
            longitude: 85.1684233,
            gpsDateTime: 20220530141038,
            location:
              "Reliance Petrol Pump, MOUZA PATHARAKATA, P.S KHALLIKOTE, Langaleswar, Odisha (NE)",
          },
          {
            latitude: 14.683175,
            longitude: 79.97524,
            gpsDateTime: 20220529101037,
            location:
              "AH45 Sunnambhatti Village Sunnabatti, Andhra Pradesh (SW)",
          },
          {
            latitude: 13.4838883,
            longitude: 80.1017817,
            gpsDateTime: 20220529044031,
            location: "Guntur-Chennai Hwy, Tamil Nadu (SW)",
          },
          {
            latitude: 22.0744183,
            longitude: 87.3496967,
            gpsDateTime: 20220531081053,
            location:
              "????? ?????? Sitala Temple, Bara Matkatpur, West Bengal (SE)",
          },
          {
            latitude: 17.3439133,
            longitude: 82.5162817,
            gpsDateTime: 20220529234037,
            location: "NH 16, near RAMDEV MANDIR, Tuni, Andhra Pradesh (NW)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531020913,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 16.471115,
            longitude: 80.61492,
            gpsDateTime: 20220529162537,
            location: "NH 16 Service Rd, Tadepalli, Andhra Pradesh (NE)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220528235147,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220529012147,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 17.8207344,
            longitude: 83.2015217,
            gpsDateTime: 20220530022540,
            location: "SH 9 Pendurthi Visakhapatnam, Andhra Pradesh (NE)",
          },
          {
            latitude: 18.0578817,
            longitude: 83.52082,
            gpsDateTime: 20220530061039,
            location: "AH45 Natavalasa, Andhra Pradesh (SW)",
          },
          {
            latitude: 18.1578394,
            longitude: 83.6506083,
            gpsDateTime: 20220530065540,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528193632,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531014930,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 17.239565,
            longitude: 82.3188067,
            gpsDateTime: 20220529225536,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 20.0836217,
            longitude: 85.56237,
            gpsDateTime: 20220530165541,
            location: "Chennai - Kolkata Hwy, Kiajhari, Orissa (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531130919,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 21.4728361,
            longitude: 86.8832417,
            gpsDateTime: 20220530234049,
            location: "AH45, Balasore, Orissa (SW)",
          },
          {
            latitude: 19.099315,
            longitude: 84.6910733,
            gpsDateTime: 20220530111048,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 22.4786983,
            longitude: 88.06587,
            gpsDateTime: 20220531202408,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 13.6248733,
            longitude: 80.0229333,
            gpsDateTime: 20220529051032,
            location: "AH45 Tada Khandrika, Andhra Pradesh (NW)",
          },
          {
            latitude: 15.2752178,
            longitude: 80.0226517,
            gpsDateTime: 20220529115540,
            location:
              "Chennai - Vijayawada Hwy Mulaguntapadu, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531183722,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531153637,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 14.5215667,
            longitude: 79.9887383,
            gpsDateTime: 20220529094036,
            location: "Essar Petrol Pump, NH16, Andhra Pradesh (SW)",
          },
          {
            latitude: 18.964875,
            longitude: 84.5732083,
            gpsDateTime: 20220530104037,
            location: "Srikakulam - Ichchapuram Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 17.2306828,
            longitude: 82.1300161,
            gpsDateTime: 20220529222545,
            location: "AH45 Yerravaram, Andhra Pradesh (SW)",
          },
          {
            latitude: 21.8932067,
            longitude: 87.2637611,
            gpsDateTime: 20220531062543,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NW)",
          },
          {
            latitude: 19.6098617,
            longitude: 85.1184267,
            gpsDateTime: 20220530135547,
            location: "Katikata - Jaipur Rd, Kanakei, Orissa (SW)",
          },
          {
            latitude: 13.0310417,
            longitude: 80.0316067,
            gpsDateTime: 20220528172102,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 14.2414833,
            longitude: 79.886655,
            gpsDateTime: 20220529083744,
            location:
              "Chennai - Srikakulam Hwy Bandepalle, Andhra Pradesh (SW)",
          },
          {
            latitude: 18.6135117,
            longitude: 84.230655,
            gpsDateTime: 20220530091043,
            location: "AH45 Ayodhyapuram Tekkali, Andhra Pradesh (SW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531190644,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 17.9013283,
            longitude: 83.3964767,
            gpsDateTime: 20220530054038,
            location:
              "NH-16peddipalemAnandapuram Visakhapatnam, Andhra Pradesh (NE)",
          },
          {
            latitude: 13.02992,
            longitude: 80.0314417,
            gpsDateTime: 20220528162532,
            location: "Queens Land, Chembarambakkam, Tamil Nadu (NE)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220529005147,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 22.65316,
            longitude: 88.3640783,
            gpsDateTime: 20220531224059,
            location:
              "Dakhineswar, May Dibas Pally, Dakshineswar, Kolkata, West Bengal (SE)",
          },
          {
            latitude: 21.331615,
            longitude: 86.7446294,
            gpsDateTime: 20220530225546,
            location: "Hotel Jagatjanani, Keshapur, Odisha (SE)",
          },
          {
            latitude: 16.9668167,
            longitude: 81.43229,
            gpsDateTime: 20220529192540,
            location: "GNT Road, Andhra Pradesh (SW)",
          },
          {
            latitude: 17.60718,
            longitude: 82.8770433,
            gpsDateTime: 20220530005538,
            location:
              "Chennai - Srikakulam Hwy Narasingapalli, Andhra Pradesh (SW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528212132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528203632,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 13.0310417,
            longitude: 80.0316067,
            gpsDateTime: 20220528173602,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531192132,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 17.0636717,
            longitude: 81.8775983,
            gpsDateTime: 20220529205543,
            location: "AH45 Venkatapuram, Andhra Pradesh (SE)",
          },
          {
            latitude: 17.3800233,
            longitude: 82.6070883,
            gpsDateTime: 20220529235537,
            location: "Chennai - Kolkata Hwy Devavaram, Andhra Pradesh (SW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528225132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 14.1128167,
            longitude: 79.877235,
            gpsDateTime: 20220529063845,
            location: "AH45 Mutyalapadu Rural, Andhra Pradesh (NW)",
          },
          {
            latitude: 16.5168783,
            longitude: 80.7629217,
            gpsDateTime: 20220529165538,
            location: "AH45 Velpuru, Andhra Pradesh (NE)",
          },
          {
            latitude: 20.94719,
            longitude: 86.3345917,
            gpsDateTime: 20220530205545,
            location:
              "Balasore - Bhadrak - Cuttack Rd, Gandharbabindha, Orissa (SW)",
          },
          {
            latitude: 22.4752044,
            longitude: 88.0243567,
            gpsDateTime: 20220531105549,
            location:
              "Chennai - Kolkata Hwy, Chandipur, Kulgachia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 13.030135,
            longitude: 80.031525,
            gpsDateTime: 20220529022537,
            location: "Queens Land, Chembarambakkam, Tamil Nadu (NE)",
          },
          {
            latitude: 13.04481,
            longitude: 80.0674883,
            gpsDateTime: 20220529024028,
            location: "Thirumazhisai Koot Road, Thirumazhisai, Tamil Nadu (SW)",
          },
          {
            latitude: 18.40016,
            longitude: 84.0279078,
            gpsDateTime: 20220530082542,
            location: "Srikakulam-Narasannapeta Rd, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.6528433,
            longitude: 88.33263,
            gpsDateTime: 20220531221041,
            location:
              "AH1, Madhyapara, Rajchandrapur, Bally, Howrah, West Bengal (SE)",
          },
          {
            latitude: 13.7169728,
            longitude: 80.0036833,
            gpsDateTime: 20220529052533,
            location:
              "Mee Abhiruchi Restaurant, Keerthi Complex, NH16, RTA Office, Sullurupeta, Andhra Pradesh (SE)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531033913,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 17.1557083,
            longitude: 82.0045267,
            gpsDateTime: 20220529212334,
            location: "Chennai - Kolkata Hwy, Andhra Pradesh (NW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528185132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 14.7698317,
            longitude: 80.0028533,
            gpsDateTime: 20220529102537,
            location: "Guntur-Chennai Hwy, Andhra Pradesh (SW)",
          },
          {
            latitude: 20.33546,
            longitude: 85.8835444,
            gpsDateTime: 20220530181044,
            location:
              "SAHOO DELAY NEEDS. GROCERY SHOP, Utkal Heights, NEAR, Bhubaneswar, Odisha (NE)",
          },
          {
            latitude: 13.0310128,
            longitude: 80.031595,
            gpsDateTime: 20220528165132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 21.8755583,
            longitude: 87.2601817,
            gpsDateTime: 20220531014053,
            location:
              "Kolaghat - Pansila - Cuttack Rd, Ramgiri Gobindachak, West Bengal (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531173632,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528222133,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 22.4016817,
            longitude: 87.6321428,
            gpsDateTime: 20220531095549,
            location: "Tarama Nursing Home, Bishnupur, West Bengal (NW)",
          },
          {
            latitude: 21.8932067,
            longitude: 87.2637611,
            gpsDateTime: 20220531065543,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NW)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531035913,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 13.553475,
            longitude: 80.0600767,
            gpsDateTime: 20220529045531,
            location: "Guntur-Chennai Hwy Karur, Andhra Pradesh (SE)",
          },
          {
            latitude: 14.1128167,
            longitude: 79.877235,
            gpsDateTime: 20220529070844,
            location: "AH45 Mutyalapadu Rural, Andhra Pradesh (NW)",
          },
          {
            latitude: 17.4602383,
            longitude: 82.7662583,
            gpsDateTime: 20220530002538,
            location: "AH45 Dharmavaram Agraharam, Andhra Pradesh (NE)",
          },
          {
            latitude: 17.0546961,
            longitude: 81.58045,
            gpsDateTime: 20220529195531,
            location:
              "School Mess for Students, Duddukuru - Bandapuram Rd, Bandapuram, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531171042,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531041744,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 13.7893233,
            longitude: 79.9498417,
            gpsDateTime: 20220529054033,
            location: "Guntur-Chennai Hwy Yekollu, Andhra Pradesh (NW)",
          },
          {
            latitude: 15.4760117,
            longitude: 80.05874,
            gpsDateTime: 20220529122531,
            location:
              "Chennai - Vijayawada Hwy Narasa Puram, Andhra Pradesh (NE)",
          },
          {
            latitude: 15.7394844,
            longitude: 80.0215783,
            gpsDateTime: 20220529134032,
            location: "Guntur-Chennai Hwy Medaramatla, Andhra Pradesh (NE)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528202132,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 16.3048283,
            longitude: 80.48332,
            gpsDateTime: 20220529154025,
            location: "NH 16 Service Rd, Andhra Pradesh (SW)",
          },
          {
            latitude: 20.5842133,
            longitude: 86.03395,
            gpsDateTime: 20220530191046,
            location:
              "Balasore - Bhadrak - Cuttack Rd, Gopasanthapur, Orissa (SW)",
          },
          {
            latitude: 14.4300311,
            longitude: 79.9942367,
            gpsDateTime: 20220529092535,
            location: "AH45 Chintareddy Palem Nellore, Andhra Pradesh (SW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528223632,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 14.853125,
            longitude: 79.9875367,
            gpsDateTime: 20220529104040,
            location: "Guntur-Chennai Hwy, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531115113,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 15.5678044,
            longitude: 80.0476417,
            gpsDateTime: 20220529124032,
            location:
              "Chennai - Vijayawada Hwy Yedugundlapadu, Andhra Pradesh (NW)",
          },
          {
            latitude: 22.6592067,
            longitude: 88.3068583,
            gpsDateTime: 20220531214054,
            location:
              "Vision College of Management, Hathipur, Behind Mahrajpur Police Station, Off. NH2, Rajchandrapur, Bally, West Bengal (SE)",
          },
          {
            latitude: 13.4077867,
            longitude: 80.1229267,
            gpsDateTime: 20220529042531,
            location:
              "Chennai - Vijayawada Hwy, Gummidipoondi, Tamil Nadu (SE)",
          },
          {
            latitude: 21.89344,
            longitude: 87.26436,
            gpsDateTime: 20220531030914,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 22.3895383,
            longitude: 87.4598861,
            gpsDateTime: 20220531092554,
            location:
              "Kolaghat - Pansila - Cuttack Rd, Durgapur West, West Bengal (NW)",
          },
          {
            latitude: 14.1128167,
            longitude: 79.877235,
            gpsDateTime: 20220529065345,
            location: "AH45 Mutyalapadu Rural, Andhra Pradesh (NW)",
          },
          {
            latitude: 15.7332467,
            longitude: 80.01034,
            gpsDateTime: 20220529131033,
            location: "Guntur-Chennai Hwy Medaramatla, Andhra Pradesh (NW)",
          },
          {
            latitude: 20.7283433,
            longitude: 86.1402033,
            gpsDateTime: 20220530194046,
            location:
              "SWAD HOTEL AND RESTAURANT(AC), Chudakhia chhaka, Chandikhole,NH-16 side, Sarei, Odisha (NE)",
          },
          {
            latitude: 22.6061533,
            longitude: 88.2546767,
            gpsDateTime: 20220531212546,
            location:
              "Mumbai - Kolkata Hwy, Ankurhati, Howrah, West Bengal (NW)",
          },
          {
            latitude: 16.5661544,
            longitude: 80.8528467,
            gpsDateTime: 20220529171038,
            location: "K.subbarao Cloth & Fancy Stores, Atkuru, Andhra Pradesh",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531122539,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 17.757415,
            longitude: 83.0813844,
            gpsDateTime: 20220530015539,
            location:
              "Anakapalli Sabbavaram Rd Asakapalle, Andhra Pradesh (NE)",
          },
          {
            latitude: 13.0310028,
            longitude: 80.031485,
            gpsDateTime: 20220529010647,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 19.8846483,
            longitude: 85.3456711,
            gpsDateTime: 20220530145539,
            location: "Katikata - Jaipur Rd, Kuhudi, Orissa (NW)",
          },
          {
            latitude: 15.9884428,
            longitude: 80.1051117,
            gpsDateTime: 20220529142536,
            location:
              "Government Hospital, Martur., Service Rd, Martur, Andhra Pradesh (NE)",
          },
          {
            latitude: 19.9773867,
            longitude: 85.4513083,
            gpsDateTime: 20220530152521,
            location: "Katikata - Jaipur Rd, Patrapada, Orissa (SW)",
          },
          {
            latitude: 13.0310033,
            longitude: 80.031485,
            gpsDateTime: 20220528210632,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 20.8933811,
            longitude: 86.21325,
            gpsDateTime: 20220530202548,
            location: "AH45, Mirjapur, Orissa (NE)",
          },
          {
            latitude: 22.3969967,
            longitude: 87.5319883,
            gpsDateTime: 20220531094055,
            location: "Mumbai - Kolkata Hwy, Kalyanpur, West Bengal (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531135109,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 16.7860217,
            longitude: 81.22285,
            gpsDateTime: 20220529184041,
            location:
              "ZPP High School, Sitampeta, West Godavari, NH-5, Eluru Rajamundry Road, Gundugolanu, Gundugolanu, Andhra Pradesh (SE)",
          },
          {
            latitude: 19.36716,
            longitude: 85.018045,
            gpsDateTime: 20220530124247,
            location: "Chennai - Kolkata Hwy, Humuribana, Orissa (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531142150,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
          {
            latitude: 21.8932117,
            longitude: 87.2642617,
            gpsDateTime: 20220531054054,
            location:
              "Indian Oil Petrol Pump (Sankar Filling Centre), Angua, West Bengal (NE)",
          },
          {
            latitude: 19.9475583,
            longitude: 85.411115,
            gpsDateTime: 20220530151040,
            location: "Chennai - Kolkata Hwy, Chandpur, Orissa (NW)",
          },
          {
            latitude: 20.428745,
            longitude: 85.8774661,
            gpsDateTime: 20220530182544,
            location:
              "State Bank Of India Atm, Balikuda Traffic, Gopalpur, Odisha",
          },
          {
            latitude: 13.0310317,
            longitude: 80.0315983,
            gpsDateTime: 20220528163753,
            location: "Kanchipuram - Chennai Rd, Kuthambakkam, Tamil Nadu (NW)",
          },
          {
            latitude: 18.3360633,
            longitude: 83.95369,
            gpsDateTime: 20220530081042,
            location: "Srikakulam - Singupuram Rd, Andhra Pradesh (NE)",
          },
          {
            latitude: 22.47877,
            longitude: 88.065805,
            gpsDateTime: 20220531155517,
            location: "Badshahi Rd, Rauta, Uluberia, Howrah, West Bengal (NE)",
          },
        ],
      },
      latLongDataArray:[],
      markers : [],
      path:[],
      options:{strokeColor:'#E65442'},
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
    };
  },
  methods: {
    getData() {
      console.log(this.$route.params.row);
    },
    goBack() {
      this.$router.push({ name: "DailyRouteAnalysis" });
    },
    markerClickEvent(marker, idx) {
      console.log(marker);
      console.log(idx);
      // if (typeof marker.gpsDtm !== "undefined") {
      //   this.toggleInfoWindow(marker, idx);
      // } else {
      //   if (typeof marker.plateNo !== "undefined") {
      //     this.$refs.detail.toggle(marker.plateNo);
      //   }
      // }
      // this.toggleInfoWindow(marker, idx);
       if (typeof marker.gpsDtm !== "undefined") {
        this.toggleInfoWindow(marker, idx);
      }
    },
    toggleInfoWindow: function(marker, idx) {
      console.log(marker);
      let date = this.$moment(marker.gpsDtm, "YYYYMMDDHHmmss").format("YYYY-MM-DD");
      let time = this.$moment(marker.gpsDtm, "YYYYMMDDHHmmss").format("HH:mm:ss");
      // console.log(date);
      console.log(marker.title);
      this.infoWindowPos = marker.latLng;
      if(marker.title === 'Toll Info'){
        this.infoContent = `
                          <p style="text-align:center"><b style="font-size:14px">${marker.title}</b></p>
                          <hr style="margin-top:5px; margin-bottom:5px" />
                          <br/>
                          <b>Toll Charges</b>: 500
                          <br/>
                          <b>Location</b>:${marker.location}
                          <br/>
                          <b>Date</b>: ${date}
                          <br />
                          <b>Time</b>:${time}
                          <hr />
                            `
      }else{
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
            }

      if (this.currentMidx == idx) {
        this.infoWinOpen = !this.infoWinOpen;
      } else {
        this.infoWinOpen = true;
        this.currentMidx = idx;
      }
    },
  },
  computed: {
    computedMapSize() {
        this.latLongData
      return {
        width: "100%",
        height: "550px",
        border: "2px solid rgba(0, 0, 0, 0.24)",
        borderRadius: "10px",
      };
    },
    latLongData(){
        const position = [];
        let path2 = []
                // console.log(i)
                  for(let j in this.sampleData.latLong){
                        path2.push({
                        lat:this.sampleData.latLong[j].latitude,
                        lng:this.sampleData.latLong[j].longitude,
                        gpsDtm:this.sampleData.latLong[j].gpsDateTime,
                        location:this.sampleData.latLong[j].location,
                    })
                  }
                
                const getPath = path2.sort((a,b)=> a.gpsDtm - b.gpsDtm)
                console.log(getPath.length);
                //1st Day
                for(let i=0;i<=100;i++){
                    // this.path.push(getPath[i])
                    position[i]={
                        lat: getPath[i].lat,
                        lng: getPath[i].lng,
                    };

                    this.markers.push({
                        latLng  :position[i],
                        icon: {
                            url: require('../../../../assets/png/icons/marker_img1.png'),
                            scaledSize: {width: 20, height: 20, f: 'px', b: 'px',},
                        },
                        title:`${this.sampleData.plateNo}`,
                        gpsDtm: getPath[i].gpsDtm,
                        location:getPath[i].location
                    });
                    this.markers.push({
                        latLng  :{lat:getPath[70].lat, lng:getPath[70].lng},
                        icon: {
                            url: require('../../../../assets/png/icons/toll_img.png'),
                            scaledSize: {width: 25, height: 25, f: 'px', b: 'px',},
                        },
                        title:`Toll Info`,
                        gpsDtm: getPath[70].gpsDtm,
                        location:getPath[70].location
                    });
                }
                for(let i=101;i<=140;i++){
                    // this.path.push(getPath[i])
                    position[i]={
                        lat: getPath[i].lat,
                        lng: getPath[i].lng,
                    };

                    this.markers.push({
                        latLng  :position[i],
                        icon: {
                            url: require('../../../../assets/png/icons/marker_img2.png'),
                            scaledSize: {width: 20, height: 20, f: 'px', b: 'px',},
                        },
                        title:`${this.sampleData.plateNo}`,
                        gpsDtm: getPath[i].gpsDtm,
                        location:getPath[i].location
                    });

                    this.markers.push({
                        latLng  :{lat:getPath[110].lat, lng:getPath[110].lng},
                        icon: {
                            url: require('../../../../assets/png/icons/toll_img.png'),
                            scaledSize: {width: 25, height: 25, f: 'px', b: 'px',},
                        },
                        title:`Toll Info`,
                        gpsDtm: getPath[110].gpsDtm,
                        location:getPath[110].location
                    });
                }
                for(let i=141;i<=200;i++){
                    // this.path.push(getPath[i])
                    position[i]={
                        lat: getPath[i].lat,
                        lng: getPath[i].lng,
                    };

                    this.markers.push({
                        latLng  :position[i],
                        icon: {
                            url: require('../../../../assets/png/icons/marker_img3.png'),
                            scaledSize: {width: 20, height: 20, f: 'px', b: 'px',},
                        },
                        title:`${this.sampleData.plateNo}`,
                        gpsDtm: getPath[i].gpsDtm,
                        location:getPath[i].location
                    });

                    this.markers.push({
                        latLng  :{lat:getPath[150].lat, lng:getPath[150].lng},
                        icon: {
                            url: require('../../../../assets/png/icons/toll_img.png'),
                            scaledSize: {width: 25, height: 25, f: 'px', b: 'px',},
                        },
                        title:`Toll Info`,
                        gpsDtm: getPath[150].gpsDtm,
                        location:getPath[150].location
                    });
                }
                for(let i=201;i<=240;i++){
                    // this.path.push(getPath[i])
                    position[i]={
                        lat: getPath[i].lat,
                        lng: getPath[i].lng,
                    };

                    this.markers.push({
                        latLng  :position[i],
                        icon: {
                            url: require('../../../../assets/png/icons/marker_img4.png'),
                            scaledSize: {width: 20, height: 20, f: 'px', b: 'px',},
                        },
                        title:`${this.sampleData.plateNo}`,
                        gpsDtm: getPath[i].gpsDtm,
                        location:getPath[i].location
                    });

                    this.markers.push({
                        latLng  :{lat:getPath[210].lat, lng:getPath[210].lng},
                        icon: {
                            url: require('../../../../assets/png/icons/toll_img.png'),
                            scaledSize: {width: 25, height: 25, f: 'px', b: 'px',},
                        },
                        title:`Toll Info`,
                        gpsDtm: getPath[210].gpsDtm,
                        location:getPath[210].location
                    });
                }
                for(let i=241;i<313;i++){
                    // this.path.push(getPath[i])
                    position[i]={
                        lat: getPath[i].lat,
                        lng: getPath[i].lng,
                    };

                    this.markers.push({
                        latLng  :position[i],
                        icon: {
                            url: require('../../../../assets/png/icons/marker_img5.png'),
                            scaledSize: {width: 20, height: 20, f: 'px', b: 'px',},
                        },
                        title:`${this.sampleData.plateNo}`,
                        gpsDtm: getPath[i].gpsDtm,
                        location:getPath[i].location
                    });
                    this.markers.push({
                        latLng  :{lat:getPath[245].lat, lng:getPath[245].lng},
                        icon: {
                            url: require('../../../../assets/png/icons/toll_img.png'),
                            scaledSize: {width: 25, height: 25, f: 'px', b: 'px',},
                        },
                        title:`Toll Info`,
                        gpsDtm: getPath[245].gpsDtm,
                        location:getPath[245].location
                    });
                }
                // console.log(this.options);
                this.path = getPath
                this.markers.push({
                  latLng:{lat:getPath[getPath.length-1].lat, lng:getPath[getPath.length-1].lng},
                  icon: {
                          url: require('../../../../assets/png/icn_trailer_dbr.png'),
                          scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
                        },
                  title:"Plate No. : " + this.sampleData.plateNo
                })
                this.markers.push({
                  latLng:{lat:this.path[0].lat, lng:this.path[0].lng},
                  icon: {
                          url: require('../../../../assets/png/icn_factory.png'),
                          scaledSize: {width: 45, height: 45, f: 'px', b: 'px',},
                        },
                  title: this.sampleData.departureCode
                })
        for(let i in this.sampleData.latLong){
            // console.log(i);
            
                // this.latLongDataArray.push({getPath});

                // position[i]={
                //         lat: this.sampleData.latLong[i].latitude,
                //         lng: this.sampleData.latLong[i].longitude,
                //     };

                //     this.markers.push({
                //         latLng  :position[i],
                //         icon: {
                //             url: require('../../../../assets/png/icn_location_new.png'),
                //             scaledSize: {width: 25, height: 25, f: 'px', b: 'px',},
                //         },
                //         title:`${this.sampleData.plateNo}`,
                //         gpsDtm: this.sampleData.latLong[i].gpsDateTime,
                //         location:this.sampleData.latLong[i].location
                //     });
        }
                console.log(this.latLongDataArray);
    }
  },
};
</script>

<style lang="scss" scoped>
h5 {
  cursor: pointer;
}
.infoContent {
    color: #000;
    margin-bottom: 0px;
}
</style>
