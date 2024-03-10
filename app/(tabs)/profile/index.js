import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { Feather, Entypo } from '@expo/vector-icons';
import React from 'react'
import { LinearGradient } from 'expo-linear-gradient';

const index = () => {
  return (
    <ScrollView>
      <LinearGradient colors={["#840032", "#840032"]} style={{ flex: 1}} >
          <View style={{padding:12}}>
            <View style={{flexDirection: "row", alignItems:"center", justifyContent:"space-between"}}>
              <Feather name="bar-chart" size={24} color="white" />
              <Text style={{fontSize:16, fontWeight:"600", color:"white"}} >Manejo del sistema</Text>
              <Entypo name="lock" size={24} color="white" />
            </View>
          </View>
      </LinearGradient>
    </ScrollView>
  )
}

export default index

const styles = StyleSheet.create({})