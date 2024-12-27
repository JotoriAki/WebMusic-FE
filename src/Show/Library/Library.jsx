import classNames from "classnames/bind";
import Styles from "./Library.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import { CaretRightOutlined, CommentOutlined, DeleteOutlined, HeartFilled, HeartOutlined, HolderOutlined, MenuUnfoldOutlined, MoreOutlined, PlayCircleFilled, PlayCircleOutlined, PlusCircleFilled, RightOutlined, SettingOutlined, ShareAltOutlined } from "@ant-design/icons";
import { Card,Flex,message,notification,Popover, Spin, Switch} from "antd";
import Meta from "antd/es/card/Meta";
import { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { addSongToPlaylists, addSongWaitPlayList, autoPlaylist, createPlaylist, getPlayListOfUser, playSong } from "../../Actions/PlayListAction";
import { deleteSong, getAllSongOfUser, getSong, getSongLiked, likeSong } from "../../Actions/SongAction";
import SongEdit from "./SongEdit";
import { Link } from "react-router-dom";
import { getComment } from "../../Actions/CommentAction";



const cx = classNames.bind(Styles);
function Library(props) {
    const email = localStorage.getItem("email");
    const actorUnique = localStorage.getItem("user");
    const [propCreatePlaylist, setPropCreatePlaylist] = useState(false);
    const [likeOrUpload, setLikeOrUpload] = useState(true);
    const [namePlaylist, setNamePlaylist] = useState("");
    const [publicPlaylist, setpublicPlaylist] = useState(false);
    const [popupEditSong, setPopupEditSong] = useState(false);
    const [dataEditSong, setDataEditSong] = useState({});
    const [isRender, setisRender] = useState(true);
    const [likedSongs, setLikedSongs] = useState({});

    const HandleLikeOrUpload = (value) => {
        setLikeOrUpload(value);
    }

    const HandleNamePlaylist = (e) => {
        setNamePlaylist(e.target.value);
    }
    const HandlePublicPlaylist = (value) => {
        setpublicPlaylist(value);
    }

    const DeleteSong = (id) => {
        deleteSong(id, actorUnique);
        }

      const handlePopupEditSongTrue = (data) => {
        setPopupEditSong(true);
        setDataEditSong(data);
      }
      const handlePopupEditSongFalse = () => {
        setPopupEditSong(false);
      }

    const CreatePlaylist = () => {
        createPlaylist(actorUnique, namePlaylist, publicPlaylist);
        setPropCreatePlaylist(false);
        setisRender(true);
    }

    const songsOfUser = useSelector(state => state.AllSong.songOfUser.songs);
    const songs = useSelector(state => state.AllSong.songLikedUser);
    const playlistOfUser = useSelector(state => state.PlayList.PlaylistOfUser);



    const addSongToPlayList = (song) => {
        props.addSongWaitPlayList(song);
      }
    
    const handleCreatePlaylist = () => {
        setPropCreatePlaylist(!propCreatePlaylist);
    }


    useEffect(() => {
        if(isRender){
        props.getSongLiked(actorUnique);
        props.getAllSongOfUser(actorUnique);
        props.getPlayListOfUser(actorUnique, actorUnique);
        setisRender(false);
        }
    }, [props, isRender, songsOfUser, songs, playlistOfUser]);
    useEffect(() => {
        if(isRender){
        props.getSongLiked(actorUnique);
        props.getAllSongOfUser(actorUnique);
        props.getPlayListOfUser(actorUnique, actorUnique);
        setisRender(false);
        }
    }, [props, isRender, songsOfUser, songs, playlistOfUser]);


    const playSongClick = (song, songList) => {
        props.playSong(song);
        props.autoPlaylist(songList, song);
      }

    const formatDuration = (duration) => {
        duration = Math.floor(duration);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return hours > 0 
            ? `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
            : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    const content = (
        <div>
          <p>Tạo Playlist Mới</p>
        </div>
      );

    const HandleLikeSong = (song) => {
      const isLiked = likedSongs[song._id] !== undefined ? likedSongs[song._id] : song?.likedBy?.includes(actorUnique);
      const action = isLiked ? "unlike" : "like";
      likeSong(song._id, action,song.actorUnique, actorUnique);
  
      setLikedSongs((prevLikedSongs) => ({
        ...prevLikedSongs,
        [song._id]: !isLiked,
      }));
      setisRender(true);
    };
    const [messageApi, contextHolder] = message.useMessage();
    const ShareClick = (song) => {
        const baseUrl = window.location.origin;
        navigator.clipboard.writeText(`${baseUrl}/song/${song._id}`);
        messageApi.open({
        type: 'success',
        content: 'Đã copy link chia sẻ',
        });
    }
    return ( 
        <div className={cx("library")}>
            {contextHolder}
            <Container>
                <Row>
                    <Col>
                        <h1>Thư Viện</h1>
                    </Col>
                </Row>
                <Row className={cx("Playlist")}>
                    <Col xl='12'>
                        <h3>Playlist 
                            <Popover placement="top" content={content}>
                                <PlusCircleFilled onClick={handleCreatePlaylist}/>
                            </Popover>
                        </h3>
                        {propCreatePlaylist &&
                        <div className={cx("Prop-CreatePlaylist")}>
                            <h5>Tạo Playlist Mới</h5>
                            <input className={cx("Input-NamePlaylist")} placeholder="Nhập tên playlist" onChange={HandleNamePlaylist} value={namePlaylist}/>
                            <Row className={cx("public-open")}>
                                <Col xl='9'>
                                    <p>Công Khai</p>
                                    <span>Mọi người có thể nhìn thấy playlist này</span>
                                </Col>
                                <Col xl='3'>
                                    <Switch defaultChecked className={cx("switch")} onChange={HandlePublicPlaylist} value={publicPlaylist}/>
                                </Col>
                            </Row>
                            <button className={cx("btn-CreatePlaylist")} onClick={CreatePlaylist}>Tạo Playlist</button>
                        </div>
                        }
                        {propCreatePlaylist &&
                            <div className={cx("Prop-shadow")} onClick={handleCreatePlaylist}></div>
                        }
                    </Col>

                        {playlistOfUser && playlistOfUser.map((playlist) => (
                            <Col key={playlist.id} xl='2' className={cx("item_Playlist")}>
                                <div
                                    className={cx("card")}
                                >
                                    <CaretRightOutlined className={cx("icon-play-Playlist")} onClick={() =>  playSongClick(playlist.songs[0], playlist.songs)}/>
                                <Link to={`/playlist/${playlist._id}`} className={cx("link")}>
                                    <div className={cx("shadow")}></div>
                                    <img alt="Playlist" className={cx("img-playlist")} src="https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/3/2/a/3/32a35f4d26ee56366397c09953f6c269.jpg" />
                                </Link>
                                    <Meta className={cx("Meta")} title={playlist?.name} description={playlist.actor} />
                                </div>
                            </Col>
                        ))}

                </Row>
                <Row className={cx("List-Song")}>
                        <Col xl='12' className={cx("Choose-Type")}>
                            <button className={cx("btn-ListSong", likeOrUpload? "btn-ListSong-active" : "" )} onClick={() => HandleLikeOrUpload(true)}>Yêu thích</button>
                            <button className={cx("btn-ListSong", !likeOrUpload? "btn-ListSong-active" : "")}  onClick={() => HandleLikeOrUpload(false)}>Đã Tải Lên</button>
                        </Col>
                        <Row className={cx("Title_Playlist")}>
                            <Col xl='9' className={cx("Name-Title")}>
                                <p>Bài Hát </p>           
                            </Col>
                            <Col xl='3' className={cx("Duration")}>
                                <p>Thời Gian</p>
                            </Col>
                        </Row>
                        {!likeOrUpload && songsOfUser && songsOfUser.map((song) => (
                            <Row className={cx("Item_Playlist")}>
                                <Col xl='9' className={cx("Name-Song")}>
                                    <Row>
                                        <Col xl='1' className={cx("Col-img-song")}>
                                        <CaretRightOutlined className={cx("icon-play")} onClick={() =>  playSongClick(song, songsOfUser)}/>
                                        
                                            <div className={cx("shadow")}></div>
                                            <img src={song.img} alt={song.title} className={cx("img-song")}></img>
                                        </Col>
                                        <Col>
                                            <span>{song.title}</span> <br/>
                                            <div className={cx("icon")}>
                                                <span className={cx("icon-item")}><HeartOutlined /> {song.like}</span>
                                                <span className={cx("icon-item")}><CommentOutlined /> {song.like}</span>
                                                <span className={cx("icon-item")}><PlayCircleOutlined /> {song.view}</span>
                                            </div>
                                        </Col>     
                                    </Row>       
                                </Col>
                                <Col xl='3' className={cx("Duration")}>
                                    <p>{formatDuration(song.duration)}</p>
                                    <Popover placement="left" 
                                    trigger={'click'}
                                    content={(
                         
                                            <Row className={cx("Option")}>
                                                <Col xl='12' className={cx("Item-Option")} onClick={() => addSongToPlayList(song)}>
                                                    <p>Thêm vào danh sách chờ</p>
                                                </Col>
                                                <Col xl='12' className={cx("Item-Option")}>
                                                    <Popover placement="left" content={(
                                                        <Row className={cx("Option")}>
                                                        {playlistOfUser && playlistOfUser.map((playlist) => (
                                                        <Col xl='12' className={cx("Item-Option")} onClick={() => addSongToPlaylists(actorUnique, playlist._id, song._id)}>
                                                            <p><RightOutlined className={cx("icon")}/>{playlist?.name}</p>
                                                        </Col>
                                                        ))}

                                                        </Row>
                                                        )}>
                                                            
                                                        <p><MenuUnfoldOutlined className={cx("icon")}/>Thêm vào playlist</p>
                                                     </Popover>

                                                </Col>
                                                <Col xl='12' className={cx("Item-Option")}>
                                                    <Popover placement="left" content={(<p>Tym</p>)}>
                                                    {likedSongs[song._id] !== undefined ? likedSongs[song._id] ? 
                                                    <HeartFilled style={{color:"red"}} onClick={() => HandleLikeSong(song,"unlike")}/>
                                                    : 
                                                    <HeartOutlined style={{color:"red"}} onClick={() => HandleLikeSong(song,"like")}/>
                                                    : song?.likedBy?.includes(actorUnique) ? 
                                                    <HeartFilled style={{color:"red"}} onClick={() => HandleLikeSong(song,"unlike")}/>
                                                    : 
                                                    <HeartOutlined style={{color:"red"}} onClick={() => HandleLikeSong(song,"like")}/>
                                                    }
                                                    </Popover>

                                                    <Popover placement="bottom" content={(<p>Chia Sẻ</p>)}>
                                                        <ShareAltOutlined
                                                        onClick={() => ShareClick(song)}
                                                        style={{color:"blue", marginLeft:"12px"}}/>
                                                    </Popover>

                                                    <Popover placement="bottom" content={(<p>Chỉnh sửa bài hát</p>)}>
                                                        <SettingOutlined style={{color:"brown", marginLeft:"12px"}} onClick={() => handlePopupEditSongTrue(song)}/>
                                                    </Popover>

                                                    <Popover placement="right" content={(<p>Xóa bài hát</p>)}>
                                                        <DeleteOutlined style={{color:"red", marginLeft:"12px"}} onClick={() => DeleteSong(song._id, actorUnique)} />
                                                    </Popover>
                                                    

                                                </Col>
                                            </Row>
                          
                                    )}>


                                    <MoreOutlined className={cx("icon-More")}/>
                                    </Popover>
                                </Col>
                            </Row>
                        ))}
                        {likeOrUpload && songs && songs.map((song) => (
                            <Row className={cx("Item_Playlist")}>
                                <Col xl='9' className={cx("Name-Song")}>
                                    <Row>
                                        <Col xl='1' className={cx("Col-img-song")}>
                                            <CaretRightOutlined className={cx("icon-play")} onClick={() =>  playSongClick(song, songs)}/>
                                            <div className={cx("shadow")}></div>
                                            <img src={song.img} alt={song.title} className={cx("img-song")}></img>
                                        </Col>
                                        <Col>
                                            <span>{song.title}</span>  <br/>
                                            <span>{song.actor}</span>
                                        </Col>     
                                    </Row>       
                                </Col>
                                <Col xl='3' className={cx("Duration")}>
                                    <p>{formatDuration(song.duration)}</p>
                                    <Popover placement="left" 
                                    trigger={'click'}
                                    content={(
                         
                                            <Row className={cx("Option")}>
                                                <Col xl='12' className={cx("Item-Option")} onClick={() => addSongToPlayList(song)}>
                                                    <p>Thêm vào danh sách chờ</p>
                                                </Col>
                                                <Col xl='12' className={cx("Item-Option")}>
                                                <Popover placement="left" content={(
                                                    <Row className={cx("Option")}>
                                                    {playlistOfUser && playlistOfUser.map((playlist) => (
                                                    <Col xl='12' className={cx("Item-Option")} onClick={() => addSongToPlaylists(actorUnique, playlist._id, song._id)}>
                                                        <p><RightOutlined className={cx("icon")}/>{playlist?.name}</p>
                                                    </Col>
                                                    ))}

                                                    </Row>
                                                     )}>
                                                        
                                                    <p><MenuUnfoldOutlined className={cx("icon")}/>Thêm vào playlist</p>
                                                     </Popover>

                                                </Col>
                                                <Col xl='12' className={cx("Item-Option")}>
                                                    <Popover placement="left" content={(<p>Tym</p>)}>
                                                    {likedSongs[song._id] !== undefined ? likedSongs[song._id] ? 
                                                    <HeartFilled style={{color:"red"}} onClick={() => HandleLikeSong(song,"unlike")}/>
                                                    : 
                                                    <HeartOutlined style={{color:"red"}} onClick={() => HandleLikeSong(song,"like")}/>
                                                    : song?.likedBy?.includes(actorUnique) ? 
                                                    <HeartFilled style={{color:"red"}} onClick={() => HandleLikeSong(song,"unlike")}/>
                                                    : 
                                                    <HeartOutlined style={{color:"red"}} onClick={() => HandleLikeSong(song,"like")}/>
                                                    }
                                                    </Popover>
                                                    <Popover placement="bottom" content={(<p>Chia Sẻ</p>)}>
                                                        <ShareAltOutlined
                                                        onClick={() => ShareClick(song)}
                                                        style={{color:"blue", marginLeft:"12px"}}/>
                                                    </Popover>

                                                </Col>
                                            </Row>
                          
                                    )}>


                                    <MoreOutlined className={cx("icon-More")}/>
                                    </Popover>
                                </Col>
                            </Row>
                        ))}
                        {!songs && (
                            <Flex align="center" gap="middle">
                            <Spin size="large" />
                            </Flex>
                        )}
                        {popupEditSong && (
                            <div className={cx("song-edit")}>
                                <SongEdit data={dataEditSong} handlePopupEditSongFalse={handlePopupEditSongFalse} />
                            </div>
                        )}

                        {popupEditSong && (
                            <div className={cx("shadow-propup")} onClick={handlePopupEditSongFalse}></div>
                        )}
                </Row>
            </Container>
        </div>
     );
}

export default connect(null, { getAllSongOfUser, getSongLiked, playSong, autoPlaylist, addSongWaitPlayList, getPlayListOfUser, getComment})(Library);