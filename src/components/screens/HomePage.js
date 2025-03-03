import React, {useContext, useEffect, useState, useCallback} from 'react';
import {TimerContext} from '../../AppNavigatorRoutes';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import PropTypes from 'prop-types';
import {ICON_HEART} from './utils/Images';
import ProgressBar from 'react-native-progress/Bar';

const HomePage = ({navigation}) => {
  const {timers, updateTimer, removeTimer} = useContext(TimerContext);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [completedTimer, setCompletedTimer] = useState([]);
  const [runningTimerId, setRunningTimerId] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (completedTimer?.length > 0) {
      setIsModalVisible(true);
    }
  }, [completedTimer]);

  useEffect(() => {
    if (runningTimerId !== null) {
      const timerToUpdate = timers.find(t => t?.id === runningTimerId);
      if (!timerToUpdate) return;

      const interval = setInterval(() => {
        if (timerToUpdate.remainingTime <= 0) {
          clearInterval(interval);
          updateTimer(runningTimerId, {remainingTime: 0, status: 'Completed'});
          setCompletedTimer(prevTimers => [
            ...prevTimers,
            {
              name: timerToUpdate.name,
              completedAt: new Date().toLocaleString(),
            },
          ]);
          setRunningTimerId(null);
        } else {
          const newRemainingTime = timerToUpdate.remainingTime - 1;
          updateTimer(runningTimerId, {
            remainingTime: newRemainingTime,
            status: newRemainingTime <= 0 ? 'Completed' : 'Running',
          });
          triggerHalfwayAlert(
            timerToUpdate,
            timerToUpdate.duration - newRemainingTime,
          );
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [runningTimerId, timers, updateTimer]);

  const toggleCategoryExpansion = category => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const groupTimersByCategory = () => {
    return timers.reduce((acc, timer) => {
      const category = timer.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(timer);
      return acc;
    }, {});
  };

  const toggleTimer = id => {
    const timerToUpdate = timers.find(t => t?.id === id);
    if (!timerToUpdate) return;

    if (runningTimerId === id) {
      setRunningTimerId(null);
      updateTimer(id, {status: 'Paused'});
    } else {
      setRunningTimerId(id);
      updateTimer(id, {status: 'Running'});
    }
  };

  const resetTimer = id => {
    const timer = timers.find(t => t?.id === id);
    if (!timer) return;

    updateTimer(id, {remainingTime: timer.duration, status: 'Stopped'});
    if (runningTimerId === id) {
      setRunningTimerId(null);
    }
  };

  const pauseTimer = id => {
    setRunningTimerId(null);
    updateTimer(id, {status: 'Paused'});
  };

  const stopAndRemoveTimer = id => {
    clearInterval(runningTimerId);
    removeTimer(id);
    setRunningTimerId(null);
  };

  const handleDelete = id => {
    Alert.alert('Delete Timer', 'Are you sure you want to delete this timer?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        onPress: () => {
          stopAndRemoveTimer(id);
        },
        style: 'destructive',
      },
    ]);
  };

  const renderTimerItem = ({item}) => {
    const isTimerRunning = runningTimerId === item.id;

    return (
      <View style={styles.timerCardMore}>
        <Text style={[styles.noTimer, {textAlign: 'center', marginBottom: 5}]}>
          {item?.name}
        </Text>
        <Text
          style={[styles.noTimerSub, {textAlign: 'center', marginBottom: 5}]}>
          {item?.remainingTime} sec
        </Text>
        <Text
          style={[styles.noTimerSub, {textAlign: 'center', marginBottom: 10}]}>
          {item?.status}
        </Text>
        <ProgressBar
          progress={item.remainingTime / item.duration}
          width={350}
          height={10}
          borderRadius={10}
          color="#4CAF50"
          unfilledColor="#e0e0e0"
        />
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() =>
              isTimerRunning ? pauseTimer(item.id) : toggleTimer(item.id)
            }
            style={styles.button}>
            <Text style={styles.timerAddText}>
              {isTimerRunning ? 'Pause' : 'Start'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => resetTimer(item.id)}
            style={styles.button}>
            <Text style={styles.timerAddText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AddTimers', {timerToEdit: item})
            }
            style={styles.button}>
            <Text style={styles.timerAddText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={styles.buttonDelete}>
            <Text style={styles.timerAddText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const startAllTimersInCategory = category => {
    groupedTimers[category]?.forEach(timer => {
      if (runningTimerId !== timer.id) {
        toggleTimer(timer.id);
      }
    });
  };

  const pauseAllTimersInCategory = category => {
    groupedTimers[category]?.forEach(timer => {
      if (runningTimerId === timer.id) {
        pauseTimer(timer.id);
      }
    });
  };

  const resetAllTimersInCategory = category => {
    groupedTimers[category]?.forEach(timer => {
      resetTimer(timer.id);
    });
  };

  const triggerHalfwayAlert = (timer, elapsed) => {
    if (elapsed === parseInt(timer.duration / 2, 10)) {
      clearInterval(runningTimerId);
      setRunningTimerId(null);
      updateTimer(timer.id, {status: 'Paused'});
      Alert.alert(
        'Halfway Alert!',
        `You’ve reached ${50}% of the timer: ${timer.name}`,
        [
          {text: 'Cancel', style: 'cancel'},
          {
            text: 'Ok',
            onPress: () => {
              toggleTimer(timer?.id);
            },
            style: 'destructive',
          },
        ],
      );
    }
  };

  const renderCategorySection = (category, timers) => (
    <View style={styles.categorySection}>
      <TouchableOpacity onPress={() => toggleCategoryExpansion(category)}>
        <Text style={styles.categoryHeader}>{category}</Text>
      </TouchableOpacity>

      <View style={styles.bulkActionsRow}>
        <TouchableOpacity
          onPress={() => startAllTimersInCategory(category)}
          style={styles.bulkActionButton}>
          <Text style={styles.bulkActionText}>Start All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => pauseAllTimersInCategory(category)}
          style={styles.bulkActionButton}>
          <Text style={styles.bulkActionText}>Pause All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => resetAllTimersInCategory(category)}
          style={styles.bulkActionButton}>
          <Text style={styles.bulkActionText}>Reset All</Text>
        </TouchableOpacity>
      </View>

      {expandedCategories[category] && (
        <FlatList
          data={timers}
          keyExtractor={item => item?.id?.toString()}
          renderItem={renderTimerItem}
          showsVerticalScrollIndicator={true}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={21}
        />
      )}
    </View>
  );

  const groupedTimers = groupTimersByCategory();

  return (
    <View style={styles.container}>
      {!timers || timers.length === 0 ? (
        <View style={styles.timerCard}>
          <View>
            <Text style={styles.noTimer}>No timers added</Text>
            <Text style={styles.noTimerSub}>
              Please click add timer, to proceed
            </Text>
          </View>
          <View>
            <Image source={ICON_HEART} style={{width: 22, height: 20}} />
          </View>
        </View>
      ) : (
        Object.keys(groupedTimers).map(category =>
          renderCategorySection(category, groupedTimers[category]),
        )
      )}
      <TouchableOpacity
        onPress={() => navigation.navigate('AddTimers')}
        style={styles.timerBtn}>
        <Text style={styles.timerAddText}>Add Timer</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('HistoryScreen', {timerHistory: completedTimer})
        }
        style={styles.timerBtn}>
        <Text style={styles.timerAddText}>Go to history</Text>
      </TouchableOpacity>
      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.congratulationsText}>Congratulations!</Text>
            <Text style={styles.timerNameText}>
              Your timer "
              {completedTimer.length > 0
                ? completedTimer[completedTimer.length - 1].name
                : ''}
              " is complete
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(false)}
              style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#E5EDF9'},
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categorySection: {
    marginBottom: 20,
  },
  categoryHeader: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    color: '#B9811C',
    marginBottom: 10,
  },
  categoryLink: {
    fontSize: 14,
    fontFamily: 'Montserrat',
    color: '#008158',
    marginBottom: 5,
  },
  noTimer: {
    fontSize: 18,
    fontFamily: 'Montserrat',
    color: '#E5EDF9',
  },
  noTimerSub: {
    fontFamily: 'Montserrat',
    fontSize: 14,
    color: '#E5EDF9',
  },
  timerCard: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#008158',
    padding: 20,
  },
  timerCardMore: {
    borderRadius: 10,
    backgroundColor: '#008158',
    padding: 20,
    marginVertical: 10,
  },
  timerBtn: {
    marginTop: 20,
    backgroundColor: '#008158',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#B9811C',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonDelete: {
    backgroundColor: '#D32F2F',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
  },
  timerAddText: {
    color: '#E5EDF9',
    fontFamily: 'Montserrat',
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  congratulationsText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#008158',
  },
  timerNameText: {fontSize: 16, marginBottom: 20, color: '#008158'},
  closeButton: {backgroundColor: '#B9811C', padding: 10, borderRadius: 8},
  closeButtonText: {color: '#fff', fontSize: 14},
  bulkActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  bulkActionButton: {backgroundColor: '#008158', padding: 10, borderRadius: 8},
  bulkActionText: {color: '#E5EDF9', fontFamily: 'Montserrat', fontSize: 14},
});

HomePage.propTypes = {
  navigation: PropTypes.object,
};

export default HomePage;
