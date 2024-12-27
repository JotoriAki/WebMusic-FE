import classNames from "classnames/bind";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from 'react-player'
import styles from "./Footer.module.scss";
import { Col, Row } from "react-bootstrap";
import { Slider } from "antd";
import { CaretLeftOutlined, CaretRightOutlined, CloseOutlined, MenuFoldOutlined, PauseOutlined, RetweetOutlined, StepBackwardOutlined, StepForwardOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { connect, useSelector } from "react-redux";
import { nextSong, playSongOnAutoPlaylist, playSongOnPreviousPlaylist, playSongOnWaitPlaylist, previousSong, removeSong } from "../../Actions/PlayListAction";
import 'animate.css/animate.css'
import { switchUserName } from "./SwichName";
import { listenSong } from "../../Actions/SongAction";
const cx = classNames.bind(styles);

function Footer(props) {
  const [volume, setVolume] = useState(JSON.parse(localStorage.getItem("playerState"))?.volume || 0.5);
  const [progress, setProgress] = useState(0);
  const [progressChanging, setProgressChanging] = useState(false);
  const [mute, setMute] = useState(JSON.parse(localStorage.getItem("playerState"))?.mute || false);
  const [duration, setDuration] = useState(0);
  const [loop, setLoop] = useState(JSON.parse(localStorage.getItem("playerState"))?.loop || false);
  const playerRef = useRef(null);
  const [isVisiblePlaylist, setIsVisiblePlaylist] = useState(false);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef(null);
  const playing = useSelector(state => state.PlayList.playing);
  const localPlaying = JSON.parse(localStorage.getItem("playing"));

  const PreviousPlaylist = useSelector(state => state.PlayList.previousPlaylist);
  const NextReleasePlaying = useSelector(state => state.PlayList.waitPlaylist);
  const NextPlaying = useSelector(state => state.PlayList.autoPlaylist);

  const hasCalledListen = useRef(false);
  const togglePlaylist = () => {
    setIsVisiblePlaylist(!isVisiblePlaylist);
  };



  useEffect(() => {
      setProgress(0);
      setProgressChanging(true);
      setDuration(playing?.duration);
      if(playing === undefined){
        localStorage.removeItem("playing");
      }
      setTimer(0);
      hasCalledListen.current = false;
  }, [playing]);


  useEffect(() => {
    setProgressChanging(false);
  }, []);

  const togglePlay = () => {
    if (progressChanging) {
      setProgressChanging(false);
    } else {
      setProgressChanging(true);
    }
  };


  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => {
        return prevTimer + 1;
      });


    }, 1000);
  };
  const stopTimer = () => {
    clearInterval(intervalRef.current); 
    intervalRef.current = null; 
  };
  useEffect(() => {
    if (timer > 1 && timer === Math.floor(duration / 1.5)) {
      if (!hasCalledListen.current) {
        hasCalledListen.current = true;
      listenSong(playing?._id);
    }else{
      hasCalledListen.current = false;
    }
  }
    if(progress === 1){
      setTimer(0);
      hasCalledListen.current = false;
    }
  }, [duration, playing?._id, progress, timer]);
  useEffect(() => {
    if (progressChanging) {
      startTimer();
    } else {
      stopTimer();
    }

    // Cleanup the interval when component unmounts or progressChanging changes
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [progressChanging]);

  const toggleMute = () => {
    if (mute) {
      setMute(false);
    } else {
      setMute(true);
    }
  };

  const handleVolumeChange = (value) => {
    const newVolume = parseFloat(value);
    setVolume(newVolume);

  };

  const handleProgressChange = (value) => {
    setProgress(value);
    if (playerRef.current) {
        playerRef.current.seekTo(value, 'fraction');
    }
    
};

const handleProgress = (state) => {
    if (progressChanging) {
        setProgress(state.played);
        if (state.played === 1) {
            setProgressChanging(false);
            props.nextSong();
        }
    }
};

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }
  const formatSliderValue = (value) => {
    return `${formatTime(value * duration)}`;
};
const formatVolumeValue = (value) => {
  return `${Math.round(value * 100)}`;
};

useEffect(() => {
  const state = {
    loop,
    volume,
    mute,
  };
  localStorage.setItem("playerState", JSON.stringify(state));
}, [loop, volume, mute]);

const handleNextSong = () => {
  props.nextSong();
  setProgress(0);
};
const handlePreviousSong = () => {
  props.previousSong();
  setProgress(0);
};

  return (
    <div className={cx("space-Footer")}>
      <div className={cx("Footer", !localPlaying && "Hiden-Footer")}>
        <Row>
            <Col xl='2' className={cx("PlayControler")}>
                <span className={cx("iconPlayer")} onClick={handlePreviousSong}>{<StepBackwardOutlined />}</span>
                <span className={cx("iconPlayer")} onClick={togglePlay}>{progressChanging ? <PauseOutlined /> : <CaretRightOutlined />}</span>
                <span className={cx("iconPlayer")} onClick={handleNextSong}>{<StepForwardOutlined />}</span>
                <span className={cx("iconLoop", loop? "iconLooping" : "")} onClick={() => setLoop(!loop)} style={{}} >{<RetweetOutlined />}</span>
            </Col>
            <Col xl='6'>
              <Row>
                <Col xl='1' className={cx("TimeProcessLeft")}>
                  <div>{formatTime(duration * progress)}</div>
                  </Col>
                  <Col>
                  <Slider
                    className={cx("progress-slider")}
                    value={progress}
                    min={0}
                    max={1}
                    step={0.005}
                    onChange={handleProgressChange}
                    tipFormatter={formatSliderValue}
                  />
                  </Col>
                <Col xl='1' className={cx("TimeProcessRight")}><div>{formatTime(duration)}</div></Col>
              </Row>
            </Col>
            <Col xl='1' className={cx("VolumeControler")}>
              <Row>
                <Col xl='1' className={cx("muteVolume")}>
                <span onClick={toggleMute} >{mute ? <FontAwesomeIcon icon={faVolumeXmark} /> : <FontAwesomeIcon icon={faVolumeHigh} />}</span>
                
                </Col>

                <Col>
                  <Slider className={cx("valueVolume")} 
                  step={0.01}
                  min={0}
                  max={1} 
                  onChange={handleVolumeChange} 
                  value={volume}
                  tipFormatter={formatVolumeValue}
                  />
                
                </Col>
              </Row>
            </Col>
            <Col xl='2'>
              <Row>
                <Col xl='4'>
                  <img className={cx("img_song_playing")} src={localPlaying?.img || playing?.img  } alt="" />
                </Col>
                <Col className={cx("title_playing")}>
                  <span >{localPlaying?.title || playing?.title}</span>
                </Col>
              </Row>
            </Col>

            <div className={cx("Playlist",isVisiblePlaylist ? 'Playlistactive' : '')} style={{ width: "300px" }}>
                <h5>Danh Sách Phát</h5>
                <div>
                    {PreviousPlaylist?.map((song, index) => (
                      <Col className={cx("item-Playlist-Priv")} xl='12'>
                      <Row>
                        <Col xl="3" onClick={() => props.playSongOnPreviousPlaylist(song, index)}> 
                        <img className={cx("img_song_playing")} src={song?.img} alt="" />
                        </Col>  
                        <Col className={cx("Title-song-playing")} onClick={() => props.playSongOnPreviousPlaylist(song, index)}>
                          <p>{song?.title}</p>
                          <span>{song?.actor}</span>
                        </Col>
                        <Col className={cx("iconRemove")} xl='1' onClick={() => props.removeSong(index, "previous")}>
                          <CloseOutlined />
                        </Col>
                        
                      </Row>
                    </Col>
                    ))}
                      <Col className={cx("item-Playlist")} xl='12'>
                      <Row>
                        <Col xl="3"> 
                        <img className={cx("img_song_playing")} src={localPlaying?.img || playing?.img  } alt="" />
                        </Col>  
                        <Col className={cx("Title-song-playing")} xl='8'>
                          <p>{localPlaying?.title || playing?.title}</p>
                          <span>{localPlaying?.actor || playing?.actor}</span>
                        </Col>
                        <Col className={cx("iconPlaying")} xl='1'>


                        <span className={cx("iconPlaying", "animate__animated", "animate__headShake", "animate__infinite")}>
                        <CaretLeftOutlined />
                        </span>

                        </Col>
                      </Row>
                    </Col>
                    {NextReleasePlaying?.map((song, index) => (
                    <Col className={cx("item-Playlist-Next")} xl='12'>
                    <Row>
                      <Col xl="3" onClick={() => props.playSongOnWaitPlaylist(song, index)}> 
                      <img className={cx("img_song_playing")} src={song.img} alt="" />
                      </Col>  
                      <Col className={cx("Title-song-playing")} onClick={() => props.playSongOnWaitPlaylist(song, index)}>
                        <p>{song?.title}</p>
                        <span>{song?.actor}</span>
                      </Col>
                      <Col className={cx("iconRemove")} xl='1' onClick={() => props.removeSong(index, "wait")}>
                          <CloseOutlined />
                      </Col>
                    </Row>
                  </Col>
                  ))}
                  {NextPlaying?.map((song, index) => (
                    <Col className={cx("item-Playlist-Next")} xl='12'>
                    <Row>
                      <Col xl="3" onClick={() => props.playSongOnAutoPlaylist(song, index)}> 
                      <img className={cx("img_song_playing")} src={song?.img} alt="" />
                      </Col>  
                      <Col className={cx("Title-song-playing")} onClick={() => props.playSongOnAutoPlaylist(song, index)}>
                        <p>{song?.title}</p>
                        <span>{song?.actor}</span>
                      </Col>
                      <Col className={cx("iconRemove")} xl='1' onClick={() => props.removeSong(index, "auto")}>
                          <CloseOutlined />
                      </Col>
                    </Row>
                  </Col>
                  ))}
                </div>
            </div>


                  <Col className={cx("Playlist-Propup")}>
                      <span onClick={togglePlaylist} className={cx(isVisiblePlaylist? "Playlist-Active" : "Playlist-Hover")}><MenuFoldOutlined /></span>
                    </Col>

        </Row>

      
      <ReactPlayer
        className={cx("react-player")}
        ref={playerRef}
        url={localPlaying?.fileMp3 || playing?.fileMp3}
        controls
        playing={progressChanging}
        volume={volume}
        progress={progress}
        onProgress={handleProgress}
        muted={mute}
        onDuration={handleDuration}
        width="100%"
        height="50px"
        loop={loop}
      />
    </div>
    </div>
  );

}
export default connect(null, {nextSong, previousSong, playSongOnPreviousPlaylist, playSongOnWaitPlaylist, playSongOnAutoPlaylist, removeSong})(Footer);