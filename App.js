import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Constants } from 'expo';
import React from 'react';
import { Platform, StatusBar, View } from 'react-native';
import { createBottomTabNavigator, createMaterialTopTabNavigator, createStackNavigator } from 'react-navigation';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AddEntry from './components/AddEntry';
import EntryDetail from './components/EntryDetail';
import History from './components/History';
import Live from './components/Live';
import reducer from './reducers';
import { purple, white } from './utils/colors';

function UdaciStatusBar({ backgroundColor, ...props }) {
  return (
    <View style={{ backgroundColor, height: Constants.statusBarHeight }}>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </View>
  );
}

const routes = {
  History: {
    screen: History,
    navigationOptions: {
      tabBarLabel: 'History',
      tabBarIcon: ({ tintColor }) => <Ionicons name="ios-bookmarks" size={30} color={tintColor} />
    }
  },
  AddEntry: {
    screen: AddEntry,
    navigationOptions: {
      tabBarLabel: 'Add Entry',
      tabBarIcon: ({ tintColor }) => <FontAwesome name="plus-square" size={30} color={tintColor} />
    }
  },
  Live: {
    screen: Live,
    navigationOptions: {
      tabBarLabel: 'Live',
      tabBarIcon: ({ tintColor }) => <Ionicons name="ios-speedometer" size={30} color={tintColor} />
    }
  }
};

const tabOptions = {
  navigationOptions: {
    header: null
  },
  tabBarOptions: {
    activeTintColor: Platform.OS === 'ios' ? purple : white,
    style: {
      height: 56,
      backgroundColor: Platform.OS === 'ios' ? white : purple,
      shadowColor: 'rgba(0, 0, 0, 0.24)',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 6,
      shadowOpacity: 1
    }
  }
};

const Tabs =
  Platform.OS === 'ios'
    ? createBottomTabNavigator(routes, tabOptions)
    : createMaterialTopTabNavigator(routes, tabOptions);

const MainNavigator = createStackNavigator(
  {
    Home: {
      screen: Tabs,
      navigationOptions: {
        header: null
      }
    },
    EntryDetail: {
      screen: EntryDetail,
      navigationOptions: {
        headerTintColor: white,
        headerStyle: {
          backgroundColor: purple
        }
      }
    }
  },
  {
    navigationOptions: {
      headerForceInset: {
        top: 'never'
      }
    }
  }
);

export default class App extends React.Component {
  render() {
    return (
      <Provider store={createStore(reducer)}>
        <View style={{ flex: 1 }}>
          <UdaciStatusBar backgroundColor={purple} barStyle="light-content" />
          <MainNavigator />
        </View>
      </Provider>
    );
  }
}
