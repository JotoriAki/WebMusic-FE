import classNames from "classnames/bind";
import styles from "./DetailSong.module.scss";
import { Container, Col, Row } from "react-bootstrap";
import { AppstoreAddOutlined, CaretRightOutlined, DownOutlined, HeartFilled, HeartOutlined, MenuUnfoldOutlined, PlayCircleFilled, RightCircleFilled, RightOutlined, ShareAltOutlined } from "@ant-design/icons";
import { useCallback, useEffect, useState } from "react";
import { getSongById, getSongBySameType, likeSong } from "../../Actions/SongAction";
import { Link, useLocation, useParams } from "react-router-dom";
import { connect, useSelector } from "react-redux";
import { addSongToPlaylists, addSongWaitPlayList, getPlayListOfUser, playSong } from "../../Actions/PlayListAction";
import { Dropdown, message, notification, Popover, Space } from "antd";
import { commentLikeChange, createComment, deleteComment, getComment } from "../../Actions/CommentAction";
import { getUserByUserUnique } from "../../Actions/UserAction";

const cx = classNames.bind(styles);

function DetailSong(props) {
    const playlistOfUser = useSelector(state => state.PlayList.PlaylistOfUser);
    const Comment = useSelector(state => state.Comment.comments);
    const actorUnique = localStorage.getItem("user");
    const songID = useParams();
    const [song, setSong] = useState(null);
    const [isRender, setisRender] = useState(true);
    const [user, setUser] = useState(null);
    const [userSong, setUserSong] = useState(null);
    const [comment, setComment] = useState("");
    const [commentReply, setCommentReply] = useState([]);
    const [showReply, setshowReply] = useState([]);
    const [showReplyResult, setshowReplyResult] = useState([]);
    const [songSameType, setSongSameType] = useState("");
    const [likedComments, setLikedComments] = useState({});
    const [likedReply, setLikedReply] = useState({});

    const location = useLocation();



    const toggleReplyResult = (id) => {
        setshowReplyResult(prevState => {
            if (prevState.includes(id)) {
                return prevState.filter(replyId => replyId !== id);
            } else {
                return [...prevState, id];
            }
        });
    };


useEffect(() => {
    const fetchCommentData = async () => {
        const hash = location.hash; // Lấy giá trị hash từ URL
        if (hash) {
            const commentId = hash.substring(1); // Loại bỏ dấu '#'
            const parentCommentId = await Comment?.listCmt?.find(comment => comment._id === commentId)?.parentId; // Lấy id của bình luận cha
            if (parentCommentId) {
                toggleReplyResult(parentCommentId); // Mở rộng bình luận cha
            }
            setTimeout(() => {
                const commentElement = document.getElementById(commentId);
                if (commentElement) {
                    // Cuộn đến phần tử bình luận
                    commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Làm nổi bật bình luận
                    commentElement.classList.add('highlight-comment');
                }
            }, 300); // Đợi một khoảng thời gian cho các bình luận mở rộng
        }
    };
    fetchCommentData();
}, [location.hash]); // Thêm location.hash làm dependency để effect chạy lại mỗi khi hash thay đổi

    const toggleReply =((id) => {
        setshowReply(prevState => {
            if (prevState.includes(id)) {
                return prevState.filter(replyId => replyId !== id);
            } else {
                return [...prevState, id];
            }
        });
    });



    const HandleCommentReply = (e, id) => {
        setCommentReply(prevReplies => {
            const updatedReplies = prevReplies.filter(reply => reply.id !== id);
            return [...updatedReplies, { id: id, content: e.target.value }];
        });
    }

    const HandleComment = (e) => {
        setComment(e.target.value);
    }

    const HandleDeleteComment = (e) => {
        setComment("");
    }

    const submitComment = (comment) => {
        createComment(actorUnique, songID.songID, comment);
        setisRender(true);
        HandleDeleteComment();
    }

    const submitCommentReply = (comment, parent_id, index) => {
        createComment(actorUnique, songID.songID, comment, parent_id);
        setCommentReply(prevReplies => 
            prevReplies.map(reply => 
                reply.id === parent_id ? { ...reply, content: "" } : reply
            )
        );
        setisRender(true);
    };



    const HandleDeleteCommentReply = (id) => {
        setCommentReply(prevReplies => 
            prevReplies.map(reply => 
                reply.id === id ? { ...reply, content: "" } : reply
            )
        );
        toggleReply(id);
    };


    useEffect(() => {
        getUserByUserUnique(actorUnique).then((res) => {
            setUser(res);
        });
        getUserByUserUnique(song?.actorUnique).then((res) => {
            setUserSong(res);
        });
    }, [song, actorUnique]);

    useEffect(() => {
        if (isRender) {
            const fetchData = async () => {
                await getSongBySameType(songID.songID).then((res) => {
                    setSongSameType(res);
                })
                await props.getPlayListOfUser(actorUnique, actorUnique);
                await props.getComment(songID.songID);
                getSongById(songID.songID).then((res) => {
                    setSong(res.song);
                })
                setisRender(false);
            }
            fetchData();
        };
    }, [songID, song, isRender, props, actorUnique]);

    const LikeSong = (songId, action) => {
        likeSong(songId, action, userSong.userNameUnique, actorUnique);
        setisRender(true);
    }

    const playSongClick = (song) => {
        props.playSong(song);
    }

    const addSongToWaitPlayList = (song) => {
        props.addSongWaitPlayList(song);
    }

    const loadPage = () => {
        setisRender(true);
    }

    const fomatTime = (time) => {
        const now = new Date();
        const diff = Math.floor((now - new Date(time)) / 1000);

        if (diff < 60) {
            return `${diff} giây trước`;
        } else if (diff < 3600) {
            const minutes = Math.floor(diff / 60);
            return `${minutes} phút trước`;
        } else if (diff < 86400) {
            const hours = Math.floor(diff / 3600);
            return `${hours} tiếng trước`;
        } else if (diff < 2592000) {
            const days = Math.floor(diff / 86400);
            return `${days} ngày trước`;
        } else if (diff < 31536000) {
            const months = Math.floor(diff / 2592000);
            return `${months} tháng trước`;
        } else {
            const years = Math.floor(diff / 31536000);
            return `${years} năm trước`;
        }
    }

    const submitDeleteComment = (commentId) => {
        deleteComment(actorUnique, commentId);
        setisRender(true);
    }
    const HandleLikeComment = (comment, reply) => {
        const isLikedComment = comment && (likedComments[comment._id] !== undefined ? likedComments[comment._id] : comment?.likedBy?.includes(actorUnique));
        const isLikedReply = reply && (likedReply[reply._id] !== undefined ? likedReply[reply._id] : reply?.likedBy?.includes(actorUnique));
        const actionComment = isLikedComment ? "unlike" : "like";
        const actionReply = isLikedReply ? "unlike" : "like";
        
        if (reply) {
            commentLikeChange(actorUnique, comment._id, actionReply, reply._id);
            setLikedReply((prevLikedReply) => ({
                ...prevLikedReply,
                [reply._id]: !isLikedReply,
            }));
        } else {
            commentLikeChange(actorUnique, comment._id, actionComment);
            setLikedComments((prevLikedComments) => ({
                ...prevLikedComments,
                [comment._id]: !isLikedComment,
            }));
        }

        setisRender(true);
    };
    const [messageApi, contextHolder] = message.useMessage();
    const ShareClick = () => {
        navigator.clipboard.writeText(window.location.href);
        messageApi.open({
        type: 'success',
        content: 'Đã copy link chia sẻ',
        });
    }

    console.log(commentReply);
    return (
        <div>
            {contextHolder}
            <Container>
                <Row>
                    <Col className={cx("BannerSong")}>
                        <Row>
                            <Col xl="6">
                                <Row>
                                    <Col xl="1">
                                        <span className={cx("Icon-Play")}><RightCircleFilled onClick={() => playSongClick(song)} /></span>
                                    </Col>
                                    <Col className={cx("Title-Song")}>
                                        <p>{song?.title}</p>
                                    </Col>
                                </Row>
                                <Row className={cx("space")}>
                                    <Col xl="2">
                                    <Link to={`/profile/${userSong?.userNameUnique}`}>
                                    <img className={cx("avt-actor")} src={userSong?.avt || "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg"} alt="img"></img>
                                    </Link>
                                    </Col>
                                    <Col xl="7" className={cx("Name-actor")}  >
                                    <span>{userSong?.username}</span>
                                    </Col>
                                </Row>
                                <Row className={cx("Types-Song")}>
                                    <Col xl='12' >
                                    {
                                        song?.types.map((item, index) => {
                                            return (
                                                    <span key={index}>{item}</span>
                                                )
                                            })
                                        }
                                        </Col>
                                </Row>
                            </Col>
                            <Col className={cx("Banner-song-right")}>
                                <img className={cx("Img-song")} src={song?.img} alt="img"></img>
                            </Col>
                        </Row>
                    </Col>
                </Row>
                <Row className={cx("option")}>
                    <Col xl="9">
                        <div className={cx("item-option")} onClick={ShareClick}> <ShareAltOutlined /> Chia sẻ</div>
                        <div className={cx("item-option")} onClick={() => addSongToWaitPlayList(song)}> <MenuUnfoldOutlined /> Thêm vào phát tiếp theo</div>
                        <div className={cx("item-option")}>
                            <Popover placement="right" content={(
                                <span>
                                    {playlistOfUser && playlistOfUser.map((playlist) => (
                                        <Col xl='12' className={cx("Item-Option")} onClick={() => addSongToPlaylists(actorUnique, playlist._id, song._id)} key={playlist._id}>
                                            <p><RightOutlined className={cx("icon")} /> {playlist?.name}</p>
                                        </Col>
                                    ))}
                                </span>
                            )}>
                                <AppstoreAddOutlined /> Thêm vào playlist
                            </Popover>
                        </div>
                        <div className={cx("item-option-right")}>
                            <div className={cx("item-tym")}> {song?.likedBy.includes(actorUnique) ?
                                <HeartFilled style={{ color: 'red' }} onClick={() => LikeSong(song?._id, "unlike")} /> :
                                <HeartOutlined onClick={() => LikeSong(song?._id, "like")} />} {song?.like}
                            </div>
                            <div className={cx("item-view")}><PlayCircleFilled /> {song?.view}</div>
                        </div>
                    </Col>
                </Row>
                <Row>
                               

                                
                    <Col xl="9" className={cx("Binh-luan")}>
                        <Col xl='12'className={cx("Content-Song")} >
                            <pre>{song?.content}</pre>
                        </Col>
                        <h4>{Comment?.totalCmt} Bình luận</h4>
                        <Row>
                            <Col xl="1">
                                <img className={cx("avt-comment")} src={user?.avt} alt="img"></img>
                            </Col>
                            <Col xl="10">
                                <input className={cx("Input-VietBL")} placeholder="Viết bình luận..." onChange={HandleComment} value={comment}></input>
                                <button className={cx(comment ? "Button-VietBL" : "Button-VietBL-disabled")} onClick={() => submitComment(comment)}>Bình Luận</button>
                                <button className={cx("Button-Huy")} onClick={HandleDeleteComment}>Hủy</button>
                            </Col>
                            
                        </Row>
                        {Comment?.listCmt && Comment?.listCmt?.map((cmt, index) => (
                            <Row className={cx("item-comment")} id={`${cmt._id}`} key={cmt._id}>
                                <Col xl="1">
                                    <img className={cx("avt-comment")} src={cmt?.avt} alt="img"></img>
                                </Col>
                                <Col xl="11" className={cx("content-comment")}>
                                    <Row>
                                        <Col xl="12">
                                            <span className={cx("Name-User")}>{cmt?.actor}</span>
                                            <span className={cx("Time-Commnet")}>• {fomatTime(cmt?.createdAt)}</span>
                                            ㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤㅤ
                                            
                                        </Col>
                                        <Col xl="12" className={cx("ml-auto")} >

                                            <span className={cx("Content-Comment")}>
                                                {cmt?.content}
                                            </span>
                                            {cmt?.actorUnique === actorUnique && (
                                            <Dropdown menu={{ 
                                                items: [
                                                    {
                                                        label: <p style={{color: "red"}} onClick={() => submitDeleteComment(cmt?._id)}>Xóa Comment</p>,
                                                        key: '0',
                                                    }
                                                ]
                                             }} trigger={['click']} className={cx("Delete")}>
                                                <div>
                                                    <Space>
                                                        <DownOutlined />
                                                    </Space>
                                                </div>
                                            </Dropdown>
                                            )}
                                            <br />
                                            <span>
                                                    {(() => {
                                                        const isLiked = likedComments[cmt._id] !== undefined ? likedComments[cmt._id] : cmt?.likedBy?.includes(actorUnique);
                                                        return isLiked ? 
                                                            <HeartFilled style={{color:"red"}} onClick={() => HandleLikeComment(cmt, null)}/> :
                                                            <HeartOutlined style={{color:"red"}} onClick={() => HandleLikeComment(cmt, null)}/>;
                                                    })()} {cmt?.like}
                                            </span>

                                            <button className={cx("Button-Rep")} onClick={() => toggleReply(cmt._id)}>Trả lời</button>
                                            {cmt?.replies.length > 0 && <button className={cx("Button-Result-Rep")} onClick={() => toggleReplyResult(cmt._id)}> <DownOutlined /> {cmt?.replies.length} Phản hồi</button>}

                                            {showReply.includes(cmt._id) && (
                                                <Row className={cx(showReply.includes(cmt._id) ? "item-reply-show" : "item-reply")}>
                                                    <Col xl="1">
                                                        <img className={cx("avt-comment-reply")} src={user?.avt} alt="img"></img>
                                                    </Col>
                                                    <Col xl="10">
                                                        <input 
                                                            className={cx("Input-VietBL-reply")} 
                                                            placeholder="Viết bình luận..." 
                                                            onChange={(e) => HandleCommentReply(e, cmt._id)} 
                                                            value={commentReply.find(reply => reply.id === cmt._id)?.content || ''}
                                                        />

                                                        <button className={cx(commentReply.find(
                                                            reply => reply.id === cmt._id)?.content ? "Button-VietBL-reply" : "Button-VietBL-disabled-reply")} 
                                                            onClick={() => submitCommentReply(commentReply.find(reply => reply.id === cmt._id)?.content, cmt?._id, index)}
                                                            >Bình Luận</button>
                                                        <button className={cx("Button-Huy-reply")} onClick={() => HandleDeleteCommentReply(cmt._id)}>Hủy</button>
                                                    </Col>

                                                </Row>
                                            )}
                                            {showReplyResult.includes(cmt._id) && cmt?.replies && cmt.replies.map((reply, replyIndex) => (
                                                <Row className={cx("item-comment-reply")} id={`${reply._id}`} key={reply._id}>
                                                    <Col xl="1">
                                                        <img className={cx("avt-comment-reply")} src={reply?.avt} alt="img"></img>
                                                    </Col>
                                                    <Col xl="11" className={cx("content-comment-reply")}>
                                                        <Row>
                                                            <Col xl="12">
                                                                <span className={cx("Name-User")}>{reply?.actor}</span>
                                                                <span className={cx("Time-Commnet")}>• {fomatTime(reply?.createdAt)}</span>
                                                            </Col>
                                                            <Col xl="12">
                                                                <span className={cx("Content-Comment")}>
                                                                    {reply?.content}
                                                                </span> 

                                                                <br />
                                                                <span>
                                                                {(() => {
                                                                    const isLiked = likedReply[reply._id] !== undefined ? likedReply[reply._id] : reply?.likedBy?.includes(actorUnique);
                                                                    return isLiked ? 
                                                                        <HeartFilled style={{color:"red"}} onClick={() => HandleLikeComment(cmt, reply)}/> :
                                                                        <HeartOutlined style={{color:"red"}} onClick={() => HandleLikeComment(cmt, reply)}/>;
                                                                })()} {reply?.like}
                                                                </span>
                                                                {reply?.actorUnique === actorUnique && (
                                                                <Dropdown menu={{ 
                                                                    items: [
                                                                        {
                                                                            label: <p style={{color: "red"}} onClick={() => submitDeleteComment(reply?._id)}>Xóa Comment</p>,
                                                                            key: '0',
                                                                        }
                                                                    ]
                                                                }} trigger={['click']} className={cx("Delete")}>
                                                                    <div>
                                                                        <Space>
                                                                            <DownOutlined />
                                                                        </Space>
                                                                    </div>
                                                                </Dropdown>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                </Row>
                                            ))}
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        ))}
                    </Col>
                    <Col xl="3" className={cx("Song-Same")}>
                        <Row>
                            <Col xl="12">
                                <h4>Bài hát liên quan</h4>
                            </Col>
                            {songSameType && songSameType.map((song, index) => (
                                <Col xl="12" key={index}>
                                    <Row className={cx("item-song-same")}>
                                        <Col xl='3' className={cx("item-img")}>
                                            <img className={cx("img-song-same")} src={song?.img} alt="img"></img>
                                            <span className={cx("Icon-Play-Same")}><CaretRightOutlined onClick={() => playSongClick(song)} /></span>
                                        </Col>
                                        <Col xl='9'>
                                            <Link to={`/song/${song?._id}`} className={cx("link")} onClick={loadPage}>
                                                <span className={cx("title-song-same")}>{song?.title}</span> <br />
                                                <span>{song?.actor}</span>
                                            </Link>
                                        </Col>
                                    </Row>
                                </Col>
                            ))}
                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default connect(null, { playSong, addSongWaitPlayList, getPlayListOfUser, getComment })(DetailSong);
