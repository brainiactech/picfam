import { StackNavigator} from 'react-navigation';

import SplashScreen from './src/splash-screen/splashscreen';
import SignupScreen from './src/auth/signup/signup';
import LoginScreen from './src/auth/login/login';
import HomeScreen from './src/home/home';
import CreateGroup from './src/group/create_group';
import ListGroup from './src/group/list_group';
import AddGroupMember from './src/group/add_group_member';
import GroupMember from './src/group/group_members';

import CreateEvent from './src/event/create_event';
import ListEvent from './src/event/list_event';
import EventPicComment from './src/event/event_pic_comment';
import EventDetails from './src/event/event_details';
import EventScreen from './src/event/event_screen';
import AddEventParticipant from './src/event/add_event_participant';
import EventParticipant from './src/event/event_participants';

import AddPictureByEventList from './src/picture/add_by_event_list';
import AddPictureByEvent from './src/picture/add_by_event';

import GroupScreen from './src/group/group_screen';
import Notification from './src/notification/notification';

import Profile from './src/profile/profile';
import EditProfile from './src/profile/edit_profile';
import PublicProfile from './src/profile/public_profile';
import Browse from './src/browse/browse';
import BrowsePicDetails from './src/browse/browse_pic_details';


import Welcome from './src/welcome/welcome';
import WelcomeGroup from './src/welcome/group';
import WelcomeEvent from './src/welcome/event';
import WelcomeJoinEvents from './src/welcome/join_events';



const PixNavigation = StackNavigator(
  {
    Splash: { screen: SplashScreen, navigationOptions: {header: false}},
    Signup: { screen: SignupScreen, navigationOptions: {headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    Login: { screen: LoginScreen, navigationOptions: {headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    Home: { screen: HomeScreen, navigationOptions: {header: false} },

    Welcome: { screen: Welcome, navigationOptions: {header: false} },
    WelcomeGroup: { screen: WelcomeGroup, navigationOptions: {header: false} },
    WelcomeEvent: { screen: WelcomeEvent, navigationOptions: {header: false} },
    WelcomeJoinEvents: { screen: WelcomeJoinEvents, navigationOptions: {header: false} },

    CreateGroup: { screen: CreateGroup, navigationOptions: {title: 'Create Group', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    ListGroup: { screen: ListGroup, navigationOptions: {title: 'Group List', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    Group: { screen: GroupScreen, navigationOptions: {title: 'Group Details', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    AddGroupMember: { screen: AddGroupMember, navigationOptions: {title: 'Add Members', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    GroupMember: { screen: GroupMember, navigationOptions: {title: 'Group Members', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},

    CreateEvent: { screen: CreateEvent, navigationOptions: {title: 'Create Event', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    ListEvent: { screen: ListEvent, navigationOptions: {title: 'Event List', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    Event: { screen: EventScreen, navigationOptions: {title: 'Event', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    EventDetails: { screen: EventDetails, navigationOptions: {title: 'Events Details', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    EventPicComment: { screen: EventPicComment, navigationOptions: {title: 'Picture Comments', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    AddEventParticipant: { screen: AddEventParticipant, navigationOptions: {title: 'Add Participant', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    EventParticipant: { screen: EventParticipant, navigationOptions: {title: 'Event participant', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},

    AddPictureByEventList: { screen: AddPictureByEventList, navigationOptions: {title: 'Add Event Pictures', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    AddPictureByEvent: { screen: AddPictureByEvent, navigationOptions: {title: 'Add Event Pictures', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},

    Profile: { screen: Profile, navigationOptions: {title: 'Profile', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    EditProfile: { screen: EditProfile, navigationOptions: {title: 'Edit Profile', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    PublicProfile: { screen: PublicProfile, navigationOptions: {title: 'Public Profile', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    Browse: { screen: Browse, navigationOptions: {title: 'Browse Events', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    BrowsePicDetails: { screen: BrowsePicDetails, navigationOptions: {title: 'Fresh Picture', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},
    Notification: { screen: Notification, navigationOptions: {title: 'Notifications', headerStyle:{backgroundColor: '#2980b9'},headerTintColor: '#fff',}},

  },
  {
    navigationOptions:{
    //header:false,
  } 

});
export default PixNavigation;