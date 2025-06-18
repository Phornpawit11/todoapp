import { IconSymbol } from "@/components/ui/IconSymbol";
import { TodoListModel } from "@/models/todolist.model";
import { AppKeys } from "@/untils/AppKeys";
import { boxShadow, margin, padding } from "@/untils/mixins";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
export default function HomeScreen() {
  const [todoList, setTodoList] = useState<TodoListModel[]>([]);
  const [todoText, setTodoText] = useState("");
  const onChangedText = (text: string) => {
    setTodoText(text);
  };
  const handleAddTodo = () => {
    if (todoText.trim() === "") {
      alert("Todo text cannot be empty");
    }

    const newTodo: TodoListModel = {
      id: generateuid(),
      title: todoText,
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
    };
    saveTodoList([...todoList, newTodo]);
    setTodoText("");
  };

  const handleDeleteTodo = (id: number) => {
    Alert.alert("ลบ", "ต้องการลบหรือไม่?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          const updateData = todoList.filter((todo) => todo.id !== id);
          saveTodoList(updateData);
        },
      },
    ]);
  };
  const handleToggleComplete = (id: number) => {
    const updatedTodos = todoList.map((todo) => {
      if (todo.id !== id) {
        return todo;
      } else {
        return {
          ...todo,
          completed: !todo.completed,
          updatedAt: new Date(),
        };
      }
    });
    saveTodoList(updatedTodos);
  };
  const saveTodoList = async (data: TodoListModel[]) => {
    try {
      setTodoList(data);
      await AsyncStorage.setItem(
        AppKeys.LOCAL_STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (error) {
      console.error("Error saving todo list:", error);
    }
  };
  const fetchTodoList = async () => {
    AsyncStorage.getItem(AppKeys.LOCAL_STORAGE_KEY)
      .then((result) => {
        if (result) {
          setTodoList(JSON.parse(result));
        }
      })
      .catch((err) => {});
  };
  const generateuid = () => {
    return Math.floor(Math.random() * 1000000);
  };
  useEffect(() => {
    fetchTodoList();

    return () => {
      setTodoList([]);
    };
  }, []);
  const sortedList = useMemo(
    () =>
      todoList.sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }),
    [todoList]
  );
  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 16 }}>
        <TextInput
          value={todoText}
          style={styles.textInputContainer}
          placeholder="เพิ่ม Todo ใหม่"
          onChangeText={onChangedText}
        />
        <TouchableOpacity style={styles.btnContainer} onPress={handleAddTodo}>
          <Text style={{ color: "white", fontSize: 18 }}>Add Todo</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedList}
        keyExtractor={(item: TodoListModel) => `${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.todoContainer}>
            <View style={styles.titleContainer}>
              <Pressable onPress={() => handleToggleComplete(item.id)}>
                <IconSymbol
                  name={item.completed ? "checkmark.circle.fill" : "circle"}
                  size={24}
                  color={item.completed ? "green" : "grey"}
                />
              </Pressable>

              <Text>{item.title}</Text>
            </View>
            <Pressable onPress={() => handleDeleteTodo(item.id)}>
              <IconSymbol name="trash.fill" size={24} color="red" />
            </Pressable>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.stepContainer}>
            <Text>ไม่มีรายการ Todo</Text>
            <Text>กรุณาเพิ่มรายการ Todo ใหม่</Text>
          </View>
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  todoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    ...boxShadow("grey"),
    ...padding(16),
    backgroundColor: "white",
    ...margin(4, 0, 4, 0),
    borderRadius: 8,
  },
  btnContainer: {
    alignItems: "center",
    ...boxShadow("grey"),
    ...padding(16),
    backgroundColor: "red",
    ...margin(4, 0, 4, 0),
    borderRadius: 8,
  },
  textInputContainer: {
    backgroundColor: "white",
    ...padding(16),
    ...boxShadow("grey"),
    borderRadius: 8,
    marginBottom: 8,
  },
});
