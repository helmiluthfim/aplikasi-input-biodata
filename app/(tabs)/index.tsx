import React, { useState, useEffect, useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Platform,
  View,
} from "react-native";
import * as SQLite from "expo-sqlite";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import RadioGroup, { RadioButtonProps } from "react-native-radio-buttons-group";
import {
  TextInput,
  Button,
  Text,
  Card
} from "react-native-paper";

type DbType = SQLite.SQLiteDatabase;

export default function Home() {
  const [db, setDb] = useState<DbType | null>(null);
  const [name, setName] = useState("");
  const [gender, setGender] = useState("L");
  const [selectedGenderId, setSelectedGenderId] = useState("L");
  const [birthPlace, setBirthPlace] = useState("");
  const [birthDate, setBirthDate] = useState(new Date());
  const [religion, setReligion] = useState("Islam");
  const [address, setAddress] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const genderOptions: RadioButtonProps[] = useMemo(
    () => [
      {
        id: "L",
        label: "Laki-laki",
        value: "L",
        color: "#007AFF",
        labelStyle: { fontSize: 16 },
        containerStyle: { marginRight: 20 },
      },
      {
        id: "P",
        label: "Perempuan",
        value: "P",
        color: "#007AFF",
        labelStyle: { fontSize: 16 },
      },
    ],
    []
  );

  const handleGenderChange = (selectedId: string) => {
    setSelectedGenderId(selectedId);
    const selected = genderOptions.find((btn) => btn.id === selectedId);
    if (selected?.value) setGender(selected.value);
  };

  const handleSubmit = async () => {
    await db?.runAsync(
      "INSERT INTO biodata (name, gender, birthPlace, birthDate, religion, address) VALUES (?, ?, ?, ?, ?, ?)",
      [
        name,
        gender,
        birthPlace,
        birthDate.toISOString().split("T")[0],
        religion,
        address,
      ]
    );
    alert("Data berhasil disimpan!");
    clearForm();
  };

  const clearForm = () => {
    setName("");
    setGender("L");
    setSelectedGenderId("L");
    setBirthPlace("");
    setBirthDate(new Date());
    setReligion("Islam");
    setAddress("");
  };

  useEffect(() => {
    const initDb = async () => {
      const newDb = await SQLite.openDatabaseAsync("db.db");
      setDb(newDb);
      await newDb.execAsync(`
        CREATE TABLE IF NOT EXISTS biodata (
          id INTEGER PRIMARY KEY NOT NULL,
          name TEXT,
          gender TEXT,
          birthPlace TEXT,
          birthDate TEXT,
          religion TEXT,
          address TEXT
        );
      `);
    };
    initDb();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card mode="outlined" style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <Text style={styles.title}>Form Biodata</Text>

          <TextInput
            label="Nama"
            value={name}
            mode="outlined"
            onChangeText={setName}
            style={styles.input}
          />

          <Text style={styles.label}>Jenis Kelamin</Text>
          <View style={{ marginBottom: 12 }}>
            <RadioGroup
              radioButtons={genderOptions}
              onPress={handleGenderChange}
              selectedId={selectedGenderId}
              layout="row"
            />
          </View>

          <TextInput
            label="Tempat Lahir"
            value={birthPlace}
            mode="outlined"
            onChangeText={setBirthPlace}
            style={styles.input}
          />

          <Text style={styles.label}>Tanggal Lahir</Text>
          <Button
            mode="outlined"
            onPress={() => setShowDatePicker(true)}
            style={styles.input}
          >
            {birthDate.toDateString()}
          </Button>
          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="default"
              value={birthDate}
              onChange={(event, selectedDate) => {
                setShowDatePicker(Platform.OS === "ios");
                if (selectedDate) setBirthDate(selectedDate);
              }}
            />
          )}

          <Text style={styles.label}>Agama</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={religion}
              onValueChange={(itemValue) => setReligion(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Islam" value="Islam" />
              <Picker.Item label="Kristen" value="Kristen" />
              <Picker.Item label="Katolik" value="Katolik" />
              <Picker.Item label="Hindu" value="Hindu" />
              <Picker.Item label="Buddha" value="Buddha" />
              <Picker.Item label="Konghucu" value="Konghucu" />
            </Picker>
          </View>

          <TextInput
            label="Alamat"
            value={address}
            mode="outlined"
            multiline
            onChangeText={setAddress}
            style={[styles.input, { height: 80 }]}
          />

          <Button mode="contained" onPress={handleSubmit} style={{ marginTop: 10 }}>
            Simpan Biodata
          </Button>
        </Card.Content>
      </Card>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f2f2f2",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  cardContent: {
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    paddingHorizontal: 10,
  },
});

