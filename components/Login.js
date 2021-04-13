import React, { Component } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert} from 'react-native';
import { Dimensions } from 'react-native';

export default class Login extends React.Component {
   constructor(props){
    super(props)
    this.state = {
      Email:'',
      Password:'',
      token:'',
    }
  }


  login = () => {
  
    const {Email}= this.state;
    const {Password}=this.state;
    const {token}=this.state;
    fetch('http://192.168.15.73:8000/login/',{
      method:'post',
        headers: new Headers({
        'Accept':'application/json', 
        'Content-Type':'application/json; charset=utf-8',
      }),
      body: JSON.stringify({
        username : Email,
        password : Password,
      })
    }).then((response)=>response.json())
     .then((responseJson)=>{
      console.log(responseJson.token)
      if(responseJson == "Wrong Credentials"){
        Alert.alert("Wrong Credentials")
      }else{
        this.setState({
           token:responseJson.token
        })
        this.props.navigation.navigate('Stripe',{token:responseJson.token})
      }
     }).catch((error)=>{
      console.error(error);
     })
  }

   render() {
      return (
         <View style = {styles.container}>

            <View style = {{marginTop: "7%",}}/>
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "Mobile Number"
               placeholderTextColor = "#808080"
               autoCapitalize = "none"
               onChangeText = {Email=> this.setState({Email})}/>
            
            <TextInput style = {styles.input}
               underlineColorAndroid = "transparent"
               placeholder = "OTP"
               placeholderTextColor = "#808080"
               autoCapitalize = "none"
               secureTextEntry={true}
               onChangeText = {Password=> this.setState({Password})}/>
            
            <TouchableOpacity
               style = {styles.submitButton}
               onPress = {
                  () => this.login()
               }>
               <Text style = {styles.submitButtonText}> Login </Text>
            </TouchableOpacity>
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
   submitButton: {
      backgroundColor: 'black',
      padding: 10,
      margin: "4%",
      height: 60,
      alignItems: 'center',
   },
   submitButtonText:{
      color: 'white',
      fontSize:23
   }
})