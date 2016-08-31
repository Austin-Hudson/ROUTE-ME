import axios from 'axios';

export default {
  getDistanceMatrix: function(data){
    return axios.post('http://localhost:3000/distance', data)

  },
  getDirections: function(data){
    return axios.post("http://localhost:3000/directions", data)
  },
  getAllRoutes: function(){
    return axios.get('http://localhost:3000/saved-routes')
  }

}
