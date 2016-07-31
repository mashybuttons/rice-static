import React, { Component } from 'react';
import { connect } from 'react-redux';
import { actions } from './../ducks/home-view-ducks.js';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import Dropdown from 'react-dropdown';
import getSecureApiClient from '../../../utils/aws';
import rec from '../../../utils/rec';

import './HomeView.scss';

const locationsArr = [
  'Las Vegas', 'San Francisco', 'Pokeball',
];


class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: locationsArr[0],
    };
    this._onSelect = this._onSelect.bind(this);
    this.axiosSoloPost = this.axiosSoloPost.bind(this);
  }

  componentWillMount() {
    this.importPreferences();
    this.getFriendsInfo();
  }


  getFriendsInfo() {
    const user = this.props.user.clientId;

    const apigClient = getSecureApiClient();
    const body = {
      clientId: user,
    };

    apigClient.apiUsersFriendsPost({}, body)
    .then(response => {
      console.log('[HomeView] apiUsersFriendsPost response', response);
      this.props.actions.importFriends(response.data);
    })
    .catch(error => {
      console.log('[HomeView] apiUsersFriendsPost error', error);
    });
  }

  importPreferences() {
    const user = this.props.user.clientId;

    const apigClient = getSecureApiClient();
    const body = {
      clientId: user,
    };

    apigClient.apiUsersPreferencesPost({}, body)
    .then(response => {
      console.log('[HomeView] apiUsersPreferencesPost response', response);
      this.props.actions.importPreferences(response.data);
    })
    .catch(error => {
      console.log('[HomeView] apiUsersPreferencesPost error', error);
    });
  }

  _onSelect(option) {
    this.setState({
      selected: option.value,
    });
    this.props.actions.changeLocation(option.value);
  }

  axiosSoloPost() {
    const recommendationsOptions = {
      'data': {
        'obj': {
          'user_ids': [this.props.user.clientId],
          'preferences': {
            'categories': [this.props.preferences],
          },
          'location': this.props.location,
        },
      },
    };

    rec('https://in6ws55vnd.execute-api.us-west-2.amazonaws.com', '/Production/api/recommendation', 'post', recommendationsOptions)
    .then(response => {
      console.log('[HomeView] Rec Response', response);

      const recDataArr = response.data.response.slice(0, 5);
      // API Business Yelp
      const apigClient = getSecureApiClient();
      const bodyYelp = { response: recDataArr };

      return apigClient.apiBusinessYelpPost({}, bodyYelp);
    })
    .catch(err => {
      console.log('[HomeView] Rec Error', err);
    })
    .then(responseYelp => {
      const restNames = [];
      responseYelp.data.forEach(name => {
        restNames.push(JSON.parse(JSON.stringify(name)));
      });

      this.props.actions.addRecs(restNames);
      console.log('[HomeView] apiBusinessYelpPost response', JSON.stringify(responseYelp, null, 2));
      browserHistory.push('/restaurant');
    })
    .catch(errorYelp => {
      console.log('[HomeView] apiBusinessYelpPost error', errorYelp);
    });
  }

  render() {
    return (
      <div className="HomeView-container">
        <div className="option option-location"><h3>Select Your Location</h3></div>
        <Dropdown options={locationsArr} onChange={this._onSelect} value={locationsArr[0]} placeholder="Select Your Location" />

        <div className="option option-solo" onClick={this.axiosSoloPost.bind(null)}><h3>Get a Solo Recommendation</h3></div>
        <Link to="/group"><div className="option option-group"><h3>Get a Group Recommendation</h3></div></Link>
        { this.props.restaurant.toRate ? <Link to="/rating"><div className="option option-rating"><h3>Rate Your Last Restaurant</h3></div></Link> : null }
      </div>
    );
  }
}

HomeView.propTypes = {
  actions: React.PropTypes.object,
  user: React.PropTypes.object,
  friends: React.PropTypes.array,
  location: React.PropTypes.object,
  restaurant: React.PropTypes.object,
  preferences: React.PropTypes.array,
};

const mapStateToProps = function mapStateToProps(state) {
  return {
    user: state.user,
    friends: state.user.friends,
    preferences: state.user.preferences,
    location: state.location,
    restaurant: state.restaurant,
  };
};

const mapDispatchToProps = function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
};

HomeView = connect(mapStateToProps, mapDispatchToProps)(HomeView);
export default HomeView;
