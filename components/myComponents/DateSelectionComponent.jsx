import { View, Text } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";

export default function DateSelectionComponent({
  dateSelection,
  objectField,
  hideDate,
}) {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(true);

  return (
    <View>
      <DateTimePicker
        value={date}
        mode="date"
        display="default"
        onChange={(event, selectedDate) => {
          dateSelection(objectField, selectedDate);
          hideDate();
        }}
      />
    </View>
  );
}
