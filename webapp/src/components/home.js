import React, { Component } from 'react';
import {bindActionCreators} from 'redux';
import { connect } from 'react-redux';
import parking from '../parking.png';
import GoogleMapReact from 'google-map-react';
import ReactDOM from 'react-dom';
import "../App.css";

 
import * as Actions from '../actions';
 
const AnyReactComponent = ({ text }) => <div style={{
    position: 'relative', color: 'white', background: 'red',
    height: 40, width: 40, top: -20, left: -30,    
  }}>
    {text}
  </div>;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state={
            data:props.data
        }
    }

    static defaultProps = {
        center: {lat: 37.349507 , lng: -121.937510},
        zoom: 17
      };    
    hello(){
        this.props.getData(); 
    }
    componentWillMount() {
        this.props.getData();
        this.setState({
            data:this.props.data
        })
    }

    checktime(data){
        data.sort(function(a, b){
            var keyA = a.spot,
                keyB = b.spot;
            // Compare the 2 dates
            if(keyA < keyB) return -1;
            if(keyA > keyB) return 1;
            return 0;
        });
        var ans = []
        for(var i = 0;i < 2;i++){
            if(data[i]){
                if(i+1 != data[i].spot){
                    ans.push("greenStatus");
                }else{
                    var curr = new Date();
                    var olddate = new Date(data[i].createDate);
                    var temp = Math.abs(curr - olddate)/1000;
                    console.log(temp)
                    if(temp > 270){
                        ans.push("blackStatus")
                    }else if(temp > 240){
                        ans.push("redStatus")
                    }else{
                        ans.push("whiteStatus")
                    }
                }
            }else{
                ans.push("greenStatus");
            }
        }
        console.log(ans)
        return ans
    }
 
    render() {
        var parkingdata =[ "Parking Hours : 8 AM to 12 PM",
        "Parking Time Limit : 2 hours", 
        "Parking fee : 10$ for 4 hours", "Valet Parking also available" ];
        var colors = ["green", "red","black","white"]
        var status = ["Spot Available", "Time over for car parked", "Car getting towed","Car Parked at spot"];
        const listAnnotations = status.map((numbers,i) =>
            <span className="annotations"><div width="10" height="10" className={colors[i]} /><span className="textspan">{numbers}</span></span>
        );

        var parkstatus;
        if(this.props.data.data){
            const ans = this.checktime(this.props.data.data)
            parkstatus = ans.map((ans,i) =>
            <span className="annotations"><div width="10" height="10" className={ans}>{i+1}</div></span>
        );
        }

        const listItems = parkingdata.map((numbers,i) =>
            <li key={i}><h3>{numbers}</h3></li>
        );
        return (
            <div className="mainDiv">
            <div className="bodyDiv">
                <img src={parking} alt="boohoo" className="img-responsive"/>
                
                <h1>Parking Ninja's Web Portal - Smart Hassle free parking solution</h1>
             
            </div>
            <div className="left" id="hello">
                <h1>Parking Garage Information</h1>
                <ul>{listItems}</ul>
            </div>
            <div className="right">{this.props.data.data && 
                <div className="map">
                <h3>Annotations:</h3>
                {listAnnotations}
                <div>
                </div>
                <h1 className="header">Parking Status now:</h1>
                <div className="parkstatus">
                {parkstatus}
                </div>
                <div className="maps">
                <GoogleMapReact
                bootstrapURLKeys={{ key: "AIzaSyB3PrPhxDdHUqHKAigmi8FFXUlpktLm2nY" }}
                    defaultCenter={this.props.center}
                    defaultZoom={this.props.zoom}
                >
                <AnyReactComponent
                    lat={37.349507 }
                    lng={-121.937510}
                    text={'Parking Garage'}
                    />
                </GoogleMapReact>
                </div>
                </div>
            }
            </div></div>
            
        )
    }
};
 
 
function mapStateToProps(state, props) {
    return {
        data: state.dataReducer.data
    }
}
 
function mapDispatchToProps(dispatch) {
    return bindActionCreators(Actions, dispatch);
}
 
//Connect everything
export default connect(mapStateToProps, mapDispatchToProps)(Home);