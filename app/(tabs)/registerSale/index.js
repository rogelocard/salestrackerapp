import { ScrollView, StyleSheet, Text, TextInput, View, Pressable,Alert } from 'react-native'
import React, {useState} from 'react'
import axios from 'axios';
import {API_HOST} from '@env'

const sales = () => {
  const [saleId, setSaleId] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [route, setRoute] = useState("");
  const [barsetId, setBarsetId] = useState("");
  const [reportImage, setReportImage] = useState("");
  const [total, setTotal] = useState("");

  const handleRegister = () => {
    const saleData = {
      saleId: saleId,
      timestamp: timestamp,
      flightNumber: flightNumber,
      route: route,
      barsetId: barsetId,
      reportImage: reportImage,
      total: total,

    };
    axios.post(`${API_HOST}/index`,saleData).then((response) => {
      Alert.alert("Ingreso la venta","Ingreso correctamete");
      setSaleId("");
      setTimestamp("");
      setFlightNumber("");
      setRoute("");
      setBarsetId("");
      setReportImage("");
      setTotal("");
    }).catch((error) => {
      Alert.alert("Error","Ingresar la venta");
      console.log("Ingresar la venta",error);
    });
  };

  return (
    <ScrollView style={{flex:1,backgroundColor:"write"}}>
      <View style={{flex: 1,backgroundColor: "#fff"}}>
        <View style={{backgroundColor: "#8A084B",padding: 20,}}>
          <Text style={{ fontSize: 24,color: "#fff",textAlign: "center",fontFamily: "GillSans-SemiBold",}}>Ingresa la Ventas</Text>
        </View>
        <View style={{padding:10}}>
            <Text style={{fontSize:17,fontWeight:"bold",color:"#8A084B"}} >Fecha:</Text>
            <TextInput value={timestamp} onChangeText={(text) => setTimestamp(text)} style={{padding:10,borderColor:"#8A084B",borderWidth:1,marginTop:10,borderRadius:5}} placeholderTextColor={"black"}/>
        </View>
        <View style={{padding:10}}>
            <Text style={{fontSize:17,fontWeight:"bold",color:"#8A084B"}} ># Vuelo:</Text>
            <TextInput value={flightNumber} onChangeText={(text) => setFlightNumber(text)} style={{padding:10,borderColor:"#8A084B",borderWidth:1,marginTop:10,borderRadius:5}}  placeholderTextColor={"black"}/>
        </View>
        <View style={{padding:10}}>
            <Text style={{fontSize:17,fontWeight:"bold",color:"#8A084B"}} >Ruta:</Text>
            <TextInput value={route} onChangeText={(text) => setRoute(text)} style={{padding:10,borderColor:"#8A084B",borderWidth:1,marginTop:10,borderRadius:5}}  placeholderTextColor={"black"}/>
        </View>
        <View style={{padding:10}}>
            <Text style={{fontSize:17,fontWeight:"bold",color:"#8A084B"}} ># Barset:</Text>
            <TextInput value={barsetId} onChangeText={(text) => setBarsetId(text)} style={{padding:10,borderColor:"#8A084B",borderWidth:1,marginTop:10,borderRadius:5}}  placeholderTextColor={"black"}/>
        </View>
        <View style={{padding:10}}>
            <Text style={{fontSize:17,fontWeight:"bold",color:"#8A084B"}} >Imagen:</Text>
            <TextInput value={reportImage} onChangeText={(text) => setReportImage(text)} style={{padding:10,borderColor:"#8A084B",borderWidth:1,marginTop:10,borderRadius:5}}  placeholderTextColor={"black"}/>
        </View>
        <View style={{padding:10}}>
            <Text style={{fontSize:17,fontWeight:"bold",color:"#8A084B"}} >Total:</Text>
            <TextInput value={total} onChangeText={(text) => setTotal(text)} style={{padding:10,borderColor:"#8A084B",borderWidth:1,marginTop:10,borderRadius:5}}  placeholderTextColor={"black"}/>
        </View>
        <Pressable onPress={handleRegister} style={{backgroundColor:"#8A084B",padding:10,marginLeft: 40 ,marginRight: 40,justifyContent:"center",alignItems:"center",borderRadius:5,}}>
            <Text style={{fontWeight:"bold", color:"white"}}>Enviar</Text>
        </Pressable>
      </View>  
    </ScrollView>
  )
}


export default sales

const styles = StyleSheet.create({})