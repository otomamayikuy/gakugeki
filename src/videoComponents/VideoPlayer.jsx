import React from 'react'
import "video-react/dist/video-react.css"
import { Player, ControlBar, PlaybackRateMenuButton } from 'video-react'

class VideoPlayer extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      url: props.VideoURL
    }
  }
  componentDidMount() {
    this.player.playbackRate = 1;
    this.forceUpdate();
  }
  render() {
    return (
      <div className="videoPlayer">
      <Player
        ref={c => {
          this.player = c;
        }}
        playsInline
      >
        <ControlBar>
          <PlaybackRateMenuButton order={7} rates={[2, 1.5, 1.0, 0.5]} />
        </ControlBar>
        <source
          src={this.state.url}
          type="video/mp4"
        />
      </Player>
      </div>
    );
  }
}

export default VideoPlayer;