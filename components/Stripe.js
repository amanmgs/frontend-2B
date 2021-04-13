import React, { Component } from 'react';
import { Linking, View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, ImageBackground, Image} from 'react-native';
import { Dimensions } from 'react-native';
import Stripe from 'react-native-stripe-api';

export default class Stripepayment extends React.Component {
   constructor(props){
    super(props)
    this.state = {
      num:'', //4242424242424242
      expm:'', //4
      expy:'', //2022
      cvc:'', //314
    };
  }


submit = () =>{
const apiKey = 'sk_test_51H2jtoAgAa2kDvY2OZ8azI3GW7XcDFP9OG1TSs8NPueomokE0o2SXruaPP2aXfps3n0xqIqOiYtswtAXbugZ5nsy00rUJpCMuH';
const client = new Stripe(apiKey)

// Create a Stripe token with new card infos
if(this.state.num === null || this.state.num.length < 16){
  Alert.alert("Please Check the Card number")
}
else if (this.state.expm === null || this.state.expm.length < 1){
  Alert.alert("Please Check the month")
}
else if (this.state.expy === null || this.state.expy.length < 2){
  Alert.alert("Please Check the year")
}
else if (this.state.cvc === null){
  Alert.alert("Please Check CVC")
}
else{
client.createToken({
       number: this.state.num ,
       exp_month: this.state.expm, 
       exp_year: this.state.expy, 
       cvc: this.state.cvc,
    }).then((response)=>response)
      .then((responseJson)=>{
          console.log(responseJson)
          this.initpayment(responseJson)    
         }).catch((error)=>{
          console.error(error);
         })   
    }
}


initpayment = (responseJson) => {
const { params } = this.props.navigation.state;
const token = params ? params.token : null;
console.log(token)        
fetch('http://192.168.15.73:8000/StripeView/',{
    method:'post',
      headers: {
      'Accept':'application/json', 
      'Content-Type':'application/json',
      'Authorization': "JWT " + token
    },
    body: JSON.stringify({
      token : responseJson.id,
      amount : 10,
    })
    }).then((response)=>response.json())
      .then((responseJson)=>{
       this.setState({stripepayid:responseJson.id}, ()=>{this.Checkstatus(responseJson)})
       console.log(responseJson)
       }).catch((error)=>{
        console.error(error);
       })
}               

Checkstatus=(payment) =>{
if (payment === 'Wrong Detail'){
  Alert.alert("Payment Unsucessfull", "Please Check the data you Entered")
}
else {
  Alert.alert("Payment Sucessfull", payment.id)
  Linking.openURL(payment.receipt_url)
}
}


   render() {
      
      return (
         <View style = {styles.container}>

           <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Card Number"
               placeholderTextColor = "#808080"
               autoCapitalize = "none"
               keyboardType={'numeric'}
               onChangeText = {num=> this.setState({num})}/>
              <View>
              <View>            
              <TextInput style = {styles.input}
                 underlineColorAndroid = "transparent"
                 placeholder = "MM"
                 placeholderTextColor = "#808080"
                 keyboardType={'numeric'}
                 autoCapitalize = "none"
                 onChangeText = {expm=> this.setState({expm})}/>
              </View>
              <View>             
              <TextInput style = {styles.input}
                 underlineColorAndroid = "transparent"
                 placeholder = "YY"
                 placeholderTextColor = "#808080"
                 keyboardType={'numeric'}
                 autoCapitalize = "none"
                 onChangeText = {expy=> this.setState({expy})}/>
              </View>
              <View>             
              <TextInput style = {styles.input}
                 underlineColorAndroid = "transparent"
                 placeholder = "CVC"
                 placeholderTextColor = "#808080"
                 keyboardType={'numeric'}
                 autoCapitalize = "none"
                 onChangeText = {cvc=> this.setState({cvc})}/>
              </View> 
              </View>
              <View><TouchableOpacity
               style = {styles.button}
               onPress = {
                  () => {this.submit()}
               }>
               <Text style={{color: 'white',fontSize: 18}}>Submit</Text>
            </TouchableOpacity></View>
         </View>
      )
   }
}

const styles = StyleSheet.create({
   container: {
      flex:1,
      width:Dimensions.get('window').width,
      height:Dimensions.get('window').height,
      marginTop:'30%'
   },
   input: {
      margin: "4%",
      height: 60,
      borderColor: 'black',
      borderWidth: 1,
      color:'black',
      fontSize: 20,
      textAlign : 'center',
   },
   button: {
      backgroundColor: 'black',
      padding: 5,
      margin: "4%",
      height: 60,
      alignItems: 'center',
      justifyContent: 'center'
   }
})