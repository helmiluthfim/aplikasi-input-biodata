import { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet } from "react-native";
import * as SQLite from "expo-sqlite";
import { useFocusEffect } from "expo-router";
import {
  Text,
  TextInput,
  Card,
  Button,
  Paragraph,
  Divider,
} from "react-native-paper";

interface BiodataRecord {
  id: number;
  name: string;
  gender: string;
  birthPlace: string;
  birthDate: string;
  religion: string;
  address: string;
}

type DbType = SQLite.SQLiteDatabase;

export default function Settings() {
  const [db, setDb] = useState<DbType | null>(null);
  const [biodataList, setBiodataList] = useState<BiodataRecord[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<BiodataRecord>>({});

  const getData = async () => {
    const result = await db?.getAllAsync("SELECT * FROM biodata");
    if (result) setBiodataList(result as BiodataRecord[]);
  };

  const deleteBiodata = async (id: number) => {
    await db?.runAsync("DELETE FROM biodata WHERE id = ?", [id]);
    getData();
  };

  const startEdit = (data: BiodataRecord) => {
    setEditingId(data.id);
    setEditValues(data);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({});
  };

  const saveEdit = async () => {
    if (!editingId) return;

    const {
      name = "",
      gender = "",
      birthPlace = "",
      birthDate = "",
      religion = "",
      address = "",
    } = editValues;

    await db?.runAsync(
      "UPDATE biodata SET name=?, gender=?, birthPlace=?, birthDate=?, religion=?, address=? WHERE id=?",
      [name, gender, birthPlace, birthDate, religion, address, editingId]
    );

    setEditingId(null);
    setEditValues({});
    getData();
  };

  useFocusEffect(
    useCallback(() => {
      if (db) {
        getData();
      }
    }, [db])
  );

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
      <Text style={styles.heading}>Data Biodata</Text>

      {biodataList.map((item) => (
        <Card key={item.id} style={styles.card} mode="elevated">
          <Card.Content>
            {editingId === item.id ? (
              <>
                <TextInput
                  label="Nama"
                  value={editValues.name}
                  onChangeText={(val) => setEditValues({ ...editValues, name: val })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Jenis Kelamin"
                  value={editValues.gender}
                  onChangeText={(val) => setEditValues({ ...editValues, gender: val })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Tempat Lahir"
                  value={editValues.birthPlace}
                  onChangeText={(val) => setEditValues({ ...editValues, birthPlace: val })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Tanggal Lahir"
                  value={editValues.birthDate}
                  onChangeText={(val) => setEditValues({ ...editValues, birthDate: val })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Agama"
                  value={editValues.religion}
                  onChangeText={(val) => setEditValues({ ...editValues, religion: val })}
                  style={styles.input}
                  mode="outlined"
                />
                <TextInput
                  label="Alamat"
                  value={editValues.address}
                  onChangeText={(val) => setEditValues({ ...editValues, address: val })}
                  style={styles.input}
                  mode="outlined"
                  multiline
                />

                <Card.Actions style={styles.actions}>
                  <Button mode="contained" onPress={saveEdit}>
                    Simpan
                  </Button>
                  <Button onPress={cancelEdit}>Batal</Button>
                </Card.Actions>
              </>
            ) : (
              <>
                <Paragraph><Text style={styles.label}>Nama:</Text> {item.name}</Paragraph>
                <Paragraph><Text style={styles.label}>Jenis Kelamin:</Text> {item.gender}</Paragraph>
                <Paragraph><Text style={styles.label}>TTL:</Text> {item.birthPlace}, {item.birthDate}</Paragraph>
                <Paragraph><Text style={styles.label}>Agama:</Text> {item.religion}</Paragraph>
                <Paragraph><Text style={styles.label}>Alamat:</Text> {item.address}</Paragraph>

                <Divider style={{ marginVertical: 10 }} />

                <Card.Actions style={styles.actions}>
                  <Button onPress={() => startEdit(item)}>Edit</Button>
                  <Button onPress={() => deleteBiodata(item.id)} textColor="red">
                    Hapus
                  </Button>
                </Card.Actions>
              </>
            )}
          </Card.Content>
        </Card>
      ))}

      {biodataList.length === 0 && (
        <Text style={{ marginTop: 20, textAlign: "center" }}>
          Belum ada data biodata.
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  heading: {
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
  },
  actions: {
    justifyContent: "flex-end",
    marginTop: 10,
  },
  input: {
    marginBottom: 10,
  },
});
