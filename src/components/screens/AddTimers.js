import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import PropTypes from 'prop-types';
import {TimerContext} from '../../AppNavigatorRoutes';

const categories = ['Workout', 'Study', 'Break'];

const AddTimers = ({navigation, route}) => {
  const {addTimer, updateTimer} = useContext(TimerContext);
  const {timerToEdit} = route.params || {};
  const [name, setName] = useState(timerToEdit ? timerToEdit.name : '');
  const [duration, setDuration] = useState(
    timerToEdit ? timerToEdit.duration : '',
  );
  const [category, setCategory] = useState(
    timerToEdit ? timerToEdit.category : categories[0],
  );
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (timerToEdit) {
      setName(timerToEdit.name);
      setDuration(timerToEdit.duration.toString());
    }
  }, [timerToEdit]);

  const validateForm = () => {
    let newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Please Enter Timer name which is required';
    }
    if (!duration.trim() || isNaN(duration) || parseInt(duration) <= 0) {
      newErrors.duration = 'Please Enter a valid duration in seconds';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const timerDuration = parseInt(duration, 10);
      if (timerToEdit) {
        updateTimer(timerToEdit.id, {
          name,
          duration: timerDuration,
          remainingTime: timerDuration,
          category,
        });
      } else {
        addTimer({
          id: Date.now(),
          name,
          duration: parseInt(duration),
          category,
        });
      }
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Timer Name</Text>
      <TextInput
        style={[styles.input, errors.name && styles.inputError]}
        value={name}
        onChangeText={text => {
          setErrors(prev => ({...prev, name: ''}));
          setName(text);
        }}
        editable={true}
        placeholder={'Enter Timer Name'}
        placeholderTextColor={'#78909C'}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.header}>Duration</Text>
      <TextInput
        style={[styles.input, errors.duration && styles.inputError]}
        keyboardType="numeric"
        value={duration}
        onChangeText={text => {
          setErrors(prev => ({...prev, duration: ''}));
          setDuration(text);
        }}
        editable={true}
        maxLength={6}
        placeholder={'Enter Duration in seconds'}
        placeholderTextColor={'#78909C'}
      />
      {errors.duration && (
        <Text style={styles.errorText}>{errors.duration}</Text>
      )}

      <Text style={styles.header}>Category</Text>
      <Picker
        mode="dropdown"
        style={styles.input}
        selectedValue={category}
        onValueChange={setCategory}
        selectionColor={'#78909C'}
        dropdownIconColor={'#78909C'}>
        {categories.map(cat => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>

      <TouchableOpacity onPress={handleSubmit} style={styles.timerBtn}>
        <Text style={styles.timerAddText}>
          {timerToEdit ? 'Update Timer' : 'Add Timer'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#E5EDF9'},
  input: {
    borderWidth: 1,
    borderColor: '#008158',
    borderRadius: 8,
    paddingStart: 16,
    paddingTop: 16.5,
    marginBottom: 8,
    color: '#78909C',
    fontFamily: 'Montserrat',
    fontSize: 14,
    height: 60,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#D32F2F',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  header: {
    fontFamily: 'Montserrat',
    fontSize: 15,
    color: '#B9811C',
    marginVertical: 10,
  },
  timerBtn: {
    backgroundColor: '#008158',
    padding: 20,
    width: '100%',
    borderRadius: 10,
    alignItems: 'center',
    alignSelf: 'center',
  },
  timerAddText: {
    color: '#E5EDF9',
    fontFamily: 'Montserrat',
    fontSize: 14,
  },
});
AddTimers.propTypes = {
  navigation: PropTypes.object,
};
export default AddTimers;
