import classNames from "classnames/bind";
import Styles from "./Playlist.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import { Empty, Modal, Switch } from "antd";
import { CaretRightOutlined, CloseOutlined, DeleteOutlined, EditOutlined, EllipsisOutlined, ProductOutlined} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { autoPlaylist, deletePlaylist, deleteSongToPlaylist, getPlaylistById, getPlayListOfUser, playSong, updatePlaylist } from "../../Actions/PlayListAction";
import { getAllSongOfUser, getSong } from "../../Actions/SongAction";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { Popconfirm, Popover} from "antd";


const cx = classNames.bind(Styles);
function Playlist(props) {
    const playlistId = useParams();
    const [selectedPlaylist, setSelectedPlaylist] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [namePlaylist, setNamePlaylist] = useState("");
    const [publicPlaylist, setpublicPlaylist] = useState(selectedPlaylist?.public);
    const actorUnique = localStorage.getItem("user");
    const [isRender, setisRender] = useState(true);

    const Songplaylist = selectedPlaylist?.songs;
    console.log(selectedPlaylist);


    const HandleNamePlaylist = (e) => {
        setNamePlaylist(e.target.value);
    }
    const HandlePublicPlaylist = (value) => {
        setpublicPlaylist(value);
    }
    useEffect(() => {
        setpublicPlaylist(selectedPlaylist?.public);
        setNamePlaylist(selectedPlaylist?.name);
    }, [props,selectedPlaylist]);
    useEffect(() => {
        if(isRender){
        getPlaylistById(actorUnique, playlistId.playlistId).then((res) => {
            setSelectedPlaylist(res);
            
        });
        setisRender(false);
        }
    }, [props, isRender, actorUnique, selectedPlaylist, playlistId.playlistId]);
    useEffect(() => {
        if(isRender){
        getPlaylistById(actorUnique, playlistId.playlistId).then((res) => {
            setSelectedPlaylist(res);
            
        });
        setisRender(false);
        }
    }, [props, isRender, actorUnique, selectedPlaylist, playlistId.playlistId]);
    useEffect(() => {
        if(isRender){
        getPlaylistById(actorUnique, playlistId.playlistId).then((res) => {
            setSelectedPlaylist(res);
            
        });
        setisRender(false);
        }
    }, [props, isRender, actorUnique, selectedPlaylist, playlistId.playlistId]);
    useEffect(() => {
        if(isRender){
        getPlaylistById(actorUnique, playlistId.playlistId).then((res) => {
            setSelectedPlaylist(res);
            
        });
        setisRender(false);
        }
    }, [props, isRender, actorUnique, selectedPlaylist, playlistId.playlistId]);
    const formatDuration = (duration) => {
        duration = Math.floor(duration);
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = duration % 60;
        return hours > 0 
            ? `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
            : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };
    const playSongClick = (song, selectedPlaylists) => {
        props.playSong(song);
        props.autoPlaylist(selectedPlaylists, song);
      }

    const confirmDeleteSong = (actor,playlistID,songID) => {
        deleteSongToPlaylist(actor,playlistID,songID);
        setisRender(true);
        }
    const confirmDelete = (playlistID) => {
        deletePlaylist(actorUnique, playlistID);
    }
    
    const showModal = () => {
      setIsModalOpen(true);
    };
  
    const handleOk = () => {
      updatePlaylist(selectedPlaylist?._id, actorUnique, namePlaylist, publicPlaylist);
      setisRender(true);
      setIsModalOpen(false);
    };
  
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    return ( 
    <div>
        {selectedPlaylist && (
        <Container>
            <Row>
                <Col xl="4" className={cx("Detail-Playlist")}>

                    <div className={cx("Hover-Img")}>
                        <img className={cx("img-Playlist")} src="https://photo-resize-zmp3.zmdcdn.me/w320_r1x1_jpeg/cover/3/2/a/3/32a35f4d26ee56366397c09953f6c269.jpg" alt="playlist" />
                        <CaretRightOutlined className={cx("icon-play-Playlist")} onClick={() =>  playSongClick(selectedPlaylist?.songs[0], Songplaylist)}/>
                    </div>
                    <h4>{selectedPlaylist?.name}</h4>
                    <p>Được tạo bởi <span style={{fontWeight: 800}}>{selectedPlaylist?.actor}</span></p>
                    <p>{selectedPlaylist?.public? "Công Khai" : "Riêng Tư"}</p>
        
                            {selectedPlaylist?.actorUnique === actorUnique && (
                            <Row className={cx("Option-Playlist")}>
                                <Col xl='12'>
                                <p onClick={showModal}><EditOutlined /> Sửa Tên Playlist</p>
                                <Modal title="Sửa Tên Playlist" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                                    <input type="text" placeholder="Nhập tên mới cho playlist" onChange={HandleNamePlaylist} value={namePlaylist}/><br/><br/>
                                    <span style={{marginRight: "5px", fontWeight: "700"}}>Công Khai</span>
                                    <Switch defaultChecked className={cx("switch")} onChange={HandlePublicPlaylist} value={publicPlaylist}/>
                        
                                </Modal>
                                    
                                </Col>

                                <Col xl='12'>
                                <Popconfirm
                                        title="Xóa Playlist"
                                        description="Bạn có muốn xóa playlist này không?"
                                        onConfirm={() => confirmDelete(selectedPlaylist?._id)}
                                        okText="Có"
                                        cancelText="Không"
                                    >
                                    <p><DeleteOutlined /> Xóa Playlist</p>
                                    </Popconfirm>
                                </Col>
                            </Row>
                            )}
              
                </Col>
                <Col>
                <Row className={cx("Title_Playlist")}>
                            <Col xl='9' className={cx("Name-Title")}>
                                <p><ProductOutlined /> Bài Hát </p>           
                            </Col>
                            <Col xl='3' className={cx("Duration")}>
                                <p>Thời Gian</p>
                            </Col>
                        </Row>
                {Songplaylist && Songplaylist.map((song) => (
                            <Row className={cx("Item_Playlist")}>
                                <Col xl='9' className={cx("Name-Song")}>
                                    <Row>
                                        <Col xl='1' className={cx("Col-img-song")}>
                                        <CaretRightOutlined className={cx("icon-play")} onClick={() =>  playSongClick(song)}/>
                                            <div className={cx("shadow")}></div>
                                            <img src={song.img} alt={song.title} className={cx("img-song")}></img>
                                        </Col>
                                        <Col>
                                            <span>{song.title}</span> <br/>
                                        </Col>     
                                    </Row>       
                                </Col>
                                <Col xl='3' className={cx("Duration")}>
                                    <p>{formatDuration(song.duration)}</p>

                                    <Popconfirm
                                        title="Xóa Bài Hát"
                                        description="Bạn có muốn xóa bài hát này khỏi playlist không?"
                                        onConfirm={() => confirmDeleteSong(actorUnique,selectedPlaylist?._id,song._id)}
                                        okText="Có"
                                        cancelText="Không"
                                    >

                                    <CloseOutlined className={cx("icon-More")}/>
                                    </Popconfirm>
                                </Col>
                            </Row>
                        ))}
                </Col>
            </Row>

        </Container>
        )}
        {!selectedPlaylist && (
            <Container>
                <Row>
                    <Col className={cx("no-playlist")}>
                    <Empty />
                    </Col>
                </Row>
            </Container>
        )}
    </div>
     );
}

export default connect(null, { getAllSongOfUser, getSong, playSong, autoPlaylist, getPlayListOfUser})(Playlist);