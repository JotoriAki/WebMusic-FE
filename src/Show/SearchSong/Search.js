import classNames from 'classnames/bind';
import styles from './Search.module.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CommentOutlined,
  HeartOutlined,
  PlayCircleFilled,
  PlayCircleOutlined,
  SearchOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { searchSong } from '../../Actions/SongAction';
import { playSong } from '../../Actions/PlayListAction';
import { connect } from 'react-redux';
import { searchUser } from '../../Actions/UserAction';
import { Popover } from 'antd';

const cx = classNames.bind(styles);

function Search(props) {
  const [songSearch, setSongSearch] = useState([]);
  const [userSearch, setUserSearch] = useState([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search');
  const [zeroSong, setZeroSong] = useState('');
  const [zeroUser, setZeroUser] = useState('');
  const [combinedSearch, setCombinedSearch] = useState([]);
  const [choose, setChoose] = useState('all');

  const playSongClick = (song) => {
    props.playSong(song);
  };
  console.log('searchQuery', songSearch, userSearch);
  useEffect(() => {
    if (searchQuery) {
      setSongSearch([]);
      searchSong(searchQuery)
        .then((res) => {
          if (res.success) {
            setSongSearch(res.songs);
            setZeroSong('');
          } else {
            setSongSearch([]);
            setZeroSong(res.message);
          }
        })
        .catch((err) => {
          console.error(err);
        });

      setUserSearch([]);
      searchUser(searchQuery)
        .then((res) => {
          if (res.success) {
            setUserSearch(res.users);
            setZeroUser('');
          } else {
            setUserSearch([]);
            setZeroUser(res.message);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [searchQuery]);

  useEffect(() => {
    const combined = [...songSearch, ...userSearch];
    combined.sort((a, b) => {
      const nameA = a.title ? a.title.toLowerCase() : a.username.toLowerCase();
      const nameB = b.title ? b.title.toLowerCase() : b.username.toLowerCase();

      return nameA.localeCompare(nameB);
    });

    setCombinedSearch(combined);
  }, [songSearch, userSearch]);
  const navigate = useNavigate();
  const goToDetail = (id) => {
    navigate(`/song/${id}`);
  };
  const goToProfile = (usernameUnique) => {
    navigate(`/profile/${usernameUnique}`);
  };
  return (
    <Container>
      <h4 className={cx('Title-search')}>Kết quả tìm kiếm của "{searchQuery}"</h4>
      <Row>
        <Col xl="2">
          <h5 onClick={() => setChoose('all')} className={cx('choose', choose === 'all' ? 'all' : '')}>
            <SearchOutlined /> Tất Cả
          </h5>
          <h5 onClick={() => setChoose('music')} className={cx('choose', choose === 'music' ? 'music' : '')}>
            <FontAwesomeIcon icon={faMusic} /> Nhạc
          </h5>
          <h5 onClick={() => setChoose('user')} className={cx('choose', choose === 'user' ? 'user' : '')}>
            <UserOutlined /> Mọi Người
          </h5>
        </Col>
        <Col>
          <Row>
            {choose === 'all' && combinedSearch.length > 0 ? (
              combinedSearch.map((item, index) => {
                if (item.title) {
                  return (
                    <Col xl="12" className={cx('song-item')} key={index}>
                      <div className={cx('song-img')}>
                        <PlayCircleFilled className={cx('icon-fix')} />
                        <img src={item.img} alt={item.title} onClick={() => playSongClick(item)} />
                      </div>
                      <div className={cx('content-song')} onClick={() => goToDetail(item._id)}>
                        <span className={cx('title-song')}>{item.title}</span>
                        <p>{item.actor}ㅤ</p>
                        <div className={cx('icon')}>
                          <span className={cx('icon-item')}>
                            <HeartOutlined /> {item.like}
                          </span>
                          <span className={cx('icon-item')}>
                            <CommentOutlined /> {item.like}
                          </span>
                          <span className={cx('icon-item')}>
                            <PlayCircleOutlined /> {item.view}
                          </span>
                        </div>
                      </div>
                    </Col>
                  );
                } else if (item.username) {
                  return (
                    <Col
                      xl="12"
                      className={cx('song-item')}
                      key={index}
                      onClick={() => goToProfile(item.userNameUnique)}
                    >
                      <div className={cx('user-img')}>
                        <PlayCircleFilled className={cx('icon-fix')} />
                        <img src={item.avt} alt={item.username} />
                      </div>
                      <div className={cx('content-song')}>
                        <span className={cx('title-user')}>
                          <UserOutlined /> {item.username}
                        </span>
                        <div className={cx('icon-follow')}>
                          <Popover placement="top" content={<p>Theo Dõi</p>}>
                            <span className={cx('ThongTin')}>
                              <UserAddOutlined /> {item?.following?.length}
                            </span>
                          </Popover>
                          <Popover placement="top" content={<p>Được Theo Dõi</p>}>
                            <span className={cx('ThongTin')}>
                              <UsergroupAddOutlined /> {item?.follower?.length}
                            </span>
                          </Popover>
                        </div>
                      </div>
                    </Col>
                  );
                }
                return null;
              })
            ) : (
              <Col xl="12"></Col>
            )}
            {choose === 'music' && songSearch.length > 0 ? (
              songSearch.map((song, index) => (
                <Col xl="12" className={cx('song-item')} key={index}>
                  <div className={cx('song-img')}>
                    <PlayCircleFilled className={cx('icon-fix')} />
                    <img src={song.img} alt={song.title} onClick={() => playSongClick(song)} />
                  </div>
                  <div className={cx('content-song')} onClick={() => goToDetail(song._id)}>
                    <span className={cx('title-song')}>{song.title}</span>
                    <p>{song.actor}ㅤ</p>
                    <div className={cx('icon')}>
                      <span className={cx('icon-item')}>
                        <HeartOutlined /> {song.like}
                      </span>
                      <span className={cx('icon-item')}>
                        <CommentOutlined /> {song.like}
                      </span>
                      <span className={cx('icon-item')}>
                        <PlayCircleOutlined /> {song.view}
                      </span>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col xl="12"></Col>
            )}
            {choose === 'user' && userSearch.length > 0 ? (
              userSearch.map((user, index) => (
                <Col xl="12" className={cx('song-item')} key={index} onClick={() => goToProfile(user.userNameUnique)}>
                  <div className={cx('user-img')}>
                    <PlayCircleFilled className={cx('icon-fix')} />
                    <img src={user.avt} alt={user.username} />
                  </div>
                  <div className={cx('content-song')}>
                    <span className={cx('title-user')}>
                      <UserOutlined /> {user.username}
                    </span>
                    <div className={cx('icon-follow')}>
                      <Popover placement="top" content={<p>Theo Dõi</p>}>
                        <span className={cx('ThongTin')}>
                          <UserAddOutlined /> {user?.following?.length}
                        </span>
                      </Popover>
                      <Popover placement="top" content={<p>Được Theo Dõi</p>}>
                        <span className={cx('ThongTin')}>
                          <UsergroupAddOutlined /> {user?.follower?.length}
                        </span>
                      </Popover>
                    </div>
                  </div>
                </Col>
              ))
            ) : (
              <Col xl="12"></Col>
            )}
            {choose === 'all' && combinedSearch.length === 0 && (
              <Col xl="12">
                <h4>Không có kết quả tìm kiếm</h4>
              </Col>
            )}
            {choose === 'music' && songSearch.length === 0 && <Col xl="12">{zeroSong && <h4>{zeroSong}</h4>}</Col>}
            {choose === 'user' && userSearch.length === 0 && <Col xl="12">{zeroUser && <h4>{zeroUser}</h4>}</Col>}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default connect(null, { playSong })(Search);
