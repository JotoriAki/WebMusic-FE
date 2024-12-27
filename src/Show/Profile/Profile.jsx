import classNames from "classnames/bind";
import Styles from "./Profile.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import { CaretRightOutlined, CommentOutlined, FormOutlined, HeartOutlined, PlayCircleOutlined, SettingOutlined, SpotifyOutlined, TagOutlined, UserAddOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { Button, Image, Popover, Upload } from "antd";
import { useEffect, useState } from "react";
import { followUser, getUserByUserUnique, uploadAvt } from "../../Actions/UserAction";
import { Link, useParams } from "react-router-dom";
import { connect, useSelector, useDispatch } from "react-redux";
import { getAllSongOfUser } from "../../Actions/SongAction";
import { autoPlaylist, getPlayListOfUser, playSong } from "../../Actions/PlayListAction";
import Meta from "antd/es/card/Meta";


const cx = classNames.bind(Styles);
function Profile(props) {
    const [isOption, setIsOption] = useState("gioithieu");
    const { nameunique } = useParams();
    const [user, setUser] = useState(null);
    const [isRender, setisRender] = useState(true);
    const [isFollow, setIsFollow] = useState(null);
    const email = localStorage.getItem('email');
    const userNameUniqueLongin = localStorage.getItem('user');

    const songsOfUser = useSelector(state => state.AllSong.songOfUser);
    const playlistOfUser = useSelector(state => state.PlayList.PlaylistOfUser);

// console.log(user?.email);
    const HandleOption = (option) => {
        setIsOption(option);
    }

    useEffect(() => {
        if (isRender) {
        props.getAllSongOfUser(nameunique);
        props.getPlayListOfUser(nameunique, userNameUniqueLongin);

        setisRender(false);
        }
    }, [isRender, nameunique, props, userNameUniqueLongin]);

    useEffect(() => {
        if (isRender) {
        const fetchUser = async () => {
            setisRender(true);
            const res = await getUserByUserUnique(nameunique);
            if (res) {
                setUser(res);
                setisRender(false);
            }
        };


        if (nameunique) {
            fetchUser();
        }
        setisRender(false);
    }
    }, [nameunique, isRender]);
//e.target.result
const beforeUpload = (file) => {
    uploadAvt(userNameUniqueLongin, file);
};

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

if (user && isFollow === null) {
    setIsFollow(user.follower.some(followerEmail => followerEmail === userNameUniqueLongin));
}

const SubmitFollow = (nameUniqueTarget) => {
    if (isFollow != null) {
        if (isFollow) {
            setIsFollow(false);
        } else {
            setIsFollow(true);
        }
    } else if (isFollow === true) {
        setIsFollow(false);
    } else {
        setIsFollow(true);
    }

    const action = isFollow? "unfollow" : "follow";
    followUser(nameUniqueTarget, action, userNameUniqueLongin);
    setisRender(true);
};
    return (
        <div>
            <Container>
                <Row className={cx("Profile")}>
                    <Col xl="3" className={cx("Avt-User")}>
                    {userNameUniqueLongin === nameunique && (
                        <Upload
                            showUploadList={false}
                            beforeUpload={beforeUpload}
                            method="get"
                        >
                            <FormOutlined className={cx("icon-fix")}/>
                            <div className={cx("shadow")}></div>
                            <img className={cx("img-avt")} src={user?.avt} alt="avatar" />
                        </Upload>
                    )}
                    {userNameUniqueLongin !== nameunique && (
                        <div>
                            <div className={cx("shadow")}></div>
                            <Image className={cx("img-avt")} src={user?.avt} alt="avatar" />
                        </div>
                    )}
                    </Col>
                    <Col className={cx("NameUser")}>
                    <h4>{user?.username}</h4>
                    <p>@{user?.userNameUnique}</p>
                    </Col>
                    {userNameUniqueLongin === nameunique && (
                    <Col xl='1'>
                        <Link to={`/setting`}>
                        <SettingOutlined className={cx("setting")}/>
                        </Link>
                    </Col>
                    )}
                </Row>
                <Row>
                    <Col xl="12" className={cx("Bio")}>
                        <span className={cx("Option", isOption === "gioithieu" && "Option-Active")} onClick={() => HandleOption("gioithieu")}>Giới Thiệu</span>
                        <span className={cx("Option", isOption === "baihat" && "Option-Active")} onClick={() => HandleOption("baihat")}>Bài Hát</span>
                        <span className={cx("Option", isOption === "playlist" && "Option-Active")} onClick={() => HandleOption("playlist")}>Playlist</span>
                        
                        <Popover placement="top" content={(<p>Bài Hát</p>)}>
                            <span className={cx("ThongTin")}><SpotifyOutlined /> {songsOfUser.totalSongs}</span>
                        </Popover>
                        <Popover placement="top" content={(<p>Theo Dõi</p>)}>
                            <span className={cx("ThongTin")}><UserAddOutlined /> {user?.following?.length}</span>
                        </Popover>
                        <Popover placement="top" content={(<p>Được Theo Dõi</p>)}>
                        <span className={cx("ThongTin")}><UsergroupAddOutlined /> {user?.follower?.length}</span>
                        </Popover> 
                        {userNameUniqueLongin !== nameunique && (
                            <Button type={isFollow != null ? isFollow? "primary" : "dashed" : user?.follower.includes(email)? "primary" : "dashed"} className={cx("follow")} 
                            onClick={() => SubmitFollow(user?.userNameUnique)}>{
                                isFollow? "Đã Theo Dõi" : "Theo Dõi"
                            }</Button>
                        )}
                        <hr/>


                    </Col>
                    {isOption === "gioithieu" && (
                    <Col xl="12" className={cx("Bio-Content")}>
                        <p> Chào mừng đến với trang cá nhân của tôi</p>

                        <p><TagOutlined /> Thể Loại Yêu Thích Của {user?.username}:</p>
                            {user?.interests.map((type) => (
                                <span className={cx("interests")}>{type}</span>
                            ))}
                    </Col>
                    )}
                    {isOption === "baihat" && (
                        <div>
                        {songsOfUser.songs && songsOfUser.songs.map((song) => (
                            <Col xl="12" className={cx("Bio-Content")} onClick={() =>  playSongClick(song, songsOfUser.songs)}>
                            <Row className={cx("Item_Playlist")}>
                                <Col xl='12' className={cx("Name-Song")}>
                                    <Row>
                                        <Col xl='2' className={cx("Col-img-song")}>
                                            
                                            <div className={cx("shadow")}></div>
                                            <img src={song.img} alt={song.title} className={cx("img-song")}></img>
                                        </Col>
                                        <Col>
                                            <span className={cx("title-song")}>{song.title}</span>  <br/>
                                            <span>{song.actor}</span>
                                            <div className={cx("icon")}>
                                                <span className={cx("icon-item")}><HeartOutlined /> {song.like}</span>
                                                <span className={cx("icon-item")}><CommentOutlined /> {song.like}</span>
                                                <span className={cx("icon-item")}><PlayCircleOutlined /> {song.view}</span>
                                            </div>
                                        </Col>
                                        <Col xl='3' className={cx("types")}>
                                            {song.types.map((type) => (
                                                <p>{type}</p>
                                            ))}
                                        </Col>
                            
                                    <Col xl='2' className={cx("Duration")}>
                                        <p>{formatDuration(song.duration)}</p>
                                        <CaretRightOutlined className={cx("icon-play")}/>
                                        </Col>
                                    </Row>
                                </Col>
                            
                            </Row>
                            </Col>
                        ))}
                        </div>

                    )}
                    {isOption === "playlist" && (
                    <Col xl="12" className={cx("Playlist")}>
                        <Row>
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
                    </Col>
                    )}
                </Row>
            </Container>
        </div>
    );
}

export default connect(null, { getAllSongOfUser, playSong, autoPlaylist, getPlayListOfUser})(Profile);