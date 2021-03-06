import React, {Component}         from 'react';
import utils                      from '../utils/helper.js'
import { Link }                   from 'react-router';
import Background                 from './Background.js';
import {Map, Marker, InfoWindow}  from 'google-maps-react';
import Directions                 from './Directions.js';
import '../css/search.css';

class SavedRoutes extends Component {

  constructor(props){
    super(props);
    this.state = {
      directions: ""
    }
  }

  makeMap(){
    const shortestPath = this.props.shortestPath;
    const latLongs = this.props.locations;
    let startLocation = [];
    let middle_locations = [];
    let endLocation = [];

    let locations = latLongs.map(function(marker, index){
      let name, lat, long;

        if(index === 0){
          name = shortestPath[0];
          lat = marker.lat;
          long = marker.lng;
          startLocation.push({name: name, lat:lat, long:long});
        }

        //it's the middle routes need to map over them
        if(index === 1){
          console.log("MARKER", marker);
          for(let prop in marker){
            let temp = marker[prop];
            for(let geo in temp){
              let midLoc = [];
              lat = temp[geo].lat;
              long = temp[geo].lng;
              name = geo;
              midLoc.push({name:name, lat:lat, long:long});
              middle_locations.push(midLoc);
            }
          }
        }

        if(index === 2){
          name = shortestPath[shortestPath.length-1];
          lat = marker.lat;
          long = marker.lng;
          endLocation.push({name: name, lat:lat, long:long});
      }
    })

    let start = startLocation.map(function(loc, index){
      let name, lat, long;
      name = loc.name;
      lat = loc.lat;
      long = loc.long;

      return(
        <Marker key={name}
        name={name}
        position={{lat: lat, lng: long}} />
      )
    })

    let end = endLocation.map(function(loc, index){
      let name, lat, long;
      name = loc.name;
      lat = loc.lat;
      long = loc.long;

      return(
        <Marker key={name}
        name={name}
        position={{lat: lat, lng: long}} />
      )
    })

    let middle = middle_locations.map(function(loc, index){
      let middleMarker = [];
      let m = loc.map(function(a, b){
        let name, lat, long;
        name = a.name;
        lat = a.lat;
        long = a.long;
        console.log(name, lat, long);
        return(
          <Marker key={b}
          name={name}
          position={{lat: lat, lng: long}} />
        )
      })

      middleMarker.push(m);

      return(
        middleMarker
      )

    })
    let startLat = "";
    let startLong = "";
    let lox = this.props.locations[0];
    for(let l in lox){
      if(l === "lat"){
        startLat = lox[l];
      }
      if(l === "lng"){
        startLong = lox[l]
      }
    }

    return(
        <Map center={{lat: startLat, lng: startLong}} zoom={9}
          containerStyle={
           {width: '45%', height: '60%', position: 'fixed',
}}
           style={
              {
                boxShadow: "-10px 3px 70px -5px rgba(68,85,102,0.71)",
                borderRadius: '5px',
                border: '1px solid lightblue'
              }
            }
            google={window.google}>
              {start}
              {middle}
              {end}
        </Map>
    )
  }


  viewDirections(){
    let data = {
      route: this.props.shortestPath
    }

    utils.getDirections(data).then((res) => {
      console.log("res", res.data.routes[0].legs);
      this.setState({directions: res.data.routes[0].legs})
    })
  }

  render() {
    const shortestPath = this.props.shortestPath;
    const length = shortestPath.length;
    const directions = this.state.directions;
    const dLength = directions.length;
    return (
      <div>
        <div>
        {length > 0 ? this.makeMap() : ""}
        </div>

        <div>
          {dLength > 0 ? <Directions directions={directions} shortestPath={shortestPath} /> : "" }
          {length > 0 ?
            <button className="directions-button" onClick={(event)=>this.viewDirections()}>View Directions</button> : ""}
        </div>
      </div>
    );
  }
}

export default SavedRoutes;
