import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from './../ducks/group-view-ducks.js';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import SearchInput, { createFilter } from 'react-search-input';

import getSecureApiClient from '../../../utils/aws';
import rec from '../../../utils/rec';

import './GroupView.scss';

const KEYS_TO_FILTERS = ['name', 'email'];


class GroupView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      selectedPreferences: [],
    };
    this.addToGroup = this.addToGroup.bind(this);
  }

  componentDidMount() {
    const search = document.getElementsByClassName('form-group')[0].getElementsByTagName('input')[0];
    search.className += ' form-control';

    this.getFriendsInfo();
    this.addToGroup(this.props.user);
  }

  getFriendsInfo() {
    const apigClient = getSecureApiClient();
    const body = {
      clientId: this.props.user.clientId,
    };

    apigClient.apiUsersFriendsPost({}, body)
    .then(response => {
      console.log('[GroupView] apiUsersFriendsPost response', response);
      this.props.actions.importFriends(response.data);
    })
    .catch(error => {
      console.log('[GroupView] apiUsersFriendsPost error', error);
    });
  }

  isSelected(user) {
    return (this.state.selectedPreferences.indexOf(user) > -1);
  }

  addToGroup(user) {
    this.props.actions.addToGroup(user.clientId);
    this.props.actions.addToGroupName(user.name);
    this.props.actions.addToGroupEmail(user.email);

    this.state.selectedPreferences.push(user);
  }

  handleSubmit() {
    // API Group Preferences
    const apigClient = getSecureApiClient();
    const groupPreferences = {
      clientId: this.props.user.clientId,
      group: this.props.group.users,
    };
    console.log('groupUsers', JSON.stringify(groupPreferences, null, 2));

    apigClient.apiUsersGroupPreferencesPost({}, groupPreferences)
    .then(response => {
      console.log('[GroupView] apiUsersGroupPreferencesPost response', response);
      this.props.actions.importGroupPref(response.data);

      // API Recommendations
      const recommendationsOptions = { data: { obj: {
        'user_ids': this.props.group.users,
        'preferences': { 'categories': this.props.group.preferences },
        'location': 'Las Vegas',
      } } };

      console.log('[GroupView] recommendationsOptions', JSON.stringify(recommendationsOptions, null, 2));

      rec('https://in6ws55vnd.execute-api.us-west-2.amazonaws.com', '/Production/api/recommendation', 'post', recommendationsOptions)
      .then(recData => {
        console.log('[GroupView] recData', recData);
        const recDataArr = recData.data.response.slice(0, 5);
        // API Business Yelp
        // const apigClient = getSecureApiClient();
        const bodyYelp = { response: recDataArr };

        apigClient.apiBusinessYelpPost({}, bodyYelp)
        .then(responseYelp => {
          const restNames = [];
          responseYelp.data.forEach(name => {
            restNames.push(JSON.parse(JSON.stringify(name)));
          });

          this.props.actions.addRecs(restNames);
          console.log('[GroupView] apiBusinessYelpPost response', JSON.stringify(responseYelp, null, 2));
          browserHistory.push('/restaurant');
        })
        .catch(errorYelp => {
          console.log('[GroupView] apiBusinessYelpPost error', errorYelp);
        });
      })
      .catch(recError => {
        console.log('[GroupView] recError', recError);
      });
    })
    .catch(error => {
      console.log('[Group View] apiUsersGroupPreferencesPost error', error);
    });
  }

  searchUpdated(term) {
    this.setState({
      searchTerm: term,
    });
  }

  render() {
    const filteredFriends = this.props.friends.filter(createFilter(this.state.searchTerm, KEYS_TO_FILTERS));

    return (
      <div className="GroupView">
        <div className="heading heading-friends"><h3>Select Your Group</h3></div>

        <form className="form-inline">
          <SearchInput className="form-group" onChange={this.searchUpdated.bind(this)} />
        </form>

        {filteredFriends.map((user, i) => {
          return (
            <div className={'FriendEntry-container ' + (this.isSelected(user) ? 'selected' : '')} key={i} onClick={() => {this.addToGroup(user); }}>
              <div className="FriendEntry-fields">{user.name}</div>
              <div className="FriendEntry-fields">{user.email}</div>
            </div>
          );
        })}
        <button className="btn btn-lg btn-success btn-block" onClick={this.handleSubmit.bind(this)}>Get a Group Recommendation</button>
      </div>
    );
  }
}

GroupView.propTypes = {
  user: React.PropTypes.object,
  actions: React.PropTypes.object,
  friends: React.PropTypes.array,
  group: React.PropTypes.object,
  location: React.PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    friends: state.user.friends,
    group: state.group,
    location: state.location,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators(actions, dispatch) };
};

GroupView = connect(mapStateToProps, mapDispatchToProps)(GroupView);

export default GroupView;
