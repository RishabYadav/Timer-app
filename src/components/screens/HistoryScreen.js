import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

const HistoryScreen = ({route}) => {
  const {timerHistory = []} = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.timerNameText}>Timer History</Text>
      {timerHistory.length === 0 ? (
        <Text style={styles.timerNameText}>No completed timers yet.</Text>
      ) : (
        timerHistory.map((timer, index) => (
          <View key={index} style={styles.timerCardMore}>
            <Text>Timer Name: {timer.name}</Text>
            <Text>Completed at: {timer.completedAt}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#E5EDF9'},
  timerCardMore: {
    borderRadius: 10,
    backgroundColor: '#008158',
    padding: 20,
    marginVertical: 10,
  },
  timerNameText: {fontSize: 16, marginBottom: 20, color: '#008158'},
});

export default HistoryScreen;
