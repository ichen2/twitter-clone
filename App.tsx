import { time } from 'console';
import React from 'react';
import { ViewStyle, ScrollView, FlatList, StyleSheet, Text, View, Image, Button, Pressable, TextInput } from 'react-native';

{ 
  /* 
  TODO: 
  Add disabled button state visual
  Add tweet character count indicator
  Make discovery bar scrollable
  */ 
}

const colors = {
  white: '#FFFFFF',
  black: '#000000',
  blue: '#1DA1F2',
  darkGrey: '#222222',
  lightGrey: '#6a6a6a'
}

interface Topic {
  title: string,
  subtitle: string,
  context?: string,
}

interface Tweet {
  name: string,
  username: string,
  content: string,
}

interface UserProps {
  name: String,
  username: String
}

interface TimelineProps {
  tweets: Tweet[]
  setTweets: Function
}

interface TweetDialogProps {
  setTweetDialogVisible: Function
}

interface TweetComposerProps {
  tweetDraftText: string,
  setTweetDraftText: Function,
}

const username = "timtamlvr2"
const name = "ian chen"

const topics: Topic[] = [
  {title: "COVID-19", subtitle: "Joe Biden unveils a new vaccine mandate for federal employees and business with over 100 employees.", context: "#Vaccines"},
  {title: "CLB", subtitle: "Fans discuss Drake's new album, Certified Lover Boy. Spoiler: it's trash.", context: "#Donda"},
  {title: "21", subtitle: "Twitter users anticipate 9/10/21, a colloquial holiday based on a 2014 Vine."},
]

const initialTweets: Tweet[] = [
  {name: name, username: username, content: "Hello Twitter!"}
]

const Spacer : React.FC<{width?: number, height?: number}> = (props) => {
  return <View style={{width: props.width, height: props.height}} />
}

const TweetComposer: React.FC<TimelineProps & TweetDialogProps> = (props) => {
  const [tweetDraftText, setTweetDraftText] = React.useState("")
  let tweetComposer: TextInput
  const tweetIsValid = () => {
    return tweetDraftText.length > 0 && tweetDraftText.length <= 280
  }

  return (
    <View style={styles.tweetComposerLayout}>
      <Image style={{ width: 56, height: 56, borderRadius: 28}} resizeMode='contain' source={require('./assets/profile.png')} />
      <TextInput 
        ref={input => { if(input) tweetComposer = input }} 
        style={styles.tweetComposer} 
        multiline={true}
        onChangeText={text => setTweetDraftText(text)}
        placeholder="What's Happening?"
      />
      <Pressable 
        disabled={!tweetIsValid()}
        style={styles.tweetButtonSmall}
        onPress={() => {
          props.setTweets(tweetDraftText)
          props.setTweetDialogVisible()
          setTweetDraftText("")
          tweetComposer.clear()
        }}
      >
        <Text style={styles.tweetButtonLargeText}>Tweet</Text>
      </Pressable>
    </View>
  )
}

const CreateTweetDialog : React.FC<TimelineProps & TweetDialogProps> = (props) => {
  return (
    <View style={styles.centeredScreenLayout}>
      <View style={styles.createTweetDialog}>
        <View style={styles.createTweetDialogHeader}>
          <Text style={styles.headerTextSmall} onPress={() => {props.setTweetDialogVisible()}}>{"\u2715"}</Text>
        </View>
        <TweetComposer tweets={props.tweets} setTweets={props.setTweets} setTweetDialogVisible={props.setTweetDialogVisible} />
        <View style={styles.createTweetDialogFooter}></View>
      </View>
    </View>
  )
}

const TopicCardView: React.FC<{topic: Topic, style?: ViewStyle}> = (props) => {
  return (
    <View style={props.style}>
      <Text style={styles.bodySubTextSmall}>{"#" + props.topic.title}</Text>
      <Text style={styles.headerTextSmall}>{props.topic.subtitle}</Text>
      <Text style={styles.bodySubTextSmall}>{props.topic.context ? "Trending with: " + props.topic.context : undefined}</Text>
    </View>
  )
}

const TweetView: React.FC<{tweet: Tweet, style?: ViewStyle}> = (props) => {
  return (
    <View style={styles.tweet}>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.headerTextSmall}>
          {props.tweet.name}
        </Text>
        <Spacer width={8} />
        <Text style={styles.bodySubTextSmall}>
          {"@" + props.tweet.username}
        </Text>
      </View>
      <Spacer height={4} />
      <Text style={styles.bodyTextSmall}>
        {props.tweet.content}
      </Text>
    </View>
  )
}

const NavigationBar : React.FC<TweetDialogProps> = (props) => {
  const navigationOptions: string[] = [
    "Home",
    "Explore",
    "Notifications",
    "Messages",
    "Bookmarks",
    "Lists",
    "Profile",
    "More",
  ]
  const [currentNavigationOption, setCurrentNavigationOption] = React.useState(0)
  return (
    <View style={styles.navigationBar}>
      <View style={styles.navigationList}>
        <View>
          <Image style={{ width: 32, height: 32, marginBottom: 32}} resizeMode='contain' source={require('./assets/twitter.png')} />
          <FlatList
            data={navigationOptions}
            renderItem={({item, index})=>
              <Text 
                style={index == currentNavigationOption ? styles.headerTextLarge : styles.bodyTextLarge}
                onPress={() => setCurrentNavigationOption(index)}>
                  {item}
              </Text>
            }
          />
          <Pressable style={styles.tweetButtonLarge} onPress={() => { props.setTweetDialogVisible() }}>
            <Text style={styles.tweetButtonLargeText}>Tweet</Text>
          </Pressable>
        </View>
        <View style={{flexDirection: 'column', flex: 1, justifyContent: 'flex-end'}}>
          <View style={{flexDirection: 'row'}}>
            <Image style={{ width: 40, height: 40, borderRadius: 20}} resizeMode='contain' source={require('./assets/profile.png')} />
            <Spacer width={12} />
            <View style={{flexDirection: 'column'}}>
              <Text style={styles.headerTextSmall}>{name}</Text>
              <Text style={styles.bodySubTextSmall}>{username}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}

const HomeTimeline : React.FC<TimelineProps> = (props) => {

  return (
    <View style={styles.homeTimeline}>
      <View style={styles.homeTimelineHeader}>
        <Text style={[styles.headerTextLarge, {paddingBottom: 0}]}>Home</Text>
      </View>
      <ScrollView>
        <TweetComposer 
          tweets={props.tweets} setTweets={props.setTweets} setTweetDialogVisible={()=>{}}
        />
        <FlatList
          data={props.tweets}
          renderItem={({item})=><TweetView key={item.content} tweet={item} />}
        />
      </ScrollView>
    </View>
  )
}

const DiscoveryBar : React.FC = () => {
  const [searchBarText, setSearchBarText] = React.useState("")
  return (
    <View style={styles.discoveryBar}>
      <View style={styles.discoverBarWrapper}>
        <TextInput
            style={styles.searchBar}
            placeholder="Search Twitter"
            onChangeText={text => setSearchBarText(text)}
            defaultValue={searchBarText}
          />
        <View style={styles.sidebarCard}>
          <ScrollView>
            <Text style={styles.headerTextLarge}>What's Happening</Text>
            <FlatList
              data={topics}
              renderItem={({item, index})=><TopicCardView key={item.title} topic={item} style={index > 0 ? {paddingTop: 20} : {}}/>}
            />
          </ScrollView>
        </View>
      </View>
    </View>
  )
}

export default function App() {
  const [tweets, setTweets] = React.useState<Tweet[]>(initialTweets)
  const [tweetDialogVisible, setTweetDialogVisible] = React.useState(false)

  const updateTweets = (tweetDraftText: string) => {
    setTweets(prevTweets => [{name: name, username: username, content: tweetDraftText}, ...prevTweets])
  }

  const toggleTweetDialogVisible = () => {
    setTweetDialogVisible(prevVisibility => !prevVisibility)
  }

  return (
    <View style={styles.container}>
      <NavigationBar setTweetDialogVisible={toggleTweetDialogVisible} />
      <HomeTimeline tweets={tweets} setTweets={updateTweets} />
      <DiscoveryBar />
      {
        tweetDialogVisible && 
        <CreateTweetDialog tweets={tweets} setTweets={updateTweets} setTweetDialogVisible={toggleTweetDialogVisible} />
      }
    </View>
  );
}

const timelinePadding = 16
const timelineWidth = '42%'
const navigationBarWidth = '25%'
const discoveryBarWidth = '33%'

const styles = StyleSheet.create({
  bodyTextSmall: {
    color: colors.white,
    fontSize: 14,
  },
  bodyTextLarge: {
    color: colors.white,
    fontSize: 20,
    paddingBottom: 24,
  },
  bodySubTextSmall: {
    color: colors.lightGrey,
    fontSize: 14,
  },
  headerTextSmall: {
    color: colors.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  headerTextLarge: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 24,
  },
  tweetButtonSmall: {
    marginStart: 8,
    width: 80,
    height: 40,
    borderRadius: 24,
    backgroundColor: colors.blue,
  },
  tweetButtonSmallDisabled: {
    marginStart: 8,
    width: 80,
    height: 40,
    borderRadius: 24,
    backgroundColor: colors.blue,
  },
  tweetButtonLarge: {
    width: 200,
    height: 48,
    borderRadius: 24,
    marginLeft: -24,
    backgroundColor: colors.blue,
  },
  tweetButtonLargeText: {
    marginVertical: 'auto',
    textAlign: 'center',
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    height: '100vh',
    backgroundColor: colors.black,
  },
  centeredScreenLayout: {
    backgroundColor: 'rgba(256, 256, 256, .2)',
    position: 'absolute', 
    start: 0, 
    end: 0, 
    top: 0, 
    bottom: 0, 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  createTweetDialog : {
    borderRadius: 20,
    backgroundColor: colors.black,
  },
  createTweetDialogHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
  },
  createTweetDialogFooter: {
    padding: 20,
  },
  navigationBar: {
    position: 'absolute',
    borderRightWidth: 1,
    borderRightColor: colors.darkGrey,
    width: navigationBarWidth,
    height: '100vh',
  },
  navigationList: {
    marginLeft: 108,
    marginVertical: 20,
    flexDirection: 'column',
    flex: 1,
  },
  homeTimeline: {
    left: navigationBarWidth,
    width: timelineWidth,
    height: '100vh',
  },
  homeTimelineHeader: {
    padding: timelinePadding,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
  },
  tweetComposerLayout: {
    padding: timelinePadding,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
  },
  tweetComposer: {
    marginLeft: 16,
    flex: 1,
    color: colors.white,
    fontSize: 20,
    paddingStart: 10,
  },
  tweet : {
    flexDirection: 'column',
    padding: timelinePadding,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
  },

  discoveryBar: {
    position: 'absolute',
    width: discoveryBarWidth,
    height: '100vh',
    right: 0,
    borderLeftWidth: 1,
    borderLeftColor: colors.darkGrey,
  },
  discoverBarWrapper: {
    marginLeft: 32,
    marginRight: 108,
  },
  searchBar: {
    width: '100%',
    marginTop: 5,
    marginBottom: 20,
    height: 40, 
    color: colors.white,
    backgroundColor: colors.darkGrey, 
    borderRadius: 20 ,
    paddingLeft: 10,
  },
  sidebarCard: {
    padding: 20,
    width: '100%',
    backgroundColor: colors.darkGrey, 
    borderRadius: 30 ,
  },
});