/**
 * Componente de la aplicación que muestra un informe de ventas y permite ver los detalles de cada venta en un modal.
 * Utiliza la librería axios para realizar una solicitud GET a la API y obtener los registros de ventas.
 * Los registros se muestran como botones en la pantalla principal y al hacer clic en ellos se abre un modal con los detalles de la venta.
 * El modal muestra información como el vuelo, número de vuelo, fecha y una imagen relacionada.
 * También proporciona opciones para descargar y cerrar el modal.
 */
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { API_HOST } from '@env'
import { useRouter } from "expo-router";
import { printToFileAsync } from "expo-print";
import { shareAsync } from "expo-sharing";


export default function app(){
  const [sales, setSales] = useState([]);
  const [input, setInput] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get(`${API_HOST}/sales`);
        setSales(response.data);
      } catch (error) {
        console.log("Error fetching records", error);
      }
    };
    fetchSalesData();

  }, []);

  console.log("Data from GET API: ", sales)

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.headerContainer}>
        {/* <Text style={styles.header}>Aqui encuentras tus ventas</Text> */}
          <Ionicons name="arrow-back" size={24} color="white" />
          <Pressable style={styles.searchFieldStyle}>
            <AntDesign style={{marginLeft: 10}} name="search1" size={20} color="#840032" />
            <TextInput 
              value={input} 
              onChangeText={(text) => setInput(text)} 
              style={{flex:1}} 
              placeholder="Buscar" 
            />
          </Pressable>
          {sales.length > 0 && (
              <View style={{marginTop: -28}}>
                <Pressable onPress={() => router.push("/(tabs)/registerSale")} >
                    <AntDesign style={{marginTop:30}} name="pluscircle" size={24} color="white" />
                </Pressable>
              </View>
            )}
      </View>

      {sales.length > 0 ? (
          // <SearchResults data={sales} input={input} setInput={setInput} />
          <FlatList data={sales} renderItem={({item}) => {
            if (item?.flightNumber.toLowerCase().includes(input.toLowerCase())){
              const dateString = item?.timestamp.split('T')[0];

              // Generate report to PDF
              const html = `
                <html>
                  <body>
                    <h1 style="
                      color: #FFFFFF; 
                      background: #840032;
                      width: 100%;
                      display: flex;
                      justify-content: center;
                    "> 
                      Reporte de venta 
                    </h1>
                    <hr/>
                    <br/>
                    <p><span style="font-weight: bold;">Ruta Vuelo:</span>${item?.route}</p>
                    <p><span style="font-weight: bold;">Número vuelo:</span>${item?.flightNumber}</p>
                    <p><span style="font-weight: bold;">Fecha:</span>${dateString}</p>
                    <p><span style="font-weight: bold;">Total:</span>${item?.total}</p>
                    <hr/>
                  </body>
                </html>
              `
              // Generate to PDF
              let generatePdf = async () => {
                const file = await printToFileAsync({
                  html:html,
                  base64: false,
                });

                await shareAsync(file.uri)
              }

              return (
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => setModalVisible(true)}
                    >
                        <FontAwesome name="plane" size={20} color="#fff" />
                        <Text style={styles.buttonText}>
                          {item?.route} ({item?.flightNumber}) - {dateString}
                        </Text>
                    </TouchableOpacity>

                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => {
                      setModalVisible(!modalVisible);
                      }}
                    >
                        <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}> <Text style={{fontWeight: "bold"}}>Ruta Vuelo:</Text> {item?.route}</Text>
                            <Text style={styles.modalText}><Text style={{fontWeight: "bold"}}>Numero Vuelo:</Text> {item?.flightNumber}</Text>
                            <Text style={styles.modalText}><Text style={{fontWeight: "bold"}}>Fecha:</Text> {dateString}</Text>
                            <Text style={styles.modalText}><Text style={{fontWeight: "bold"}}>Total:</Text> {item?.total}</Text>
                            <Image
                            style={styles.image}
                            source={{ uri: "https://picsum.photos/200/200" }}
                            />
                            <TouchableOpacity
                            style={[styles.button, styles.buttonModal]}
                            onPress={generatePdf}
                            >
                              <Text style={styles.textStyle}> <Feather name="download" size={24} color="white" /> Descargar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                            style={[styles.button, styles.buttonModal]}
                            onPress={() => setModalVisible(!modalVisible)}
                            >
                              <Text style={styles.textStyle}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                    </Modal>
                </View>
              )
            }
        }}/>
      ) : (
        <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
           <Text>No hay ventas registradas todavia</Text>
           <Text>Presiona el boton de más para añadir una venta</Text>
           <Pressable onPress={() => router.push("/(tabs)/registerSale")} >
              <AntDesign style={{marginTop:30}} name="pluscircle" size={24} color="black" />
           </Pressable>
        </View>
      )}

    </View>
  )
}

// export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#840032",
    // padding: 20,
    padding: 12, // I addeded. 
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "white"
  },
  header: {
    fontSize: 24,
    color: "#fff",
    textAlign: "center",
    fontFamily: "GillSans-SemiBold",
  },
  searchFieldStyle: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 7,
    gap:10,
    backgroundColor: "white",
    height: 40,
    borderRadius: 3,
    flex: 1,
    // width: "70%"
  },
  //Botones
  buttonContainer: {
    padding: 5,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: "#040032",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    // marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  // Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "70%",
  },
  buttonModal: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#840032",
    justifyContent: "center",
    alignItems: "center",
    width: "90%",
    padding: 10,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  image: {
    width: 100,
    height: 100,
  },
})