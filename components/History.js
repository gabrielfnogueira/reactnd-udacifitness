import React, { Component } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import UdaciFitnessCalendar from 'udacifitness-calendar';
import { addEntry, receiveEntries } from '../actions';
import { fecthCalendarResults } from '../utils/api';
import { white } from '../utils/colors';
import { getDailyReminderValue, timeToString } from '../utils/helpers';
import DateHeader from './DateHeader';
import MetricCard from './MetricCard';
import { AppLoading } from 'expo';

class History extends Component {
  state = {
    ready: false
  };

  componentDidMount() {
    const { dispatch } = this.props;

    fecthCalendarResults()
      .then(entries => dispatch(receiveEntries(entries)))
      .then(({ entries }) => {
        if (!entries[timeToString()]) {
          dispatch(
            addEntry({
              [timeToString()]: getDailyReminderValue()
            })
          );
        }
      })
      .then(() => this.setState({ ready: true }));
  }

  renderItem = ({ today, ...metrics }, formattedDate, key) => (
    <View style={styles.item}>
      {today ? (
        <View>
          <DateHeader date={formattedDate} />
          <Text style={styles.noDataText}>{today}</Text>
        </View>
      ) : (
        <TouchableOpacity onPress={() => console.log('Pressed!')}>
          <MetricCard metrics={metrics} date={formattedDate} />
        </TouchableOpacity>
      )}
    </View>
  );

  renderEmptyDate(formattedDate) {
    return (
      <View style={styles.item}>
        <DateHeader date={formattedDate} />
        <Text style={styles.noDataText}> You didn't log any data this day.</Text>
      </View>
    );
  }

  render() {
    if (!this.state.ready) {
      return <AppLoading />;
    }

    const { entries } = this.props;

    return <UdaciFitnessCalendar items={entries} renderItem={this.renderItem} renderEmptyDate={this.renderEmptyDate} />;
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: white,
    borderRadius: Platform.OS === 'ios' ? 16 : 2,
    padding: 20,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 17,
    justifyContent: 'center',
    shadowRadius: 3,
    shadowOpacity: 0.8,
    shadowColor: 'rgba(0,0,0,0.24)',
    shadowOffset: {
      width: 0,
      height: 3
    }
  },
  noDataText: {
    fontSize: 20,
    paddingTop: 20,
    paddingBottom: 20
  }
});

function mapStateToProps(entries) {
  return {
    entries
  };
}

export default connect(mapStateToProps)(History);