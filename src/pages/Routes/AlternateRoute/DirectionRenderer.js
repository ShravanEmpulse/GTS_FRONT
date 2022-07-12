import { MapElementFactory } from "vue2-google-maps";

let data = [];


export {
  data
}

export default MapElementFactory({
  name: "directionsRenderer",

  ctr() {
    return window.google.maps.DirectionsRenderer;
  },

  events: [],

  mappedProps: {},

  props: {
    origin: { type: [Object, Array] },
    destination: { type: [Object, Array] },
    travelMode: { type: String },
  },

  afterCreate(directionsRenderer) {
    let directionsService = new window.google.maps.DirectionsService();
    

    this.$watch(
      () => [this.origin, this.destination, this.travelMode],
      () => {
        let { origin, destination, travelMode } = this;
        if (!origin || !destination || !travelMode) return;
        directionsService.route(
          {
            origin,
            destination,
            travelMode,  
            provideRouteAlternatives: true,
            unitSystem: google.maps.UnitSystem.METRIC,
            avoidTolls: false
          },
          (response, status) => {
            if (status !== "OK") return;
            // eslint-disable-next-line no-debugger
            // debugger
            directionsRenderer.setDirections(response);
            directionsRenderer.setOptions({polylineOptions:{strokeOpacity: 0.6,
              strokeColor: 'blue',strokeWeight: 8,}});
            
            console.log(response);
            
            let getDirection = (r) => {
              console.log(r);
              // var directionsRenderer1 = new google.maps.DirectionsRenderer({
              //   directions: r,
              //   routeIndex: 1,
              //   map: directionsRenderer.map,
              //   polylineOptions: {
              //     strokeColor: "gray"
              //   }
              // });
              // console.log("routeindex1 = ", directionsRenderer1.getRouteIndex());
            
              // var directionsRenderer2 = new google.maps.DirectionsRenderer({
              //   directions: r,
              //   routeIndex: 2,
              //   map: directionsRenderer.map,
              //   polylineOptions: {
              //     strokeColor: "gray"
              //   }
              // });
              // console.log("routeindex2 = ", directionsRenderer2.getRouteIndex()); //line
            }
            console.log(data);
            console.log(directionsRenderer);
            for (var i = 0, len = response.routes.length; i < len; i++) {
                new google.maps.DirectionsRenderer({
                    directions: response,
                    routeIndex: i,
                    strokeColor:"red"
                });
                getDirection(response);
                data.push({
                  s_no:i+1,
                  distance:response.routes[i].legs[0].distance.text,
                  duration:response.routes[i].legs[0].duration.text,
                  summary:response.routes[i].summary
                })
            }
            data = []
            // for(let j=0;j<response.routes.length; j++){
            //   console.log(j);
            //   data.push({
            //     s_no:j+1,
            //     distance:response.routes[j].legs[0].distance.text,
            //     duration:response.routes[j].legs[0].duration.text,
            //     summary:response.routes[j].summary
            //   })
            // }
          }
        );
        directionsRenderer.setPanel(document.getElementById("sidebar"));
      }
    );
  },
});

