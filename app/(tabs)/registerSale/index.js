import { ScrollView, StyleSheet, Text, TextInput, View, Pressable,Alert, Button, SafeAreaView, Image } from 'react-native'
import React, {useEffect, useState, useRef} from 'react'
import axios from 'axios';
import {API_HOST} from '@env'
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Camera } from 'expo-camera';
import { shareAsync } from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library'

const sales = () => {
  const [timestamp, setTimestamp] = useState("");
  const [flightNumber, setFlightNumber] = useState("");
  const [route, setRoute] = useState("");
  const [barsetId, setBarsetId] = useState("");
  const [reportImage, setReportImage] = useState("");
  const [total, setTotal] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const router = useRouter();

  let cameraRef = useRef()
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
  const [photo, setPhoto] = useState();
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // useEffect(() => {
  //   (async () => {
  //     const cameraPermission = await Camera.requestCameraPermissionsAsync();
  //     const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
  //     setHasCameraPermission(cameraPermission.status === "granted");
  //     setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")

  //   })();
  // }, []);

  // if (hasCameraPermission === undefined) {
  //   return <Text>Requiriendo permisos...</Text>
  // } else if (!hasCameraPermission) {
  //   return <Text>Permisos para camara no autorizados. Por favor cambia esto en la congiguración</Text>
  // }

  const openCamera = async () => {
    const cameraPermission = await Camera.requestCameraPermissionsAsync();
    const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();

    if (cameraPermission.status === 'granted' && mediaLibraryPermission.status === 'granted') {
      setIsCameraOpen(true); // Abrimos la cámara en pantalla completa
      setHasCameraPermission(cameraPermission.status === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted")
    } else {
      Alert.alert('Permisos requeridos', 'Se necesitan permisos de cámara y galería para tomar fotos.');
    }
  };

  let takePic = async () => {
    let options = {
      quality: 1,
      base64: true, 
      exif: false
    };

    let newPhoto = await cameraRef.current.takePictureAsync(options);
    setPhoto(newPhoto);
  };

  if (photo) {
    let sharePic = () => {
        shareAsync(photo.uri).then(() => {
          setPhoto(undefined);
        })
    }

    let savePhoto = () => {
      MediaLibrary.saveToLibraryAsync(photo.uri).then(() => {
        setPhoto(undefined);
      })
    };

    return (
      <SafeAreaView style={styles.cameraContainer}>
        <Image style={styles.preview} source={{ uri: "data:image/jpg;base64," + photo.base64}}/>
        <Button title="Compartir" onPress={sharePic}/>
        {hasMediaLibraryPermission ? <Button title="Guardar" onPress={savePhoto}/> : undefined}
        <Button title="Descartar" onPress={() => setPhoto(undefined)}/>

      </SafeAreaView>
    );
  }

  const handleRegister = () => {
    // Obtenemos fecha seleccionada y agregamos la hora actual
    const timestamp = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    const saleData = {
      timestamp: timestamp,
      flightNumber: flightNumber,
      route: route,
      barsetId: barsetId,
      reportImage: reportImage,
      total: total,

    };
    
    axios.post(`${API_HOST}/index`,saleData).then((response) => {
      Alert.alert("Ingreso la venta","Ingreso correctamete");
      setTimestamp("");
      setFlightNumber("");
      setRoute("");
      setBarsetId("");
      setReportImage("");
      setTotal("");
      router.push("/(tabs)/salesReport");
    }).catch((error) => {
      Alert.alert("Error","Ingresar la venta");
      console.log("Ingresar la venta",error);
    });
  };

  if (isCameraOpen) {
    return (
      <View style={styles.cameraContainer}>
        <Camera style={styles.cameraContainer} ref={cameraRef}>
          <View style={styles.buttonContainer} >
              <Button title="Tomar foto" onPress={takePic} />
          </View>
        </Camera>
        {/* Botón para cerrar la cámara y volver al formulario */}
        <Button title="Cerrar cámara" onPress={() => setIsCameraOpen(false)} />
      </View>
    );
  } else {
    // // Si la cámara no está abierta, mostramos el formulario de venta
    return (
      <ScrollView style={{flex:1,backgroundColor:"write"}}>
        <View style={{flex: 1,backgroundColor: "#fff"}}>
          <View style={{backgroundColor: "#840032",padding: 20,}}>
            <Text style={{ fontSize: 24,color: "#fff",textAlign: "center",fontFamily: "GillSans-SemiBold",}}>Ingresa una venta</Text>
          </View>
          <View style={styles.field}>
            <Text style={styles.inputLable}>Fecha:</Text>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.textInputStyle}>
              <Text>{date.toLocaleDateString()}</Text>
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setDate(new Date(selectedDate));
                  }
                }}
                maximumDate={new Date()} // El usuario solo puede seleccionar hasta hoy.
              />
            )}
          </View>
          <View style={styles.field}>
              <Text style={styles.inputLable} ># Vuelo:</Text>
              <TextInput value={flightNumber} onChangeText={(text) => setFlightNumber(text)} style={styles.textInputStyle}  placeholderTextColor={"black"}/>
          </View>
          <View style={styles.field}>
              <Text style={styles.inputLable} >Ruta:</Text>
              <TextInput value={route} onChangeText={(text) => setRoute(text)} style={styles.textInputStyle}  placeholderTextColor={"black"}/>
          </View>
          <View style={styles.field}>
              <Text style={styles.inputLable} ># Barset:</Text>
              <TextInput value={barsetId} onChangeText={(text) => setBarsetId(text)} style={styles.textInputStyle}  placeholderTextColor={"black"}/>
          </View>
          {/* <View style={styles.field}>
              <Text style={styles.inputLable} >Imagen:</Text>
              <TextInput value={reportImage} onChangeText={(text) => setReportImage(text)} style={styles.textInputStyle}  placeholderTextColor={"black"}/>
          </View> */}
          <View style={styles.field}>
              <Text style={styles.inputLable} >Total:</Text>
              <TextInput value={total} onChangeText={(text) => setTotal(text)} style={styles.textInputStyle}  placeholderTextColor={"black"}/>
          </View>
          <View>
            <Button title="Abrir cámara" onPress={openCamera} />
          </View>
          <Pressable onPress={handleRegister} style={{backgroundColor:"#840032",padding:10,marginLeft: 40 ,marginRight: 40,justifyContent:"center",alignItems:"center",borderRadius:5,}}>
              <Text style={{fontWeight:"bold", color:"white"}}>Enviar</Text>
          </Pressable>
        </View>  
      </ScrollView>
    )
  }
}


export default sales

const styles = StyleSheet.create({
  inputLable: {
    fontSize:17,
    fontWeight:"bold",
    color:"black"
  },
  field:{
    padding:10
  },
  textInputStyle: {
    padding:10,
    borderColor:"#8A084B",
    borderWidth:1,
    marginTop:10,
    borderRadius:5
  },
  cameraContainer: {
    flex:1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%"
  },
  buttonContainer: {
    backgroundColor: '#fff',
    alignSelf: 'flex-end'
  },
  preview: {
    alignSelf: 'stretch',
    flex: 1
  }
})