import classNames from "classnames/bind";

import styles from "./Feed.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { getAllSongsFollowedUsers, getSong, getSongHot, likeSong } from "../../Actions/SongAction";
import { addSongToPlaylists, addSongWaitPlayList, autoPlaylist, getPlayListOfUser, playSong } from "../../Actions/PlayListAction";
import { AppstoreAddOutlined, FireOutlined, HeartFilled, LoadingOutlined, MenuUnfoldOutlined, PlayCircleFilled, RightOutlined } from "@ant-design/icons";
import { Dropdown } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { Popover, Spin } from "antd";


const cx = classNames.bind(styles);

function Feed(props) {
  const songs = useSelector(state => state.AllSong.songFollowedUser);
  const songLoading = useSelector(state => state.AllSong.loading);
  const [isRender, setisRender] = useState(true);
  const [likedSongs, setLikedSongs] = useState({});
  const playlistOfUser = useSelector(state => state.PlayList.PlaylistOfUser);

  const user = localStorage.getItem("user");
  useEffect(() => {
    props.getAllSongsFollowedUsers();
    props.getSongHot();

  }, [props]);

  useEffect(() => {
    if(isRender){
    props.getAllSongsFollowedUsers(user);
    props.getPlayListOfUser(user, user);
    setisRender(false);
    }
  }, [songs, props, isRender]);

  useEffect(() => {
    if(isRender){
    props.getAllSongsFollowedUsers(user);
    props.getPlayListOfUser(user, user);
    setisRender(false);
    }
  }, [songs, props, isRender]);

  const addSongToPlayList = (song) => {
    props.addSongWaitPlayList(song);
  }

  const playSongClick = (song) => {
    props.playSong(song);
    props.autoPlaylist(songs);
  }



  const formatSongTitle = (title) => {
    return title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-");
  };

    const HandleLikeSong = (song) => {
      const isLiked = likedSongs[song._id] !== undefined ? likedSongs[song._id] : song?.likedBy?.includes(user);
      const action = isLiked ? "unlike" : "like";
      likeSong(song._id, action,song.actorUnique, user);
  
      setLikedSongs((prevLikedSongs) => ({
        ...prevLikedSongs,
        [song._id]: !isLiked,
      }));
  
      setisRender(true);
    };
  return (
    <div className={cx("Home")}>
      <Container>
        {songLoading && <div className={cx("loading")}>
          <Spin indicator={<LoadingOutlined style={{ fontSize: 100 }} spin />} className={cx("icon-loading")}/>
        </div>}
        {!songLoading &&(
        <Row>
          <Col xl='12'>
            <Row>
              <Col xl='12' className={cx("Tilte")}>
                <h4>Những bài nhạc mà bạn theo dõi</h4>
              </Col>
              {songs && songs.map((song) => (
                <Col xl='12' className={cx("item")} key={song.id}>
                  <Row>
                    <Col xl='2' className={cx("Img")}>
                    <div className={cx("song-img")}>
                      <PlayCircleFilled className={cx("icon-play")} onClick={() =>  playSongClick(song)}/>
                      <div className={cx("icon-option")}>
                        <HeartFilled onClick={() => HandleLikeSong(song, song?.likedBy?.includes(user) ? "unlike" : "like")} 
                        className={cx(likedSongs[song._id] !== undefined ? likedSongs[song._id] ? "unlike" : "like" : song?.likedBy?.includes(user) ? "unlike" : "like")}/>
                      </div>
                      <Link to={`/song/${formatSongTitle(song._id)}`} className={cx("link")}>
                      <div className={cx("shadow")}></div>
                      <img className={cx("item_img")} src={song.img} alt={song.title}/>
                      </Link>
                    </div>
                   </Col>
                  <Col xl='7'>
                  <p className={cx("nameMusic")}>{song.title}</p>
                      <p className={cx("author")}>{song.actor}</p>
                      <p className={cx("Type-song")}>
                      {song.types && song.types.map((type) => (
                        <span className={cx("type")}>{type}</span>
                      ))}
                      </p>
                    </Col>
                    <Col xl='2'>
                      <span className={cx("icon-more")}>
                        <Dropdown>
                          <Dropdown.Menu>
                            <Dropdown.Item text="Thêm vào danh sách chờ" onClick={() => addSongToPlayList(song)}/>
                            <Dropdown.Item text={      
                              <Popover placement="left" content={(
                                <Row className={cx("Option")}>
                                {playlistOfUser && playlistOfUser.map((playlist) => (
                                <Col xl='12' className={cx("Item-Option")} onClick={() => addSongToPlaylists(user, playlist._id, song._id)}>
                                    <p><RightOutlined className={cx("icon")}/>{playlist?.name}</p>
                                </Col>
                                ))}

                                </Row>
                                )}>
                                    
                                <p><AppstoreAddOutlined className={cx("icon")}/> Thêm vào playlist</p>
                              </Popover>}/>
                          </Dropdown.Menu>
                        </Dropdown>
                      </span>
                    </Col>
         

                 </Row>
                </Col>
              ))}
            </Row>
          </Col>
        
        </Row>
        )}
      </Container>
    </div>
  )
}

export default connect(null, { getAllSongsFollowedUsers, addSongWaitPlayList, playSong, autoPlaylist, getSongHot, getPlayListOfUser})(Feed);