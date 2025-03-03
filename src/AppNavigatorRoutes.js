import React, {createContext, useEffect, useReducer, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import HomePage from './components/screens/HomePage';
import AddTimers from './components/screens/AddTimers';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HistoryScreen from './components/screens/HistoryScreen';

const TimerReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TIMER':
      return [
        ...state,
        {
          ...action.payload,
          status: 'Stopped',
          remainingTime: action.payload.duration,
        },
      ];
    case 'UPDATE_TIMER':
      return state.map(timer =>
        timer.id === action.payload.id
          ? {...timer, ...action.payload.data}
          : timer,
      );
    case 'REMOVE_TIMER':
      return state.filter(timer => timer.id !== action.payload.id);
    case 'SET_TIMERS':
      return action.payload;
    default:
      return state;
  }
};

export const TimerContext = createContext();

const AppNavigator = () => {
  const Stack = createNativeStackNavigator();
  const [timers, dispatch] = useReducer(TimerReducer, []);

  useEffect(() => {
    loadTimers();
    return () => {
      clearAllIntervals();
    };
  }, []);

  const loadTimers = async () => {
    try {
      const storedTimers = await AsyncStorage.getItem('timers');
      if (storedTimers) {
        dispatch({type: 'SET_TIMERS', payload: JSON.parse(storedTimers)});
      }
    } catch (error) {
      console.error('Failed to load timers', error);
    }
  };

  const saveTimers = async newTimers => {
    try {
      dispatch({type: 'SET_TIMERS', payload: newTimers});
      await AsyncStorage.setItem('timers', JSON.stringify(newTimers));
    } catch (error) {
      console.error('Failed to save timers', error);
    }
  };

  const addTimer = timer => {
    dispatch({type: 'ADD_TIMER', payload: timer});
  };

  const updateTimer = (id, data) => {
    dispatch({type: 'UPDATE_TIMER', payload: {id, data}});
  };

  const removeTimer = id => {
    dispatch({type: 'REMOVE_TIMER', payload: {id}});
  };

  const clearAllIntervals = () => {
    timers.forEach(timer => {
      if (timer.interval) {
        clearInterval(timer.interval);
      }
    });
  };

  return (
    <TimerContext.Provider value={{timers, addTimer, updateTimer, removeTimer}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="HomePage">
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="AddTimers" component={AddTimers} />
          <Stack.Screen name="HistoryScreen" component={HistoryScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </TimerContext.Provider>
  );
};

export default AppNavigator;
